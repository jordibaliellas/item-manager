import { Component, HostListener, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
  Product,
  ProductsService,
  FilterProduct,
  SortByProduct,
  KeySortByProduct,
  ListProducts,
} from './services/products.service';
import { RowItem } from './components/table/table.component';
import { debounceTime, flatMap } from 'rxjs/operators';
import { Column, ProductColumns } from './enums/product';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { FavoriteComponent } from './components/favorite/favorite.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  columns: Column[] = ProductColumns;

  filters$ = new BehaviorSubject<FilterProduct>({});
  sortBy$ = new BehaviorSubject<SortByProduct>(null);
  skip$ = new BehaviorSubject<number>(0);
  listProducts$: Observable<ListProducts>;
  totalList: number;
  limitList = 5;

  screenHeight: number;
  screenWidth: number;

  constructor(
    private productsService: ProductsService,
    private dialog: MatDialog
  ) {
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    this.setRows();
  }

  setRows(): void {
    this.listProducts$ = combineLatest([
      this.filters$,
      this.sortBy$,
      this.skip$,
    ]).pipe(
      debounceTime(100),
      flatMap(([filters, sortBy, skip]) =>
        this.productsService.getListProducts(filters, sortBy, {
          skip,
          limit: this.limitList,
        })
      )
    );
  }

  clickedRow(event: RowItem<Product>): void {
    switch (event.column.key) {
      case 'image':
        this.clickShowImage(event);
        break;
      case 'favorite':
        this.clickFavorite(event);
        break;

      default:
        break;
    }
  }

  clickShowImage(event: RowItem<Product>): void {
    window.open(event.row.image, '_blank');
  }

  clickFavorite(event: RowItem<Product>): void {
    const favorite = event.row.favorite.prefix === 'far' ? true : false;

    const currentFavoriteProducts = this.productsService.favoriteProducts$
      .value;

    if (favorite) {
      currentFavoriteProducts.push(event.row.productId);
    } else {
      const indexOfFavoriteItem = currentFavoriteProducts.indexOf(
        event.row.productId
      );
      currentFavoriteProducts.splice(indexOfFavoriteItem, 1);
    }
    this.productsService.favoriteProducts$.next(currentFavoriteProducts);
    event.row.favorite = favorite ? faStar : faStarRegular;
  }

  changeFilter(filterProduct: FilterProduct): void {
    this.skip$.next(0);
    this.filters$.next(filterProduct);
  }

  onClickColumn(column: Column): void {
    this.columns.forEach((col) => (col.sorted = null));

    const sortBy: SortByProduct = this.sortBy$.value || {
      key: null,
      asc: null,
      type: null,
    };
    sortBy.asc = column.key === sortBy.key ? !sortBy.asc : true;
    column.sorted = sortBy.asc ? 'asc' : 'desc';
    sortBy.key = column.key as KeySortByProduct;
    sortBy.type = sortBy.key === KeySortByProduct.price ? 'number' : 'string';

    this.sortBy$.next(sortBy);
  }

  changePage(page: number): void {
    this.skip$.next((page - 1) * this.limitList);
  }

  openFavoriteDialog(): void {
    const width = (this.screenWidth * 80) / 100;
    const height = (this.screenHeight * 80) / 100;

    this.dialog.open(FavoriteComponent, {
      height: `${height}px`,
      width: `${width}px`,
    });
  }
}
