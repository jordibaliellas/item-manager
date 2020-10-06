import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { flatMap, map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

export interface Product {
  productId: number;
  favorite: IconDefinition;
  title: string;
  description: string;
  price: string;
  email: string;
  image: string;
}

interface ProductResponse {
  items: Product[];
}

export interface FilterProduct {
  title?: string;
  description?: string;
  price?: string;
  email?: string;
}

export const enum KeySortByProduct {
  title = 'title',
  description = 'description',
  price = 'price',
  email = 'email',
}

export interface SortByProduct {
  key: KeySortByProduct;
  asc: boolean;
  type: 'string' | 'number';
}

export interface PaginationProduct {
  skip: number;
  limit: number;
}

export interface ListProducts {
  limit: number;
  skip: number;
  total: number;
  products: Product[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  // I save the products to avoid many requests to the server. If this list is updated I should always make the request.
  products: Product[];
  favoriteProducts$ = new BehaviorSubject<number[]>([]);

  constructor(private http: HttpClient) {}

  getListProducts(
    filter: FilterProduct = {},
    sortBy?: SortByProduct,
    pagination?: PaginationProduct
  ): Observable<ListProducts> {
    return this.favoriteProducts$.pipe(
      flatMap(() => this.getProducts()),
      map((products) =>
        products.map((product, idx) => {
          product.productId = idx + 1;
          product.favorite = this.favoriteProducts$.value.includes(idx + 1)
            ? faStar
            : faStarRegular;
          return product;
        })
      ),
      map((products) =>
        products
          .filter(this.filterProducts(filter))
          .sort(this.sortProducts(sortBy))
      ),
      map((products) => ({
        limit: pagination.limit,
        skip: pagination.skip,
        total: products.length,
        products: products.splice(pagination.skip, pagination.limit),
      }))
    );
  }

  getProducts(): Observable<Product[]> {
    return this.products && this.products.length
      ? of(this.products)
      : this.getProductsApi();
  }

  getFavoriteProducts(): Observable<Product[]> {
    return this.favoriteProducts$.pipe(
      flatMap((favoriteProducts) =>
        this.getProducts().pipe(
          map((products) =>
            products.filter((product) =>
              favoriteProducts.includes(product.productId)
            )
          )
        )
      )
    );
  }

  getProductsApi(): Observable<Product[]> {
    return this.http
      .get<ProductResponse>(`${environment.apiItems}/items.json`)
      .pipe(
        map((response) => response.items),
        tap((products) => {
          this.products = products;
        })
      );
  }

  filterProducts(filter: FilterProduct): (product: Product) => boolean {
    return (product: Product): boolean => {
      if (filter.title && !product.title.match(new RegExp(filter.title, 'i'))) {
        return false;
      }

      if (
        filter.description &&
        !product.description.match(new RegExp(filter.description, 'i'))
      ) {
        return false;
      }

      if (filter.email && !product.email.match(new RegExp(filter.email, 'i'))) {
        return false;
      }

      if (filter.price && !product.price.match(new RegExp(filter.price, 'i'))) {
        return false;
      }

      return true;
    };
  }

  sortProducts(sortBy: SortByProduct): (a: Product, b: Product) => number {
    return (a: Product, b: Product): number => {
      if (!sortBy) return 0;

      const aValue =
        sortBy.type === 'number'
          ? +a[sortBy.key]
          : a[sortBy.key].toLocaleLowerCase();

      const bValue =
        sortBy.type === 'number'
          ? +b[sortBy.key]
          : b[sortBy.key].toLocaleLowerCase();

      if (aValue > bValue) return sortBy.asc ? 1 : -1;
      if (aValue < bValue) return sortBy.asc ? -1 : 1;

      return 0;
    };
  }
}
