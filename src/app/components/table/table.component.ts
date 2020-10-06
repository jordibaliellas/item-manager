import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  faSort,
  faSortDown,
  faSortUp,
} from '@fortawesome/free-solid-svg-icons';
import { Column, TypeColumn } from 'src/app/enums/product';

export interface RowItem<T> {
  column: Column;
  row: T;
  rowIndex: number;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnInit {
  @Input() columns: Column[];
  @Input() rows: Array<T>;

  @Output() clickedRow = new EventEmitter<RowItem<T>>();
  @Output() clickColumn = new EventEmitter<Column>();

  faSortUp = faSortUp;
  faSortDown = faSortDown;
  faSort = faSort;
  typeColumns = TypeColumn;

  constructor() {}

  ngOnInit(): void {}

  onClickColumn(column: Column) {
    if (!column.sortable) return;
    this.clickColumn.emit(column);
  }

  clickRow(column: Column, row: T, rowIndex: number) {
    this.clickedRow.emit({ column, row, rowIndex });
  }
}
