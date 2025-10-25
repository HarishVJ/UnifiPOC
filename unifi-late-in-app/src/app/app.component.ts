import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { LateInDataService } from './core/services/late-in-data.service';
import { PersonaService } from './core/services/persona.service';
import { ValidationService } from './core/services/validation.service';
import { ToastService } from './core/services/toast.service';
import { LateInRecord, PaginationConfig, SortConfig, ValidationError } from './core/models/late-in-record.model';
import { Persona, PersonaType, PERSONAS } from './core/models/persona.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // State
  showLogin = true;
  showLoading = false;
  records: LateInRecord[] = [];
  selectedRows = new Set<number>();
  currentPersona!: Persona;
  pagination!: PaginationConfig;
  sortConfig!: SortConfig;
  
  // Validation
  validationErrors: string[] = [];
  showValidationBanner = false;
  errorFields = new Set<string>();
  
  // Filters
  filters = {
    station: 'DTW - Detroit',
    customer: 'All Customers',
    lineOfService: 'All Services',
    jobCode: 'All Job Codes',
    excusedStatus: '',
    dateRange: 'yesterday'
  };
  showDatePicker = false;
  
  // Stats
  stats = {
    pending: 0,
    excused: 0,
    unexcused: 0
  };
  
  // Bulk Actions
  showBulkExcusedModal = false;
  showBulkCommentModal = false;
  bulkExcusedValue = '';
  bulkCommentValue = '';
  
  // Toast
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'info';
  showToast = false;
  
  // Dropdowns
  personas = Object.values(PERSONAS);
  stations = ['DTW - Detroit', 'ORD - Chicago', 'LAX - Los Angeles'];
  customers = ['All Customers', 'Delta Airlines', 'United Airlines'];
  lineOfServices = ['All Services', 'Cargo', 'Passenger'];
  jobCodes = ['All Job Codes', 'Ramp Agent', 'Supervisor'];

  constructor(
    private dataService: LateInDataService,
    private personaService: PersonaService,
    private validationService: ValidationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.subscribeToData();
    this.subscribeToToast();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToData(): void {
    this.dataService.getPagedRecords()
      .pipe(takeUntil(this.destroy$))
      .subscribe(records => {
        this.records = records;
        this.updateStats();
      });

    this.dataService.selectedRows$
      .pipe(takeUntil(this.destroy$))
      .subscribe(selected => {
        this.selectedRows = selected;
      });

    this.personaService.currentPersona$
      .pipe(takeUntil(this.destroy$))
      .subscribe(persona => {
        this.currentPersona = persona;
      });

    this.dataService.pagination$
      .pipe(takeUntil(this.destroy$))
      .subscribe(pagination => {
        this.pagination = pagination;
      });

    this.dataService.sortConfig$
      .pipe(takeUntil(this.destroy$))
      .subscribe(sortConfig => {
        this.sortConfig = sortConfig;
      });
  }

  private subscribeToToast(): void {
    this.toastService.toast$
      .pipe(takeUntil(this.destroy$))
      .subscribe(toast => {
        this.toastMessage = toast.message;
        this.toastType = toast.type;
        this.showToast = toast.show;
      });
  }

  // Login/Logout
  login(): void {
    this.showLoading = true;
    setTimeout(() => {
      this.showLogin = false;
      this.showLoading = false;
      this.toastService.showSuccess('Login successful!');
    }, 1500);
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.showLoading = true;
      setTimeout(() => {
        this.showLogin = true;
        this.showLoading = false;
        this.dataService.clearSelection();
        this.toastService.showInfo('Logged out successfully');
      }, 1000);
    }
  }

  // Persona
  changePersona(personaType: PersonaType): void {
    this.personaService.switchPersona(personaType);
    this.dataService.clearSelection();
    this.toastService.showInfo(`Switched to ${PERSONAS[personaType].role} view`);
  }

  // Filters
  applyFilters(): void {
    this.showLoading = true;
    setTimeout(() => {
      this.dataService.applyFilters({
        excusedStatus: this.filters.excusedStatus
      });
      this.showLoading = false;
      this.toastService.showSuccess('Filters applied successfully');
    }, 1000);
  }

  resetFilters(): void {
    this.filters = {
      station: 'DTW - Detroit',
      customer: 'All Customers',
      lineOfService: 'All Services',
      jobCode: 'All Job Codes',
      excusedStatus: '',
      dateRange: 'yesterday'
    };
    this.dataService.applyFilters({});
    this.toastService.showInfo('Filters reset to default');
  }

  refreshGrid(): void {
    this.showLoading = true;
    setTimeout(() => {
      this.applyFilters();
      this.showLoading = false;
      this.toastService.showSuccess('Grid refreshed successfully');
    }, 1000);
  }

  toggleDatePicker(): void {
    this.showDatePicker = !this.showDatePicker;
  }

  selectDateOption(option: string): void {
    this.filters.dateRange = option;
    this.showDatePicker = false;
    this.toastService.showInfo('Date filter updated');
  }

  getDateLabel(): string {
    const labels: Record<string, string> = {
      'yesterday': 'Yesterday',
      '2days': '2 Days Ago',
      '3days': '3 Days Ago'
    };
    return labels[this.filters.dateRange] || 'Yesterday';
  }

  // Stats
  private updateStats(): void {
    this.dataService.filteredRecords$
      .pipe(takeUntil(this.destroy$))
      .subscribe(allRecords => {
        this.stats.pending = allRecords.filter(r => !r.excused).length;
        this.stats.excused = allRecords.filter(r => r.excused === 'Yes').length;
        this.stats.unexcused = allRecords.filter(r => r.excused === 'No').length;
      });
  }

  // Grid Actions
  toggleRowSelection(id: number): void {
    this.dataService.toggleRowSelection(id);
  }

  selectAll(): void {
    this.dataService.selectAll();
  }

  toggleSelectAll(): void {
    if (this.selectedRows.size === this.records.length && this.records.length > 0) {
      this.dataService.clearSelection();
    } else {
      this.selectAll();
    }
  }

  updateField(id: number, field: keyof LateInRecord, value: any): void {
    this.dataService.updateRecord(id, field, value);
    this.errorFields.delete(`${id}-${field}`);
  }

  sortTable(column: string): void {
    this.dataService.applySort(column);
    this.toastService.showInfo(`Sorted by ${column}`);
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
    this.toastService.showInfo(`Showing ${select.value} rows per page`);
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

  // Bulk Actions
  openBulkExcusedModal(): void {
    this.bulkExcusedValue = '';
    this.showBulkExcusedModal = true;
  }

  closeBulkExcusedModal(): void {
    this.showBulkExcusedModal = false;
  }

  applyBulkExcused(): void {
    if (!this.bulkExcusedValue) {
      this.toastService.showError('Please select an Excused status');
      return;
    }

    const ids = Array.from(this.selectedRows);
    this.dataService.bulkUpdateExcused(ids, this.bulkExcusedValue as 'Yes' | 'No');
    this.closeBulkExcusedModal();
    this.toastService.showSuccess(`Excused status updated for ${ids.length} record(s)`);
  }

  openBulkCommentModal(): void {
    this.bulkCommentValue = '';
    this.showBulkCommentModal = true;
  }

  closeBulkCommentModal(): void {
    this.showBulkCommentModal = false;
  }

  applyBulkComment(): void {
    if (!this.bulkCommentValue || !this.bulkCommentValue.trim()) {
      this.toastService.showError('Please enter a comment');
      return;
    }

    if (this.bulkCommentValue.length > 500) {
      this.toastService.showError('Comment exceeds 500 character limit');
      return;
    }

    const ids = Array.from(this.selectedRows);
    this.dataService.bulkUpdateComment(ids, this.bulkCommentValue);
    this.closeBulkCommentModal();
    this.toastService.showSuccess(`Comment applied to ${ids.length} record(s)`);
  }

  getBulkCharCount(): string {
    const length = this.bulkCommentValue ? this.bulkCommentValue.length : 0;
    return `${length} / 500`;
  }

  getBulkCharCountClass(): string {
    const length = this.bulkCommentValue ? this.bulkCommentValue.length : 0;
    if (length > 450) return 'error';
    if (length > 400) return 'warning';
    return '';
  }

  // Validation
  approveSelected(): void {
    const selectedRecords = Array.from(this.selectedRows)
      .map(id => this.records.find(r => r.id === id))
      .filter(r => r !== undefined) as LateInRecord[];

    const errors = this.validationService.validateRecords(selectedRecords, this.currentPersona);

    if (errors.length > 0) {
      this.validationErrors = errors.map(e => `${e.employeeId}: ${e.message}`);
      this.showValidationBanner = true;
      errors.forEach(e => this.errorFields.add(`${e.employeeId}-${e.field}`));
      this.toastService.showError('Please fix validation errors');
      return;
    }

    this.showValidationBanner = false;
    this.errorFields.clear();
    
    const count = selectedRecords.length;
    if (!confirm(`Approve ${count} selected record(s)?`)) {
      return;
    }

    this.showLoading = true;
    setTimeout(() => {
      this.dataService.clearSelection();
      this.showLoading = false;
      this.toastService.showSuccess(`${count} record(s) approved and sent to Kronos`);
    }, 2000);
  }

  hasError(id: number, field: string): boolean {
    return this.errorFields.has(`${id}-${field}`);
  }

  // Helpers
  getExcusedClass(excused: string): string {
    if (excused === 'Yes') return 'excused-yes';
    if (excused === 'No') return 'excused-no';
    return 'excused-empty';
  }

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

  // File Upload (for AMH)
  handleFileUpload(event: Event, rowId: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      this.toastService.showError('File too large. Maximum size is 10MB');
      input.value = '';
      return;
    }

    this.dataService.updateRecord(rowId, 'amhAttachment', file.name);
    this.toastService.showSuccess('File uploaded successfully');
  }

  removeFile(rowId: number): void {
    this.dataService.updateRecord(rowId, 'amhAttachment', null);
    this.toastService.showInfo('File removed');
  }
}
