/**
 * Authentication Manager
 * Handles login/logout operations
 */

const AuthManager = {
    login() {
        UIUtils.showLoading();
        
        setTimeout(() => {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('appContainer').classList.add('show');
            UIUtils.hideLoading();
            
            // Initialize the application
            AppInitializer.init();
            
            UIUtils.showToast('Login successful!', 'success');
        }, AppConfig.LOADING_DELAY);
    },
    
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            UIUtils.showLoading();
            
            setTimeout(() => {
                document.getElementById('appContainer').classList.remove('show');
                document.getElementById('loginScreen').style.display = 'flex';
                UIUtils.hideLoading();
                UIUtils.showToast('Logged out successfully', 'info');
            }, 1000);
        }
    }
};
