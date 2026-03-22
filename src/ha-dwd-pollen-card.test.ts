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

    const icon = element.shadowRoot?.querySelector('ha-icon');
    expect(icon?.getAttribute('icon')).to.equal('mdi:tree-outline');
  });

  it('orders pollen by exposure level when sort_by_level is true', async () => {
    element.setConfig({ ...mockConfig, sort_by_level: true });
    const hass = {
      'sensor.pollen_birke': {
        state: '1.0',
        attributes: { state_today_desc: 'low' },
      },
      'sensor.pollen_graser': {
        state: '3.0',
        attributes: { state_today_desc: 'high' },
      },
    };
    element.hass = createMockHass(hass);
    await element.updateComplete;

    const names = Array.from(element.shadowRoot?.querySelectorAll('.pollen-name') || []).map(
      (el) => el.textContent
    );
    // Gräser (3.0) should be before Birke (1.0)
    expect(names).to.deep.equal(['Gräser', 'Birke']);
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

    const header = element.shadowRoot?.querySelector('.card-header');
    expect(header?.textContent?.trim()).to.equal('Custom Title');
  });

  it('does not render the header when show_title is false', async () => {
    element.setConfig({ ...mockConfig, show_title: false });
    element.hass = createMockHass({
      'sensor.pollen_birke': { state: '1.0', attributes: {} },
    });
    await element.updateComplete;

    const header = element.shadowRoot?.querySelector('.card-header');
    expect(header).toBeNull();
  });

  describe('static methods', () => {
    it('getStubConfig returns default config', () => {
      const stubConfig = HaDwdPollenCard.getStubConfig() as any;
      expect(stubConfig.type).to.contain('ha-dwd-pollen-card');
      expect(stubConfig.entities).to.be.an('array');
      expect(stubConfig.title).to.equal('Pollenflug');
    });

    it('getConfigElement returns editor element', () => {
      const editor = HaDwdPollenCard.getConfigElement();
      expect(editor.tagName.toLowerCase()).to.contain('ha-dwd-pollen-card-editor');
    });
  });
});

describe('HaDwdPollenCardEditor', () => {
  it('sets config correctly', async () => {
    const editor = await fixture(
      html`<ha-dwd-pollen-card-editor></ha-dwd-pollen-card-editor>`
    );
    const config = {
      type: 'custom:ha-dwd-pollen-card',
      entities: ['sensor.pollen_birke'],
    };
    (editor as any).setConfig(config);
    expect((editor as any)._config).to.deep.equal(config);
  });

  it('renders editor fields', async () => {
    const editor = await fixture(
      html`<ha-dwd-pollen-card-editor></ha-dwd-pollen-card-editor>`
    );
    (editor as any).hass = { states: {} };
    (editor as any).setConfig({
      type: 'custom:ha-dwd-pollen-card',
      entities: [],
    });
    await (editor as any).updateComplete;

    expect(editor.shadowRoot?.querySelector('ha-textfield')).to.not.be.null;
    expect(editor.shadowRoot?.querySelector('ha-selector')).to.not.be.null;
    expect(editor.shadowRoot?.querySelector('ha-switch')).to.not.be.null;
  });

  it('fires config-changed event when title changes', async () => {
    const editor = await fixture(
      html`<ha-dwd-pollen-card-editor></ha-dwd-pollen-card-editor>`
    );
    const config = {
      type: 'custom:ha-dwd-pollen-card',
      entities: [],
    };
    (editor as any).hass = { states: {} };
    (editor as any).setConfig(config);

    const eventSpy = new Promise((resolve) => {
      editor.addEventListener('config-changed', (ev) => resolve(ev));
    });

    const ev = new CustomEvent('input', {
      bubbles: true,
      composed: true,
    });
    Object.defineProperty(ev, 'target', {
      value: { configValue: 'title', value: 'New Title' },
    });

    (editor as any)._valueChanged(ev);

    const caughtEvent = (await eventSpy) as CustomEvent;
    expect(caughtEvent.detail.config.title).to.equal('New Title');
  });

  it('fires config-changed event when entities change', async () => {
    const editor = await fixture(
      html`<ha-dwd-pollen-card-editor></ha-dwd-pollen-card-editor>`
    );
    const config = {
      type: 'custom:ha-dwd-pollen-card',
      entities: [],
    };
    (editor as any).hass = { states: {} };
    (editor as any).setConfig(config);

    const eventSpy = new Promise((resolve) => {
      editor.addEventListener('config-changed', (ev) => resolve(ev));
    });

    const ev = new CustomEvent('value-changed', {
      detail: { value: ['sensor.pollen_new'] },
      bubbles: true,
      composed: true,
    });

    (editor as any)._valueChanged(ev, 'entities');

    const caughtEvent = (await eventSpy) as CustomEvent;
    expect(caughtEvent.detail.config.entities).to.deep.equal(['sensor.pollen_new']);
  });
});
