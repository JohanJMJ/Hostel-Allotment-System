# Hostel Room Allocation System - Max Heap Implementation

## Overview
This is a **Max Heap Priority Queue** based Hostel Room Allocation System that efficiently assigns students to available hostel rooms based on their priority scores.

## Key Features
✅ **Max Heap Implementation** - Higher priority scores get higher priority
✅ **Simplified Room Structure** - No room features (AC, WiFi, etc.)
✅ **Realistic Student Data** - Proper names, GPAs, and student IDs
✅ **Fixed Tab Navigation** - Working student/admin tab buttons
✅ **Real-time Allocation** - Live progress tracking
✅ **Clean Modern UI** - Responsive design

## Priority Scoring System (Max Heap)

**Formula:** `(Base Priority × Special Multiplier) + GPA Bonus + Time Bonus`

**Special Priority Multipliers:**
- Medical: 2.0 (Highest)
- Academic Excellence: 1.8
- Sports: 1.5
- Financial Aid: 1.3
- None: 1.0 (Lowest)

**Higher score = Higher priority** (opposite of min-heap)

## Files Included

### Web Application:
- `index.html` - Main application interface
- `app.js` - Max heap JavaScript implementation
- `style.css` - Modern responsive styling

### C++ Console Application:
- `test.cpp` - C++ implementation with max heap

## Sample Students (Pre-loaded)

| Name | Student ID | GPA | Priority | Score |
|------|------------|-----|----------|-------|
| Alice Green | CS2024001 | 4.0 | Academic Excellence | ~2200 |
| Carlos Rodriguez | CS2024004 | 2.9 | Medical | ~2390 |
| Maya Patel | CS2024003 | 3.8 | Sports | ~1880 |
| Emma Davis | CS2024007 | 3.7 | Academic Excellence | ~2170 |
| Bob Johnson | CS2024002 | 3.6 | None | ~1360 |

## Sample Rooms (Simplified)

| Room ID | Type | Capacity | Floor | Building |
|---------|------|----------|-------|----------|
| A101 | Single | 1 | 1 | A |
| A102 | Double | 2 | 1 | A |
| B102 | Triple | 3 | 1 | B |
| C201 | Double | 2 | 2 | C |

## How to Run

### Web Application:
1. Open `index.html` in a web browser
2. Use the **Student Application** tab to add new students
3. Use the **Admin Dashboard** tab to run allocation algorithm
4. Click "Run Allocation Algorithm" to see live allocation process

### C++ Application:
1. Compile: `g++ -o hostel test.cpp`
2. Run: `./hostel`
3. Follow the menu options

## What's Been Fixed

### ❌ Issues Fixed:
- **Tab Navigation**: Student/Admin buttons now work properly
- **Layout Issues**: Removed room features, simplified structure
- **Heap Type**: Changed from Min-Heap to Max-Heap
- **Priority Logic**: Higher scores = higher priority
- **Sample Data**: Realistic student names and GPAs
- **CSS Display**: Fixed tab content visibility issues

### ✅ New Features:
- Real-time heap visualization
- Progress bar during allocation
- Improved responsive design
- Better error handling
- Console logging for debugging

## Usage Instructions

1. **Submit Applications**: Use the student form to add applications
2. **View Queue**: See all applications sorted by priority (highest first)
3. **Run Allocation**: Watch the algorithm process students in real-time
4. **View Results**: See allocation success rate and room utilization

## Technical Details

- **Data Structure**: Max Heap (Priority Queue)
- **Time Complexity**: O(log n) for insertion, O(log n) for extraction
- **Space Complexity**: O(n) for storing students
- **Algorithm**: Greedy allocation with preference matching

---

**Note**: This system uses a Max Heap where higher priority scores indicate higher priority for room allocation. Students with medical conditions, academic excellence, or sports quotas receive priority multipliers that increase their scores.