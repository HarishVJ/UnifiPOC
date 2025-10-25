/**
 * Stats Manager
 * Updates statistics cards
 */

const StatsManager = {
    update() {
        const pending = AppState.gridData.filter(r => !r.excused).length;
        const excused = AppState.gridData.filter(r => r.excused === 'Yes').length;
        const unexcused = AppState.gridData.filter(r => r.excused === 'No').length;
        
        document.getElementById('statPending').textContent = pending;
        document.getElementById('statExcused').textContent = excused;
        document.getElementById('statUnexcused').textContent = unexcused;
    }
};
