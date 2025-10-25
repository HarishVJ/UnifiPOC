/**
 * Sort Manager
 * Handles table column sorting
 */

const SortManager = {
    sort(column) {
        // Toggle direction if same column, otherwise reset to ascending
        if (AppState.currentSortColumn === column) {
            AppState.currentSortDirection = AppState.currentSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            AppState.currentSortColumn = column;
            AppState.currentSortDirection = 'asc';
        }
        
        // Sort the filtered data
        AppState.filteredData.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];
            
            // Handle empty values
            if (!aVal && !bVal) return 0;
            if (!aVal) return 1;
            if (!bVal) return -1;
            
            // Compare values
            if (aVal < bVal) return AppState.currentSortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return AppState.currentSortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        
        // Update sort indicators
        document.querySelectorAll('[id^="sort-"]').forEach(el => {
            el.textContent = '⇅';
        });
        const indicator = document.getElementById(`sort-${column}`);
        if (indicator) {
            indicator.textContent = AppState.currentSortDirection === 'asc' ? '↑' : '↓';
        }
        
        // Re-render table
        TableRenderer.render();
        PaginationManager.update();
        UIUtils.showToast(`Sorted by ${column} (${AppState.currentSortDirection})`, 'info');
    }
};
