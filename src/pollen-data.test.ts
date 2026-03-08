import { describe, it, expect } from 'vitest';
import { HomeAssistant } from 'custom-card-helpers';
import { getPollenData, getPollenColor } from './pollen-data';

describe('pollen-data', () => {
  describe('getPollenColor', () => {
    it('returns red for high risk', () => {
      expect(getPollenColor(3.0)).toBe('#ff0000');
    });
    it('returns orange for medium risk', () => {
      expect(getPollenColor(2.0)).toBe('#ff9800');
    });
    it('returns yellow for low risk', () => {
      expect(getPollenColor(1.0)).toBe('#ffee00');
    });
    it('returns lime for very low risk', () => {
      expect(getPollenColor(0.5)).toBe('#cddc39');
    });
    it('returns green for no risk', () => {
      expect(getPollenColor(0)).toBe('#4caf50');
    });
  });

  describe('getPollenData', () => {
    it('returns null when entity does not exist', () => {
      const hass = { states: {} } as unknown as HomeAssistant;
      expect(getPollenData(hass, 'sensor.pollenflug_birke_123')).toBeNull();
    });

    it('parses birke correctly', () => {
      const hass = {
        states: {
          'sensor.pollenflug_birke_123': {
            state: '1.0',
            attributes: {
              state_today_desc: 'geringe Belastung',
            },
          },
        },
      } as unknown as HomeAssistant;

      const result = getPollenData(hass, 'sensor.pollenflug_birke_123');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Birke');
      expect(result?.state).toBe(1.0);
      expect(result?.description).toBe('geringe Belastung');
    });

    it('extracts type from complex entity ID', () => {
      const hass = {
        states: {
          'sensor.pollenflug_ambrosia_region_45': {
            state: '3.0',
            attributes: {},
          },
        },
      } as unknown as HomeAssistant;

      const result = getPollenData(hass, 'sensor.pollenflug_ambrosia_region_45');
      expect(result?.typeId).toBe('ambrosia');
      expect(result?.name).toBe('Ambrosia');
    });
  });
});
