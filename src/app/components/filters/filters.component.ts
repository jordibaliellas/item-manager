import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FilterProduct } from 'src/app/services/products.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
  private filterForm: FilterProduct = {};

  @Output() changeFilter = new EventEmitter<FilterProduct>();

  constructor() {}

  ngOnInit(): void {}

  changeInput(key: string, value: string) {
    this.filterForm[key] = value;
    this.changeFilter.next(this.filterForm);
  }
}
