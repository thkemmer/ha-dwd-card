import { describe, it, expect, beforeEach } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import { HomeAssistant } from 'custom-card-helpers';
import './ha-dwd-details-card';
import { HaDwdDetailsCard } from './ha-dwd-details-card';

describe('HaDwdDetailsCard', () => {
  let element: HaDwdDetailsCard;
  let hass: HomeAssistant;

  beforeEach(async () => {
    hass = {
      states: {
        'sensor.dwd_current': {
          attributes: {
            warning_count: 1,
            warning_1_headline: 'Test Headline',
            warning_1_start: '2026-01-01T10:00:00Z',
            warning_1_end: '2026-01-01T12:00:00Z',
            warning_1_type: 51,
            warning_1_level: 1,
            warning_1_color: '#ffeb3b',
            warning_1_description: 'Test Description',
            warning_1_instruction: 'Test Instruction',
            last_update: '2026-01-01T09:00:00Z',
          },
        },
        'sensor.dwd_pre': {
          attributes: {
            warning_count: 0,
          },
        },
      },
    } as unknown as HomeAssistant;

    element = await fixture(html`<ha-dwd-details-card></ha-dwd-details-card>`);
    element.hass = hass;
    element.setConfig({
      type: 'custom:ha-dwd-details-card',
      current_warning_entity: 'sensor.dwd_current',
      prewarning_entity: 'sensor.dwd_pre',
    });
    await element.updateComplete;
  });

  it('renders a warning card with correct content', () => {
    const headline = element.shadowRoot?.querySelector('.headline');
    expect(headline?.textContent?.trim()).to.equal('Test Headline');

    const description = element.shadowRoot?.querySelector('.description');
    expect(description?.textContent?.trim()).to.equal('Test Description');

    const instruction = element.shadowRoot?.querySelector('.instruction-text');
    expect(instruction?.textContent?.trim()).to.equal('Test Instruction');
  });

  it('renders "Keine aktiven Warnungen" when no warnings are present', async () => {
    const newHass = {
      ...hass,
      states: {
        ...hass.states,
        'sensor.dwd_current': {
          ...hass.states['sensor.dwd_current'],
          attributes: {
            ...hass.states['sensor.dwd_current'].attributes,
            warning_count: 0,
          },
        },
      },
    } as unknown as HomeAssistant;
    element.hass = newHass;
    await element.updateComplete;

    const noWarnings = element.shadowRoot?.querySelector('.no-warnings');
    expect(noWarnings).not.toBeNull();
    expect(noWarnings?.textContent).to.contain(
      'Keine Wetterwarnungen vorhanden.'
    );
  });
});

describe('HaDwdDetailsCardEditor', () => {
  it('sets config correctly', async () => {
    const editor = await fixture(
      html`<ha-dwd-details-card-editor></ha-dwd-details-card-editor>`
    );
    const config = {
      type: 'custom:ha-dwd-details-card',
      current_warning_entity: 'sensor.dwd_current',
    };
    (editor as unknown as { setConfig: (c: any) => void }).setConfig(config);
    expect((editor as unknown as { _config: any })._config).to.equal(config);
  });
});
