/**
 * Bulk Actions Manager
 * Handles bulk operations on selected rows
 */

const BulkActions = {
    // Bulk Excused Modal
    showExcusedModal() {
        const count = AppState.selectedRows.size;
        document.getElementById('bulkExcusedCount').textContent = count;
        document.getElementById('bulkExcusedValue').value = '';
        document.getElementById('bulkExcusedModal').classList.add('show');
    },
    
    closeExcusedModal() {
        document.getElementById('bulkExcusedModal').classList.remove('show');
    },
    
    applyExcused() {
        const value = document.getElementById('bulkExcusedValue').value;
        
        if (!value) {
            UIUtils.showToast('Please select an Excused status', 'error');
            return;
        }
        
        let successCount = 0;
        let failureCount = 0;
        
        AppState.selectedRows.forEach(rowId => {
            const row = AppState.gridData.find(r => r.id === rowId);
            if (row) {
                row.excused = value;
                successCount++;
            } else {
                failureCount++;
            }
        });
        
        this.closeExcusedModal();
        TableRenderer.render();
        StatsManager.update();
        
        if (failureCount === 0) {
            UIUtils.showToast(`Excused status updated for ${successCount} record(s)`, 'success');
        } else {
            UIUtils.showToast(`Updated ${successCount} record(s), ${failureCount} failed`, 'error');
        }
    },
    
    // Bulk Comment Modal
    showCommentModal() {
        const count = AppState.selectedRows.size;
        document.getElementById('bulkCommentCount').textContent = count;
        document.getElementById('bulkCommentValue').value = '';
        document.getElementById('bulkCharCount').textContent = '0 / 500';
        document.getElementById('bulkCommentModal').classList.add('show');
        
        // Add character counter
        const textarea = document.getElementById('bulkCommentValue');
        textarea.oninput = function() {
            const length = this.value.length;
            const counter = document.getElementById('bulkCharCount');
            counter.textContent = `${length} / 500`;
            counter.className = 'char-count';
            if (length > 450) counter.classList.add('error');
            else if (length > 400) counter.classList.add('warning');
        };
    },
    
    closeCommentModal() {
        document.getElementById('bulkCommentModal').classList.remove('show');
    },
    
    applyComment() {
        const value = document.getElementById('bulkCommentValue').value;
        
        if (!value || !value.trim()) {
            UIUtils.showToast('Please enter a comment', 'error');
            return;
        }
        
        if (value.length > AppConfig.MAX_COMMENT_LENGTH) {
            UIUtils.showToast(`Comment exceeds ${AppConfig.MAX_COMMENT_LENGTH} character limit`, 'error');
            return;
        }
        
        let successCount = 0;
        let failureCount = 0;
        
        AppState.selectedRows.forEach(rowId => {
            const row = AppState.gridData.find(r => r.id === rowId);
            if (row) {
                row.comment = value;
                successCount++;
            } else {
                failureCount++;
            }
        });
        
        this.closeCommentModal();
        TableRenderer.render();
        
        if (failureCount === 0) {
            UIUtils.showToast(`Comment applied to ${successCount} record(s)`, 'success');
        } else {
            UIUtils.showToast(`Applied to ${successCount} record(s), ${failureCount} failed`, 'error');
        }
    }
};
