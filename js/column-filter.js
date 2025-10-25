/**
 * Column Filter Manager
 * Handles column-level filtering in the data table
 */

const ColumnFilter = {
    apply() {
        // Get all column filter values
        const filters = {
            employeeId: document.getElementById('filter-employeeId')?.value.toLowerCase() || '',
            scheduleIn: document.getElementById('filter-scheduleIn')?.value.toLowerCase() || '',
            scheduleOut: document.getElementById('filter-scheduleOut')?.value.toLowerCase() || '',
            clockedIn: document.getElementById('filter-clockedIn')?.value.toLowerCase() || '',
            clockedOut: document.getElementById('filter-clockedOut')?.value.toLowerCase() || '',
            variance: document.getElementById('filter-variance')?.value.toLowerCase() || '',
            excused: document.getElementById('filter-excused-col')?.value || '',
            comment: document.getElementById('filter-comment')?.value.toLowerCase() || ''
        };
        
        // Filter the data
        AppState.filteredData = AppState.gridData.filter(row => {
            // Employee ID filter
            if (filters.employeeId && !row.employeeId.toLowerCase().includes(filters.employeeId)) {
                return false;
            }
            
            // Schedule In filter
            if (filters.scheduleIn && !row.scheduleIn.toLowerCase().includes(filters.scheduleIn)) {
                return false;
            }
            
            // Schedule Out filter
            if (filters.scheduleOut && !row.scheduleOut.toLowerCase().includes(filters.scheduleOut)) {
                return false;
            }
            
            // Clocked In filter
            if (filters.clockedIn && !row.clockedIn.toLowerCase().includes(filters.clockedIn)) {
                return false;
            }
            
            // Clocked Out filter
            if (filters.clockedOut && !row.clockedOut.toLowerCase().includes(filters.clockedOut)) {
                return false;
            }
            
            // Variance filter
            if (filters.variance && !row.variance.toString().includes(filters.variance)) {
                return false;
            }
            
            // Excused filter
            if (filters.excused) {
                if (filters.excused === '__EMPTY__') {
                    // Filter for empty/unset excused values
                    if (row.excused && row.excused.trim() !== '') {
                        return false;
                    }
                } else {
                    // Filter for specific values (Yes/No)
                    if (row.excused !== filters.excused) {
                        return false;
                    }
                }
            }
            
            // Comment filter
            if (filters.comment && !row.comment.toLowerCase().includes(filters.comment)) {
                return false;
            }
            
            return true;
        });
        
        // Reset to first page and re-render
        AppState.currentPage = 1;
        TableRenderer.render();
        PaginationManager.update();
        
        // Show feedback
        const totalFiltered = AppState.filteredData.length;
        const totalRecords = AppState.gridData.length;
        if (totalFiltered < totalRecords) {
            UIUtils.showToast(`Filtered to ${totalFiltered} of ${totalRecords} records`, 'info');
        }
    },
    
    clear() {
        // Clear all filter inputs
        document.getElementById('filter-employeeId').value = '';
        document.getElementById('filter-scheduleIn').value = '';
        document.getElementById('filter-scheduleOut').value = '';
        document.getElementById('filter-clockedIn').value = '';
        document.getElementById('filter-clockedOut').value = '';
        document.getElementById('filter-excused-col').value = '';
        document.getElementById('filter-comment').value = '';
        
        // Reset filtered data
        AppState.filteredData = [...AppState.gridData];
        AppState.currentPage = 1;
        
        TableRenderer.render();
        PaginationManager.update();
        UIUtils.showToast('Column filters cleared', 'info');
    }
};
