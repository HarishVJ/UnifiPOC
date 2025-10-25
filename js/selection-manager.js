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
    },
    
    toggleSelectAll() {
        const persona = AppState.getCurrentPersona();
        if (!persona.canEdit) return;
        
        const checkbox = document.getElementById('selectAllCheckbox');
        if (checkbox.checked) {
            AppState.gridData.forEach(row => AppState.selectedRows.add(row.id));
        } else {
            AppState.clearSelection();
        }
        
        TableRenderer.render();
        this.updateActionButtons();
    },
    
    selectAll() {
        const persona = AppState.getCurrentPersona();
        if (!persona.canEdit) return;
        
        AppState.gridData.forEach(row => AppState.selectedRows.add(row.id));
        document.getElementById('selectAllCheckbox').checked = true;
        
        TableRenderer.render();
        this.updateActionButtons();
    },
    
    updateActionButtons() {
        const approveBtn = document.getElementById('approveBtn');
        const bulkExcusedBtn = document.getElementById('bulkExcusedBtn');
        const bulkCommentBtn = document.getElementById('bulkCommentBtn');
        
        const hasSelection = AppState.selectedRows.size > 0;
        const canEdit = AppState.getCurrentPersona().canEdit;
        
        approveBtn.disabled = !hasSelection || !canEdit;
        bulkExcusedBtn.disabled = !hasSelection || !canEdit;
        bulkCommentBtn.disabled = !hasSelection || !canEdit;
    }
};
