# DWD Weather Warnings Dashboard Plan

## 1. Goal
Create a superior Home Assistant dashboard configuration for displaying "Deutscher Wetterdienst (DWD) Weather Warnings" compared to the default view.

## 2. Integration Overview
The DWD integration typically provides sensors per location:
- `sensor.dwd_weather_warnings_current_warning_level`
- `sensor.dwd_weather_warnings_advance_warning_level`

**Key Attributes:**
- `warning_count`: Number of active warnings.
- `warning_X_headline`: Headline of the warning.
- `warning_X_description`: Detailed text.
- `warning_X_start` / `warning_X_end`: Validity period.
- `warning_X_level`: Severity (0-4).
- `warning_X_color`: Color code (e.g., `#rrggbb`).

## 3. Proposed Solution
The standard Entities card is static and cannot easily loop through a dynamic number of warnings (e.g., `warning_1`, `warning_2`, etc.).

**Recommendation: Markdown Card**
Using a Markdown card allows us to use Jinja2 templates to:
1.  Check if there are warnings (`warning_count > 0`).
2.  Loop through all active warnings dynamically.
3.  Style the output using HTML/CSS within the Markdown to match the warning colors (Yellow, Orange, Red, etc.).
4.  Show "No active warnings" cleanly when safe.

## 4. How to use
1.  **Find your entities:** Go to Home Assistant -> Settings -> Devices & Services -> DWD Weather Warnings. Look for sensors ending in `_current_warning_level` and `_advance_warning_level`.
2.  **Update YAML:** Open `dwd_card_config.yaml` and replace the placeholder entity IDs at the top:
    ```yaml
    {% set current_sensor = 'sensor.your_location_current_warning_level' %}
    {% set advance_sensor = 'sensor.your_location_advance_warning_level' %}
    ```
3.  **Add to Dashboard:** Create a new "Manual" card in your dashboard and paste the entire content of `dwd_card_config.yaml`.

## 5. Features
- **Dynamic Icons:** Based on warning type IDs (precise mapping).
- **Auto-Styling:** Colors match the official DWD severity levels.
- **Clean Layout:** Uses a robust table-in-div approach to survive Home Assistant's Markdown sanitization.
- **Smart Empty State:** Shows a clean success message when no warnings are active.
- **Last Update:** Shows exactly when the data was last fetched from DWD.
