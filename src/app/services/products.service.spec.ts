import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';

import { Product, ProductsService, KeySortByProduct } from './products.service';

const products: Product[] = [
  {
    productId: 124,
    title: 'Iphone 8',
    price: '400',
    description: 'description iphone 8',
    email: 'jordibal98@gmail.com',
    image: 'iphone-8.jpg',
    favorite: faStar,
  },
  {
    productId: 125,
    title: 'box',
    price: '10',
    description: 'description box',
    email: 'jordibal98@gmail.com',
    image: 'box.jpg',
    favorite: faStar,
  },
];

const [product1, product2] = products;

describe('ItemsService', () => {
  let injector: TestBed;
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ProductsService);
    injector = getTestBed();
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should filter title return true', () => {
    const functionFilter = service.filterProducts({ title: 'iphone' });
    expect(functionFilter(product1)).toBe(true);
  });

  it('should filter title return false', () => {
    const functionFilter = service.filterProducts({ title: 'box' });
    expect(functionFilter(product1)).toBe(false);
  });

  it('should filter by multiple keys return true', () => {
    const functionFilter = service.filterProducts({
      title: 'iphone',
      email: 'jordi',
    });
    expect(functionFilter(product1)).toBe(true);
  });

  it('should filter by multiple keys return false', () => {
    const functionFilter = service.filterProducts({
      title: 'iphone',
      email: 'pepe',
    });
    expect(functionFilter(product1)).toBe(false);
  });

  it('should sort products by title asc correctly', () => {
    const functionSort = service.sortProducts({
      key: KeySortByProduct.title,
      asc: true,
      type: 'string',
    });

    expect(functionSort(product1, product2)).toBe(1);
  });

  it('should sort products by title desc correctly', () => {
    const functionSort = service.sortProducts({
      key: KeySortByProduct.title,
      asc: false,
      type: 'string',
    });

    expect(functionSort(product1, product2)).toBe(-1);
  });

  it('should sort products without params', () => {
    const functionSort = service.sortProducts(null);

    expect(functionSort(product1, product2)).toBe(0);
  });

  it('should sort products by price asc correctly', () => {
    const functionSort = service.sortProducts({
      key: KeySortByProduct.price,
      asc: true,
      type: 'number',
    });

    expect(functionSort(product1, product2)).toBe(1);
  });

  it('should sort products by price desc correctly', () => {
    const functionSort = service.sortProducts({
      key: KeySortByProduct.price,
      asc: false,
      type: 'number',
    });

    expect(functionSort(product1, product2)).toBe(-1);
  });

  it('should http get products', () => {
    service.getProductsApi().subscribe((result: Product[]) => {
      expect(result[0].title).toEqual('Iphone 8');
      expect(result[0].description).toEqual('description iphone 8');

      expect(result[1].title).toEqual('box');
      expect(result[1].description).toEqual('description box');
    });

    const req = httpMock.expectOne(`${environment.apiItems}/items.json`);
    expect(req.request.method).toBe('GET');

    req.flush(products);
  });
});
