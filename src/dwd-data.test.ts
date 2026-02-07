import { describe, it, expect } from 'vitest';
import { HomeAssistant } from 'custom-card-helpers';
import { getDWDData, getPrewarningEntityId } from './dwd-data';

describe('dwd-data', () => {
  describe('getDWDData', () => {
    it('returns empty data when entity does not exist', () => {
      const hass = { states: {} } as unknown as HomeAssistant;
      const result = getDWDData(hass, 'non_existent');
      expect(result.warningCount).toBe(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('returns empty data when state has no attributes', () => {
      const hass = {
        states: {
          'sensor.dwd': { state: 'ok' },
        },
      } as unknown as HomeAssistant;
      const result = getDWDData(hass, 'sensor.dwd');
      expect(result.warningCount).toBe(0);
    });

    it('parses warnings correctly from attributes', () => {
      const hass = {
        states: {
          'sensor.dwd': {
            attributes: {
              warning_count: 2,
              last_update: '2026-02-07T12:00:00Z',
              warning_1_headline: 'Warning 1',
              warning_1_level: 2,
              warning_1_color: '#ffee00',
              warning_2_headline: 'Warning 2',
              warning_2_level: 3,
            },
          },
        },
      } as unknown as HomeAssistant;

      const result = getDWDData(hass, 'sensor.dwd');
      expect(result.warningCount).toBe(2);
      expect(result.lastUpdate).toBe('2026-02-07T12:00:00Z');
      expect(result.warnings[0].headline).toBe('Warning 1');
      expect(result.warnings[0].level).toBe(2);
      expect(result.warnings[0].color).toBe('#ffee00');
      expect(result.warnings[1].headline).toBe('Warning 2');
      expect(result.warnings[1].color).toBe('#cccccc'); // Fallback
    });

    it('handles zero warnings', () => {
      const hass = {
        states: {
          'sensor.dwd': {
            attributes: {
              warning_count: 0,
            },
          },
        },
      } as unknown as HomeAssistant;

      const result = getDWDData(hass, 'sensor.dwd');
      expect(result.warningCount).toBe(0);
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('getPrewarningEntityId', () => {
    it('returns configured prewarning entity if provided', () => {
      expect(getPrewarningEntityId('current', 'pre')).toBe('pre');
    });

    it('derives prewarning entity ID by convention', () => {
      expect(
        getPrewarningEntityId('sensor.dwd_berlin_aktuelle_warnstufe')
      ).toBe('sensor.dwd_berlin_vorwarnstufe');
    });

    it('returns unchanged ID if convention does not match', () => {
      // This is a bit of a weird case, but that's how it's implemented
      expect(getPrewarningEntityId('sensor.dwd_berlin')).toBe('sensor.dwd_berlin');
    });
  });
});
