// Chatbot Configuration - Late In Handlin
const CONFIG = {
    "use_case": "Late In Handling",
    "personas": {
        "StationManager": {
            "flow": [
                {
                    "id": "entry_prompt",
                    "type": "summary_with_buttons",
                    "text": "Hi {{user_name}}, I found {{total_late_in_count}} Late In record(s) that need your review.",
                    "summary": {
                        "title": "📊 Summary",
                        "fields": [
                            "Total Records: {{total_late_in_count}}",
                            "Stations: {{station_count}}",
                            "Date Range: {{date_range}}"
                        ]
                    },
                    "buttons": [
                        { "text": "✅ Yes, review now", "next": "record_list" },
                        { "text": "🕐 Remind me later", "next": "end_session" }
                    ]
                },
                {
                    "id": "record_list",
                    "type": "list_cards",
                    "text": "Here are the Late In records for your stations:",
                    "items": "{{records}}",
                    "card_template": {
                        "buttons": [
                            { "text": "✅", "next": "action_capture_single", "data": { "excuse": "Yes" } },
                            { "text": "❌", "next": "action_capture_single", "data": { "excuse": "No" } }
                        ]
                    },
                    "bulk_option": {
                        "text": "Would you like to apply same action to all?"
                    }
                },
                {
                    "id": "action_capture_single",
                    "type": "form",
                    "text": "Please provide your action for {{emp_name}} ({{date}}).",
                    "fields": [
                        { "type": "dropdown", "label": "Excuse", "name": "excuse", "options": ["Yes", "No"], "required": true },
                        { "type": "text", "label": "Comment", "name": "comment", "placeholder": "Enter reason for excuse or denial", "required": true }
                    ],
                    "buttons": [
                        { "text": "✅ Submit", "next": "confirmation" },
                        { "text": "⏩ Skip", "next": "record_list" }
                    ]
                },
                {
                    "id": "bulk_action",
                    "type": "form",
                    "text": "You selected {{bulk_count}} records. Enter one Excuse and Comment to apply to all.",
                    "fields": [
                        { "type": "dropdown", "label": "Excuse", "name": "excuse", "options": ["Yes", "No"], "required": true },
                        { "type": "text", "label": "Comment", "name": "comment", "placeholder": "Enter reason applicable to all records", "required": true }
                    ],
                    "buttons": [
                        { "text": "✅ Confirm", "next": "confirmation" },
                        { "text": "✏️ Edit", "next": "record_list" }
                    ]
                },
                {
                    "id": "confirmation",
                    "type": "summary_card",
                    "text": "✅ Confirm Submission\n\nReview before finalizing:",
                    "fields": [
                        "Excuse Decision: {{excuse_decision}}",
                        "Comment: {{comment}}",
                        "Records Affected: {{record_count}}"
                    ],
                    "buttons": [
                        { "text": "✅ Confirm & Submit", "next": "submit_action" },
                        { "text": "✏️ Edit", "next": "record_list" },
                        { "text": "❌ Cancel", "next": "end_session" }
                    ]
                },
                {
                    "id": "submit_action",
                    "type": "message",
                    "text": "🎉 Success!\n\n✅ Excused: {{approved_count}}\n❌ Not Excused: {{rejected_count}}\n📅 Submitted: {{submitted_on}}\n\nID: #{{record_count}}-{{approved_count}}",
                    "buttons": [
                        { "text": "📄 View Summary", "next": "summary_view" },
                        { "text": "🔁 Review Another Exception", "next": "entry_prompt" }
                    ]
                },
                {
                    "id": "summary_view",
                    "type": "message",
                    "text": "📊 Summary View\n\nTotal Records: {{total_late_in_count}}\nPending Review: {{total_late_in_count}}\n\nThis feature will show detailed analytics.",
                    "buttons": [{ "text": "🔙 Back to Start", "next": "entry_prompt" }]
                },
                {
                    "id": "view_details",
                    "type": "message",
                    "text": "📋 Detailed Information\n\nEmployee: {{emp_name}}\nDate: {{date}}\nScheduled In: {{sched_in}}\nActual In: {{actual_in}}\nLate By: {{time_diff}}\nStation: {{station_name}}\n\nAdditional details would be shown here.",
                    "buttons": [{ "text": "🔙 Back to Records", "next": "record_list" }]
                },
                {
                    "id": "end_session",
                    "type": "message",
                    "text": "👋 No problem! I'll remind you later about the pending Late In records. Have a great day!",
                    "buttons": [{ "text": "🔄 Start Over", "next": "entry_prompt" }]
                }
            ]
        },
        "AMHUser": {
            "flow": [
                {
                    "id": "entry_prompt",
                    "type": "message_with_buttons",
                    "text": "👋 Hi {{user_name}}, you have {{total_late_in_count}} Late In record(s) to review on behalf of Station Managers.",
                    "buttons": [
                        { "text": "✅ Start Review", "next": "record_list" },
                        { "text": "🕐 Remind me later", "next": "end_session" }
                    ]
                },
                {
                    "id": "record_list",
                    "type": "list_cards",
                    "text": "Here are the Late In records assigned to you:",
                    "items": "{{records}}",
                    "card_template": {
                        "fields": [
                            "Employee: {{emp_name}}",
                            "Date: {{date}}",
                            "Scheduled In: {{sched_in}}",
                            "Actual In: {{actual_in}}",
                            "Late By: {{time_diff}}",
                            "Station: {{station_name}}"
                        ],
                        "buttons": [
                            { "text": "✅ Excuse", "next": "action_capture_single", "data": { "excuse": "Yes" } },
                            { "text": "❌ Not Excused", "next": "action_capture_single", "data": { "excuse": "No" } }
                        ]
                    },
                    "bulk_option": {
                        "text": "Would you like to apply same action/comment/evidence to all?",
                        "buttons": [
                            { "text": "🔄 Apply same to all", "next": "bulk_action" },
                            { "text": "🧾 Review one by one", "next": "action_capture_single" }
                        ]
                    }
                },
                {
                    "id": "action_capture_single",
                    "type": "form",
                    "text": "Provide your decision and attach evidence for {{emp_name}} ({{date}}):",
                    "fields": [
                        { "type": "dropdown", "label": "Excuse", "name": "excuse", "options": ["Yes", "No"], "required": true },
                        { "type": "text", "label": "Comment", "name": "comment", "placeholder": "Explain reason for this action", "required": true },
                        { "type": "file", "label": "Evidence (file or link)", "name": "evidence", "required": true }
                    ],
                    "buttons": [
                        { "text": "✅ Submit", "next": "confirmation" },
                        { "text": "⏩ Skip", "next": "record_list" }
                    ]
                },
                {
                    "id": "bulk_action",
                    "type": "form",
                    "text": "Applying same action to {{bulk_count}} records. Please provide details:",
                    "fields": [
                        { "type": "dropdown", "label": "Excuse", "name": "excuse", "options": ["Yes", "No"], "required": true },
                        { "type": "text", "label": "Comment", "name": "comment", "placeholder": "Enter single comment for all records", "required": true },
                        { "type": "file", "label": "Upload single evidence for all", "name": "evidence", "required": true }
                    ],
                    "buttons": [
                        { "text": "✅ Confirm", "next": "confirmation" },
                        { "text": "✏️ Edit", "next": "record_list" }
                    ]
                },
                {
                    "id": "confirmation",
                    "type": "summary_card",
                    "text": "Please confirm your submission details:",
                    "fields": [
                        "Excuse Decision: {{excuse_decision}}",
                        "Comment: {{comment}}",
                        "Evidence: {{evidence_status}}",
                        "Records Affected: {{record_count}}"
                    ],
                    "buttons": [
                        { "text": "✅ Confirm & Submit", "next": "submit_action" },
                        { "text": "✏️ Edit", "next": "record_list" },
                        { "text": "❌ Cancel", "next": "end_session" }
                    ]
                },
                {
                    "id": "submit_action",
                    "type": "message",
                    "text": "✅ Actions submitted successfully for {{record_count}} record(s). Evidence attached.\n\n- Excused: {{approved_count}}\n- Not Excused: {{rejected_count}}\n- Submitted On: {{submitted_on}}",
                    "buttons": [
                        { "text": "📄 View Submission Summary", "next": "summary_view" },
                        { "text": "🔁 Handle Another Exception", "next": "entry_prompt" }
                    ]
                },
                {
                    "id": "summary_view",
                    "type": "message",
                    "text": "📊 Submission Summary\n\nTotal Records Processed: {{record_count}}\nExcused: {{approved_count}}\nNot Excused: {{rejected_count}}\nEvidence Attached: Yes\n\nAll submissions have been recorded.",
                    "buttons": [{ "text": "🔙 Back to Start", "next": "entry_prompt" }]
                },
                {
                    "id": "end_session",
                    "type": "message",
                    "text": "👋 No problem! I'll remind you later about the pending Late In records. Have a great day!",
                    "buttons": [{ "text": "🔄 Start Over", "next": "entry_prompt" }]
                }
            ]
        }
    }
};

