/**
 * Persona Manager
 * Handles user role switching
 */

const PersonaManager = {
    changePersona() {
        const select = document.getElementById('personaSelect');
        AppState.currentPersona = select.value;
        const persona = AppState.getCurrentPersona();
        
        // Update UI with persona info
        document.getElementById('userName').textContent = persona.name;
        document.getElementById('userRole').textContent = persona.role;
        document.querySelector('.user-avatar').textContent = persona.avatar;
        
        // Clear selection and re-render
        AppState.clearSelection();
        TableRenderer.render();
        SelectionManager.updateActionButtons();
        PaginationManager.update();
        
        UIUtils.showToast(`Switched to ${persona.role} view`, 'info');
    }
};
