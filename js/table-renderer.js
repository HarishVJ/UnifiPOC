/**
 * Table Renderer
 * Renders the data table with current page data
 */

const TableRenderer = {
    render() {
        const tbody = document.getElementById('tableBody');
        const persona = AppState.getCurrentPersona();
        tbody.innerHTML = '';
        
        // Calculate pagination
        const startIndex = (AppState.currentPage - 1) * AppState.rowsPerPage;
        const endIndex = startIndex + AppState.rowsPerPage;
        const pageData = AppState.filteredData.slice(startIndex, endIndex);
        
        // Render rows
        pageData.forEach(row => {
            const tr = document.createElement('tr');
            if (AppState.selectedRows.has(row.id)) {
                tr.classList.add('selected');
            }
            
            tr.innerHTML = this.renderRow(row, persona);
            tbody.appendChild(tr);
        });
        
        // Update select all checkbox state
        this.updateSelectAllCheckbox(pageData);
    },
    
    updateSelectAllCheckbox(pageData) {
        const checkbox = document.getElementById('selectAllCheckbox');
        if (!checkbox) return;
        
        // Check if all current page rows are selected
        const allSelected = pageData.length > 0 && pageData.every(row => AppState.selectedRows.has(row.id));
        checkbox.checked = allSelected;
    },
    
    getVarianceClass(variance) {
        if (variance <= 0) {
            return 'ontime';
        } else if (variance < 15) {
            return 'warning';
        } else {
            return 'late';
        }
    },
    
    renderRow(row, persona) {
        return `
            <td style="text-align: center;">
                <input type="checkbox" 
                       class="checkbox-input" 
                       ${persona.canEdit ? '' : 'disabled'}
                       ${AppState.selectedRows.has(row.id) ? 'checked' : ''}
                       onchange="SelectionManager.toggleRow(${row.id})">
            </td>
            <td><span class="employee-id">${row.employeeId}</span></td>
            <td><span class="time-value">${row.scheduleIn}</span></td>
            <td><span class="time-value">${row.scheduleOut}</span></td>
            <td><span class="time-value">${row.clockedIn}</span></td>
            <td><span class="time-value">${row.clockedOut}</span></td>
            <td style="text-align: center;">
                <span class="variance-badge ${this.getVarianceClass(row.variance)}">${row.variance}</span>
            </td>
            <td>
                <select class="excused-select excused-${row.excused === 'Yes' ? 'yes' : row.excused === 'No' ? 'no' : 'empty'}"
                        ${persona.canEditExcused ? '' : 'disabled'}
                        onchange="FieldUpdater.updateField(${row.id}, 'excused', this.value)">
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
                          onkeyup="FieldUpdater.updateField(${row.id}, 'comment', this.value); FieldUpdater.updateCharCount(${row.id})">${row.comment}</textarea>
                <div class="char-count" id="charCount-${row.id}">${row.comment ? row.comment.length : 0} / 500</div>
                ${persona.showAMH ? this.renderAMHSection(row) : ''}
            </td>
        `;
    },
    
    renderAMHSection(row) {
        const hasReasonAndFile = row.amhReason && row.amhAttachment;
        
        return `
            <div class="amh-section-inline">
                <div class="amh-inline-header">
                    <span class="amh-inline-icon">🔐</span>
                    <span class="amh-inline-title">AMH Authorization</span>
                    <span class="amh-inline-badge ${hasReasonAndFile ? 'complete' : 'pending'}">${hasReasonAndFile ? '✓' : '!'}</span>
                    <span class="amh-inline-divider">|</span>
                    <span class="amh-inline-sm">💬 Station Mgr: <em>${row.comment || 'No comment'}</em></span>
                </div>
                
                <div class="amh-inline-fields">
                    <div class="amh-inline-field">
                        <div class="amh-inline-label">
                            <span>📝</span>
                            <span>Reason*</span>
                        </div>
                        <textarea class="amh-inline-textarea"
                                  id="amhReason-${row.id}"
                                  placeholder="Why acting on behalf..."
                                  onkeyup="FieldUpdater.updateField(${row.id}, 'amhReason', this.value)">${row.amhReason}</textarea>
                    </div>
                    
                    <div class="amh-inline-field amh-inline-upload">
                        <div class="amh-inline-label">
                            <span>📎</span>
                            <span>Document*</span>
                        </div>
                        <div class="amh-inline-upload-btn ${row.amhAttachment ? 'uploaded' : ''}" 
                             onclick="document.getElementById('fileInput-${row.id}').click()">
                            ${row.amhAttachment ? 
                                `<span class="amh-inline-file-name">✓ ${row.amhAttachment}</span>
                                 <button class="amh-inline-remove" onclick="FieldUpdater.removeFile(${row.id}); event.stopPropagation();">✕</button>` :
                                `<span class="amh-inline-upload-text">📤 Upload</span>`
                            }
                        </div>
                        <input type="file" 
                               id="fileInput-${row.id}" 
                               style="display: none;"
                               accept="${AppConfig.ACCEPTED_FILE_TYPES}"
                               onchange="FieldUpdater.handleFileUpload(${row.id}, this)">
                    </div>
                    
                    <div class="amh-inline-field">
                        <div class="amh-inline-label">
                            <span>📋</span>
                            <span>Notes</span>
                        </div>
                        <textarea class="amh-inline-textarea"
                                  placeholder="Additional context..."
                                  onkeyup="FieldUpdater.updateField(${row.id}, 'amhNotes', this.value)">${row.amhNotes}</textarea>
                    </div>
                </div>
            </div>
        `;
    }
};
