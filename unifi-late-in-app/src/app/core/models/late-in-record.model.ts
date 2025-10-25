export interface LateInRecord {
  id: number;
  employeeId: string;
  scheduleIn: string;
  scheduleOut: string;
  clockedIn: string;
  clockedOut: string;
  variance: number;
  excused: ExcusedStatus;
  comment: string;
  kronosStatus: KronosStatus;
  amhAttachment?: string | null;
  amhReason?: string;
  amhNotes?: string;
}

export type ExcusedStatus = 'Yes' | 'No' | '';
export type KronosStatus = 'success' | 'pending' | 'failed';

export interface LateInFilters {
  station?: string;
  customer?: string;
  lineOfService?: string;
  jobCode?: string;
  excusedStatus?: string;
  dateRange?: DateRangeFilter;
}

export interface DateRangeFilter {
  type: 'yesterday' | '2days' | '3days' | 'custom';
  startDate?: Date;
  endDate?: Date;
}

export interface PaginationConfig {
  currentPage: number;
  rowsPerPage: number;
  totalRecords: number;
  totalPages: number;
}

export interface SortConfig {
  column: string | null;
  direction: 'asc' | 'desc';
}

export interface ValidationError {
  employeeId: string;
  field: string;
  message: string;
}
