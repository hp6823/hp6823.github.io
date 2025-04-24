# hp6823.github.

## Task 2: Data Preprocessing

### Overview
The original dataset contained raw towed vehicle records, including attributes such as vehicle make, color, tow date, and location. To optimize performance and ensure meaningful visualizations, preprocessing was performed to generate smaller, visualization-ready files.

### Steps Taken

- **Aggregation and Filtering**:
  - Removed entries with `Count = 0` to eliminate irrelevant rows.
  - Grouped by `Make`, `Color`, and `Tow Date` to calculate total tows (`Count`) per attribute.

- **Date Transformation**:
  - Created a new column `TowDateOnly` (date without timestamp) to support time-based filtering.
  - Extracted `Weekday` from `Tow Date` using Python (`pandas`) for use in interactive bar charts.

- **Color Code Normalization**:
  - Ensured color values (e.g., `"BLK"`, `"GRY"`) were clean, stripped of whitespace, and consistent in case.
  - Used friendly labels in dropdown menus while keeping the data values concise.

- **Spatial File Preparation**:
  - Filtered and cleaned the GeoJSON shape file for Chicago community areas (`areas_cleaned.geojson`)
  - Merged location coordinates from raw tows into a CSV (`IL_lat_lon.csv`) for use in spatial dot plots

### Outputs
Preprocessed files used in the system:
- `make_and_color_filtered.csv`
- `towed_vehicles_with_weekday.csv`
- `IL_lat_lon.csv`
- `chicago_comm_areas_cleaned.geojson`
