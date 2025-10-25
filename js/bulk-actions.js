/**
 * Bulk Actions Manager
 * Handles bulk operations on selected rows
 */

const BulkActions = {
    bulkUploadedFile: null,
    
    // Bulk Update Modal (Combined Excused + Comment)
    showBulkUpdateModal() {
        const count = AppState.selectedRows.size;
        const persona = AppState.getCurrentPersona();
        
        document.getElementById('bulkUpdateCount').textContent = count;
        document.getElementById('bulkExcusedValue').value = '';
        document.getElementById('bulkCommentValue').value = '';
        document.getElementById('bulkCharCount').textContent = '0 / 500';
        
        // Show/hide AMH fields based on persona
        const amhFields = document.getElementById('bulkAmhFields');
        const noteText = document.getElementById('bulkNoteText');
        
        if (persona.showAMH) {
            amhFields.style.display = 'block';
            document.getElementById('bulkAmhReason').value = '';
            document.getElementById('bulkAmhNotes').value = '';
            this.bulkUploadedFile = null;
            this.resetBulkUploadArea();
            noteText.textContent = 'All fields including AMH authorization will be applied to all selected records.';
        } else {
            amhFields.style.display = 'none';
            noteText.textContent = 'Both Excused status and Comment will be applied to all selected records.';
        }
        
        document.getElementById('bulkUpdateModal').classList.add('show');
        
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
    
    closeBulkUpdateModal() {
        document.getElementById('bulkUpdateModal').classList.remove('show');
    },
    
    applyBulkUpdate() {
        const persona = AppState.getCurrentPersona();
        const excusedValue = document.getElementById('bulkExcusedValue').value;
        const commentValue = document.getElementById('bulkCommentValue').value;
        
        // Basic validation
        if (!excusedValue) {
            UIUtils.showToast('Please select an Excused status', 'error');
            return;
        }
        
        if (!commentValue || !commentValue.trim()) {
            UIUtils.showToast('Please enter a comment', 'error');
            return;
        }
        
        if (commentValue.length > AppConfig.MAX_COMMENT_LENGTH) {
            UIUtils.showToast(`Comment exceeds ${AppConfig.MAX_COMMENT_LENGTH} character limit`, 'error');
            return;
        }
        
        // AMH-specific validation
        let amhReasonValue = '';
        let amhNotesValue = '';
        
        if (persona.showAMH) {
            amhReasonValue = document.getElementById('bulkAmhReason').value;
            amhNotesValue = document.getElementById('bulkAmhNotes').value;
            
            if (!amhReasonValue || !amhReasonValue.trim()) {
                UIUtils.showToast('Please enter Authorization Reason', 'error');
                return;
            }
            
            if (!this.bulkUploadedFile) {
                UIUtils.showToast('Please upload a supporting document', 'error');
                return;
            }
        }
        
        let successCount = 0;
        let failureCount = 0;
        
        // Apply to all selected rows
        AppState.selectedRows.forEach(rowId => {
            const row = AppState.gridData.find(r => r.id === rowId);
            if (row) {
                row.excused = excusedValue;
                row.comment = commentValue;
                
                // Apply AMH fields if persona is AMH
                if (persona.showAMH) {
                    row.amhReason = amhReasonValue;
                    row.amhAttachment = this.bulkUploadedFile;
                    row.amhNotes = amhNotesValue;
                }
                
                successCount++;
            } else {
                failureCount++;
            }
        });
        
        this.closeBulkUpdateModal();
        TableRenderer.render();
        StatsManager.update();
        
        if (failureCount === 0) {
            UIUtils.showToast(`Bulk update applied to ${successCount} record(s)`, 'success');
        } else {
            UIUtils.showToast(`Updated ${successCount} record(s), ${failureCount} failed`, 'error');
        }
    },
    
    handleBulkFileUpload(input) {
        const file = input.files[0];
        if (!file) return;
        
        // Validate file size
        if (file.size > AppConfig.MAX_FILE_SIZE) {
            UIUtils.showToast(`File size exceeds ${AppConfig.MAX_FILE_SIZE / 1024 / 1024}MB limit`, 'error');
            input.value = '';
            return;
        }
        
        // Store file name
        this.bulkUploadedFile = file.name;
        
        // Update UI
        document.getElementById('bulkUploadArea').classList.add('has-file');
        document.getElementById('bulkUploadText').textContent = 'File Uploaded';
        document.getElementById('bulkUploadHint').textContent = file.name;
        document.getElementById('bulkFileDisplay').style.display = 'flex';
        document.getElementById('bulkFileName').textContent = `📄 ${file.name}`;
        
        UIUtils.showToast('File uploaded successfully', 'success');
    },
    
    removeBulkFile() {
        this.bulkUploadedFile = null;
        document.getElementById('bulkFileInput').value = '';
        this.resetBulkUploadArea();
        UIUtils.showToast('File removed', 'info');
    },
    
    resetBulkUploadArea() {
        document.getElementById('bulkUploadArea').classList.remove('has-file');
        document.getElementById('bulkUploadText').textContent = 'Click to Upload';
        document.getElementById('bulkUploadHint').textContent = 'PDF, DOC, DOCX, JPG, PNG (Max 10MB)';
        document.getElementById('bulkFileDisplay').style.display = 'none';
        document.getElementById('bulkFileName').textContent = '';
    }
};
