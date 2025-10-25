/**
 * Application State Management
 * Centralized state for the Late In Management System
 */

const AppState = {
    // Current user persona
    currentPersona: 'sm',
    
    // Data storage
    gridData: [],
    filteredData: [],
    selectedRows: new Set(),
    
    // Pagination
    currentPage: 1,
    rowsPerPage: 50,
    totalPagesCount: 1,
    
    // Sorting
    currentSortColumn: null,
    currentSortDirection: 'asc',
    
    // Filters
    currentDateFilter: 'yesterday',
    
    // Get current persona configuration
    getCurrentPersona() {
        return PersonaConfig[this.currentPersona];
    },
    
    // Reset selection
    clearSelection() {
        this.selectedRows.clear();
    },
    
    // Get selected row data
    getSelectedRows() {
        return Array.from(this.selectedRows).map(id => 
            this.gridData.find(row => row.id === id)
        ).filter(Boolean);
    }
};
