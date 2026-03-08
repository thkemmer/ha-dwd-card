import { describe, it, expect, beforeEach } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import { HomeAssistant } from 'custom-card-helpers';
import { HaDwdPollenCard } from './ha-dwd-pollen-card';
import './ha-dwd-pollen-card';

// Mock Home Assistant object
const createMockHass = (states: any) => ({
  states,
}) as unknown as HomeAssistant;

const mockConfig = {
  type: 'custom:ha-dwd-pollen-card',
  entities: ['sensor.pollen_birke', 'sensor.pollen_graser'],
  title: 'Pollenflug Vorhersage',
};

describe('HaDwdPollenCard', () => {
  let element: HaDwdPollenCard;

  beforeEach(async () => {
    element = await fixture(html`<ha-dwd-pollen-card></ha-dwd-pollen-card>`);
    element.setConfig(mockConfig);
  });

  it('renders correctly with active pollen and filters out state 0', async () => {
    const hass = {
      'sensor.pollen_birke': {
        state: '2.0',
        attributes: { state_today_desc: 'mittlere Belastung' },
      },
      'sensor.pollen_graser': {
        state: '0.0',
        attributes: { state_today_desc: 'keine Belastung' },
      },
    };
    element.hass = createMockHass(hass);
    await element.updateComplete;

    const rows = element.shadowRoot?.querySelectorAll('.pollen-row');
    // Only Birke should be visible because state > 0
    expect(rows?.length).toBe(1);
    
    const name = element.shadowRoot?.querySelector('.pollen-name');
    expect(name?.textContent).to.equal('Birke');
    
    const desc = element.shadowRoot?.querySelector('.pollen-desc');
    expect(desc?.textContent).to.equal('mittlere Belastung');
  });

  it('shows "Keine Belastung" when no pollen is active and hide_empty is false', async () => {
    element.hass = createMockHass({
      'sensor.pollen_birke': { state: '0.0', attributes: {} },
    });
    await element.updateComplete;

    expect(element.shadowRoot?.textContent).to.contain('Keine Belastung');
  });

  it('renders nothing when hide_empty is true and no pollen is active', async () => {
    element.setConfig({ ...mockConfig, hide_empty: true });
    element.hass = createMockHass({
      'sensor.pollen_birke': { state: '0.0', attributes: {} },
    });
    await element.updateComplete;

    // When hide_empty is true and no results, it should NOT render the ha-card
    const card = element.shadowRoot?.querySelector('ha-card');
    expect(card).toBeNull();
  });

  it('uses the configured title', async () => {
    element.setConfig({ ...mockConfig, title: 'Custom Title' });
    element.hass = createMockHass({
      'sensor.pollen_birke': {
        state: '1.0',
        attributes: { state_today_desc: 'low' },
      },
    });
    await element.updateComplete;

    const header = element.shadowRoot?.querySelector('ha-card');
    expect(header?.getAttribute('header')).to.equal('Custom Title');
  });
});