// Sample Data
const SAMPLE_DATA = {
    user_name: "John Doe",
    total_late_in_count: 15,
    station_count: 3,
    date_range: "Nov 1-4, 2024",
    default_date_range: "Nov 1-4, 2024",
    stations: [
        { name: "Las Vegas", count: 5 },
        { name: "Houston", count: 6 },
        { name: "Atlanta", count: 4 }
    ],
    lines_of_service: [
        { name: "Wheelchair", count: 8 },
        { name: "Ambulatory", count: 4 },
        { name: "Stretcher", count: 3 }
    ],
    records: [
        {
            emp_name: "Alice Johnson",
            emp_id: "EMP001",
            date: "2024-11-04",
            sched_in: "08:00 AM",
            actual_in: "08:45 AM",
            time_diff: "45",
            station_name: "Las Vegas",
            line_of_service: "Wheelchair",
            points: "1.0"
        },
        {
            emp_name: "Bob Smith",
            emp_id: "EMP002",
            date: "2024-11-04",
            sched_in: "09:00 AM",
            actual_in: "09:30 AM",
            time_diff: "30",
            station_name: "Houston",
            line_of_service: "Ambulatory",
            points: "1.0"
        },
        {
            emp_name: "Carol Williams",
            emp_id: "EMP003",
            date: "2024-11-03",
            sched_in: "07:30 AM",
            actual_in: "08:15 AM",
            time_diff: "45",
            station_name: "Las Vegas",
            line_of_service: "Wheelchair",
            points: "1.0"
        },
        {
            emp_name: "David Lee",
            emp_id: "EMP004",
            date: "2024-11-04",
            sched_in: "07:00 AM",
            actual_in: "07:20 AM",
            time_diff: "20",
            station_name: "Atlanta",
            line_of_service: "Stretcher",
            points: "1.0"
        }
    ]
};

