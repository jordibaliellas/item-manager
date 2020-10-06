import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-filter',
  templateUrl: './input-filter.component.html',
  styleUrls: ['./input-filter.component.scss'],
})
export class InputFilterComponent {
  @Input() label: string;
  @Input() placeholder: string;

  @Output() changeInput = new EventEmitter<string>();

  valueInput = '';

  constructor() {}

  onChangeInput() {
    this.changeInput.next(this.valueInput);
  }
}
