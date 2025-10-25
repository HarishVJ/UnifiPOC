/**
 * Validation Manager
 * Handles form validation
 */

const ValidationManager = {
    validateSelection() {
        const errors = [];
        const persona = AppState.getCurrentPersona();
        
        // Clear previous error highlights
        this.clearErrors();
        
        AppState.selectedRows.forEach(rowId => {
            const row = AppState.gridData.find(r => r.id === rowId);
            if (!row) return;
            
            // Excused field is required
            if (!row.excused) {
                errors.push(`${row.employeeId}: Excused field is required (must select Yes or No)`);
                this.highlightError(rowId, 'excused');
            }
            
            // Comment is mandatory for Late In
            if (row.variance > 0 && (!row.comment || !row.comment.trim())) {
                errors.push(`${row.employeeId}: Comment is mandatory for Late In exceptions`);
                this.highlightError(rowId, 'comment');
            }
            
            // Comment character limit
            if (row.comment && row.comment.length > AppConfig.MAX_COMMENT_LENGTH) {
                errors.push(`${row.employeeId}: Comment exceeds ${AppConfig.MAX_COMMENT_LENGTH} character limit (${row.comment.length} chars)`);
                this.highlightError(rowId, 'comment');
            }
            
            // AMH specific validations
            if (persona.showAMH) {
                if (!row.amhReason || !row.amhReason.trim()) {
                    errors.push(`${row.employeeId}: AMH authorization reason is required`);
                    this.highlightError(rowId, 'amhReason');
                }
                if (!row.amhAttachment) {
                    errors.push(`${row.employeeId}: AMH supporting document must be uploaded`);
                    this.highlightError(rowId, 'amhAttachment');
                }
            }
        });
        
        if (errors.length > 0) {
            this.showValidationBanner(errors);
            return false;
        } else {
            this.hideValidationBanner();
            return true;
        }
    },
    
    highlightError(rowId, fieldType) {
        const startIndex = (AppState.currentPage - 1) * AppState.rowsPerPage;
        const pageData = AppState.filteredData.slice(startIndex, startIndex + AppState.rowsPerPage);
        const rowIndex = pageData.findIndex(r => r.id === rowId);
        
        if (rowIndex === -1) return;
        
        const rowElement = document.querySelector(`#tableBody tr:nth-child(${rowIndex + 1})`);
        if (!rowElement) return;
        
        const fieldMap = {
            'excused': '.excused-select',
            'comment': '.comment-textarea',
            'amhReason': `#amhReason-${rowId}`,
            'amhAttachment': `#uploadArea-${rowId}`
        };
        
        const selector = fieldMap[fieldType];
        if (selector) {
            const element = rowElement.querySelector(selector);
            if (element) element.classList.add('validation-error');
        }
    },
    
    clearErrors() {
        document.querySelectorAll('.validation-error').forEach(el => {
            el.classList.remove('validation-error');
        });
    },
    
    showValidationBanner(errors) {
        const banner = document.getElementById('validationBanner');
        const list = document.getElementById('validationList');
        list.innerHTML = errors.map(e => `<li>${e}</li>`).join('');
        banner.classList.add('show');
        banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    
    hideValidationBanner() {
        document.getElementById('validationBanner').classList.remove('show');
    }
};
