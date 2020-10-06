import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const LIMIT_SELECTOR_PAGES = 4;
const FIRST_PAGE = 1;

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnChanges {
  @Input() skip: number;
  @Input() limit: number;
  @Input() total: number;
  @Output() clickPage = new EventEmitter();

  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;

  lastPage: number;
  currentPage: number;
  isFirstPage: boolean;
  isLastPage: boolean;

  pages: number[];

  constructor() {}

  ngOnChanges(): void {
    this.calculatePages();
  }

  calculatePages() {
    if (!this.total) return;

    this.currentPage = this.skip / this.limit + 1;
    this.lastPage = Math.ceil(this.total / this.limit);

    this.isFirstPage = this.currentPage === FIRST_PAGE;
    this.isLastPage = this.currentPage === this.lastPage;

    this.pages = [this.currentPage];
    if (!this.isFirstPage) this.pages.unshift(this.currentPage - 1);
    if (this.isLastPage) {
      this.addPagesStart();
      return;
    }
    this.addPagesEnd();

    if (this.pages.length === LIMIT_SELECTOR_PAGES) return;
    this.addPagesStart();
  }

  addPagesEnd() {
    const lastPagePosition = this.pages.length - 1;
    const lastPage = this.pages[lastPagePosition];

    const isLastPage = lastPage === this.lastPage;
    const isFull = this.pages.length === LIMIT_SELECTOR_PAGES;

    if (isLastPage || isFull) return;

    const newPage = lastPage + 1;
    this.pages.push(newPage);

    return this.addPagesEnd();
  }

  addPagesStart() {
    const firstPage = this.pages[0];

    const isFull = this.pages.length === LIMIT_SELECTOR_PAGES;
    const isFirstPage = firstPage === FIRST_PAGE;

    if (isFull || isFirstPage) return;

    const newPage = firstPage - 1;
    this.pages.unshift(newPage);

    return this.addPagesStart();
  }

  goToPage(page: number) {
    if (page === this.currentPage || page > this.lastPage || page < FIRST_PAGE)
      return;
    this.clickPage.next(page);
  }
}
