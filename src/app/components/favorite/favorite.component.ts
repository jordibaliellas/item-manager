import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { Product, ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
})
export class FavoriteComponent implements OnInit {
  favoriteProducts$: Observable<Product[]>;
  faTrash = faTrash;

  constructor(
    public dialogRef: MatDialogRef<FavoriteComponent>,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.favoriteProducts$ = this.productsService.getFavoriteProducts();
  }

  deleteFavoriteItem(product: Product) {
    const currentFavoriteProducts = this.productsService.favoriteProducts$
      .value;

    const indexFavoriteProduct = currentFavoriteProducts.indexOf(
      product.productId
    );
    currentFavoriteProducts.splice(indexFavoriteProduct, 1);

    this.productsService.favoriteProducts$.next(currentFavoriteProducts);
  }
}
