        // ===== STATE MANAGEMENT =====
        let currentPersona = 'sm';
        let selectedRows = new Set();
        let gridData = [];
        let filteredData = []; // Data after filters applied
        let currentDateFilter = 'yesterday';
        
        // Pagination state
        let currentPage = 1;
        let rowsPerPage = 50;
        let totalPagesCount = 1;
        
        // Sorting state
        let currentSortColumn = null;
        let currentSortDirection = 'asc';
        
        // Persona configurations
        const personas = {
            sm: {
                name: 'Site Manager',
                role: 'Site Manager',
                canEdit: true,
                canEditExcused: true,
                canEditComment: true,
                showAMH: false,
                avatar: 'SM'
            },
            amh: {
                name: 'John Smith',
                role: 'Area Manager',
                canEdit: true,
                canEditExcused: true,
                canEditComment: true,
                showAMH: true,
                avatar: 'AM'
            },
            ops: {
                name: 'Operations User',
                role: 'Operations',
                canEdit: false,
                canEditExcused: false,
                canEditComment: false,
                showAMH: false,
                avatar: 'OP'
            },
            admin: {
                name: 'Admin User',
                role: 'Administrator',
                canEdit: false,
                canEditExcused: false,
                canEditComment: false,
                showAMH: false,
                avatar: 'AD'
            }
        };
        
        // ===== INITIALIZATION =====
        function init() {
            generateSampleData();
            initializeDatePicker();
            filteredData = [...gridData]; // Initialize filtered data
            renderTable();
            updateStats();
            updatePagination();
        }
        
        // ===== DATE PICKER =====
        function initializeDatePicker() {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const twoDays = new Date(today);
            twoDays.setDate(twoDays.getDate() - 2);
            const threeDays = new Date(today);
            threeDays.setDate(threeDays.getDate() - 3);
            
            document.getElementById('yesterdayDate').textContent = formatDate(yesterday);
            document.getElementById('twoDaysDate').textContent = formatDate(twoDays);
            document.getElementById('threeDaysDate').textContent = formatDate(threeDays);
            
            // Set custom date max to yesterday
            const maxDate = yesterday.toISOString().split('T')[0];
            document.getElementById('customStartDate').max = maxDate;
            document.getElementById('customEndDate').max = maxDate;
        }
        
        function formatDate(date) {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
        
        function toggleDatePicker() {
            const dropdown = document.getElementById('dateDropdown');
            const display = document.getElementById('dateDisplay');
            dropdown.classList.toggle('show');
            display.classList.toggle('active');
        }
        
        function selectDateOption(value) {
            currentDateFilter = value;
            const labels = {
                'yesterday': 'Yesterday',
                '2days': '2 Days Ago',
                '3days': '3 Days Ago'
            };
            
            document.getElementById('dateDisplayText').textContent = labels[value];
            
            // Update selected state
            document.querySelectorAll('.date-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            event.target.closest('.date-option').classList.add('selected');
            
            toggleDatePicker();
            showToast('Date filter updated', 'info');
        }
        
        function applyCustomRange() {
            const startDate = document.getElementById('customStartDate').value;
            const endDate = document.getElementById('customEndDate').value;
            
            if (!startDate || !endDate) {
                showToast('Please select both start and end dates', 'error');
                return;
            }
            
            if (new Date(startDate) > new Date(endDate)) {
                showToast('Start date must be before end date', 'error');
                return;
            }
            
            currentDateFilter = 'custom';
            const start = new Date(startDate);
            const end = new Date(endDate);
            document.getElementById('dateDisplayText').textContent = 
                `${formatDate(start)} - ${formatDate(end)}`;
            
            toggleDatePicker();
            showToast('Custom date range applied', 'success');
        }
        
        // Close date picker when clicking outside
        document.addEventListener('click', function(event) {
            const picker = document.querySelector('.date-picker-wrapper');
            if (picker && !picker.contains(event.target)) {
                document.getElementById('dateDropdown').classList.remove('show');
                document.getElementById('dateDisplay').classList.remove('active');
            }
        });
        
        // Close modals when clicking outside
        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal-overlay')) {
                closeBulkExcusedModal();
                closeBulkCommentModal();
            }
        });
        
        // ===== LOGIN/LOGOUT =====
        function login() {
            showLoading();
            setTimeout(() => {
                document.getElementById('loginScreen').style.display = 'none';
                document.getElementById('appContainer').classList.add('show');
                hideLoading();
                init();
                showToast('Login successful!', 'success');
            }, 1500);
        }
        
        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                showLoading();
                setTimeout(() => {
                    document.getElementById('appContainer').classList.remove('show');
                    document.getElementById('loginScreen').style.display = 'flex';
                    hideLoading();
                    showToast('Logged out successfully', 'info');
                }, 1000);
            }
        }
        
        // ===== PERSONA MANAGEMENT =====
        function changePersona() {
            const select = document.getElementById('personaSelect');
            currentPersona = select.value;
            const persona = personas[currentPersona];
            
            document.getElementById('userName').textContent = persona.name;
            document.getElementById('userRole').textContent = persona.role;
            document.querySelector('.user-avatar').textContent = persona.avatar;
            
            selectedRows.clear();
            renderTable();
            updateActionButtons();
            updatePagination();
            
            showToast(`Switched to ${persona.role} view`, 'info');
        }
        
        // ===== DATA GENERATION =====
        function generateSampleData() {
            gridData = [];
            // Generate 120 sample records for pagination demo
            const prefixes = ['EMP', 'TMP', 'CTR', 'FTE'];
            
            for (let i = 1; i <= 120; i++) {
                const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
                const empId = `${prefix}${(10000 + i).toString()}`; // Alphanumeric format
                
                const minutesLate = Math.floor(Math.random() * 40) + 5;
                const scheduleInHour = 8;
                const scheduleOutHour = 16; // 8-hour shift
                const clockedInMinute = minutesLate;
                const clockedOutMinute = Math.floor(Math.random() * 30); // Random early/late out
                
                const scheduleIn = `${scheduleInHour.toString().padStart(2, '0')}:00`;
                const scheduleOut = `${scheduleOutHour.toString().padStart(2, '0')}:00`;
                const clockedIn = `${scheduleInHour.toString().padStart(2, '0')}:${clockedInMinute.toString().padStart(2, '0')}`;
                const clockedOut = `${scheduleOutHour.toString().padStart(2, '0')}:${clockedOutMinute.toString().padStart(2, '0')}`;
                
                gridData.push({
                    id: i - 1,
                    employeeId: empId,
                    scheduleIn: scheduleIn,
                    scheduleOut: scheduleOut,
                    clockedIn: clockedIn,
                    clockedOut: clockedOut,
                    variance: minutesLate,
                    excused: i % 3 === 0 ? 'Yes' : i % 3 === 1 ? 'No' : '',
                    comment: i % 2 === 0 ? 'Traffic delay due to highway accident' : '',
                    kronosStatus: i % 3 === 0 ? 'success' : i % 3 === 1 ? 'pending' : 'failed',
                    amhAttachment: null,
                    amhReason: '',
                    amhNotes: ''
                });
            }
        }
        
        // ===== TABLE RENDERING =====
        function renderTable() {
            const tbody = document.getElementById('tableBody');
            const persona = personas[currentPersona];
            tbody.innerHTML = '';
            
            // Calculate pagination
            const startIndex = (currentPage - 1) * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            const pageData = filteredData.slice(startIndex, endIndex);
            
            // Render only the current page data
            pageData.forEach(row => {
                const tr = document.createElement('tr');
                if (selectedRows.has(row.id)) {
                    tr.classList.add('selected');
                }
                
                // Checkbox
                tr.innerHTML = `
                    <td style="text-align: center;">
                        <input type="checkbox" 
                               class="checkbox-input" 
                               ${persona.canEdit ? '' : 'disabled'}
                               ${selectedRows.has(row.id) ? 'checked' : ''}
                               onchange="toggleRowSelection(${row.id})">
                    </td>
                    <td><span class="employee-id">${row.employeeId}</span></td>
                    <td><span class="time-value">${row.scheduleIn}</span></td>
                    <td><span class="time-value">${row.scheduleOut}</span></td>
                    <td><span class="time-value">${row.clockedIn}</span></td>
                    <td><span class="time-value">${row.clockedOut}</span></td>
                    <td>
                        <select class="excused-select excused-${row.excused === 'Yes' ? 'yes' : row.excused === 'No' ? 'no' : 'empty'}"
                                ${persona.canEditExcused ? '' : 'disabled'}
                                onchange="updateField(${row.id}, 'excused', this.value)">
                            <option value="">— Select —</option>
                            <option value="Yes" ${row.excused === 'Yes' ? 'selected' : ''}>Yes</option>
                            <option value="No" ${row.excused === 'No' ? 'selected' : ''}>No</option>
                        </select>
                    </td>
                    <td>
                        <textarea class="comment-textarea"
                                  id="comment-${row.id}"
                                  maxlength="500"
                                  ${persona.canEditComment ? '' : 'disabled'}
                                  placeholder="${persona.canEditComment ? 'Enter comment (max 500 chars)...' : 'Read only'}"
                                  onkeyup="updateField(${row.id}, 'comment', this.value); updateCharCount(${row.id})">${row.comment}</textarea>
                        <div class="char-count" id="charCount-${row.id}">${row.comment ? row.comment.length : 0} / 500</div>
                        ${persona.showAMH ? renderAMHSection(row) : ''}
                    </td>
                    <td>
                        <span class="kronos-badge kronos-${row.kronosStatus}">
                            ${row.kronosStatus === 'success' ? '🟢 Success' : 
                              row.kronosStatus === 'pending' ? '🟡 Pending' : '🔴 Failed'}
                        </span>
                    </td>
                `;
                
                tbody.appendChild(tr);
            });
        }
        
        function renderAMHSection(row) {
            const hasReasonAndFile = row.amhReason && row.amhAttachment;
            
            return `
                <div class="amh-section">
                    <div class="amh-header">
                        <div class="amh-title">
                            <span>🔐</span>
                            <span>AMH Authorization</span>
                        </div>
                        <div class="amh-badge ${hasReasonAndFile ? 'complete' : ''}">
                            ${hasReasonAndFile ? '✓ Complete' : '⚠ Required'}
                        </div>
                    </div>
                    
                    <!-- Original Comment Display -->
                    <div class="amh-field">
                        <div class="amh-field-label">
                            <span class="amh-field-label-text">SM's Original Comment</span>
                            <span class="optional-tag">Reference</span>
                        </div>
                        <div class="amh-context">
                            <div class="amh-context-label">Site Manager wrote:</div>
                            <div class="amh-context-text">${row.comment || 'No comment provided'}</div>
                        </div>
                    </div>
                    
                    <!-- Authorization Reason -->
                    <div class="amh-field">
                        <div class="amh-field-label">
                            <span class="amh-field-label-text">Authorization Reason<span class="required-star">*</span></span>
                        </div>
                        <textarea class="amh-textarea"
                                  id="amhReason-${row.id}"
                                  placeholder="Why are you acting on behalf? (e.g., 'Covering for SM - On leave')"
                                  onkeyup="updateField(${row.id}, 'amhReason', this.value)">${row.amhReason}</textarea>
                        <div class="amh-hint">Provide clear justification - this is audited for compliance</div>
                    </div>
                    
                    <!-- File Upload -->
                    <div class="amh-field">
                        <div class="amh-field-label">
                            <span class="amh-field-label-text">Supporting Document<span class="required-star">*</span></span>
                        </div>
                        <div class="amh-upload-area ${row.amhAttachment ? 'has-file' : ''}" 
                             id="uploadArea-${row.id}"
                             onclick="document.getElementById('fileInput-${row.id}').click()">
                            <div class="amh-upload-icon">${row.amhAttachment ? '✓' : '📎'}</div>
                            <div class="amh-upload-text">${row.amhAttachment ? 'File Uploaded' : 'Click to Upload'}</div>
                            <div class="amh-upload-hint">${row.amhAttachment ? row.amhAttachment : 'PDF, DOC, DOCX, JPG, PNG (Max 10MB)'}</div>
                        </div>
                        <input type="file" 
                               id="fileInput-${row.id}" 
                               style="display: none;"
                               accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                               onchange="handleFileUpload(${row.id}, this)">
                        ${row.amhAttachment ? `
                        <div class="amh-file-display show">
                            <span class="amh-file-name">📄 ${row.amhAttachment}</span>
                            <button class="amh-remove-btn" onclick="removeFile(${row.id}); event.stopPropagation();">Remove</button>
                        </div>
                        ` : ''}
                        <div class="amh-hint">🔒 Files encrypted and retained 90+ days for compliance</div>
                    </div>
                    
                    <!-- Additional Notes -->
                    <div class="amh-field">
                        <div class="amh-field-label">
                            <span class="amh-field-label-text">Additional Notes</span>
                            <span class="optional-tag">Optional</span>
                        </div>
                        <textarea class="amh-textarea"
                                  style="min-height: 60px;"
                                  placeholder="Any additional context or information..."
                                  onkeyup="updateField(${row.id}, 'amhNotes', this.value)">${row.amhNotes}</textarea>
                    </div>
                </div>
            `;
        }
        
        // ===== FIELD UPDATES =====
        function updateField(rowId, field, value) {
            const row = gridData.find(r => r.id === rowId);
            if (row) {
                row[field] = value;
                
                // Clear validation error when user edits the field
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
                    
                    updateStats();
                }
                
                // Update AMH badge if needed
                if ((field === 'amhReason' || field === 'amhAttachment') && personas[currentPersona].showAMH) {
                    updateAMHBadge(rowId);
                }
            }
        }
        
        function updateCharCount(rowId) {
            const textarea = document.getElementById(`comment-${rowId}`);
            const counter = document.getElementById(`charCount-${rowId}`);
            if (textarea && counter) {
                const length = textarea.value.length;
                counter.textContent = `${length} / 500`;
                
                // Update color based on length
                counter.className = 'char-count';
                if (length > 450) counter.classList.add('error');
                else if (length > 400) counter.classList.add('warning');
            }
        }
        
        function updateAMHBadge(rowId) {
            const row = gridData.find(r => r.id === rowId);
            if (row) {
                const badge = document.querySelector(`#tableBody tr:nth-child(${rowId + 1}) .amh-badge`);
                if (badge) {
                    const isComplete = row.amhReason && row.amhAttachment;
                    badge.className = `amh-badge ${isComplete ? 'complete' : ''}`;
                    badge.textContent = isComplete ? '✓ Complete' : '⚠ Required';
                }
            }
        }
        
        // ===== FILE UPLOAD =====
        function handleFileUpload(rowId, input) {
            const file = input.files[0];
            if (!file) return;
            
            // Validate size
            if (file.size > 10 * 1024 * 1024) {
                showToast('File too large. Maximum size is 10MB', 'error');
                input.value = '';
                return;
            }
            
            const row = gridData.find(r => r.id === rowId);
            if (row) {
                row.amhAttachment = file.name;
                
                // Clear validation error on upload area
                const uploadArea = document.getElementById(`uploadArea-${rowId}`);
                if (uploadArea) uploadArea.classList.remove('validation-error');
                
                renderTable();
                showToast('File uploaded successfully', 'success');
            }
        }
        
        function removeFile(rowId) {
            const row = gridData.find(r => r.id === rowId);
            if (row) {
                row.amhAttachment = null;
                const fileInput = document.getElementById(`fileInput-${rowId}`);
                if (fileInput) fileInput.value = '';
                renderTable();
                showToast('File removed', 'info');
            }
        }
        
        // ===== SELECTION MANAGEMENT =====
        function toggleRowSelection(rowId) {
            if (selectedRows.has(rowId)) {
                selectedRows.delete(rowId);
            } else {
                selectedRows.add(rowId);
            }
            renderTable();
            updateActionButtons();
        }
        
        function toggleSelectAll() {
            const persona = personas[currentPersona];
            if (!persona.canEdit) return;
            
            const checkbox = document.getElementById('selectAllCheckbox');
            if (checkbox.checked) {
                gridData.forEach(row => selectedRows.add(row.id));
            } else {
                selectedRows.clear();
            }
            renderTable();
            updateActionButtons();
        }
        
        function selectAll() {
            const persona = personas[currentPersona];
            if (!persona.canEdit) return;
            
            gridData.forEach(row => selectedRows.add(row.id));
            document.getElementById('selectAllCheckbox').checked = true;
            renderTable();
            updateActionButtons();
        }
        
        function updateActionButtons() {
            const approveBtn = document.getElementById('approveBtn');
            const bulkExcusedBtn = document.getElementById('bulkExcusedBtn');
            const bulkCommentBtn = document.getElementById('bulkCommentBtn');
            
            const hasSelection = selectedRows.size > 0;
            const canEdit = personas[currentPersona].canEdit;
            
            approveBtn.disabled = !hasSelection || !canEdit;
            bulkExcusedBtn.disabled = !hasSelection || !canEdit;
            bulkCommentBtn.disabled = !hasSelection || !canEdit;
        }
        
        // ===== VALIDATION =====
        function validateSelection() {
            const errors = [];
            const persona = personas[currentPersona];
            
            // Clear all previous error highlights
            clearValidationErrors();
            
            selectedRows.forEach(rowId => {
                const row = gridData.find(r => r.id === rowId);
                if (row) {
                    // Excused is mandatory for Late In
                    if (!row.excused) {
                        errors.push(`${row.employeeId}: Excused field is required (must select Yes or No)`);
                        highlightError(rowId, 'excused');
                    }
                    
                    // Comment is mandatory for Late In (when variance > 0)
                    if (row.variance > 0 && (!row.comment || !row.comment.trim())) {
                        errors.push(`${row.employeeId}: Comment is mandatory for Late In exceptions`);
                        highlightError(rowId, 'comment');
                    }
                    
                    // Comment character limit (500 chars)
                    if (row.comment && row.comment.length > 500) {
                        errors.push(`${row.employeeId}: Comment exceeds 500 character limit (${row.comment.length} chars)`);
                        highlightError(rowId, 'comment');
                    }
                    
                    // AMH specific validations
                    if (persona.showAMH) {
                        if (!row.amhReason || !row.amhReason.trim()) {
                            errors.push(`${row.employeeId}: AMH authorization reason is required`);
                            highlightError(rowId, 'amhReason');
                        }
                        if (!row.amhAttachment) {
                            errors.push(`${row.employeeId}: AMH supporting document must be uploaded`);
                            highlightError(rowId, 'amhAttachment');
                        }
                    }
                }
            });
            
            if (errors.length > 0) {
                const banner = document.getElementById('validationBanner');
                const list = document.getElementById('validationList');
                list.innerHTML = errors.map(e => `<li>${e}</li>`).join('');
                banner.classList.add('show');
                banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return false;
            } else {
                document.getElementById('validationBanner').classList.remove('show');
                return true;
            }
        }
        
        function highlightError(rowId, fieldType) {
            // Find the row index in the current page
            const startIndex = (currentPage - 1) * rowsPerPage;
            const pageData = filteredData.slice(startIndex, startIndex + rowsPerPage);
            const rowIndex = pageData.findIndex(r => r.id === rowId);
            
            if (rowIndex === -1) return; // Row not on current page
            
            const rowElement = document.querySelector(`#tableBody tr:nth-child(${rowIndex + 1})`);
            if (!rowElement) return;
            
            if (fieldType === 'excused') {
                const select = rowElement.querySelector('.excused-select');
                if (select) select.classList.add('validation-error');
            } else if (fieldType === 'comment') {
                const textarea = rowElement.querySelector('.comment-textarea');
                if (textarea) textarea.classList.add('validation-error');
            } else if (fieldType === 'amhReason') {
                const textarea = rowElement.querySelector(`#amhReason-${rowId}`);
                if (textarea) textarea.classList.add('validation-error');
            } else if (fieldType === 'amhAttachment') {
                const uploadArea = rowElement.querySelector(`#uploadArea-${rowId}`);
                if (uploadArea) uploadArea.classList.add('validation-error');
            }
        }
        
        function clearValidationErrors() {
            // Remove all validation error classes
            document.querySelectorAll('.validation-error').forEach(el => {
                el.classList.remove('validation-error');
            });
        }
        
        // ===== APPROVE ACTION =====
        function approveSelected() {
            if (!validateSelection()) {
                showToast('Please fix validation errors', 'error');
                return;
            }
            
            const count = selectedRows.size;
            if (!confirm(`Approve ${count} selected record(s)?`)) {
                return;
            }
            
            showLoading();
            
            setTimeout(() => {
                // Process approvals
                selectedRows.forEach(rowId => {
                    const row = gridData.find(r => r.id === rowId);
                    if (row) {
                        // Simulate Kronos write
                        row.kronosStatus = Math.random() > 0.3 ? 'success' : 'failed';
                    }
                });
                
                selectedRows.clear();
                document.getElementById('selectAllCheckbox').checked = false;
                renderTable();
                updateActionButtons();
                updateStats();
                hideLoading();
                
                showToast(`${count} record(s) approved and sent to Kronos`, 'success');
            }, 2000);
        }
        
        // ===== STATS =====
        function updateStats() {
            const pending = gridData.filter(r => !r.excused).length;
            const excused = gridData.filter(r => r.excused === 'Yes').length;
            const unexcused = gridData.filter(r => r.excused === 'No').length;
            
            document.getElementById('statPending').textContent = pending;
            document.getElementById('statExcused').textContent = excused;
            document.getElementById('statUnexcused').textContent = unexcused;
        }
        
        // ===== FILTERS =====
        function applyFilters() {
            showLoading();
            setTimeout(() => {
                // Apply filters (in real app, this would filter the data)
                filteredData = [...gridData]; // For now, just copy all data
                currentPage = 1; // Reset to first page when filters change
                renderTable();
                updatePagination();
                hideLoading();
                showToast('Filters applied successfully', 'success');
            }, 1000);
        }
        
        function resetFilters() {
            document.getElementById('stationSelect').selectedIndex = 0;
            document.getElementById('customerSelect').selectedIndex = 0;
            document.getElementById('losSelect').selectedIndex = 0;
            document.getElementById('jobSelect').selectedIndex = 0;
            selectDateOption('yesterday');
            filteredData = [...gridData];
            currentPage = 1;
            renderTable();
            updatePagination();
            showToast('Filters reset to default', 'info');
        }
        
        // ===== PAGINATION =====
        function updatePagination() {
            const totalRecords = filteredData.length;
            totalPagesCount = Math.ceil(totalRecords / rowsPerPage);
            
            // Update info display
            document.getElementById('totalRecords').textContent = totalRecords;
            document.getElementById('currentPageDisplay').textContent = currentPage;
            document.getElementById('totalPages').textContent = totalPagesCount;
            
            // Update button states
            document.getElementById('firstPageBtn').disabled = currentPage === 1;
            document.getElementById('prevPageBtn').disabled = currentPage === 1;
            document.getElementById('nextPageBtn').disabled = currentPage === totalPagesCount;
            document.getElementById('lastPageBtn').disabled = currentPage === totalPagesCount;
            
            // Render page numbers
            renderPageNumbers();
        }
        
        function renderPageNumbers() {
            const pageNumbersDiv = document.getElementById('pageNumbers');
            pageNumbersDiv.innerHTML = '';
            
            // Show max 7 page numbers with ellipsis
            const maxVisible = 7;
            let startPage = Math.max(1, currentPage - 3);
            let endPage = Math.min(totalPagesCount, startPage + maxVisible - 1);
            
            // Adjust start if we're near the end
            if (endPage - startPage < maxVisible - 1) {
                startPage = Math.max(1, endPage - maxVisible + 1);
            }
            
            // First page + ellipsis
            if (startPage > 1) {
                addPageNumber(1);
                if (startPage > 2) {
                    const ellipsis = document.createElement('span');
                    ellipsis.className = 'page-ellipsis';
                    ellipsis.textContent = '...';
                    pageNumbersDiv.appendChild(ellipsis);
                }
            }
            
            // Page numbers
            for (let i = startPage; i <= endPage; i++) {
                addPageNumber(i);
            }
            
            // Ellipsis + last page
            if (endPage < totalPagesCount) {
                if (endPage < totalPagesCount - 1) {
                    const ellipsis = document.createElement('span');
                    ellipsis.className = 'page-ellipsis';
                    ellipsis.textContent = '...';
                    pageNumbersDiv.appendChild(ellipsis);
                }
                addPageNumber(totalPagesCount);
            }
        }
        
        function addPageNumber(pageNum) {
            const pageNumbersDiv = document.getElementById('pageNumbers');
            const pageBtn = document.createElement('button');
            pageBtn.className = 'page-number' + (pageNum === currentPage ? ' active' : '');
            pageBtn.textContent = pageNum;
            pageBtn.onclick = () => goToPage(pageNum);
            pageNumbersDiv.appendChild(pageBtn);
        }
        
        function goToPage(page) {
            if (page < 1 || page > totalPagesCount || page === currentPage) return;
            
            currentPage = page;
            renderTable();
            updatePagination();
            
            // Scroll to top of table
            document.querySelector('.table-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        function changeRowsPerPage() {
            const select = document.getElementById('rowsPerPageSelect');
            rowsPerPage = parseInt(select.value);
            currentPage = 1; // Reset to first page
            renderTable();
            updatePagination();
            showToast(`Showing ${rowsPerPage} rows per page`, 'info');
        }
        
        // ===== SORTING =====
        function sortTable(column) {
            // Toggle direction if same column, otherwise reset to ascending
            if (currentSortColumn === column) {
                currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortColumn = column;
                currentSortDirection = 'asc';
            }
            
            // Sort the filtered data
            filteredData.sort((a, b) => {
                let aVal = a[column];
                let bVal = b[column];
                
                // Handle empty values
                if (!aVal && !bVal) return 0;
                if (!aVal) return 1;
                if (!bVal) return -1;
                
                // Compare values
                if (aVal < bVal) return currentSortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return currentSortDirection === 'asc' ? 1 : -1;
                return 0;
            });
            
            // Update sort indicators
            document.querySelectorAll('[id^="sort-"]').forEach(el => {
                el.textContent = '⇅';
            });
            const indicator = document.getElementById(`sort-${column}`);
            if (indicator) {
                indicator.textContent = currentSortDirection === 'asc' ? '↑' : '↓';
            }
            
            // Re-render table
            renderTable();
            updatePagination();
            showToast(`Sorted by ${column} (${currentSortDirection})`, 'info');
        }
        
        // ===== REFRESH =====
        function refreshGrid() {
            showLoading();
            setTimeout(() => {
                // In real app, this would fetch fresh data from server
                applyFilters(); // Reapply current filters
                hideLoading();
                showToast('Grid refreshed successfully', 'success');
            }, 1000);
        }
        
        // ===== BULK ACTIONS =====
        function showBulkExcusedModal() {
            const count = selectedRows.size;
            document.getElementById('bulkExcusedCount').textContent = count;
            document.getElementById('bulkExcusedValue').value = '';
            document.getElementById('bulkExcusedModal').classList.add('show');
        }
        
        function closeBulkExcusedModal() {
            document.getElementById('bulkExcusedModal').classList.remove('show');
        }
        
        function applyBulkExcused() {
            const value = document.getElementById('bulkExcusedValue').value;
            
            if (!value) {
                showToast('Please select an Excused status', 'error');
                return;
            }
            
            let successCount = 0;
            let failureCount = 0;
            
            selectedRows.forEach(rowId => {
                const row = gridData.find(r => r.id === rowId);
                if (row) {
                    row.excused = value;
                    successCount++;
                } else {
                    failureCount++;
                }
            });
            
            closeBulkExcusedModal();
            renderTable();
            updateStats();
            
            if (failureCount === 0) {
                showToast(`Excused status updated for ${successCount} record(s)`, 'success');
            } else {
                showToast(`Updated ${successCount} record(s), ${failureCount} failed`, 'error');
            }
        }
        
        function showBulkCommentModal() {
            const count = selectedRows.size;
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
        }
        
        function closeBulkCommentModal() {
            document.getElementById('bulkCommentModal').classList.remove('show');
        }
        
        function applyBulkComment() {
            const value = document.getElementById('bulkCommentValue').value;
            
            if (!value || !value.trim()) {
                showToast('Please enter a comment', 'error');
                return;
            }
            
            if (value.length > 500) {
                showToast('Comment exceeds 500 character limit', 'error');
                return;
            }
            
            let successCount = 0;
            let failureCount = 0;
            
            selectedRows.forEach(rowId => {
                const row = gridData.find(r => r.id === rowId);
                if (row) {
                    row.comment = value;
                    successCount++;
                } else {
                    failureCount++;
                }
            });
            
            closeBulkCommentModal();
            renderTable();
            
            if (failureCount === 0) {
                showToast(`Comment applied to ${successCount} record(s)`, 'success');
            } else {
                showToast(`Applied to ${successCount} record(s), ${failureCount} failed`, 'error');
            }
        }
        
        // ===== UI UTILITIES =====
        function showLoading() {
            document.getElementById('loadingOverlay').classList.add('show');
        }
        
        function hideLoading() {
            document.getElementById('loadingOverlay').classList.remove('show');
        }
        
        function showToast(message, type = 'info') {
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
            }, 3000);
        }
    </script>
