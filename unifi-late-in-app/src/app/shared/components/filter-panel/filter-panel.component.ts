import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LateInFilters } from '../../../core/models/late-in-record.model';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent {
  @Output() filtersApplied = new EventEmitter<LateInFilters>();
  @Output() filtersReset = new EventEmitter<void>();
  @Output() refreshRequested = new EventEmitter<void>();

  filters: LateInFilters = {
    station: '',
    customer: '',
    lineOfService: '',
    jobCode: '',
    excusedStatus: '',
    dateRange: {
      type: 'yesterday'
    }
  };

  showDatePicker = false;

  stations = ['DTW - Detroit', 'ORD - Chicago', 'LAX - Los Angeles'];
  customers = ['All Customers', 'Delta Airlines', 'United Airlines'];
  lineOfServices = ['All Services', 'Cargo', 'Passenger'];
  jobCodes = ['All Job Codes', 'Ramp Agent', 'Supervisor'];
  excusedStatuses = [
    { value: '', label: 'All' },
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
    { value: 'Pending', label: 'Pending (Empty)' }
  ];

  applyFilters(): void {
    this.filtersApplied.emit(this.filters);
  }

  resetFilters(): void {
    this.filters = {
      station: '',
      customer: '',
      lineOfService: '',
      jobCode: '',
      excusedStatus: '',
      dateRange: {
        type: 'yesterday'
      }
    };
    this.filtersReset.emit();
  }

  refresh(): void {
    this.refreshRequested.emit();
  }

  toggleDatePicker(): void {
    this.showDatePicker = !this.showDatePicker;
  }

  selectDateOption(type: 'yesterday' | '2days' | '3days'): void {
    if (this.filters.dateRange) {
      this.filters.dateRange.type = type;
    }
    this.showDatePicker = false;
  }

  getDateLabel(): string {
    if (!this.filters.dateRange) return 'Yesterday';
    switch (this.filters.dateRange.type) {
      case 'yesterday': return 'Yesterday';
      case '2days': return '2 Days Ago';
      case '3days': return '3 Days Ago';
      case 'custom': return 'Custom Range';
      default: return 'Yesterday';
    }
  }
}