// Chatbot State
let currentPersona = 'StationManager';
let currentStep = 'entry_prompt';
let sessionData = { ...SAMPLE_DATA };
let currentRecordIndex = 0;
let selectedRecords = [];
let formData = {};
let isBulkMode = false;
let filterState = {
    selectedStations: [],
    selectedLOS: [],
    selectedEmployees: [],
    allStations: false,
    allLOS: false,
    allEmployees: false
};

// Initialize chatbot
function initChatbot() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '';
    sessionData = { ...SAMPLE_DATA };
    currentRecordIndex = 0;
    selectedRecords = [];
    formData = {};
    isBulkMode = false;
    currentStep = 'entry_prompt';
    renderStep(currentStep);
}

// Reset chat when persona changes
function resetChat() {
    currentPersona = document.getElementById('persona').value;
    initChatbot();
}

// Get current flow
function getCurrentFlow() {
    return CONFIG.personas[currentPersona].flow;
}

// Find step by ID
function findStep(stepId) {
    return getCurrentFlow().find(step => step.id === stepId);
}

// Replace template variables
function replaceVariables(text, data = {}) {
    let result = text;
    const allData = { ...sessionData, ...data };
    
    for (const [key, value] of Object.entries(allData)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, value);
    }
    
    return result;
}

// Render step
function renderStep(stepId, additionalData = {}) {
    const step = findStep(stepId);
    if (!step) {
        console.error('Step not found:', stepId);
        return;
    }

    currentStep = stepId;
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';

    let content = '';
    switch (step.type) {
        case 'message_with_buttons':
        case 'message':
            content = renderMessage(step, additionalData);
            break;
        case 'list_cards':
            content = renderListCards(step, additionalData);
            break;
        case 'form':
            content = renderForm(step, additionalData);
            break;
        case 'summary_card':
            content = renderSummaryCard(step, additionalData);
            break;
        case 'summary_with_buttons':
            content = renderSummaryWithButtons(step, additionalData);
            break;
    }
    
    messageDiv.innerHTML = content;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Render message
function renderMessage(step, data) {
    const text = replaceVariables(step.text, data);
    let html = `<div class="message-content">${text}</div>`;
    
    if (step.buttons && step.buttons.length > 0) {
        html += '<div class="buttons">';
        step.buttons.forEach((button, idx) => {
            const btnClass = button.text.includes('✅') ? 'btn-success' : 
                           button.text.includes('❌') ? 'btn-danger' : 
                           button.text.includes('⏰') || button.text.includes('🕐') ? 'btn-secondary' : 'btn-primary';
            html += `<button class="btn ${btnClass}" onclick="handleButtonClick('${button.next}', ${idx})">${button.text}</button>`;
        });
        html += '</div>';
    }
    return html;
}

// Render summary with buttons
function renderSummaryWithButtons(step, data) {
    const text = replaceVariables(step.text, data);
    let html = `<div class="message-content">${text}</div>`;
    
    // Add summary card
    if (step.summary) {
        html += `<div style="margin-top: 12px; padding: 16px; background: white; border: 1px solid #e1dfdd; border-radius: 4px; box-shadow: 0 0.3px 0.9px rgba(0,0,0,0.1), 0 1.6px 3.6px rgba(0,0,0,0.13);">`;
        html += `<div style="font-size: 14px; font-weight: 600; color: #252423; margin-bottom: 12px;">${step.summary.title}</div>`;
        html += `<div style="display: grid; gap: 8px;">`;
        step.summary.fields.forEach(field => {
            const fieldText = replaceVariables(field, data);
            const parts = fieldText.split(':');
            if (parts.length === 2) {
                html += `<div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #edebe9;">`;
                html += `<span style="font-size: 13px; color: #605e5c; font-weight: 600;">${parts[0].trim()}</span>`;
                html += `<span style="font-size: 13px; color: #252423; font-weight: 600;">${parts[1].trim()}</span>`;
                html += `</div>`;
            } else {
                html += `<div style="font-size: 13px; color: #252423; padding: 4px 0;">${fieldText}</div>`;
            }
        });
        html += `</div>`;
        html += `</div>`;
    }
    
    if (step.buttons && step.buttons.length > 0) {
        html += '<div class="buttons" style="margin-top: 12px;">';
        step.buttons.forEach((button, idx) => {
            const btnClass = button.text.includes('✅') ? 'btn-success' : 
                           button.text.includes('❌') ? 'btn-danger' : 
                           button.text.includes('⏰') || button.text.includes('🕐') ? 'btn-secondary' : 'btn-primary';
            html += `<button class="btn ${btnClass}" onclick="handleButtonClick('${button.next}', ${idx})">${button.text}</button>`;
        });
        html += '</div>';
    }
    return html;
}

// Render filter step
function renderFilterStep(step, data) {
    const text = replaceVariables(step.text, data);
    let html = `<div class="message-content">${text}</div>`;
    
    html += '<div class="buttons">';
    step.buttons.forEach((button, idx) => {
        const btnClass = 'btn-primary';
        html += `<button class="btn ${btnClass}" onclick="handleFilterButton('${button.next}', ${JSON.stringify(button.data || {})})">${button.text}</button>`;
    });
    html += '</div>';
    
    return html;
}

// Render checkbox list
function renderCheckboxList(step, data) {
    const text = replaceVariables(step.text, data);
    let html = `<div class="message-content">${text}</div>`;
    
    html += '<div class="record-box" style="margin-top: 12px;">';
    html += '<div class="info-line" style="font-weight: 700; margin-bottom: 8px;">┌─────────────────────────────────┐</div>';
    
    const items = currentStep.includes('station') ? sessionData.stations : sessionData.lines_of_service;
    items.forEach((item, idx) => {
        html += `<div class="info-line" style="padding: 6px 0;">`;
        html += `<label style="cursor: pointer; display: flex; align-items: center; gap: 8px;">`;
        html += `<input type="checkbox" id="filter-${idx}" value="${item.name}" onchange="toggleFilter(this, '${item.name}')"> `;
        html += `${item.name} (${item.count})`;
        html += `</label></div>`;
    });
    
    html += '<div class="info-line" style="margin-top: 8px;">└─────────────────────────────────┘</div>';
    html += '</div>';
    
    html += '<div class="buttons" style="margin-top: 14px;">';
    step.buttons.forEach((button, idx) => {
        html += `<button class="btn btn-primary" onclick="handleButtonClick('${button.next}')">${button.text}</button>`;
    });
    html += '</div>';
    
    return html;
}

// Render list cards with professional design
function renderListCards(step, data) {
    const text = replaceVariables(step.text, data);
    let html = `<div class="message-content">${text}</div>`;
    
    sessionData.records.forEach((record, idx) => {
        html += `<div class="record-card" id="card-${idx}">`;
        
        // Compact header with inline info
        html += `<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">`;
        html += `<div style="flex: 1;">`;
        html += `<div class="record-employee-name">${record.emp_name} <span style="font-size: 12px; color: #605e5c; font-weight: 400;">(${record.emp_id})</span></div>`;
        html += `<div style="font-size: 12px; color: #605e5c; margin-top: 2px;">${record.date} • ${record.station_name} • ${record.line_of_service}</div>`;
        html += `</div>`;
        html += `<div style="text-align: right;">`;
        html += `<div style="font-size: 11px; color: #605e5c; font-weight: 600;">LATE BY</div>`;
        html += `<div style="font-size: 16px; color: #c4314b; font-weight: 700;">${record.time_diff}m</div>`;
        html += `</div>`;
        html += `</div>`;
        
        // Compact time details in one line
        html += `<div style="padding: 8px 12px; background: #faf9f8; border-radius: 2px; margin-bottom: 12px; font-size: 12px; color: #605e5c;">`;
        html += `<span style="font-weight: 600;">Scheduled:</span> ${record.sched_in} <span style="margin: 0 8px;">→</span> <span style="font-weight: 600;">Actual:</span> ${record.actual_in}`;
        html += `</div>`;
        
        // Comment field with excuse buttons at bottom
        html += `<div>`;
        html += `<label class="form-label" style="display: block; font-size: 11px; font-weight: 600; color: #605e5c; margin-bottom: 6px;">COMMENT</label>`;
        html += `<textarea id="comment-${idx}" class="form-control" placeholder="Add your comment here..." style="width: 100%; padding: 8px 12px; border: 1px solid #8a8886; border-radius: 2px; font-size: 13px; font-family: 'Segoe UI', sans-serif; resize: vertical; min-height: 70px; background: white;" onfocus="this.style.borderColor='#6264a7'; this.style.boxShadow='0 0 0 1px #6264a7'" onblur="this.style.borderColor='#8a8886'; this.style.boxShadow='none'"></textarea>`;
        html += `</div>`;
        
        // Excuse buttons at bottom right
        html += `<div style="display: flex; gap: 8px; margin-top: 12px; justify-content: flex-end; align-items: center;">`;
        html += `<span style="font-size: 11px; color: #605e5c; font-weight: 600;">EXCUSE?</span>`;
        step.card_template.buttons.forEach((button, btnIdx) => {
            const isExcuse = button.text.includes('✅');
            const icon = isExcuse ? '✓' : '✕';
            const bgColor = isExcuse ? '#92c353' : '#c4314b';
            const hoverColor = isExcuse ? '#7ba33c' : '#a52a3f';
            const title = isExcuse ? 'Yes - Excuse' : 'No - Deny';
            const excuseValue = button.data && button.data.excuse ? button.data.excuse : '';
            html += `<button style="width: 40px; height: 40px; border: none; border-radius: 2px; background: ${bgColor}; color: white; font-size: 18px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.1s; box-shadow: 0 0.3px 0.9px rgba(0,0,0,0.1), 0 1.6px 3.6px rgba(0,0,0,0.13);" title="${title}" onmouseover="this.style.background='${hoverColor}'" onmouseout="this.style.background='${bgColor}'" onclick="saveRecord(${idx}, '${excuseValue}')">${icon}</button>`;
        });
        html += `</div>`;
        
        html += '</div>';
    });
    
    if (step.bulk_option) {
        // Bulk action checkbox
        html += `<div style="margin-top: 16px; padding: 12px; background: #deecf9; border: 1px solid #6264a7; border-radius: 2px;">`;
        html += `<label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: #252423; font-weight: 600;">`;
        html += `<input type="checkbox" id="bulkCheckbox" onchange="toggleBulkMode(this.checked)" style="width: 18px; height: 18px; cursor: pointer;">`;
        html += `Apply same action to all records`;
        html += `</label>`;
        html += `</div>`;
        
        // Bulk action section (hidden by default)
        html += `<div id="bulkActionSection" style="display: none; margin-top: 12px; padding: 16px; background: white; border: 1px solid #e1dfdd; border-radius: 4px; box-shadow: 0 0.3px 0.9px rgba(0,0,0,0.1), 0 1.6px 3.6px rgba(0,0,0,0.13);">`;
        html += `<div style="font-size: 14px; font-weight: 600; color: #252423; margin-bottom: 12px;">Bulk Action for All Records</div>`;
        
        // Comment field
        html += `<div>`;
        html += `<label class="form-label" style="display: block; font-size: 11px; font-weight: 600; color: #605e5c; margin-bottom: 6px;">COMMENT</label>`;
        html += `<textarea id="bulkComment" class="form-control" placeholder="This comment will apply to all records..." style="width: 100%; padding: 8px 12px; border: 1px solid #8a8886; border-radius: 2px; font-size: 13px; font-family: 'Segoe UI', sans-serif; resize: vertical; min-height: 70px; background: white;" onfocus="this.style.borderColor='#6264a7'; this.style.boxShadow='0 0 0 1px #6264a7'" onblur="this.style.borderColor='#8a8886'; this.style.boxShadow='none'"></textarea>`;
        html += `</div>`;
        
        // Excuse buttons
        html += `<div style="display: flex; gap: 8px; margin-top: 12px; justify-content: flex-end; align-items: center;">`;
        html += `<span style="font-size: 11px; color: #605e5c; font-weight: 600;">EXCUSE?</span>`;
        html += `<button style="width: 40px; height: 40px; border: none; border-radius: 2px; background: #92c353; color: white; font-size: 18px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.1s; box-shadow: 0 0.3px 0.9px rgba(0,0,0,0.1), 0 1.6px 3.6px rgba(0,0,0,0.13);" title="Yes - Excuse All" onmouseover="this.style.background='#7ba33c'" onmouseout="this.style.background='#92c353'" onclick="saveBulkAction('Yes')">✓</button>`;
        html += `<button style="width: 40px; height: 40px; border: none; border-radius: 2px; background: #c4314b; color: white; font-size: 18px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.1s; box-shadow: 0 0.3px 0.9px rgba(0,0,0,0.1), 0 1.6px 3.6px rgba(0,0,0,0.13);" title="No - Deny All" onmouseover="this.style.background='#a52a3f'" onmouseout="this.style.background='#c4314b'" onclick="saveBulkAction('No')">✕</button>`;
        html += `</div>`;
        
        html += `</div>`;
    }
    
    return html;
}

// Render form
function renderForm(step, data) {
    const currentRecord = sessionData.records[currentRecordIndex] || {};
    const text = replaceVariables(step.text, { ...currentRecord, bulk_count: sessionData.records.length });
    let html = `<div class="message-content">${text}<form id="chatForm" onsubmit="handleFormSubmit(event, '${step.buttons[0].next}')">`;
    
    step.fields.forEach(field => {
        html += '<div class="form-group">';
        html += `<label>${field.label}${field.required ? ' *' : ''}</label>`;
        
        if (field.type === 'dropdown') {
            html += `<select name="${field.name}" ${field.required ? 'required' : ''}>`;
            html += '<option value="">Select...</option>';
            field.options.forEach(opt => {
                html += `<option value="${opt}">${opt}</option>`;
            });
            html += '</select>';
        } else if (field.type === 'file') {
            html += `<div class="file-input-wrapper">
                <input type="file" name="${field.name}" id="${field.name}" ${field.required ? 'required' : ''} onchange="updateFileName(this)">
                <label class="file-input-label" for="${field.name}">📎 ${field.label}</label>
                <div class="file-name" id="${field.name}_name"></div>
            </div>`;
        } else {
            html += `<textarea name="${field.name}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea>`;
        }
        html += '</div>';
    });
    
    html += '<div class="buttons">';
    step.buttons.forEach((button, idx) => {
        const btnClass = button.text.includes('✅') ? 'btn-success' : 
                       button.text.includes('⏩') ? 'btn-secondary' : 'btn';
        const btnType = idx === 0 ? 'submit' : 'button';
        const onclick = idx === 0 ? '' : `onclick="handleButtonClick('${button.next}')"`;
        html += `<button type="${btnType}" class="btn ${btnClass}" ${onclick}>${button.text}</button>`;
    });
    html += '</div></form></div>';
    return html;
}

// Render summary card
function renderSummaryCard(step, data) {
    const text = replaceVariables(step.text, data);
    let html = `<div class="message-content">${text}</div><div class="success-box" style="margin-top: 12px;">`;
    
    step.fields.forEach(field => {
        const fieldText = replaceVariables(field, formData);
        html += `<div class="summary-item">${fieldText}</div>`;
    });
    
    html += '</div><div class="alert" style="background: #fef2f2; border-color: #ef4444; color: #991b1b;">⚠️ Action cannot be undone</div><div class="buttons">';
    step.buttons.forEach((button, idx) => {
        const btnClass = button.text.includes('✅') ? 'btn-success' : 
                       button.text.includes('❌') ? 'btn-danger' : 'btn';
        html += `<button class="btn ${btnClass}" onclick="handleButtonClick('${button.next}')">${button.text}</button>`;
    });
    html += '</div>';
    return html;
}

// Handle button click
function handleButtonClick(nextStep, btnIdx) {
    if (nextStep === 'record_list' && currentStep === 'entry_prompt') {
        selectedRecords = sessionData.records.map((r, i) => i);
    }
    renderStep(nextStep);
}

// Handle card button click - set excuse decision
function handleCardButton(recordIdx, nextStep, buttonData) {
    // Store the decision in a temporary state
    if (!window.recordDecisions) window.recordDecisions = {};
    
    if (buttonData && buttonData.excuse) {
        window.recordDecisions[recordIdx] = buttonData.excuse;
        
        // Visual feedback - highlight the selected button
        const card = document.getElementById(`card-${recordIdx}`);
        if (card) {
            const buttons = card.querySelectorAll('button[title*="Excuse"], button[title*="Deny"]');
            buttons.forEach(btn => {
                if (btn.title.includes(buttonData.excuse === 'Yes' ? 'Excuse' : 'Deny')) {
                    btn.style.opacity = '1';
                    btn.style.boxShadow = '0 0 0 2px #6264a7';
                } else {
                    btn.style.opacity = '0.5';
                    btn.style.boxShadow = 'none';
                }
            });
        }
    }
}

// Save record with comment
function saveRecord(recordIdx, decision) {
    const comment = document.getElementById(`comment-${recordIdx}`).value.trim();
    
    if (!comment) {
        alert('Please add a comment before submitting.');
        return;
    }
    
    // Store the data
    if (!window.savedRecords) window.savedRecords = [];
    window.savedRecords.push({
        recordIdx: recordIdx,
        employee: sessionData.records[recordIdx].emp_name,
        decision: decision,
        comment: comment,
        timestamp: new Date().toISOString()
    });
    
    // Visual feedback
    const card = document.getElementById(`card-${recordIdx}`);
    if (card) {
        card.style.borderColor = '#92c353';
        card.style.backgroundColor = '#dff6dd';
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'alert alert-success';
        successMsg.style.marginTop = '12px';
        successMsg.innerHTML = `✓ ${decision === 'Yes' ? 'Excused' : 'Denied'} successfully`;
        card.appendChild(successMsg);
        
        // Disable the card after 1 second
        setTimeout(() => {
            card.style.opacity = '0.6';
            card.style.pointerEvents = 'none';
        }, 1000);
    }
    
    console.log('Saved record:', window.savedRecords[window.savedRecords.length - 1]);
}

// Toggle bulk mode
function toggleBulkMode(isEnabled) {
    const bulkSection = document.getElementById('bulkActionSection');
    const recordCards = document.querySelectorAll('.record-card');
    
    if (isEnabled) {
        // Show bulk section
        bulkSection.style.display = 'block';
        
        // Disable all individual record buttons and textareas
        recordCards.forEach(card => {
            const buttons = card.querySelectorAll('button[title*="Excuse"], button[title*="Deny"]');
            const textarea = card.querySelector('textarea');
            buttons.forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = '0.3';
                btn.style.cursor = 'not-allowed';
            });
            if (textarea) {
                textarea.disabled = true;
                textarea.style.opacity = '0.5';
                textarea.style.cursor = 'not-allowed';
            }
        });
    } else {
        // Hide bulk section
        bulkSection.style.display = 'none';
        
        // Enable all individual record buttons and textareas
        recordCards.forEach(card => {
            const buttons = card.querySelectorAll('button[title*="Excuse"], button[title*="Deny"]');
            const textarea = card.querySelector('textarea');
            buttons.forEach(btn => {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            });
            if (textarea) {
                textarea.disabled = false;
                textarea.style.opacity = '1';
                textarea.style.cursor = 'text';
            }
        });
    }
}

