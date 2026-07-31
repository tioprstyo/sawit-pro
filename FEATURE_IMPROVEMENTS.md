# Feature Improvements Plan

## Overview
Implementation plan for 5 major UI/UX improvements to the Fleet Manager application.

---

## 1. ✅ Pagination for Table Lists
**Status:** TODO
**Files to modify:**
- `src/components/molecules/Table.tsx` - Add pagination controls
- `src/components/organisms/DriverList.tsx` - Implement pagination
- `src/components/organisms/VehicleList.tsx` - Implement pagination
- `src/components/organisms/MillList.tsx` - Implement pagination
- `src/components/organisms/TripList.tsx` - Implement pagination

**Requirements:**
- Add pagination state (currentPage, itemsPerPage)
- Show 10-25 items per page (configurable)
- Previous/Next buttons
- Page indicator (e.g., "1 of 5")
- Jump to page input

---

## 2. ✅ Fix Mills and Trips Data Display
**Status:** TODO
**Files to check:**
- `src/components/organisms/MillList.tsx` - Debug why data not showing
- `src/components/organisms/TripList.tsx` - Debug why data not showing
- `src/store/millSlice.ts` - Check Redux state
- `src/store/tripSlice.ts` - Check Redux state
- `src/api/` - Check API endpoints

**Likely Issues:**
- API endpoints might not be implemented
- Redux actions not dispatching properly
- Component not fetching data on mount

---

## 3. ✅ Header/Profile UI Improvements
**Status:** TODO
**Changes:**
- Remove notification icon (🔔 and badge) from header
- Move logout button to profile menu in header
- Create dropdown menu for profile (Settings, Logout)
- Keep profile avatar visible

**Files to modify:**
- `src/App.tsx` - Update header section
- `src/App.module.css` - Remove notification styles
- Create new `ProfileMenu.tsx` component

---

## 4. ✅ Sticky Sidebar
**Status:** TODO
**Changes:**
- Sidebar stays fixed when content scrolls
- Main content area scrollable independently
- Prevent sidebar from scrolling with page

**Files to modify:**
- `src/App.module.css` - Update sidebar positioning
- `src/App.tsx` - Adjust layout structure if needed

---

## 5. ✅ Search & Filter Per Page
**Status:** TODO
**Changes:**
- Remove global searchbar from header
- Add search/filter to each page
- Add filter buttons/dropdowns per table
- Filter by status, date range, etc.

**Files to create/modify:**
- Create `SearchBar.tsx` in molecules
- Create `FilterBar.tsx` in molecules
- Modify each list component to include local search/filter
- Files: DriverList, VehicleList, MillList, TripList

**Features per list:**
- **Drivers:** Filter by status (available/sick/on_trip/leave), search by name
- **Vehicles:** Filter by status/type, search by plate number
- **Mills:** Search by name/location
- **Trips:** Filter by status/date, search by trip ID

---

## Implementation Order
1. Fix Mills/Trips data (highest priority - data not showing)
2. Sticky Sidebar (quick CSS fix)
3. Header/Profile changes
4. Remove global search, add per-page search
5. Implement pagination

---

## Current Status
- Database: ✅ Working (200 drivers, 200 vehicles, 200 mills, 200 trips)
- Mills/Trips display: ❌ Not showing (need investigation)
- Pagination: ❌ Not implemented
- Header: ⚠️ Has features to remove/modify
- Sidebar: ⚠️ Not sticky
- Search/Filter: ⚠️ Global search, need per-page filters

