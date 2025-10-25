# Quick Start Guide - Modular Version

## Getting Started

### Option 1: Direct Browser Access
1. Navigate to the POC folder
2. Open `ExceptionManagement_v2.html` in your browser
3. The application will load automatically

### Option 2: Local Server (Recommended)
```bash
cd POC
python3 -m http.server 8080
```
Then open: http://localhost:8080/ExceptionManagement_v2.html

## File Structure at a Glance

```
POC/
├── ExceptionManagement_v2.html    ← Start here
├── ExceptionManagement.html       ← Original (backup)
├── css/
│   └── styles.css                 ← All styles
├── js/                            ← All JavaScript modules
│   ├── state.js                   ← App state
│   ├── config.js                  ← Settings
│   ├── auth-manager.js            ← Login/logout
│   ├── persona-manager.js         ← Role switching
│   ├── table-renderer.js          ← Table display
│   ├── validation-manager.js      ← Form validation
│   └── ... (14 more modules)
└── README_MODULAR.md              ← Full documentation
```

## Key Modules Quick Reference

| Module | Purpose | Key Functions |
|--------|---------|---------------|
| `state.js` | App state | `AppState.gridData`, `AppState.selectedRows` |
| `config.js` | Settings | `PersonaConfig`, `AppConfig` |
| `ui-utils.js` | UI helpers | `showLoading()`, `showToast()` |
| `auth-manager.js` | Auth | `login()`, `logout()` |
| `table-renderer.js` | Display | `render()` |
| `validation-manager.js` | Validation | `validateSelection()` |
| `pagination-manager.js` | Pages | `goToPage()`, `update()` |
| `bulk-actions.js` | Bulk ops | `applyExcused()`, `applyComment()` |

## Common Tasks

### Adding a New Feature
1. Create new module: `js/my-feature.js`
2. Define module:
```javascript
const MyFeature = {
    doSomething() {
        // Your code here
    }
};
```
3. Add to HTML: `<script src="js/my-feature.js"></script>`
4. Use it: `MyFeature.doSomething()`

### Modifying Existing Feature
1. Find the module (use table above)
2. Edit the specific file
3. Save and refresh browser
4. Test the change

### Debugging
1. Open browser DevTools (F12)
2. Check Console for errors
3. Module name will be in error message
4. Open that specific file to fix

## Module Dependencies

```
app-init.js
  ├── state.js (required)
  ├── config.js (required)
  ├── data-generator.js
  ├── date-picker.js
  ├── table-renderer.js
  │   ├── field-updater.js
  │   └── stats-manager.js
  ├── pagination-manager.js
  └── stats-manager.js
```

## Testing Checklist

- [ ] Login screen appears
- [ ] Can login successfully
- [ ] Table renders with data
- [ ] Can select rows
- [ ] Can sort columns
- [ ] Can filter data
- [ ] Can paginate
- [ ] Can switch personas
- [ ] Validation works
- [ ] Bulk actions work
- [ ] Can approve records
- [ ] Stats update correctly

## Troubleshooting

### Issue: Blank page
**Solution**: Check browser console for module loading errors

### Issue: Function not defined
**Solution**: Ensure all script tags are in correct order in HTML

### Issue: Styles not loading
**Solution**: Verify `css/styles.css` path is correct

### Issue: Data not showing
**Solution**: Check `data-generator.js` is loaded and `AppState.gridData` has data

## Browser Compatibility

✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+  

## Performance Tips

1. **Development**: Use modular files (current setup)
2. **Production**: Bundle files with webpack/vite
3. **Caching**: Browser caches individual modules
4. **Loading**: All modules load in parallel

## Next Steps

1. ✅ Review `README_MODULAR.md` for detailed documentation
2. ✅ Check `COMPARISON.md` to see improvements
3. ✅ Explore individual modules in `js/` folder
4. ✅ Start customizing for your needs

## Support

- **Documentation**: See `README_MODULAR.md`
- **Comparison**: See `COMPARISON.md`
- **Original**: Reference `ExceptionManagement.html`

## Quick Commands

```bash
# Start local server
python3 -m http.server 8080

# View in browser
open http://localhost:8080/ExceptionManagement_v2.html

# Check file structure
tree -L 2

# Count lines of code
wc -l js/*.js
```

---

**Happy Coding!** 🚀
