# DWD Weather Warnings Card

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=thkemmer&repository=ha-dwd-card&category=plugin)

A custom Home Assistant card to display Deutscher Wetterdienst (DWD) weather warnings with a modern, clean design.

![Screenshot](assets/preview-card.png)

## Features

- **Dynamic Icons:** Automatically selects the correct icon based on the warning type (e.g., Ice, Wind, Storm).
- **Official Colors:** Uses the official DWD severity colors.
- **Advance Warnings:** Separately lists advance warnings.
- **Responsive Design:** Looks great on desktop and mobile.
- **Visual Editor:** Fully supported!

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

### YAML

```yaml
type: custom:ha-dwd-card
current_warning_entity: sensor.dwd_weather_warnings_berlin_current_warning_level
# Optional: explicitly define the pre-warning entity
# prewarning_entity: sensor.dwd_weather_warnings_berlin_prewarning_level
# Optional: Show title for current warnings (default: false)
show_current_warning_title: true
# Optional: Use shorter warning name instead of headline (default: false)
compact_warning_headline: true
```

**Note:** If `prewarning_entity` is not provided, the card automatically attempts to find the corresponding `_prewarning_level` entity based on the `current_warning_entity` you provide. Ensure your DWD integration naming convention is standard.

## Development

1.  Clone this repository.
2.  Run `npm install`.
3.  Run `npm run watch` to start the development build.
4.  The built file will be in `dist/ha-dwd-card.js`.
