/**
 * Date Picker Management
 * Handles date range selection
 */

const DatePicker = {
    initialize() {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const twoDays = new Date(today);
        twoDays.setDate(twoDays.getDate() - 2);
        const threeDays = new Date(today);
        threeDays.setDate(threeDays.getDate() - 3);
        
        document.getElementById('yesterdayDate').textContent = this.formatDate(yesterday);
        document.getElementById('twoDaysDate').textContent = this.formatDate(twoDays);
        document.getElementById('threeDaysDate').textContent = this.formatDate(threeDays);
        
        // Set custom date max to yesterday
        const maxDate = yesterday.toISOString().split('T')[0];
        document.getElementById('customStartDate').max = maxDate;
        document.getElementById('customEndDate').max = maxDate;
        
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
        AppState.currentDateFilter = value;
        const labels = {
            'yesterday': 'Yesterday',
            '2days': '2 Days Ago',
            '3days': '3 Days Ago'
        };
        
        document.getElementById('dateDisplayText').textContent = labels[value];
        
        // Update selected state
        document.querySelectorAll('.date-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        event.target.closest('.date-option').classList.add('selected');
        
        this.toggle();
        UIUtils.showToast('Date filter updated', 'info');
    },
    
    applyCustomRange() {
        const startDate = document.getElementById('customStartDate').value;
        const endDate = document.getElementById('customEndDate').value;
        
        if (!startDate || !endDate) {
            UIUtils.showToast('Please select both start and end dates', 'error');
            return;
        }
        
        if (new Date(startDate) > new Date(endDate)) {
            UIUtils.showToast('Start date must be before end date', 'error');
            return;
        }
        
        AppState.currentDateFilter = 'custom';
        const start = new Date(startDate);
        const end = new Date(endDate);
        document.getElementById('dateDisplayText').textContent = 
            `${this.formatDate(start)} - ${this.formatDate(end)}`;
        
        this.toggle();
        UIUtils.showToast('Custom date range applied', 'success');
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
    }
};
