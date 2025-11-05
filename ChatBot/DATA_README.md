# Sample Data Documentation

## Overview
The chatbot now loads data from `sample-data.json`, which contains 25 comprehensive records designed to test all filter scenarios.

## Data Structure

### File: `sample-data.json`

```json
{
  "user_name": "John Doe",
  "total_late_in_count": 25,
  "station_count": 3,
  "date_range": "Nov 1-5, 2024",
  "stations": [...],
  "lines_of_service": [...],
  "records": [...]
}
```

## Record Distribution

### By Station (25 total)
- **Las Vegas**: 10 records (EMP001-EMP010)
- **Houston**: 8 records (EMP011-EMP018)
- **Atlanta**: 7 records (EMP019-EMP025)

### By Line of Service (25 total)
- **Wheelchair**: 12 records
- **Ambulatory**: 8 records
- **Stretcher**: 5 records

### By Date (25 total)
- **2024-11-01**: 3 records
- **2024-11-02**: 3 records
- **2024-11-03**: 5 records
- **2024-11-04**: 9 records
- **2024-11-05**: 5 records

## Test Scenarios

### 1. Station Filters
```
"show las vegas" → 10 records
"houston records" → 8 records
"filter by atlanta" → 7 records
```

### 2. Line of Service Filters
```
"wheelchair records" → 12 records
"show ambulatory" → 8 records
"stretcher service" → 5 records
```

### 3. Date Filters
```
"show today's records" → 5 records (Nov 5)
"records from 2024-11-04" → 9 records
```

### 4. Employee Search
```
"find Alice Johnson" → 1 record (EMP001)
"search EMP015" → 1 record (Olivia Patel)
"find Maria" → 1 record (EMP013)
```

### 5. Combined Filters
```
"las vegas wheelchair" → 5 records
"houston ambulatory" → 2 records
"atlanta stretcher" → 1 record
```

## Employee Details

### Las Vegas (10 employees)
1. **EMP001** - Alice Johnson (Wheelchair, Nov 4, 45min late)
2. **EMP002** - Bob Smith (Ambulatory, Nov 4, 45min late)
3. **EMP003** - Carol Martinez (Wheelchair, Nov 5, 30min late)
4. **EMP004** - David Lee (Stretcher, Nov 3, 50min late)
5. **EMP005** - Emma Wilson (Wheelchair, Nov 5, 35min late)
6. **EMP006** - Frank Brown (Ambulatory, Nov 2, 40min late)
7. **EMP007** - Grace Taylor (Wheelchair, Nov 4, 25min late)
8. **EMP008** - Henry Anderson (Stretcher, Nov 1, 50min late)
9. **EMP009** - Iris Chen (Wheelchair, Nov 5, 30min late)
10. **EMP010** - Jack Robinson (Ambulatory, Nov 3, 35min late)

### Houston (8 employees)
11. **EMP011** - Karen White (Wheelchair, Nov 4, 55min late)
12. **EMP012** - Leo Garcia (Ambulatory, Nov 5, 40min late)
13. **EMP013** - Maria Rodriguez (Wheelchair, Nov 3, 45min late)
14. **EMP014** - Nathan Kim (Stretcher, Nov 4, 45min late)
15. **EMP015** - Olivia Patel (Wheelchair, Nov 2, 40min late)
16. **EMP016** - Peter Thompson (Ambulatory, Nov 5, 30min late)
17. **EMP017** - Quinn Davis (Wheelchair, Nov 1, 50min late)
18. **EMP018** - Rachel Green (Stretcher, Nov 4, 35min late)

### Atlanta (7 employees)
19. **EMP019** - Samuel Jackson (Wheelchair, Nov 5, 50min late)
20. **EMP020** - Tina Turner (Ambulatory, Nov 3, 45min late)
21. **EMP021** - Uma Thurman (Wheelchair, Nov 4, 25min late)
22. **EMP022** - Victor Hugo (Stretcher, Nov 2, 55min late)
23. **EMP023** - Wendy Williams (Ambulatory, Nov 5, 30min late)
24. **EMP024** - Xavier Woods (Wheelchair, Nov 1, 40min late)
25. **EMP025** - Yolanda Adams (Ambulatory, Nov 4, 35min late)

## Late Time Distribution
- **20-30 minutes**: 7 records
- **30-40 minutes**: 8 records
- **40-50 minutes**: 6 records
- **50-60 minutes**: 4 records

## How It Works

### Loading Process
1. On page load, `loadSampleData()` is called
2. Fetches `sample-data.json` via HTTP
3. Populates `SAMPLE_DATA` and `sessionData`
4. Falls back to minimal data if file not found
5. Console logs success/failure

### Fallback Data
If JSON file fails to load, the app uses 4 minimal records as fallback to ensure the chatbot still functions.

## Testing Commands

### Quick Tests
```
User: "how many records"
Expected: Total: 25, Processed: 0, Pending: 25

User: "show las vegas"
Expected: 10 records filtered

User: "wheelchair records"
Expected: 12 records filtered

User: "find Alice Johnson"
Expected: 1 record (EMP001)

User: "show today's records"
Expected: 5 records (Nov 5)
```

## Modifying Data

To add/modify records:
1. Edit `sample-data.json`
2. Maintain the same structure
3. Update counts in metadata
4. Refresh the page to reload

## Data Validation

Each record must have:
- `emp_id`: Unique employee ID
- `emp_name`: Full name
- `date`: YYYY-MM-DD format
- `station_name`: Las Vegas, Houston, or Atlanta
- `line_of_service`: Wheelchair, Ambulatory, or Stretcher
- `sched_in`: Scheduled time (HH:MM AM/PM)
- `actual_in`: Actual time (HH:MM AM/PM)
- `time_diff`: Minutes late (string)

## Benefits

✅ **Realistic data** - 25 diverse records  
✅ **Comprehensive coverage** - All filter scenarios  
✅ **Easy to modify** - JSON file format  
✅ **Fallback support** - Works even if file missing  
✅ **Testable** - Clear test scenarios  
✅ **Scalable** - Easy to add more records  
