/**
 * Selection Manager
 * Handles row selection in the data table
 */

const SelectionManager = {
    toggleRow(rowId) {
        if (AppState.selectedRows.has(rowId)) {
            AppState.selectedRows.delete(rowId);
        } else {
            AppState.selectedRows.add(rowId);
        }
        
        TableRenderer.render();
        this.updateActionButtons();
        this.updateSelectionBanner();
        this.updateSelectAllButton();
    },
    
    toggleSelectAll() {
        const persona = AppState.getCurrentPersona();
        if (!persona.canEdit) return;
        
        const checkbox = document.getElementById('selectAllCheckbox');
        if (checkbox.checked) {
            // Select only current page rows
            const currentPageRows = this.getCurrentPageRows();
            currentPageRows.forEach(row => AppState.selectedRows.add(row.id));
        } else {
            // Deselect only current page rows
            const currentPageRows = this.getCurrentPageRows();
            currentPageRows.forEach(row => AppState.selectedRows.delete(row.id));
        }
        
        TableRenderer.render();
        this.updateActionButtons();
        this.updateSelectionBanner();
        this.updateSelectAllButton();
    },
    
    selectAll() {
        const persona = AppState.getCurrentPersona();
        if (!persona.canEdit) return;
        
        // Select only current page rows
        const currentPageRows = this.getCurrentPageRows();
        currentPageRows.forEach(row => AppState.selectedRows.add(row.id));
        document.getElementById('selectAllCheckbox').checked = true;
        
        TableRenderer.render();
        this.updateActionButtons();
        this.updateSelectionBanner();
        this.updateSelectAllButton();
    },
    
    deselectAll() {
        const persona = AppState.getCurrentPersona();
        if (!persona.canEdit) return;
        
        // Deselect only current page rows
        const currentPageRows = this.getCurrentPageRows();
        currentPageRows.forEach(row => AppState.selectedRows.delete(row.id));
        document.getElementById('selectAllCheckbox').checked = false;
        
        TableRenderer.render();
        this.updateActionButtons();
        this.updateSelectionBanner();
        this.updateSelectAllButton();
    },
    
    toggleSelectAllButton() {
        const persona = AppState.getCurrentPersona();
        if (!persona.canEdit) return;
        
        const currentPageRows = this.getCurrentPageRows();
        const allSelected = currentPageRows.length > 0 && 
                           currentPageRows.every(row => AppState.selectedRows.has(row.id));
        
        if (allSelected) {
            // Deselect all current page rows
            currentPageRows.forEach(row => AppState.selectedRows.delete(row.id));
            UIUtils.showToast('All rows deselected', 'info');
        } else {
            // Select all current page rows
            currentPageRows.forEach(row => AppState.selectedRows.add(row.id));
            UIUtils.showToast(`${currentPageRows.length} rows selected`, 'success');
        }
        
        TableRenderer.render();
        this.updateActionButtons();
        this.updateSelectionBanner();
        this.updateSelectAllButton();
    },
    
    getCurrentPageRows() {
        // Get rows for current page only
        const startIndex = (AppState.currentPage - 1) * AppState.rowsPerPage;
        const endIndex = startIndex + AppState.rowsPerPage;
        return AppState.filteredData.slice(startIndex, endIndex);
    },
    
    updateSelectAllButton() {
        const currentPageRows = this.getCurrentPageRows();
        const allSelected = currentPageRows.length > 0 && 
                           currentPageRows.every(row => AppState.selectedRows.has(row.id));
        
        const icon = document.getElementById('selectAllIcon');
        const btn = document.getElementById('selectAllBtn');
        
        if (allSelected) {
            icon.textContent = '☑';
            if (btn) btn.title = 'Deselect All';
        } else {
            icon.textContent = '☐';
            if (btn) btn.title = 'Select All';
        }
    },
    
    
    updateActionButtons() {
        const approveBtn = document.getElementById('approveBtn');
        const bulkUpdateBtn = document.getElementById('bulkUpdateBtn');
        
        const hasSelection = AppState.selectedRows.size > 0;
        const canEdit = AppState.getCurrentPersona().canEdit;
        
        approveBtn.disabled = !hasSelection || !canEdit;
        bulkUpdateBtn.disabled = !hasSelection || !canEdit;
    },
    
    updateSelectionBanner() {
        const badge = document.getElementById('selectionCountBadge');
        const count = AppState.selectedRows.size;
        
        if (count > 0) {
            badge.classList.add('show');
            badge.textContent = count;
        } else {
            badge.classList.remove('show');
        }
    }
};
