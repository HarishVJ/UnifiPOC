/**
 * Application Initializer
 * Initializes the application on startup
 */

const AppInitializer = {
    init() {
        // Generate sample data
        AppState.gridData = DataGenerator.generate();
        AppState.filteredData = [...AppState.gridData];
        
        // Initialize date picker
        DatePicker.initialize();
        
        // Render initial view
        TableRenderer.render();
        StatsManager.update();
        PaginationManager.update();
        
        console.log('iLink Late In Management System initialized successfully');
    }
};
