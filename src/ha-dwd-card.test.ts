import { describe, it, expect, beforeEach } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import { HaDwdCard } from './ha-dwd-card';
import './ha-dwd-card'; // Register the component

// Mock Home Assistant object
const createMockHass = (attributes = {}) =>
  ({
    states: {
      'sensor.dwd_current': {
        attributes: {
          warning_count: 0,
          ...attributes,
        },
        state: 'ok',
      },
      'sensor.dwd_prewarning': {
        attributes: {
          warning_count: 0,
        },
        state: 'ok',
      },
    },
  }) as unknown as any;

const mockConfig = {
  type: 'custom:ha-dwd-card',
  current_warning_entity: 'sensor.dwd_current',
  prewarning_entity: 'sensor.dwd_prewarning',
  show_current_warnings_headline: true,
  show_last_update_footer: true,
};

describe('HaDwdCard', () => {
  let element: HaDwdCard;

  beforeEach(async () => {
    element = await fixture(html`<ha-dwd-card></ha-dwd-card>`);
    element.setConfig(mockConfig);
  });

  it('renders without crashing', () => {
    expect(element).toBeInstanceOf(HTMLElement);
  });

  describe('getCardSize', () => {
    it('returns 2 when no warnings exist (header + footer + empty state)', async () => {
      element.hass = createMockHass({ warning_count: 0 });
      await element.updateComplete;

      // 2 is the fallback for "no warnings"
      expect(element.getCardSize()).toBe(2);
    });

    it('returns 0 when no warnings exist and hide_empty is true', async () => {
      element.setConfig({ ...mockConfig, hide_empty: true });
      element.hass = createMockHass({ warning_count: 0 });
      await element.updateComplete;

      expect(element.getCardSize()).toBe(0);
    });

    it('calculates size for 1 active warning', async () => {
      element.hass = createMockHass({ warning_count: 1 });
      await element.updateComplete;

      // Base: 10px (padding)
      // Warning: 45px
      // Footer: 19px
      // Header: 30px
      // Total: 10 + 45 + 19 + 30 = 104
      // 104 / 50 = 2.08 -> ceil = 3
      expect(element.getCardSize()).toBe(3);
    });

    it('calculates size for 5 active warnings', async () => {
      element.hass = createMockHass({ warning_count: 5 });
      await element.updateComplete;

      // Base: 10px
      // Warnings: 5 * 45 = 225
      // Footer: 19px
      // Header: 30px
      // Total: 10 + 225 + 19 + 30 = 284
      // 284 / 50 = 5.68 -> ceil = 6
      expect(element.getCardSize()).toBe(6);
    });

    it('handles missing configuration gracefully', async () => {
      const el = await fixture<HaDwdCard>(html`<ha-dwd-card></ha-dwd-card>`);
      expect(el.getCardSize()).toBe(1);
    });
  });
});
