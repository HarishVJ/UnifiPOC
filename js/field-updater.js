/**
 * Field Updater
 * Handles field updates and file uploads
 */

const FieldUpdater = {
    updateField(rowId, field, value) {
        const row = AppState.gridData.find(r => r.id === rowId);
        if (!row) return;
        
        row[field] = value;
        
        // Clear validation error when user edits
        if (event && event.target) {
            event.target.classList.remove('validation-error');
        }
        
        // Update excused dropdown color
        if (field === 'excused') {
            const select = event.target;
            select.className = 'excused-select';
            if (value === 'Yes') select.classList.add('excused-yes');
            else if (value === 'No') select.classList.add('excused-no');
            else select.classList.add('excused-empty');
            
            StatsManager.update();
        }
        
        // Update AMH badge if needed
        if ((field === 'amhReason' || field === 'amhAttachment') && AppState.getCurrentPersona().showAMH) {
            this.updateAMHBadge(rowId);
        }
    },
    
    updateCharCount(rowId) {
        const textarea = document.getElementById(`comment-${rowId}`);
        const counter = document.getElementById(`charCount-${rowId}`);
        
        if (textarea && counter) {
            const length = textarea.value.length;
            counter.textContent = `${length} / 500`;
            
            counter.className = 'char-count';
            if (length > 450) counter.classList.add('error');
            else if (length > 400) counter.classList.add('warning');
        }
    },
    
    updateAMHBadge(rowId) {
        const row = AppState.gridData.find(r => r.id === rowId);
        if (!row) return;
        
        const badge = document.querySelector(`#tableBody tr:nth-child(${rowId + 1}) .amh-badge`);
        if (badge) {
            const isComplete = row.amhReason && row.amhAttachment;
            badge.className = `amh-badge ${isComplete ? 'complete' : ''}`;
            badge.textContent = isComplete ? '✓ Complete' : '⚠ Required';
        }
    },
    
    handleFileUpload(rowId, input) {
        const file = input.files[0];
        if (!file) return;
        
        // Validate size
        if (file.size > AppConfig.MAX_FILE_SIZE) {
            UIUtils.showToast('File too large. Maximum size is 10MB', 'error');
            input.value = '';
            return;
        }
        
        const row = AppState.gridData.find(r => r.id === rowId);
        if (row) {
            row.amhAttachment = file.name;
            
            // Clear validation error
            const uploadArea = document.getElementById(`uploadArea-${rowId}`);
            if (uploadArea) uploadArea.classList.remove('validation-error');
            
            TableRenderer.render();
            UIUtils.showToast('File uploaded successfully', 'success');
        }
    },
    
    removeFile(rowId) {
        const row = AppState.gridData.find(r => r.id === rowId);
        if (row) {
            row.amhAttachment = null;
            const fileInput = document.getElementById(`fileInput-${rowId}`);
            if (fileInput) fileInput.value = '';
            
            TableRenderer.render();
            UIUtils.showToast('File removed', 'info');
        }
    }
};
