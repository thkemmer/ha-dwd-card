import { HomeAssistant } from 'custom-card-helpers';

export interface PollenInfo {
  typeId: string;
  name: string;
  state: number;
  description: string;
  color: string;
}

const POLLEN_TYPE_MAP: Record<string, string> = {
  birke: 'Birke',
  graser: 'Gräser',
  roggen: 'Roggen',
  hasel: 'Hasel',
  erle: 'Erle',
  esche: 'Esche',
  beifuss: 'Beifuß',
  ambrosia: 'Ambrosia',
};

/**
 * Maps the numeric pollen risk index (0-3) to a hex color string
 * following the DWD risk scale.
 */
export const getPollenColor = (risk: number): string => {
  if (risk >= 3) return '#ff0000'; // High (Red)
  if (risk >= 2) return '#ff9800'; // Medium (Orange)
  if (risk >= 1) return '#ffee00'; // Low (Yellow)
  if (risk > 0) return '#cddc39'; // Very Low (Lime)
  return '#4caf50'; // None (Green) - though we might hide 0s
};

/**
 * Extracts pollen data from a Home Assistant sensor entity.
 * Entity ID format: sensor.pollenflug_<type>_<region>
 */
export const getPollenData = (
  hass: HomeAssistant,
  entityId: string
): PollenInfo | null => {
  const stateObj = hass.states[entityId];
  if (!stateObj) return null;

  const stateValue = parseFloat(stateObj.state);
  if (isNaN(stateValue)) return null;

  // Extract type from entity_id: sensor.pollenflug_birke_123 -> birke
  const parts = entityId.split('.');
  const nameParts = (parts[1] && parts[1].split('_')) || [];
  const typeId = nameParts[1] || 'unknown';
  
  const name = POLLEN_TYPE_MAP[typeId] || typeId.charAt(0).toUpperCase() + typeId.slice(1);
  const description = stateObj.attributes.state_today_desc || 'Keine Daten';

  return {
    typeId,
    name,
    state: stateValue,
    description,
    color: getPollenColor(stateValue),
  };
};