// Save bulk action
function saveBulkAction(decision) {
    const comment = document.getElementById('bulkComment').value.trim();
    
    if (!comment) {
        alert('Please add a comment before submitting.');
        return;
    }
    
    // Store the data for all records
    if (!window.savedRecords) window.savedRecords = [];
    
    sessionData.records.forEach((record, idx) => {
        window.savedRecords.push({
            recordIdx: idx,
            employee: record.emp_name,
            decision: decision,
            comment: comment,
            timestamp: new Date().toISOString(),
            bulkAction: true
        });
    });
    
    // Visual feedback - disable all cards
    const recordCards = document.querySelectorAll('.record-card');
    recordCards.forEach(card => {
        card.style.borderColor = '#92c353';
        card.style.backgroundColor = '#dff6dd';
        card.style.opacity = '0.6';
        card.style.pointerEvents = 'none';
    });
    
    // Show success message
    const bulkSection = document.getElementById('bulkActionSection');
    const successMsg = document.createElement('div');
    successMsg.className = 'alert alert-success';
    successMsg.style.marginTop = '12px';
    successMsg.innerHTML = `✓ ${decision === 'Yes' ? 'Excused' : 'Denied'} all ${sessionData.records.length} records successfully`;
    bulkSection.appendChild(successMsg);
    
    // Disable bulk section
    setTimeout(() => {
        bulkSection.style.opacity = '0.6';
        bulkSection.style.pointerEvents = 'none';
        document.getElementById('bulkCheckbox').disabled = true;
    }, 1000);
    
    console.log('Bulk action saved:', window.savedRecords.filter(r => r.bulkAction));
}

