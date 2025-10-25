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
            <td>
                <span class="kronos-badge kronos-${row.kronosStatus}">
                    ${row.kronosStatus === 'success' ? '🟢 Success' : 
                      row.kronosStatus === 'pending' ? '🟡 Pending' : '🔴 Failed'}
                </span>
            </td>
        `;
    },
    
    renderAMHSection(row) {
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
                
                <div class="amh-field">
                    <div class="amh-field-label">
                        <span class="amh-field-label-text">Authorization Reason<span class="required-star">*</span></span>
                    </div>
                    <textarea class="amh-textarea"
                              id="amhReason-${row.id}"
                              placeholder="Why are you acting on behalf? (e.g., 'Covering for SM - On leave')"
                              onkeyup="FieldUpdater.updateField(${row.id}, 'amhReason', this.value)">${row.amhReason}</textarea>
                    <div class="amh-hint">Provide clear justification - this is audited for compliance</div>
                </div>
                
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
                           accept="${AppConfig.ACCEPTED_FILE_TYPES}"
                           onchange="FieldUpdater.handleFileUpload(${row.id}, this)">
                    ${row.amhAttachment ? `
                    <div class="amh-file-display show">
                        <span class="amh-file-name">📄 ${row.amhAttachment}</span>
                        <button class="amh-remove-btn" onclick="FieldUpdater.removeFile(${row.id}); event.stopPropagation();">Remove</button>
                    </div>
                    ` : ''}
                    <div class="amh-hint">🔒 Files encrypted and retained 90+ days for compliance</div>
                </div>
                
                <div class="amh-field">
                    <div class="amh-field-label">
                        <span class="amh-field-label-text">Additional Notes</span>
                        <span class="optional-tag">Optional</span>
                    </div>
                    <textarea class="amh-textarea"
                              style="min-height: 60px;"
                              placeholder="Any additional context or information..."
                              onkeyup="FieldUpdater.updateField(${row.id}, 'amhNotes', this.value)">${row.amhNotes}</textarea>
                </div>
            </div>
        `;
    }
};
