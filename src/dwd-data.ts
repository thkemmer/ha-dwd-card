import { HomeAssistant } from 'custom-card-helpers';

export interface Warning {
  headline: string;
  name?: string;
  start: string;
  end: string;
  color: string;
  type: number | string;
  level: number;
  description?: string;
  instruction?: string;
  parameters?: Record<string, string>;
}

export interface DWDData {
  warnings: Warning[];
  warningCount: number;
  lastUpdate?: string;
}

export function getDWDData(hass: HomeAssistant, entityId: string): DWDData {
  const state = hass.states[entityId];
  if (!state || !state.attributes) {
    return { warnings: [], warningCount: 0 };
  }

  const warningCount = state.attributes['warning_count'] || 0;
  const lastUpdate = state.attributes['last_update'];
  const warnings: Warning[] = [];

  for (let i = 1; i <= warningCount; i++) {
    const prefix = `warning_${i}_`;
    const attrs = state.attributes;

    warnings.push({
      headline: attrs[`${prefix}headline`] || '',
      name: attrs[`${prefix}name`],
      start: attrs[`${prefix}start`] || '',
      end: attrs[`${prefix}end`] || '',
      color: attrs[`${prefix}color`] || '#cccccc',
      type: attrs[`${prefix}type`],
      level: attrs[`${prefix}level`],
      description: attrs[`${prefix}description`],
      instruction: attrs[`${prefix}instruction`],
      parameters: attrs[`${prefix}parameters`],
    });
  }

  return {
    warnings,
    warningCount,
    lastUpdate,
  };
}

export function getPrewarningEntityId(
  currentEntity: string,
  configuredPrewarning?: string
): string {
  if (configuredPrewarning) {
    return configuredPrewarning;
  }
  return currentEntity.replace('_aktuelle_warnstufe', '_vorwarnstufe');
}
