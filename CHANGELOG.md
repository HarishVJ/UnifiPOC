# Changelog - iLink Late In Management System

## [2.4.0] - 2025-10-25 - Variance Warning Threshold

### Added
- **Warning Color for Low Variance**: Added visual distinction for minor lateness
  - Variance < 15 minutes: Yellow/gold warning color
  - Variance ≥ 15 minutes: Red late color
  - Variance ≤ 0 minutes: Green on-time color
  - Helps prioritize which cases need attention

### Improved
- **Visual Hierarchy**: Three-tier color system
  - **Green** (On-time): variance ≤ 0 mins
  - **Yellow** (Warning): 1-14 mins late
  - **Red** (Late): ≥ 15 mins late
  - Clear visual priority system

### Color Scheme
- **On-time**: 
  - Background: #c6f6d5 (light green)
  - Text: #22543d (dark green)
- **Warning** (NEW):
  - Background: #fef5e7 (light yellow)
  - Text: #C7AA5B (gold)
- **Late**:
  - Background: #fed7d7 (light red)
  - Text: #c53030 (dark red)

### Technical Details
- Updated `js/table-renderer.js`:
  - Added `getVarianceClass()` helper method
  - Returns 'ontime', 'warning', or 'late' based on variance value
  - Threshold: < 15 minutes = warning
  - Updated `renderRow()` to use helper method
- Updated `css/styles.css`:
  - Added `.variance-badge.warning` class
  - Yellow/gold color scheme
  - Positioned between ontime and late styles

---

## [2.3.9] - 2025-10-25 - Selection Count Badge

### Changed
- **Selection Indicator**: Replaced banner with compact badge
  - Removed full-width selection banner
  - Added small badge next to Select All button
  - Removed "Clear Selection" button
  - Saves significant vertical space

