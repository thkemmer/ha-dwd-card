# Feature Concept: Detailed Warning View

## Goal
Provide a comprehensive, structured view of all active weather warnings and pre-warnings, serving as a navigation target from the compact dashboard card.

## Implementation Strategy
We will create a dedicated new card component for the detailed view to keep concerns separated and configuration clean.

### Architecture
1.  **Refactoring (Shared Logic):**
    *   Extract the parsing logic (converting flat `warning_X_...` attributes into structured Warning objects) into a shared utility: `src/dwd-data.ts`.
    *   Shared types and interfaces will be defined here.
    *   Both cards will import from this shared module.

2.  **Components:**
    *   `ha-dwd-card` (Existing): Remains the compact summary card.
    *   `ha-dwd-details-card` (New): The comprehensive view.

### Configuration (New Card)
```yaml
type: custom:ha-dwd-details-card
current_warning_entity: ...
prewarning_entity: ...
# Optional: Hide sections if empty?
hide_empty: true
```

## UI/UX Design

The detail view (`ha-dwd-details-card`) will render a vertical stack of **Expanded Warning Cards**, one for each active warning (current + pre-warnings).

### Warning Card Structure
Each warning block will contain:

1.  **Header:**
    *   Full-width colored bar matching the warning severity (Yellow/Orange/Red/Violet).
    *   Large Icon (left).
    *   **Headline:** Bold, large text (e.g., "Amtliche UNWETTERWARNUNG vor ORKANARTIGEN BÖEN").
    *   **Level:** Textual severity (e.g., "Level 3 - Unwetter").

2.  **Timeline:**
    *   Prominent start and end time display.
    *   Visual indicator if currently active vs. future.

3.  **Parameters (Grid View):**
    *   A structured grid displaying the `parameters` attribute (key-value pairs).
    *   *Example:*
        *   Wind Direction: South-West
        *   Gusts: ~110 km/h
        *   Snowfall: > 15cm

4.  **Description:**
    *   Full text body (`warning_X_description`).

5.  **Instructions (Actionable):**
    *   Distinct section (e.g., bordered box) for `warning_X_instruction`.
    *   Essential for safety advice (e.g., "Secure loose objects", "Avoid forests").

6.  **Metadata:**
    *   Region name.
    *   Last update timestamp.

## Navigation Workflow
1.  **Dashboard:** User sees the compact `ha-dwd-card` (summary).
2.  **Interaction:** User taps the card.
3.  **Action:** Navigates to a specific subview (e.g., `/lovelace/dwd-details`).
4.  **Detail View:** This subview contains the `ha-dwd-card` configured with `mode: details`.

## Completed Implementation
1.  **Shared Logic:** `src/dwd-data.ts` now handles parsing of DWD entity attributes for both cards.
2.  **Components:**
    *   `ha-dwd-card`: Preserved as the compact summary card.
    *   `ha-dwd-details-card`: Newly created for the comprehensive view.
3.  **Demo:** Updated to showcase both cards side-by-side with rich mock data.

## Refinement Ideas
*   **Editor:** The new card needs a visual editor (`getConfigElement`) similar to the compact card.
*   **Navigation:** While the cards are separate, we might want to offer an easy way to configure the tap action of the compact card to navigate to the detailed view (though this is mostly a dashboard configuration task).
*   **Styling:** Fine-tune the "Instruction" box to match Home Assistant's native alert styles more closely.

