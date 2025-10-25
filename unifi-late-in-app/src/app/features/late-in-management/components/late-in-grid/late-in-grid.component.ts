import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { LateInDataService } from '../../../../core/services/late-in-data.service';
import { PersonaService } from '../../../../core/services/persona.service';
import { ValidationService } from '../../../../core/services/validation.service';
import { LateInRecord, PaginationConfig, SortConfig } from '../../../../core/models/late-in-record.model';
import { Persona } from '../../../../core/models/persona.model';

@Component({
  selector: 'app-late-in-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './late-in-grid.component.html',
  styleUrls: ['./late-in-grid.component.scss']
})
export class LateInGridComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  records: LateInRecord[] = [];
  selectedRows = new Set<number>();
  currentPersona!: Persona;
  pagination!: PaginationConfig;
  sortConfig!: SortConfig;
  validationErrors: string[] = [];
  showValidationBanner = false;

  constructor(
    private dataService: LateInDataService,
    private personaService: PersonaService,
    private validationService: ValidationService
  ) {}

  ngOnInit(): void {
    // Subscribe to paged records
    this.dataService.getPagedRecords()
      .pipe(takeUntil(this.destroy$))
      .subscribe(records => {
        this.records = records;
      });

    // Subscribe to selected rows
    this.dataService.selectedRows$
      .pipe(takeUntil(this.destroy$))
      .subscribe(selected => {
        this.selectedRows = selected;
      });

    // Subscribe to current persona
    this.personaService.currentPersona$
      .pipe(takeUntil(this.destroy$))
      .subscribe(persona => {
        this.currentPersona = persona;
      });

    // Subscribe to pagination
    this.dataService.pagination$
      .pipe(takeUntil(this.destroy$))
      .subscribe(pagination => {
        this.pagination = pagination;
      });

    // Subscribe to sort config
    this.dataService.sortConfig$
      .pipe(takeUntil(this.destroy$))
      .subscribe(sortConfig => {
        this.sortConfig = sortConfig;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Row selection
  toggleRowSelection(id: number): void {
    this.dataService.toggleRowSelection(id);
  }

  selectAll(): void {
    this.dataService.selectAll();
  }

  toggleSelectAll(): void {
    if (this.selectedRows.size === this.records.length) {
      this.dataService.clearSelection();
    } else {
      this.selectAll();
    }
  }

  // Field updates
  updateField(id: number, field: keyof LateInRecord, value: any): void {
    this.dataService.updateRecord(id, field, value);
  }

  // Sorting
  sortTable(column: string): void {
    this.dataService.applySort(column);
  }

  getSortIcon(column: string): string {
    if (this.sortConfig.column !== column) return '⇅';
    return this.sortConfig.direction === 'asc' ? '↑' : '↓';
  }

  // Pagination
  goToPage(page: number): void {
    this.dataService.changePage(page);
  }

  changeRowsPerPage(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.dataService.changeRowsPerPage(parseInt(select.value));
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 7;
    let startPage = Math.max(1, this.pagination.currentPage - 3);
    let endPage = Math.min(this.pagination.totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Validation and approval
  approveSelected(): void {
    const selectedRecords = Array.from(this.selectedRows)
      .map(id => this.records.find(r => r.id === id))
      .filter(r => r !== undefined) as LateInRecord[];

    const errors = this.validationService.validateRecords(selectedRecords, this.currentPersona);

    if (errors.length > 0) {
      this.validationErrors = errors.map(e => `${e.employeeId}: ${e.message}`);
      this.showValidationBanner = true;
      return;
    }

    this.showValidationBanner = false;
    // Simulate approval
    alert(`Approving ${selectedRecords.length} record(s)`);
  }

  // Character counter
  getCharCount(comment: string): string {
    const length = comment ? comment.length : 0;
    return `${length} / 500`;
  }

  getCharCountClass(comment: string): string {
    const length = comment ? comment.length : 0;
    if (length > 450) return 'error';
    if (length > 400) return 'warning';
    return '';
  }

  // Excused status class
  getExcusedClass(excused: string): string {
    if (excused === 'Yes') return 'excused-yes';
    if (excused === 'No') return 'excused-no';
    return 'excused-empty';
  }

  // Kronos status
  getKronosIcon(status: string): string {
    if (status === 'success') return '🟢';
    if (status === 'pending') return '🟡';
    return '🔴';
  }

  getKronosText(status: string): string {
    if (status === 'success') return 'Success';
    if (status === 'pending') return 'Pending';
    return 'Failed';
  }
}