### Added
- **Selection Count Badge**: Popup-style notification badge
  - Appears top-right of Select All button
  - Shows number of selected rows
  - Red background (#B42025) with white text
  - Smooth scale animation (fade in/out)
  - Only visible when rows are selected

### Improved
- **Space Efficiency**: Eliminated banner row
  - Before: Full-width banner (~50px height)
  - After: Small badge (18px diameter)
  - Savings: ~50px vertical space
  - Cleaner, more compact interface

- **Visual Design**: Modern notification badge
  - Position: Absolute, top-right of button
  - Size: 10px font, 2px padding
  - Shadow: Subtle depth effect
  - Animation: Scale from 0 to 1
  - Auto-hide when count is 0

### Layout
**Before** (Banner):
```
┌────────────────────────────────────┐
│ ✓ 5 record(s) selected [Clear]    │  ← Full banner
└────────────────────────────────────┘
Table Header...
```

**After** (Badge):
```
Table Header:
┌───┬──────────┐
│ ☑️│ Emp ID   │
│ ⁵ │          │  ← Small badge
└───┴──────────┘
```

### Technical Details
- Updated `ExceptionManagement_v2.html`:
  - Removed `.selection-banner` section
  - Removed "Clear Selection" button
  - Added `.select-all-wrapper` container
  - Added `.selection-count-badge` span
  - Badge positioned next to Select All button
- Updated `css/styles.css`:
  - Added `.select-all-wrapper` - relative positioning
  - Added `.selection-count-badge` - absolute positioned badge
  - Red background, white text, rounded
  - Scale animation (0 to 1)
  - `.show` class triggers visibility
  - Shadow for depth
  - Top: -4px, Right: -8px positioning
- Updated `js/selection-manager.js`:
  - Updated `updateSelectionBanner()` to use badge
  - Shows/hides badge based on count
  - Updates badge text with count
  - Removed `clearAll()` method

### Space Savings
- **Before**: Banner ~50px + padding
- **After**: Badge ~18px (overlaid)
- **Net Savings**: ~50px vertical space

---

## [2.3.8] - 2025-10-25 - Select All in Table Header

### Changed
- **Select All Position**: Moved to table header above checkbox column
  - Replaced checkbox with icon button in header
  - Removed from table actions bar
  - More intuitive placement
  - Standard table pattern

### Improved
- **Visual Design**: Icon-only button in header
  - ☑️ icon when ready to select
  - ☐ icon when ready to deselect
  - Hover effect for interactivity
  - Tooltip shows "Select All" or "Deselect All"
  - Clean, minimal design

- **Space Efficiency**: Freed up space in actions bar
  - Removed button from table actions
  - More room for other action buttons
  - Cleaner header layout

### Layout
**Before**:
```
Table Header:
┌─────────────────────────────────────────────────┐
│ Title [Stats] [Select All] [Bulk] [Approve]    │
└─────────────────────────────────────────────────┘
Table:
┌───┬──────────┬─────────┐
│ ☐ │ Emp ID   │ ...     │
├───┼──────────┼─────────┤
│ ☐ │ E12345   │ ...     │
```

**After**:
```
Table Header:
┌─────────────────────────────────────────────────┐
│ Title [Stats]           [Bulk] [Approve]        │
└─────────────────────────────────────────────────┘
Table:
┌───┬──────────┬─────────┐
│ ☑️ │ Emp ID   │ ...     │  ← Select All here
├───┼──────────┼─────────┤
│ ☐ │ E12345   │ ...     │
```

### Technical Details
- Updated `ExceptionManagement_v2.html`:
  - Replaced `<input type="checkbox">` with button in `th.checkbox-col`
  - Added `.select-all-header-btn` with icon
  - Removed Select All button from `.table-actions`
  - Button calls `SelectionManager.toggleSelectAllButton()`
- Updated `css/styles.css`:
  - Added `.select-all-header-btn` styling
  - Transparent background, hover effect
  - 18px font size for icon
  - Scale animation on click
  - Centered in header cell
- Updated `js/selection-manager.js`:
  - Updated `updateSelectAllButton()` to update tooltip
  - Removed reference to button text element
  - Icon and tooltip update based on state

---

## [2.3.7] - 2025-10-25 - Simplified Selection Toggle

### Changed
- **Selection Button**: Simplified to single toggle button
  - Button toggles between "Select All" and "Deselect All"
  - No separate clear selection option needed
  - Cleaner, more intuitive interface

### Improved
- **User Feedback**: Added toast notifications
  - "X rows selected" when selecting all
  - "All rows deselected" when deselecting
  - Clear confirmation of action

- **Button States**: Dynamic button text and icon
  - When none/some selected: ☑️ "Select All"
  - When all selected: ☐ "Deselect All"
  - Icon changes to match state

### Functionality
- **Toggle Behavior**:
  - Click once: Select all rows on current page
  - Click again: Deselect all rows on current page
  - Works only for current page (respects pagination)
  - Disabled for read-only personas (Ops, Admin)

### Technical Details
- Updated `js/selection-manager.js`:
  - Enhanced `toggleSelectAllButton()` with direct selection logic
  - Added permission check for canEdit
  - Added toast notifications for user feedback
  - Removed dependency on separate selectAll/deselectAll calls
  - Inline forEach loops for clarity

---

## [2.3.6] - 2025-10-25 - Inline Stats Bar

### Changed
- **Stats Position**: Moved stats bar inline with table header
  - Positioned next to "Late Arrival Records" title
  - Eliminates separate stats section
  - Saves additional vertical space
  - More efficient use of horizontal space

### Improved
- **Layout Efficiency**: Better space utilization
  - Stats now share row with table title and actions
  - Reduced overall page height
  - All key info visible in single row
  - Professional dashboard layout

- **Visual Design**: Refined inline appearance
  - Lighter background (#f7fafc) for subtle integration
  - Smaller font sizes (20px numbers, 11px labels)
  - Reduced padding for compact fit
  - Maintains color coding and clarity

### Layout Structure
**Before** (Separate sections):
```
┌─────────────────────────────────────┐
│  15 PENDING | 8 EXCUSED | 7 UNEXCUSED │  ← Separate row
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Late Arrival Records    [Buttons]   │  ← Table header
└─────────────────────────────────────┘
```

**After** (Inline):
```
┌──────────────────────────────────────────────────────────┐
│ Late Arrival Records  [15 PENDING|8 EXCUSED|7 UNEXCUSED]  [Select All] [Bulk Update] [Approve] │
└──────────────────────────────────────────────────────────┘
```

### Technical Details
- Updated `ExceptionManagement_v2.html`:
  - Removed standalone `.stats-bar` section
  - Added `.table-header-left` container
  - Moved stats into `.stats-bar-inline` within table header
  - Stats positioned between title and action buttons
- Updated `css/styles.css`:
  - Renamed `.stats-bar` to `.stats-bar-inline`
  - Changed background from white to #f7fafc
  - Reduced padding: 8px 16px (from 12px 24px)
  - Added margin-left: 20px for spacing from title
  - Reduced stat numbers: 20px (from 24px)
  - Reduced stat labels: 11px (from 12px)
  - Reduced stat padding: 0 12px (from 0 20px)
  - Reduced divider height: 24px (from 30px)
  - Added `.table-header-left` for flex layout
  - Updated `.table-title` with white-space: nowrap
  - Updated responsive styles for mobile stacking

### Space Savings
- **Before**: Stats bar + table header = ~94px
- **After**: Combined header = ~60px
- **Savings**: ~36% additional space reduction

---

## [2.3.5] - 2025-10-25 - Compact Stats Bar Design

### Changed
- **Stats Display**: Redesigned from card layout to compact horizontal bar
  - Replaced 3 large stat cards with single horizontal stats bar
  - Reduced vertical space by ~70%
  - More professional, dashboard-style appearance
  - Better space utilization

### Improved
- **Visual Design**: Cleaner, more compact layout
  - Number + label inline (baseline aligned)
  - Vertical dividers between stats
  - Color-coded numbers and labels
  - Uppercase micro labels (12px)
  - Centered horizontal layout

- **Space Efficiency**: Significant space savings
  - Before: ~120px height (3 cards)
  - After: ~54px height (single bar)
  - Savings: 70% reduction in vertical space

- **Typography**: Better hierarchy
  - Numbers: 24px bold
  - Labels: 12px uppercase, 0.7 opacity
  - Baseline alignment for clean look

### Design Details
**Stats Bar Layout**:
```
┌─────────────────────────────────────────┐
│  15 PENDING  |  8 EXCUSED  |  7 UNEXCUSED │
└─────────────────────────────────────────┘
```

**Color Scheme**:
- Pending: Gold (#C7AA5B)
- Excused: Green (#48bb78)
- Unexcused: Red (#B42025)
- Dividers: Light gray (#e2e8f0)
- Background: White with subtle shadow

**Responsive**:
- Desktop: Horizontal layout with dividers
- Mobile: Vertical stack with horizontal dividers

### Technical Details
- Updated `ExceptionManagement_v2.html`:
  - Replaced `.stats-section` with `.stats-bar`
  - Replaced `.stat-card` structure with `.stat-item`
  - Added `.stat-number` and `.stat-label` spans
  - Added `.stat-divider` between items
  - Removed icon elements
- Updated `css/styles.css`:
  - Removed `.stats-section`, `.stat-card`, `.stat-icon`, `.stat-content`
  - Added `.stats-bar` - horizontal flexbox container
  - Added `.stat-item` - inline number + label
  - Added `.stat-number` - 24px bold numbers
  - Added `.stat-label` - 12px uppercase labels
  - Added color classes for each stat type
  - Added `.stat-divider` - vertical separators
  - Updated responsive styles for mobile stacking

---

## [2.3.4] - 2025-10-25 - Terminology Update

### Changed
- **Site Manager → Station Manager**: Updated terminology throughout application
  - Persona dropdown: "Station Manager (SM)"
  - User role display: "Station Manager"
  - Configuration: PersonaConfig.sm.name and role
  - AMH section: "Station Mgr:" label
  - Consistent with aviation industry terminology

### Files Updated
- `ExceptionManagement_v2.html`: Dropdown option and user role display
- `js/config.js`: PersonaConfig name and role
- `js/table-renderer.js`: AMH section label

---

## [2.3.3] - 2025-10-25 - Unified Date Range Calendar

### Changed
- **Custom Date Range**: Replaced separate date inputs with unified calendar picker
  - Single control for selecting both start and end dates
  - Visual calendar interface with month navigation
  - Click to select start date, click again for end date
  - Real-time range preview with visual highlighting
  - Modern, intuitive user experience

### Added
- **Interactive Calendar**: Full-featured calendar picker
  - Month navigation (previous/next buttons)
  - 7-day week grid layout (Su-Sa)
  - Visual range selection with highlighting
  - Disabled future dates (grayed out)
  - Range start/end markers (red background)
  - In-range dates highlighted (light red)
  - Clear and Apply buttons

### Features
- **Two-Click Selection**: Simple selection workflow
  - First click: Select start date
  - Second click: Select end date
  - Auto-swaps if end date is before start
  - Shows "Start date - ..." during selection
  - Validates 31-day limit on second click

- **Visual Feedback**: Clear visual indicators
  - 📅 Calendar icon in input
  - Range start: Red background, white text, bold
  - Range end: Red background, white text, bold
  - In-range: Light red background
  - Hover: Gray background
  - Disabled: Gray text, no interaction

- **Month Navigation**: Navigate through months
  - ‹ Previous month button
  - › Next month button (disabled for future months)
  - Current month/year display
  - Cannot navigate to future months

- **Calendar Footer**: Action buttons
  - Clear: Reset selection, start over
  - Apply: Confirm and apply date range

### Improved
- **User Experience**: Better date selection
  - No manual typing required
  - Visual range preview before applying
  - Clear feedback during selection
  - Prevents invalid selections
  - Auto-validates 31-day limit

- **Input Display**: Unified input field
  - Shows "Select date range..." when empty
  - Shows "Start date - ..." during selection
  - Shows full range when complete
  - Calendar icon for clarity

### Technical Details
- Updated `ExceptionManagement_v2.html`:
  - Replaced separate date inputs with unified calendar
  - Added `.unified-date-range` container
  - Added `.date-range-input` with icon and text
  - Added `.date-range-calendar` with full calendar UI
  - Added calendar header with navigation
  - Added weekday labels (Su-Sa)
  - Added `.calendar-days` container (populated by JS)
  - Added calendar footer with Clear/Apply buttons
- Updated `js/date-picker.js`:
  - Added `tempStartDate`, `tempEndDate` for selection state
  - Added `currentMonth` for calendar navigation
  - Added `toggleCalendar()` - Show/hide calendar
  - Added `renderCalendar()` - Generate calendar grid
  - Added `selectDate()` - Handle date clicks
  - Added `updateRangeText()` - Update input display
  - Added `previousMonth()` - Navigate to previous month
  - Added `nextMonth()` - Navigate to next month (with future check)
  - Added `clearSelection()` - Reset temp selection
  - Added `applyCalendarRange()` - Apply selected range
  - Removed old `applyCustomRange()` method
- Updated `css/styles.css`:
  - Added `.unified-date-range` - Container styling
  - Added `.date-range-input` - Input field with icon
  - Added `.date-range-icon`, `.date-range-text`
  - Added `.date-range-calendar` - Calendar container
  - Added `.calendar-header` - Month navigation header
  - Added `.calendar-nav` - Navigation buttons
  - Added `.calendar-month` - Month/year display
  - Added `.calendar-weekdays` - Weekday labels grid
  - Added `.calendar-days` - Days grid (7 columns)
  - Added `.calendar-day` - Individual day cell
  - Added `.calendar-day.empty` - Empty cells before month
  - Added `.calendar-day.disabled` - Future dates
  - Added `.calendar-day.in-range` - Range highlighting
  - Added `.calendar-day.range-start`, `.range-end` - Range markers
  - Added `.calendar-footer` - Footer with buttons
  - Added `.calendar-clear`, `.calendar-apply` - Action buttons
  - Removed old `.custom-range-inputs` and button styles

### Visual Design
**Calendar Layout**:
```
┌────────────────────────────────┐
│  ‹  January 2025  ›            │
├────────────────────────────────┤
│ Su Mo Tu We Th Fr Sa           │
│        1  2  3  4  5           │
│  6  7  8  9 10 11 12           │
│ 13 14 15 16 17 18 19           │
│ 20 [21 22 23 24 25] 26         │
│ 27 28 29 30 31                 │
├────────────────────────────────┤
│ [Clear]        [Apply]         │
└────────────────────────────────┘
```

**Color Scheme**:
- Range start/end: Red (#B42025)
- In-range: Light red (#fed7d7)
- Hover: Light gray (#edf2f7)
- Disabled: Gray (#cbd5e0)
- Border: Light gray (#e2e8f0)

---

## [2.3.2] - 2025-10-25 - Enhanced Date Picker

### Added
- **Today Option**: Added "Today" as default date option
  - Set as default selection on page load
  - Quick access to current day's data
  - Appears first in date picker dropdown

- **Reset Button**: Added reset functionality
  - Resets date selection to "Today"
  - Clears custom date inputs
  - Auto-refreshes grid with today's data
  - Located next to Apply button in custom range

### Changed
- **Date Range Validation**: Max 31 days range
  - Validates custom date range doesn't exceed 31 days
  - Shows error message if range too large
  - Displays day count in success message

- **Future Dates Disabled**: Cannot select future dates
  - Max date set to today
  - Prevents invalid date selections
  - Applies to both start and end dates

- **Auto-Refresh Grid**: Automatic grid refresh on date change
  - Refreshes when preset option selected (Today, Yesterday, etc.)
  - Refreshes when custom range applied
  - Refreshes when reset to Today
  - Shows toast notification with date info

- **Single-Day Support**: Supports single-day selection
  - Can select same date for start and end
  - Displays single date (not range) when same day
  - Useful for viewing specific day's data

### Improved
- **Date Display**: Better date range display
  - Single date: "Jan 25, 2025"
  - Date range: "Jan 20, 2025 - Jan 25, 2025"
  - Shows day count in toast: "(5 days)"

- **User Feedback**: Enhanced toast notifications
  - Shows selected date/range
  - Shows day count for ranges
  - Confirms grid refresh
  - Clear error messages for validation

### Technical Details
- Updated `js/date-picker.js`:
  - Added `selectedStartDate` and `selectedEndDate` properties
  - Updated `initialize()` to set Today as default
  - Added 'today' option to `selectOption()`
  - Updated `applyCustomRange()` with 31-day validation
  - Added `resetToToday()` method
  - Added `refreshGrid()` method for auto-refresh
  - Updated max date to today (future dates disabled)
  - Added single-day display logic
- Updated `ExceptionManagement_v2.html`:
  - Added "Today" date option as first item
  - Added `todayDate` span for date display
  - Updated custom range label: "Custom Range (Max 31 days)"
  - Added `custom-range-actions` container
  - Added Reset button with `resetToToday()` onclick
- Updated `css/styles.css`:
  - Added `.custom-range-actions` - flexbox container for buttons
  - Updated `.apply-custom-btn` - flex: 1 for equal width
  - Added `.reset-custom-btn` - gray button styling
  - Added hover states for both buttons

### Features Summary
- ✅ Single-day or range selection (max 31 days)
- ✅ Default: Today
- ✅ Future dates disabled
- ✅ Auto-refresh grid on date change
- ✅ Reset option to return to Today
- ✅ Day count display in notifications
- ✅ Single-day display support

---

## [2.3.1] - 2025-10-25 - AMH Inline Horizontal Layout

### Changed
- **AMH Section Layout**: Redesigned to horizontal inline layout for maximum space efficiency
  - All fields in single compact row
  - Reduced vertical space by ~60%
  - Better visual flow and readability
  - Professional card-based design

### Improved
- **Header Row**: Single-line header with all info
  - 🔐 Icon + "AMH Authorization" + Status Badge (✓/!)
  - Divider (|)
  - 💬 SM Comment inline (truncated with ellipsis)
  - White background with red left border

- **Fields Grid**: 3-column horizontal layout
  - **Column 1 (2fr)**: 📝 Reason* - Textarea
  - **Column 2 (1fr)**: 📎 Document* - Upload button
  - **Column 3 (1.5fr)**: 📋 Notes - Textarea
  - Equal height fields (45px min)
  - Consistent spacing (8px gap)

- **Upload Button**: Compact inline button
  - 📤 Upload icon when empty
  - ✓ Filename when uploaded
  - Green background when file attached
  - Small ✕ remove button
  - Dashed border → Solid when uploaded

- **Visual Design**: Clean and modern
  - Gradient background (#fff5f5 → #ffe8e8)
  - Red border (#fc8181)
  - Uppercase micro labels (10px)
  - Icons for quick identification
  - Consistent padding (10px)

### Technical Details
- Updated `js/table-renderer.js`:
  - Redesigned `renderAMHSection()` with inline horizontal structure
  - New header: `.amh-inline-header` with all info in one row
  - New fields container: `.amh-inline-fields` with 3-column grid
  - New field: `.amh-inline-field` for each column
  - New labels: `.amh-inline-label` with icons
  - New textareas: `.amh-inline-textarea` (45px min-height)
  - New upload: `.amh-inline-upload-btn` with compact design
  - Inline SM comment with ellipsis overflow
- Updated `css/styles.css`:
  - Added `.amh-section-inline` - gradient background container
  - Added `.amh-inline-header` - single-row header
  - Added `.amh-inline-icon`, `.amh-inline-title`, `.amh-inline-badge`
  - Added `.amh-inline-divider` - separator styling
  - Added `.amh-inline-sm` - inline SM comment with ellipsis
  - Added `.amh-inline-fields` - 3-column grid (2fr 1fr 1.5fr)
  - Added `.amh-inline-field` - column container
  - Added `.amh-inline-label` - uppercase micro labels
  - Added `.amh-inline-textarea` - compact textareas
  - Added `.amh-inline-upload-btn` - inline upload button
  - Added `.amh-inline-upload-text`, `.amh-inline-file-name`
  - Added `.amh-inline-remove` - compact remove button

### Space Savings
- **Before**: ~240px height (vertical stacked)
- **After**: ~95px height (horizontal inline)
- **Savings**: 60% reduction in vertical space

---

## [2.3.0] - 2025-10-25 - Bulk Update AMH Support

### Added
- **AMH Fields in Bulk Update**: Added AMH authorization fields to bulk update modal
  - Shows AMH-specific fields when persona is Area Manager (AMH)
  - All AMH fields applied to selected records in bulk
  - Maintains consistency with individual row editing

### Features
- **Conditional Display**: AMH fields shown only for AMH persona
  - Automatically detects current persona
  - Shows/hides AMH section dynamically
  - Updates note text based on persona

- **AMH Fields in Bulk Modal**:
  - 🔐 **AMH Authorization Required** header
  - 📝 **Authorization Reason** (required) - Textarea
  - 📎 **Supporting Document** (required) - File upload
  - 📋 **Additional Notes** (optional) - Textarea

- **File Upload**: Full file upload support in bulk modal
  - Click to upload interface
  - File size validation (10MB max)
  - Accepted formats: PDF, DOC, DOCX, JPG, PNG
  - Visual feedback (green background when uploaded)
  - Remove file option

- **Validation**: Comprehensive validation for AMH
  - Excused status required
  - Comment required
  - Authorization reason required (AMH only)
  - Supporting document required (AMH only)
  - Clear error messages for missing fields

### Improved
- **Bulk Update Workflow**: Streamlined for AMH users
  - Single modal for all fields
  - All fields applied in one operation
  - Consistent with row-level editing
  - Better user experience

### Technical Details
- Updated `ExceptionManagement_v2.html`:
  - Added `bulkAmhFields` div with conditional display
  - Added `.bulk-amh-header` for section header
  - Added AMH reason textarea (`bulkAmhReason`)
  - Added file upload area (`bulkUploadArea`, `bulkFileInput`)
  - Added file display area (`bulkFileDisplay`)
  - Added AMH notes textarea (`bulkAmhNotes`)
  - Updated note text with dynamic content (`bulkNoteText`)
- Updated `js/bulk-actions.js`:
  - Added `bulkUploadedFile` property to track uploaded file
  - Updated `showBulkUpdateModal()` to show/hide AMH fields based on persona
  - Updated `applyBulkUpdate()` with AMH validation and field application
  - Added `handleBulkFileUpload()` for file upload handling
  - Added `removeBulkFile()` to remove uploaded file
  - Added `resetBulkUploadArea()` to reset upload UI
- Updated `css/styles.css`:
  - Updated `.bulk-label` to support icons (flexbox layout)
  - Added `.bulk-amh-header` - AMH section header styling
  - Added `.bulk-upload-area` - file upload area
  - Added `.bulk-upload-icon`, `.bulk-upload-text`, `.bulk-upload-hint`
  - Added `.bulk-file-display` - uploaded file display
  - Added `.bulk-file-name` - file name styling
  - Added `.bulk-remove-btn` - remove file button

---

## [2.2.9] - 2025-10-25 - AMH Section UX Improvements

### Changed
- **AMH Section Design**: Redesigned Area Manager section with compact layout and better UX
  - Reduced vertical space by ~40%
  - Added meaningful icons to all fields
  - Cleaner, more professional appearance
  - Better visual hierarchy
  - Improved readability

### Improved
- **Header**: Compact single-line header
  - 🔐 Icon + "AMH Authorization" + Status badge (✓/⚠)
  - White background with red left border
  - Smaller, cleaner design

- **SM Comment Display**: Inline comment reference
  - 💬 Icon for visual clarity
  - "SM Comment:" label with comment text
  - Compact single-line display
  - White background with brand color border

- **Field Labels**: Icon-enhanced labels
  - 📝 Authorization Reason
  - 📎 Supporting Document
  - 📋 Additional Notes
  - Smaller font (12px) for compact layout

- **Upload Area**: Simplified file upload
  - Inline layout (not centered box)
  - Shows filename with ✓ when uploaded
  - Compact remove button (✕)
  - File format hints in smaller text
  - Green background when file attached

- **Textareas**: Reduced padding and height
  - Smaller min-height (60px vs 70px)
  - Reduced padding (8px vs 12px)
  - Thinner borders (1px vs 2px)
  - Maintains full functionality

### Technical Details
- Updated `js/table-renderer.js`:
  - Redesigned `renderAMHSection()` with compact HTML structure
  - New header: `.amh-header-compact`
  - New SM comment: `.amh-sm-comment`
  - New fields: `.amh-field-compact`
  - New labels: `.amh-label` with icons
  - New textareas: `.amh-textarea-compact`
  - New upload: `.amh-upload-compact`
  - Inline file display with compact remove button
- Updated `css/styles.css`:
  - Added `.amh-header-compact` - single-line header
  - Added `.amh-sm-comment` - inline comment display
  - Added `.amh-sm-icon`, `.amh-sm-content`, `.amh-sm-label`, `.amh-sm-text`
  - Added `.amh-field-compact` - reduced margins
  - Added `.amh-label` and `.amh-label-icon`
  - Added `.amh-textarea-compact` - smaller padding
  - Added `.amh-upload-compact` - inline upload area
  - Added `.amh-upload-prompt`, `.amh-upload-formats`, `.amh-upload-success`
  - Added `.amh-remove-compact` - small remove button
  - Updated `.amh-section` - reduced padding (12px vs 20px)
  - Updated `.amh-badge` - lighter colors, smaller size

---

## [2.2.8] - 2025-10-25 - Variance Column Added

### Added
- **Variance Column**: Added variance column showing minutes late/early
  - Displays variance in minutes between scheduled and actual clock-in
  - Positioned between "Clocked Out" and "Excused" columns
  - Sortable by clicking column header
  - Filterable with text input
  - Color-coded badges:
    - Red badge for late arrivals (variance > 0)
    - Green badge for on-time/early (variance ≤ 0)
  - Centered alignment for better readability

### Technical Details
- Updated `ExceptionManagement_v2.html`:
  - Added "Variance (mins)" column header with sort capability
  - Added variance filter input in filter row
- Updated `js/table-renderer.js`:
  - Added variance cell rendering with badge styling
  - Badge class determined by variance value (late/ontime)
- Updated `js/column-filter.js`:
  - Added variance to filter object
  - Added variance filter logic (numeric string matching)
- Updated `css/styles.css`:
  - Added `.variance-badge` base styling
  - Added `.variance-badge.late` (red background)
  - Added `.variance-badge.ontime` (green background)

---

## [2.2.7] - 2025-10-25 - Excused Dropdown Styling

### Changed
- **Excused Dropdown**: Removed background colors from Excused field
  - No more green background for "Yes"
  - No more red background for "No"
  - No more yellow background for empty
  - Clean white background for all states
  - Consistent with standard form styling
  - Better readability

### Technical Details
- Updated `css/styles.css`:
  - Removed `.excused-select.excused-yes` styling (green background)
  - Removed `.excused-select.excused-no` styling (red background)
  - Removed `.excused-select.excused-empty` styling (yellow background)
  - Set uniform `background: white` and `color: #211F20` for all states

---

## [2.2.6] - 2025-10-24 - Merged Bulk Update

### Changed
- **Bulk Actions**: Merged "Bulk Excused" and "Bulk Comment" into single "Bulk Update" button
  - One button instead of two
  - Single modal for both Excused and Comment fields
  - Both fields required when performing bulk update
  - Cleaner toolbar with fewer buttons
  - More efficient workflow

### Improved
- **User Experience**: Streamlined bulk operations
  - Update both Excused and Comment in one action
  - Reduced clicks (one modal vs two separate modals)
  - Consistent data entry (both fields always updated together)
  - Clear validation for both required fields
  - Single success/failure message

- **Modal Design**: Combined interface
  - "Bulk Update Records" title
  - Excused Status dropdown (required *)
  - Comment textarea (required *)
  - Character counter for comment
  - Single "Apply to Selected" action
  - Note explains both fields will be applied

### Technical Details
- Updated `ExceptionManagement_v2.html`:
  - Replaced `bulkExcusedBtn` and `bulkCommentBtn` with single `bulkUpdateBtn`
  - Merged `bulkExcusedModal` and `bulkCommentModal` into `bulkUpdateModal`
  - Combined modal has both Excused dropdown and Comment textarea
  - Both fields marked as required with asterisk (*)
- Updated `js/bulk-actions.js`:
  - Removed `showExcusedModal()`, `closeExcusedModal()`, `applyExcused()`
  - Removed `showCommentModal()`, `closeCommentModal()`, `applyComment()`
  - Added `showBulkUpdateModal()`, `closeBulkUpdateModal()`, `applyBulkUpdate()`
  - Combined validation for both fields
  - Applies both excused and comment in single operation
- Updated `js/selection-manager.js`:
  - Updated `updateActionButtons()` to reference `bulkUpdateBtn`
  - Removed references to separate bulk buttons

---

## [2.2.5] - 2025-10-24 - Compact Single-Row Filters

### Changed
- **Filter Layout**: Reorganized filters into single compact row
  - All 6 filters + action buttons in one row
  - Reduced vertical space by ~60%
  - More room for data table
  - Minimized scrolling required
  - Compact labels (uppercase, smaller font)
  - Icon-only action buttons with tooltips

### Improved
- **Space Efficiency**: Maximum table viewing area
  - Filters take ~50px height (was ~150px)
  - Table visible immediately without scrolling
  - More records visible per screen
  - Better data analysis experience

- **Visual Design**: Cleaner, more professional
  - Inline filter controls
  - Consistent compact styling
  - Flex layout with wrapping for responsiveness
  - Search icon (🔍) on first filter label

### Technical Details
- Updated `ExceptionManagement_v2.html`:
  - Replaced `.filters-grid` with `.filters-row`
  - Changed `.filter-group` to `.filter-group-compact`
  - Changed `.filter-select` to `.filter-select-compact`
  - Moved action buttons inline with `.filter-actions-inline`
  - Icon-only buttons with title attributes for tooltips
  - Shortened "Excused Status" to "Excused"
- Updated `css/styles.css`:
  - New `.filters-row` with flexbox layout
  - New `.filter-group-compact` with minimal spacing
  - New `.filter-select-compact` with reduced padding
  - New `.filter-actions-inline` for inline buttons
  - Updated `.date-picker-display` to match compact style
  - Reduced `.filters-section` padding
  - Updated responsive styles for mobile

---

## [2.2.4] - 2025-10-24 - Unified Header Design

### Changed
- **Merged Header Layout**: Combined app-header and page-header into single unified header
  - All header elements now in one compact row
  - Logo + System Title | Page Title on left
  - Demo Role Selector + User Info + Logout on right
  - Visual divider (|) between system and page titles
  - Cleaner, more professional appearance
  - Reduced vertical space usage

### Improved
- **Visual Hierarchy**: Better organization of header elements
  - System title: "iLink Attendance System"
  - Page title: "⏰ Late In Management" (in brand color)
  - Description: "Review and process employee late arrival exceptions"
  - All controls accessible in single header bar

- **Compact Design**: More efficient use of space
  - Single header row instead of two sections
  - Demo selector integrated with user controls
  - Sticky header remains compact when scrolling

### Technical Details
- Updated `ExceptionManagement_v2.html`:
  - Merged page-header content into header-content
  - Removed separate page-header section
  - Added header-title-main wrapper for inline titles
  - Added header-divider for visual separation
  - Reordered elements: Demo Selector before User Badge
- Updated `css/styles.css`:
  - Added `.header-title-main` for inline title layout
  - Added `.header-divider` styling
  - Updated `.header-title h2` for page title styling
  - Removed old `.page-header` styles
  - Updated `.demo-selector` for compact layout
  - Updated responsive styles for mobile view

---

## [2.2.3] - 2025-10-24 - Header Layout Optimization

### Changed
- **Header Layout**: Moved page-header into app-header to minimize scrolling
  - Page title and demo role selector now part of sticky header
  - Header stays visible when scrolling through data
  - Reduces vertical space and improves navigation
  - Sticky header with `position: sticky` at top of page
  - Consistent max-width and padding across header sections

### Improved
- **User Experience**: Better accessibility to key controls
  - Demo role selector always visible
  - Page title always visible
  - User info and logout always accessible
  - Less scrolling required to access controls

### Technical Details
- Updated `ExceptionManagement_v2.html`:
  - Moved `.page-header` div inside `.app-header`
  - Removed from `.main-content` section
- Updated `css/styles.css`:
  - Added `position: sticky`, `top: 0`, `z-index: 100` to `.app-header`
  - Updated `.page-header` styling to fit inside header
  - Changed background to `#f7fafc` for visual separation
  - Adjusted padding and removed box-shadow

---

## [2.2.2] - 2025-10-24 - Empty Filter Fix

### Fixed
- **Excused Column Empty Filter**: Fixed "Empty" filter option not working
  - Previously both "All" and "Empty" had the same value `""`
  - Now "Empty" uses special value `__EMPTY__` to filter for unset/empty Excused fields
  - Filter correctly shows only records where Excused field is not set
  - "All" shows all records regardless of Excused value
  - "Yes" shows only records with Excused = Yes
  - "No" shows only records with Excused = No
  - "Empty" shows only records with Excused = empty/unset

### Technical Details
- Updated `ExceptionManagement_v2.html`:
  - Changed Empty option value from `""` to `"__EMPTY__"`
- Updated `js/column-filter.js`:
  - Added special handling for `__EMPTY__` filter value
  - Checks if `row.excused` is empty or whitespace-only

---

## [2.2.1] - 2025-10-24 - Select All Fix

### Fixed
- **Select All Behavior**: Fixed to select only current page records
  - Previously selected all 120+ records across all pages
  - Now correctly selects only visible records on current page (25/50/100)
  - Unchecking deselects only current page records
  - Select all checkbox state updates based on current page selection
  - Maintains selections when navigating between pages

### Added
- **Dynamic Select All Button**: Button text toggles based on selection state
  - Shows "Select All" when not all current page rows are selected
  - Shows "Deselect All" when all current page rows are selected
  - Icon changes: ☑️ (Select All) ↔ ☐ (Deselect All)
  - Updates automatically when:
    - Individual rows are selected/deselected
    - Page navigation occurs
    - Rows per page changes
    - Filters are applied

### Technical Details
- Updated `js/selection-manager.js`:
  - Added `getCurrentPageRows()` method to get current page data
  - Modified `toggleSelectAll()` to work with current page only
  - Modified `selectAll()` to work with current page only
  - Added `deselectAll()` method for deselecting current page
  - Added `toggleSelectAllButton()` method to toggle between select/deselect
  - Added `updateSelectAllButton()` method to update button text/icon
  - All selection methods now call `updateSelectAllButton()`
- Updated `js/table-renderer.js`:
  - Added `updateSelectAllCheckbox()` method
  - Checkbox state reflects current page selection status
- Updated `js/pagination-manager.js`:
  - Calls `updateSelectAllButton()` on page change
  - Calls `updateSelectAllButton()` on rows per page change
- Updated `ExceptionManagement_v2.html`:
  - Added IDs to button elements for dynamic updates

---

## [2.2.0] - 2025-10-24 - BDD Alignment

### Changed - Per BDD Specification
- **Column Order**: Updated to match BDD requirements
  - Removed: Variance (mins) column
  - Removed: Kronos Status column
  - Final order: Employee ID → Schedule In → Schedule Out → Clocked In → Clocked Out → Excused → Comment

- **Required Fields**: Updated field indicators
  - Excused: Required (marked with *)
  - Comment: Required for Late In/Early Out (marked with *)

### Added - Per BDD Specification
- **Selection Banner**: "n records selected" banner
  - Appears when rows are selected
  - Shows count of selected records
  - Includes "Clear Selection" button
  - Smooth slide-down animation
  - Deselect clears toolbar per BDD

- **Persona Editability**: Read-only enforcement
  - Edit icons disabled for Ops/Admin personas
  - Tooltips show read-only status
  - SM/AMH can edit Excused & Comment fields

- **Mandatory Validation**: Enhanced validation per BDD
  - Comment required when submitting Early In / Late Out approvals
  - Excused field required for all submissions
  - Inline error messages until corrected
  - Submission blocked until all required fields valid

### Technical Details
- Updated `table-renderer.js` - Removed variance and Kronos columns
- Updated `column-filter.js` - Removed variance and Kronos filters
- Updated `selection-manager.js` - Added banner management and clearAll()
- Updated `ExceptionManagement_v2.html` - Added selection banner HTML
- Updated `css/styles.css` - Added selection banner styles

---

## [2.1.0] - 2025-10-24

### Added
- **Variance Column**: Added new column showing exact time difference in minutes
  - Displays actual variance without rounding
  - Shows "X mins" format with proper pluralization
  - Styled with variance-late badge for visual clarity
  - Sortable column with click-to-sort functionality

- **Column Filters**: Added inline filtering for all table columns
  - Text filters for: Employee ID, Schedule In/Out, Clocked In/Out, Comment
  - Number filter for: Variance (minimum minutes)
  - Dropdown filters for: Excused Status, Kronos Status
  - Real-time filtering with instant feedback
  - Filter row positioned directly below table headers
  - Clear visual styling with focus states

### Modified
- **Table Structure**: Updated table header to include variance column
- **Table Renderer**: Modified row rendering to display variance data
- **CSS Styles**: Added styles for filter row and filter inputs
- **Module Loading**: Added column-filter.js to script load order

### Technical Details

#### New Files
- js/column-filter.js - Column filtering logic module

#### Modified Files
- ExceptionManagement_v2.html - Added variance column and filter row
- js/table-renderer.js - Added variance column rendering
- css/styles.css - Added filter row and column-filter styles

#### Features
1. **Variance Display**
   - Shows exact minutes late (no rounding)
   - Format: "5 mins" or "1 min"
   - Red badge styling for visibility

2. **Column Filtering**
   - Independent filters for each column
   - Filters work together (AND logic)
   - Real-time updates as you type
   - Resets pagination to page 1
   - Shows filtered count feedback

#### Usage
- Click column headers to sort
- Type in filter boxes to filter data
- Use dropdowns for status filters
- Enter minimum minutes for variance filter
- Filters apply automatically on input

---

## [2.0.0] - 2025-10-24

### Initial Modularization
- Split monolithic 2,783-line file into 20 focused modules
- Extracted CSS to separate stylesheet
- Created 18 JavaScript modules organized by feature
- Added comprehensive documentation
- Preserved original file as backup
