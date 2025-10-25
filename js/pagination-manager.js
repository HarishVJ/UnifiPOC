/**
 * Pagination Manager
 * Handles table pagination
 */

const PaginationManager = {
    update() {
        const totalRecords = AppState.filteredData.length;
        AppState.totalPagesCount = Math.ceil(totalRecords / AppState.rowsPerPage);
        
        // Update info display
        document.getElementById('totalRecords').textContent = totalRecords;
        document.getElementById('currentPageDisplay').textContent = AppState.currentPage;
        document.getElementById('totalPages').textContent = AppState.totalPagesCount;
        
        // Update button states
        document.getElementById('firstPageBtn').disabled = AppState.currentPage === 1;
        document.getElementById('prevPageBtn').disabled = AppState.currentPage === 1;
        document.getElementById('nextPageBtn').disabled = AppState.currentPage === AppState.totalPagesCount;
        document.getElementById('lastPageBtn').disabled = AppState.currentPage === AppState.totalPagesCount;
        
        // Render page numbers
        this.renderPageNumbers();
    },
    
    renderPageNumbers() {
        const pageNumbersDiv = document.getElementById('pageNumbers');
        pageNumbersDiv.innerHTML = '';
        
        const maxVisible = 7;
        let startPage = Math.max(1, AppState.currentPage - 3);
        let endPage = Math.min(AppState.totalPagesCount, startPage + maxVisible - 1);
        
        // Adjust start if near the end
        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        // First page + ellipsis
        if (startPage > 1) {
            this.addPageNumber(1);
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'page-ellipsis';
                ellipsis.textContent = '...';
                pageNumbersDiv.appendChild(ellipsis);
            }
        }
        
        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            this.addPageNumber(i);
        }
        
        // Ellipsis + last page
        if (endPage < AppState.totalPagesCount) {
            if (endPage < AppState.totalPagesCount - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'page-ellipsis';
                ellipsis.textContent = '...';
                pageNumbersDiv.appendChild(ellipsis);
            }
            this.addPageNumber(AppState.totalPagesCount);
        }
    },
    
    addPageNumber(pageNum) {
        const pageNumbersDiv = document.getElementById('pageNumbers');
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-number' + (pageNum === AppState.currentPage ? ' active' : '');
        pageBtn.textContent = pageNum;
        pageBtn.onclick = () => this.goToPage(pageNum);
        pageNumbersDiv.appendChild(pageBtn);
    },
    
    goToPage(page) {
        if (page < 1 || page > AppState.totalPagesCount || page === AppState.currentPage) return;
        
        AppState.currentPage = page;
        TableRenderer.render();
        this.update();
        
        // Scroll to top of table
        document.querySelector('.table-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    
    goToPrevious() {
        this.goToPage(AppState.currentPage - 1);
    },
    
    goToNext() {
        this.goToPage(AppState.currentPage + 1);
    },
    
    goToLast() {
        this.goToPage(AppState.totalPagesCount);
    },
    
    changeRowsPerPage() {
        const select = document.getElementById('rowsPerPageSelect');
        AppState.rowsPerPage = parseInt(select.value);
        AppState.currentPage = 1;
        
        TableRenderer.render();
        this.update();
        UIUtils.showToast(`Showing ${AppState.rowsPerPage} rows per page`, 'info');
    }
};