// Handle bulk option
function handleBulkOption(nextStep) {
    isBulkMode = nextStep === 'bulk_action';
    selectedRecords = sessionData.records.map((r, i) => i);
    renderStep(nextStep);
}

// Handle form submit
function handleFormSubmit(event, nextStep) {
    event.preventDefault();
    const form = event.target;
    const formDataObj = new FormData(form);
    
    formData = {};
    for (let [key, value] of formDataObj.entries()) {
        if (value instanceof File) {
            formData[key] = value.name;
            formData.evidence_status = 'Uploaded: ' + value.name;
        } else {
            formData[key] = value;
        }
    }
    
    formData.excuse_decision = formData.excuse || 'Not specified';
    formData.record_count = isBulkMode ? sessionData.records.length : 1;
    
    // Calculate approved/rejected counts
    if (nextStep === 'confirmation') {
        const approved = formData.excuse === 'Yes' ? formData.record_count : 0;
        const rejected = formData.excuse === 'No' ? formData.record_count : 0;
        formData.approved_count = approved;
        formData.rejected_count = rejected;
        formData.submitted_on = new Date().toLocaleString();
    }
    
    renderStep(nextStep);
}

// Update file name display
function updateFileName(input) {
    const fileName = input.files[0] ? input.files[0].name : '';
    const fileNameDiv = document.getElementById(input.name + '_name');
    if (fileNameDiv) {
        fileNameDiv.textContent = fileName ? 'Selected: ' + fileName : '';
    }
}

// Add button click sound/feedback
function addButtonFeedback(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
}

// Enhanced button click handler
function handleButtonClick(nextStep, btnIdx) {
    if (nextStep === 'record_list' && currentStep === 'entry_prompt') {
        selectedRecords = sessionData.records.map((r, i) => i);
    }
    renderStep(nextStep);
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    // Add welcome message
    const chatContainer = document.getElementById('chatContainer');
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'message';
    welcomeDiv.innerHTML = `
        <div class="bot-message">
            <div class="bot-avatar">🤖</div>
            <div class="message-content">
                <strong>Welcome to the Late In Handling System!</strong><br><br>
                I'm here to help you manage late-in records efficiently. Select your role above to get started.
            </div>
        </div>
    `;
    chatContainer.appendChild(welcomeDiv);
    
    // Start the chatbot flow
    setTimeout(() => {
        initChatbot();
    }, 1000);
});