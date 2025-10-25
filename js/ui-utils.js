/**
 * UI Utility Functions
 * Common UI operations like loading, toasts, etc.
 */

const UIUtils = {
    // Show loading overlay
    showLoading() {
        document.getElementById('loadingOverlay').classList.add('show');
    },
    
    // Hide loading overlay
    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('show');
    },
    
    // Show toast notification
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const icon = document.getElementById('toastIcon');
        const msg = document.getElementById('toastMessage');
        
        const icons = {
            success: '✓',
            error: '✗',
            info: 'ℹ️'
        };
        
        icon.textContent = icons[type] || icons.info;
        msg.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, AppConfig.TOAST_DURATION);
    },
    
    // Update character count for textareas
    updateCharCount(textareaId, counterId, maxLength = 500) {
        const textarea = document.getElementById(textareaId);
        const counter = document.getElementById(counterId);
        
        if (textarea && counter) {
            const length = textarea.value.length;
            counter.textContent = `${length} / ${maxLength}`;
            
            counter.className = 'char-count';
            if (length > maxLength - 50) counter.classList.add('error');
            else if (length > maxLength - 100) counter.classList.add('warning');
        }
    }
};
