# Missing Features - Angular vs HTML

## Current Status
✅ **Implemented in Angular:**
- Data grid with sorting
- Pagination (50 rows/page, options 25/50/100)
- Row selection
- Excused dropdown with color coding
- Comment textarea with character counter
- Kronos status badges
- Basic validation

❌ **Missing from Angular (Available in HTML):**

### 1. **Login Screen**
- Azure AD login button
- Demo mode notice
- Unifi branded login page

### 2. **App Header**
- iLink logo
- User avatar and name
- Persona selector dropdown (SM/AMH/Ops/Admin)
- Logout button

### 3. **Page Header**
- Page icon and title
- Description text

### 4. **Filter Panel**
- Station dropdown
- Customer dropdown
- Line of Service dropdown
- Job Code dropdown
- Excused Status filter
- Date Range picker (Yesterday, 2 Days, 3 Days, Custom)
- Apply Filters button
- Reset button
- Refresh button

### 5. **Stats Cards**
- Pending Review count
- Excused count
- Unexcused count
- Color-coded icons

### 6. **Bulk Actions**
- Bulk Excused modal
- Bulk Comment modal
- Success/failure summary

### 7. **AMH Section** (for AMH persona only)
- Authorization Reason textarea (mandatory)
- File upload for supporting document (mandatory)
- Additional Notes textarea (optional)
- SM's original comment display
- Complete/Required badge

### 8. **Validation Error Highlighting**
- Red border on invalid fields
- Light red background
- Error shadow effect
- Clear on edit

### 9. **Toast Notifications**
- Success messages (green)
- Error messages (red)
- Info messages (blue)
- Auto-dismiss after 3 seconds

### 10. **Loading Overlay**
- Spinner during operations
- Blur background

## Implementation Priority

### Phase 1 (Critical):
1. Filter Panel
2. Stats Cards
3. Bulk Actions
4. Toast Notifications

### Phase 2 (Important):
5. AMH Section
6. Validation Error Highlighting
7. Loading Overlay
8. Persona Selector

### Phase 3 (Nice to Have):
9. Login Screen
10. Enhanced Header

## Quick Implementation Guide

### For Filter Panel:
```typescript
// Create: src/app/shared/components/filter-panel/
// Files: filter-panel.component.ts/html/scss
// Emit events: filtersApplied, filtersReset, refreshRequested
```

### For Stats Cards:
```typescript
// Create: src/app/shared/components/stats-cards/
// Subscribe to: dataService.filteredRecords$
// Calculate: pending, excused, unexcused counts
```

### For Bulk Actions:
```typescript
// Create: src/app/shared/components/bulk-action-dialog/
// Use: Angular Material Dialog or custom modal
// Methods: applyBulkExcused(), applyBulkComment()
```

### For Toast:
```typescript
// Create: src/app/core/services/toast.service.ts
// Use: BehaviorSubject for toast messages
// Component: src/app/shared/components/toast/
```

### For AMH Section:
```typescript
// Add to: late-in-grid.component.html
// Show only when: currentPersona.showAMH === true
// Validate: amhReason and amhAttachment mandatory
```

## Estimated Effort
- Phase 1: 2-3 hours
- Phase 2: 2-3 hours  
- Phase 3: 1-2 hours
- **Total: 5-8 hours**

## Next Steps
1. Create filter panel component
2. Create stats cards component
3. Add bulk action modals
4. Implement toast service
5. Add AMH section to grid
6. Add validation highlighting
7. Create loading overlay
8. Add persona selector
9. Create login screen

## Files to Create/Modify

### New Files:
- `src/app/shared/components/filter-panel/` (3 files)
- `src/app/shared/components/stats-cards/` (3 files)
- `src/app/shared/components/bulk-action-dialog/` (3 files)
- `src/app/shared/components/toast/` (3 files)
- `src/app/shared/components/loading-overlay/` (3 files)
- `src/app/core/services/toast.service.ts`
- `src/app/features/login/` (3 files)

### Modify:
- `src/app/app.component.ts` - Add header, persona selector
- `src/app/features/late-in-management/components/late-in-grid/late-in-grid.component.html` - Add AMH section
- `src/app/features/late-in-management/components/late-in-grid/late-in-grid.component.ts` - Add bulk actions, error highlighting
