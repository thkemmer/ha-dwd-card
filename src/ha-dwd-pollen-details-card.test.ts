import { describe, it, expect, beforeEach } from 'vitest';
import { html, fixture } from '@open-wc/testing-helpers';
import { HomeAssistant } from 'custom-card-helpers';
import './ha-dwd-pollen-details-card';
import { HaDwdPollenDetailsCard } from './ha-dwd-pollen-details-card';

describe('ha-dwd-pollen-details-card', () => {
  let hass: HomeAssistant;

  beforeEach(() => {
    hass = {
      states: {
        'sensor.pollenflug_birke_123': {
          state: '3.0',
          attributes: {
            state_today_desc: 'hohe Belastung',
            state_tomorrow: '2.0',
            state_tomorrow_desc: 'mittlere Belastung',
            state_in_2_days: '1.0',
            state_in_2_days_desc: 'geringe Belastung',
            friendly_name: 'Pollenflug Birke',
          },
        },
      },
    } as unknown as HomeAssistant;
  });

  it('renders correctly with data', async () => {
    const el = (await fixture(html`
      <ha-dwd-pollen-details-card
        .hass=${hass}
        .config=${{
          type: 'custom:ha-dwd-pollen-details-card',
          entities: ['sensor.pollenflug_birke_123'],
          title: 'Forecast Test',
        }}
      ></ha-dwd-pollen-details-card>
    `)) as HaDwdPollenDetailsCard;

    const content = el.shadowRoot!.querySelector('.card-content');
    expect(content).not.toBeNull();

    const title = el.shadowRoot!.querySelector('.pollen-title');
    expect(title?.textContent).toBe('Birke');

    const forecastDays = el.shadowRoot!.querySelectorAll('.forecast-day');
    expect(forecastDays.length).toBe(3);

    // Today
    expect(forecastDays[0].querySelector('.day-desc')?.textContent?.trim()).toBe('hohe Belastung');
    expect(forecastDays[0].querySelector('ha-icon')?.getAttribute('style')).toContain('color: #ff0000');

    // Tomorrow
    expect(forecastDays[1].querySelector('.day-desc')?.textContent?.trim()).toBe('mittlere Belastung');
    expect(forecastDays[1].querySelector('ha-icon')?.getAttribute('style')).toContain('color: #ff9800');

    // In 2 Days
    expect(forecastDays[2].querySelector('.day-desc')?.textContent?.trim()).toBe('geringe Belastung');
    expect(forecastDays[2].querySelector('ha-icon')?.getAttribute('style')).toContain('color: #ffee00');
  });

  it('filters out empty entities when hide_empty is true', async () => {
     hass.states['sensor.pollenflug_graser_123'] = {
        state: '0.0',
        attributes: { state_today_desc: 'keine Belastung' }
     } as any;

     const el = (await fixture(html`
      <ha-dwd-pollen-details-card
        .hass=${hass}
        .config=${{
          type: 'custom:ha-dwd-pollen-details-card',
          entities: ['sensor.pollenflug_birke_123', 'sensor.pollenflug_graser_123'],
          hide_empty: true,
        }}
      ></ha-dwd-pollen-details-card>
    `)) as HaDwdPollenDetailsCard;

    const rows = el.shadowRoot!.querySelectorAll('.pollen-row');
    expect(rows.length).toBe(1); // Only Birke
  });
});
