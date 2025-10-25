/**
 * Date Picker Management
 * Handles single-day or date range selection (max 31 days)
 * Default: Today, Future dates disabled, Auto-refresh grid
 */

const DatePicker = {
    selectedStartDate: null,
    selectedEndDate: null,
    tempStartDate: null,
    tempEndDate: null,
    currentMonth: new Date(),
    
    initialize() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Set default to Today
        this.selectedStartDate = new Date(today);
        this.selectedEndDate = new Date(today);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const twoDays = new Date(today);
        twoDays.setDate(twoDays.getDate() - 2);
        const threeDays = new Date(today);
        threeDays.setDate(threeDays.getDate() - 3);
        
        document.getElementById('todayDate').textContent = this.formatDate(today);
        document.getElementById('yesterdayDate').textContent = this.formatDate(yesterday);
        document.getElementById('twoDaysDate').textContent = this.formatDate(twoDays);
        document.getElementById('threeDaysDate').textContent = this.formatDate(threeDays);
        
        // Set default display to Today
        document.getElementById('dateDisplayText').textContent = 'Today';
        AppState.currentDateFilter = 'today';
        
        // Setup event listeners
        this.setupEventListeners();
    },
    
    formatDate(date) {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    },
    
    toggle() {
        const dropdown = document.getElementById('dateDropdown');
        const display = document.getElementById('dateDisplay');
        dropdown.classList.toggle('show');
        display.classList.toggle('active');
    },
    
    selectOption(value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        AppState.currentDateFilter = value;
        const labels = {
            'today': 'Today',
            'yesterday': 'Yesterday',
            '2days': '2 Days Ago',
            '3days': '3 Days Ago'
        };
        
        // Set date range based on selection
        switch(value) {
            case 'today':
                this.selectedStartDate = new Date(today);
                this.selectedEndDate = new Date(today);
                break;
            case 'yesterday':
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                this.selectedStartDate = new Date(yesterday);
                this.selectedEndDate = new Date(yesterday);
                break;
            case '2days':
                const twoDays = new Date(today);
                twoDays.setDate(twoDays.getDate() - 2);
                this.selectedStartDate = new Date(twoDays);
                this.selectedEndDate = new Date(twoDays);
                break;
            case '3days':
                const threeDays = new Date(today);
                threeDays.setDate(threeDays.getDate() - 3);
                this.selectedStartDate = new Date(threeDays);
                this.selectedEndDate = new Date(threeDays);
                break;
        }
        
        document.getElementById('dateDisplayText').textContent = labels[value];
        
        // Update selected state
        document.querySelectorAll('.date-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        event.target.closest('.date-option').classList.add('selected');
        
        this.toggle();
        
        // Auto-refresh grid with selected date range
        this.refreshGrid();
        UIUtils.showToast(`Date filter: ${labels[value]}`, 'info');
    },
    
    
    resetToToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        this.selectedStartDate = new Date(today);
        this.selectedEndDate = new Date(today);
        this.tempStartDate = null;
        this.tempEndDate = null;
        AppState.currentDateFilter = 'today';
        
        document.getElementById('dateDisplayText').textContent = 'Today';
        document.getElementById('dateRangeText').textContent = 'Select date range...';
        
        // Update selected state
        document.querySelectorAll('.date-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Auto-refresh grid
        this.refreshGrid();
        UIUtils.showToast('Date filter reset to Today', 'info');
    },
    
    refreshGrid() {
        // Trigger grid refresh with selected date range
        console.log(`Refreshing grid for date range: ${this.formatDate(this.selectedStartDate)} to ${this.formatDate(this.selectedEndDate)}`);
        
        // In a real implementation, this would filter data by date range
        // For now, just re-render the table
        TableRenderer.render();
        StatsManager.update();
        
        UIUtils.showToast('Grid refreshed for selected date range', 'success');
    },
    
    setupEventListeners() {
        // Close date picker when clicking outside
        document.addEventListener('click', (event) => {
            const picker = document.querySelector('.date-picker-wrapper');
            if (picker && !picker.contains(event.target)) {
                document.getElementById('dateDropdown').classList.remove('show');
                document.getElementById('dateDisplay').classList.remove('active');
            }
        });
        
        // Close modals when clicking outside
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal-overlay')) {
                BulkActions.closeExcusedModal();
                BulkActions.closeCommentModal();
            }
        });
    },
    
    // ===== UNIFIED CALENDAR METHODS =====
    
    toggleCalendar() {
        const calendar = document.getElementById('dateRangeCalendar');
        const isVisible = calendar.style.display === 'block';
        
        if (!isVisible) {
            calendar.style.display = 'block';
            this.currentMonth = new Date();
            this.renderCalendar();
        } else {
            calendar.style.display = 'none';
        }
        
        event.stopPropagation();
    },
    
    renderCalendar() {
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Update month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        document.getElementById('calendarMonth').textContent = `${monthNames[month]} ${year}`;
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Generate calendar days
        const daysContainer = document.getElementById('calendarDays');
        daysContainer.innerHTML = '';
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            daysContainer.appendChild(emptyDay);
        }
        
        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            // Disable future dates
            if (date > today) {
                dayElement.classList.add('disabled');
            } else {
                // Check if date is in selected range
                if (this.tempStartDate && this.tempEndDate) {
                    if (date >= this.tempStartDate && date <= this.tempEndDate) {
                        dayElement.classList.add('in-range');
                    }
                    if (date.getTime() === this.tempStartDate.getTime()) {
                        dayElement.classList.add('range-start');
                    }
                    if (date.getTime() === this.tempEndDate.getTime()) {
                        dayElement.classList.add('range-end');
                    }
                } else if (this.tempStartDate && date.getTime() === this.tempStartDate.getTime()) {
                    dayElement.classList.add('range-start');
                }
                
                // Add click handler
                dayElement.onclick = () => this.selectDate(date);
            }
            
            daysContainer.appendChild(dayElement);
        }
    },
    
    selectDate(date) {
        if (!this.tempStartDate || (this.tempStartDate && this.tempEndDate)) {
            // Start new selection
            this.tempStartDate = new Date(date);
            this.tempEndDate = null;
        } else {
            // Complete selection
            if (date < this.tempStartDate) {
                // Swap if end is before start
                this.tempEndDate = new Date(this.tempStartDate);
                this.tempStartDate = new Date(date);
            } else {
                this.tempEndDate = new Date(date);
            }
            
            // Validate 31-day limit
            const daysDiff = Math.ceil((this.tempEndDate - this.tempStartDate) / (1000 * 60 * 60 * 24));
            if (daysDiff > 31) {
                UIUtils.showToast('Date range cannot exceed 31 days', 'error');
                this.tempStartDate = null;
                this.tempEndDate = null;
            }
        }
        
        this.renderCalendar();
        this.updateRangeText();
    },
    
    updateRangeText() {
        const textElement = document.getElementById('dateRangeText');
        
        if (this.tempStartDate && this.tempEndDate) {
            const daysDiff = Math.ceil((this.tempEndDate - this.tempStartDate) / (1000 * 60 * 60 * 24));
            if (daysDiff === 0) {
                textElement.textContent = this.formatDate(this.tempStartDate);
            } else {
                textElement.textContent = `${this.formatDate(this.tempStartDate)} - ${this.formatDate(this.tempEndDate)}`;
            }
        } else if (this.tempStartDate) {
            textElement.textContent = `${this.formatDate(this.tempStartDate)} - ...`;
        } else {
            textElement.textContent = 'Select date range...';
        }
    },
    
    previousMonth() {
        this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
        this.renderCalendar();
        event.stopPropagation();
    },
    
    nextMonth() {
        const today = new Date();
        const nextMonth = new Date(this.currentMonth);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        
        // Don't allow navigating to future months
        if (nextMonth <= today) {
            this.currentMonth = nextMonth;
            this.renderCalendar();
        }
        event.stopPropagation();
    },
    
    clearSelection() {
        this.tempStartDate = null;
        this.tempEndDate = null;
        this.renderCalendar();
        this.updateRangeText();
        event.stopPropagation();
    },
    
    applyCalendarRange() {
        if (!this.tempStartDate || !this.tempEndDate) {
            UIUtils.showToast('Please select both start and end dates', 'error');
            return;
        }
        
        // Apply the selection
        this.selectedStartDate = new Date(this.tempStartDate);
        this.selectedEndDate = new Date(this.tempEndDate);
        AppState.currentDateFilter = 'custom';
        
        // Update display
        const daysDiff = Math.ceil((this.selectedEndDate - this.selectedStartDate) / (1000 * 60 * 60 * 24));
        if (daysDiff === 0) {
            document.getElementById('dateDisplayText').textContent = this.formatDate(this.selectedStartDate);
        } else {
            document.getElementById('dateDisplayText').textContent = 
                `${this.formatDate(this.selectedStartDate)} - ${this.formatDate(this.selectedEndDate)}`;
        }
        
        // Close calendar and dropdown
        document.getElementById('dateRangeCalendar').style.display = 'none';
        this.toggle();
        
        // Auto-refresh grid
        this.refreshGrid();
        UIUtils.showToast(`Date range applied (${daysDiff + 1} day${daysDiff > 0 ? 's' : ''})`, 'success');
        
        event.stopPropagation();
    }
};
