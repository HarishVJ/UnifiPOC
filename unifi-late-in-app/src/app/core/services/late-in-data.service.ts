import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LateInRecord, LateInFilters, PaginationConfig, SortConfig } from '../models/late-in-record.model';

@Injectable({
  providedIn: 'root'
})
export class LateInDataService {
  private recordsSubject = new BehaviorSubject<LateInRecord[]>([]);
  private filteredRecordsSubject = new BehaviorSubject<LateInRecord[]>([]);
  private selectedRowsSubject = new BehaviorSubject<Set<number>>(new Set());
  private paginationSubject = new BehaviorSubject<PaginationConfig>({
    currentPage: 1,
    rowsPerPage: 50,
    totalRecords: 0,
    totalPages: 1
  });
  private sortConfigSubject = new BehaviorSubject<SortConfig>({
    column: null,
    direction: 'asc'
  });

  records$ = this.recordsSubject.asObservable();
  filteredRecords$ = this.filteredRecordsSubject.asObservable();
  selectedRows$ = this.selectedRowsSubject.asObservable();
  pagination$ = this.paginationSubject.asObservable();
  sortConfig$ = this.sortConfigSubject.asObservable();

  constructor() {
    this.generateSampleData();
  }

  private generateSampleData(): void {
    const records: LateInRecord[] = [];
    const prefixes = ['EMP', 'TMP', 'CTR', 'FTE'];

    for (let i = 1; i <= 120; i++) {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const empId = `${prefix}${(10000 + i).toString()}`;
      
      const minutesLate = Math.floor(Math.random() * 40) + 5;
      const scheduleInHour = 8;
      const scheduleOutHour = 16;
      const clockedInMinute = minutesLate;
      const clockedOutMinute = Math.floor(Math.random() * 30);
      
      records.push({
        id: i - 1,
        employeeId: empId,
        scheduleIn: `${scheduleInHour.toString().padStart(2, '0')}:00`,
        scheduleOut: `${scheduleOutHour.toString().padStart(2, '0')}:00`,
        clockedIn: `${scheduleInHour.toString().padStart(2, '0')}:${clockedInMinute.toString().padStart(2, '0')}`,
        clockedOut: `${scheduleOutHour.toString().padStart(2, '0')}:${clockedOutMinute.toString().padStart(2, '0')}`,
        variance: minutesLate,
        excused: i % 3 === 0 ? 'Yes' : i % 3 === 1 ? 'No' : '',
        comment: i % 2 === 0 ? 'Traffic delay due to highway accident' : '',
        kronosStatus: i % 3 === 0 ? 'success' : i % 3 === 1 ? 'pending' : 'failed',
        amhAttachment: null,
        amhReason: '',
        amhNotes: ''
      });
    }

    this.recordsSubject.next(records);
    this.filteredRecordsSubject.next([...records]);
    this.updatePagination(records.length);
  }

  applyFilters(filters: LateInFilters): void {
    let filtered = [...this.recordsSubject.value];

    if (filters.excusedStatus) {
      if (filters.excusedStatus === 'Pending') {
        filtered = filtered.filter(r => !r.excused);
      } else {
        filtered = filtered.filter(r => r.excused === filters.excusedStatus);
      }
    }

    this.filteredRecordsSubject.next(filtered);
    this.updatePagination(filtered.length);
    this.paginationSubject.next({
      ...this.paginationSubject.value,
      currentPage: 1
    });
  }

  applySort(column: string): void {
    const currentSort = this.sortConfigSubject.value;
    const direction = currentSort.column === column && currentSort.direction === 'asc' ? 'desc' : 'asc';
    
    const sorted = [...this.filteredRecordsSubject.value].sort((a, b) => {
      const aVal = a[column as keyof LateInRecord];
      const bVal = b[column as keyof LateInRecord];
      
      if (!aVal && !bVal) return 0;
      if (!aVal) return 1;
      if (!bVal) return -1;
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredRecordsSubject.next(sorted);
    this.sortConfigSubject.next({ column, direction });
  }

  updateRecord(id: number, field: keyof LateInRecord, value: any): void {
    const records = this.recordsSubject.value;
    const record = records.find(r => r.id === id);
    if (record) {
      (record as any)[field] = value;
      this.recordsSubject.next([...records]);
      this.filteredRecordsSubject.next([...this.filteredRecordsSubject.value]);
    }
  }

  bulkUpdateExcused(ids: number[], value: 'Yes' | 'No'): void {
    const records = this.recordsSubject.value;
    ids.forEach(id => {
      const record = records.find(r => r.id === id);
      if (record) {
        record.excused = value;
      }
    });
    this.recordsSubject.next([...records]);
    this.filteredRecordsSubject.next([...this.filteredRecordsSubject.value]);
  }

  bulkUpdateComment(ids: number[], comment: string): void {
    const records = this.recordsSubject.value;
    ids.forEach(id => {
      const record = records.find(r => r.id === id);
      if (record) {
        record.comment = comment;
      }
    });
    this.recordsSubject.next([...records]);
    this.filteredRecordsSubject.next([...this.filteredRecordsSubject.value]);
  }

  toggleRowSelection(id: number): void {
    const selected = new Set(this.selectedRowsSubject.value);
    if (selected.has(id)) {
      selected.delete(id);
    } else {
      selected.add(id);
    }
    this.selectedRowsSubject.next(selected);
  }

  selectAll(): void {
    const allIds = new Set(this.filteredRecordsSubject.value.map(r => r.id));
    this.selectedRowsSubject.next(allIds);
  }

  clearSelection(): void {
    this.selectedRowsSubject.next(new Set());
  }

  changePage(page: number): void {
    const pagination = this.paginationSubject.value;
    if (page >= 1 && page <= pagination.totalPages) {
      this.paginationSubject.next({
        ...pagination,
        currentPage: page
      });
    }
  }

  changeRowsPerPage(rowsPerPage: number): void {
    const pagination = this.paginationSubject.value;
    const totalPages = Math.ceil(pagination.totalRecords / rowsPerPage);
    this.paginationSubject.next({
      ...pagination,
      rowsPerPage,
      totalPages,
      currentPage: 1
    });
  }

  private updatePagination(totalRecords: number): void {
    const pagination = this.paginationSubject.value;
    const totalPages = Math.ceil(totalRecords / pagination.rowsPerPage);
    this.paginationSubject.next({
      ...pagination,
      totalRecords,
      totalPages
    });
  }

  getPagedRecords(): Observable<LateInRecord[]> {
    return new Observable(observer => {
      this.filteredRecords$.subscribe(records => {
        this.pagination$.subscribe(pagination => {
          const startIndex = (pagination.currentPage - 1) * pagination.rowsPerPage;
          const endIndex = startIndex + pagination.rowsPerPage;
          observer.next(records.slice(startIndex, endIndex));
        });
      });
    });
  }
}
