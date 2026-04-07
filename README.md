# DWD Weather Warnings Card

![CI Status](https://github.com/thkemmer/ha-dwd-card/actions/workflows/ci.yml/badge.svg)
![GitHub Release](https://img.shields.io/github/v/release/thkemmer/ha-dwd-card)
![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/thkemmer/a8884faae96966dc2e18557437ce8ab3/raw/25ce2a08d702a69822250500adf11f9324f40b40/coverage.json)
![License](https://img.shields.io/github/license/thkemmer/ha-dwd-card)

A custom Home Assistant lovelace card to display Deutscher Wetterdienst (DWD) weather warnings with a modern, clean design. This project provides two different cards to suit your needs: a compact overview card and a detailed information card.

| **Weather Card** | **Weather Details** | **Pollen Card** | **Pollen Details** |
| :---: | :---: | :---: | :---: |
| ![Standard Card](assets/ha-dwd-card_preview.png) | ![Details Card](assets/ha-dwd-details-card_preview.png) | ![Pollen Card](assets/preview-card.png) | *(Preview coming soon)* |
| *Compact weather overview* | *Weather instructions* | *Compact pollen risks* | *3-day pollen forecast* |


You can install the releases via HACS directly in Home Assistant:
[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=thkemmer&repository=ha-dwd-card&category=plugin)

## Features

- **Dynamic Icons:** Automatically selects the correct icon based on the warning type (Ice, Wind, Storm, etc.).
- **Official Colors:** Uses the severity colors defined by the DWD.
- **Pre-Warnings:** Support for separate pre-warning entities.
- **Visual Editor:** Full support for the Home Assistant dashboard editor.
- **Modern UI:** Clean, responsive design that integrates well with Home Assistant.
- **Action Support:** Support for standard tap, hold, and double-tap actions (Standard Card).

## Prerequisites

This card requires the official [Deutscher Wetterdienst (DWD) Weather Warnings](https://www.home-assistant.io/integrations/dwd_weather_warnings/) integration to be installed and configured in your Home Assistant instance.

For the **Pollen Card**, the [DWD Pollenflug Integration](https://github.com/mampfes/hacs_dwd_pollenflug) by @mampfes is required.

## Installation

### HACS (Recommended)

Click the button above or:

1.  Make sure [HACS](https://hacs.xyz/) is installed.
2.  Go to HACS -> Frontend -> Custom Repositories.
3.  Add this repository URL and select "Lovelace" as the category.
4.  Click "Install".
5.  Reload your resources.

### Manual

1.  Download `ha-dwd-card.js` from the latest release.
2.  Upload it to your Home Assistant `www` folder.
3.  Add it to your resources in Dashboard -> `...` -> Edit Dashboard -> `...` -> Manage Resources.
    - URL: `/local/ha-dwd-card.js`
    - Type: JavaScript Module

## Configuration

Both cards provide a visual editor for easy configuration.

### Visual Editor

| **Standard Card Editor** | **Details Card Editor** |
| :---: | :---: |
| ![Standard Card Editor](assets/ha-dwd-card_editor.png) | ![Details Card Editor](assets/ha-dwd-details-card_editor.png) |

### Standard Card (`custom:ha-dwd-card`)

Ideal for overview dashboards where space is limited.

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `current_warning_entity` | string | **Required** | The entity ID of the current warning level sensor. |
| `prewarning_entity` | string | Optional | The entity ID of the pre-warning level sensor. Auto-derived if omitted. |
| `show_current_warnings_headline` | boolean | `false` | Show section headlines (e.g., "Aktuelle Warnungen"). |
| `compact_warning_headline` | boolean | `false` | Use shorter warning name instead of verbose headline. |
| `show_last_update_footer` | boolean | `true` | Show the last update timestamp. |
| `hide_empty` | boolean | `false` | Hide the card if no warnings are active. |
| `tap_action` | ActionConfig | `more-info` | Action to perform on tap. |
| `hold_action` | ActionConfig | - | Action to perform on hold. |
| `double_tap_action` | ActionConfig | - | Action to perform on double tap. |

### Details Card (`custom:ha-dwd-details-card`)

Ideal for dedicated weather dashboards or as a "more-info" card.

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `current_warning_entity` | string | **Required** | The entity ID of the current warning level sensor. |
| `prewarning_entity` | string | Optional | The entity ID of the pre-warning level sensor. |
| `hide_empty` | boolean | `false` | Hide the card if no warnings are active. |
| `show_dwd_attribution` | boolean | `true` | Show the official DWD attribution text. |

## YAML Examples

### Standard Card
```yaml
type: custom:ha-dwd-card
current_warning_entity: sensor.dwd_weather_warnings_berlin_current_warning_level
show_current_warnings_headline: true
compact_warning_headline: true
```

### Details Card
```yaml
type: custom:ha-dwd-details-card
current_warning_entity: sensor.dwd_weather_warnings_berlin_current_warning_level
show_dwd_attribution: true
```

## Pollen Forecast

A dedicated section for displaying pollen exposure levels.

### Pollen Card (`custom:ha-dwd-pollen-card`)

A compact card that shows today's pollen exposure risks. It only displays active risks (levels above 0) and color-codes both the icons and the card header to match the DWD risk level.

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `entities` | array | **Required** | List of sensor entity IDs from the DWD Pollen integration. |
| `title` | string | `Pollenflug` | The title displayed in the card header. |
| `show_title` | boolean | `true` | Show or hide the card header. |
| `hide_empty` | boolean | `false` | Hide the card if no pollen exposure is currently active. |
| `sort_by_level` | boolean | `true` | Automatically sort the entries by exposure intensity (descending). |
| `tap_action` | ActionConfig | `more-info` | Action to perform on tap. |
| `hold_action` | ActionConfig | - | Action to perform on hold. |
| `double_tap_action` | ActionConfig | - | Action to perform on double tap. |

### Pollen Details Card (`custom:ha-dwd-pollen-details-card`)

A comprehensive 3-day forecast for pollen exposure. Ideal for a dedicated "Allergy" dashboard.

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `entities` | array | **Required** | List of sensor entity IDs from the DWD Pollen integration. |
| `title` | string | `Pollenflug Vorhersage` | The title displayed in the card header. |
| `show_title` | boolean | `true` | Show or hide the card header. |
| `hide_empty` | boolean | `false` | Hide entries with no current exposure. |
| `sort_by_level` | boolean | `true` | Automatically sort by current intensity. |

### YAML Examples

#### Pollen Compact Card
```yaml
type: custom:ha-dwd-pollen-card
title: "Pollenflug Heute"
hide_empty: true
sort_by_level: true
entities:
  - sensor.pollenflug_birke_123
  - sensor.pollenflug_graser_123
```

#### Pollen Details Card
```yaml
type: custom:ha-dwd-pollen-details-card
title: "3-Tages-Vorhersage"
entities:
  - sensor.pollenflug_birke_123
  - sensor.pollenflug_graser_123
  - sensor.pollenflug_hasel_123
```

## Testing

This project uses [Vitest](https://vitest.dev/) for unit testing.

```bash
npm run test
```

## Local Preview

1.  Build the project: `npm run build`
2.  Start the local server: `npm start`
3.  Open [http://localhost:8000/demo/](http://localhost:8000/demo/) in your browser.

## Development

1.  Clone this repository and run `npm install`.
2.  **Production build:** `npm run build`
3.  **Development build:** `npm run build:dev`
4.  **Watch mode:** `npm run watch`