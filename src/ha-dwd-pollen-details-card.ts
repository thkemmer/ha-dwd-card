import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { getPollenData, PollenInfo } from './pollen-data';
import { getPollenIcon } from './pollen-icons';

interface PollenDetailsCardConfig {
  type: string;
  entities: string[];
  title?: string;
  show_title?: boolean;
  hide_empty?: boolean;
  sort_by_level?: boolean;
}

const DEV_SUFFIX = __DEV__ ? '-dev' : '';
const CUSTOM_ELEMENT_NAME = `ha-dwd-pollen-details-card${DEV_SUFFIX}`;
const EDITOR_ELEMENT_NAME = `ha-dwd-pollen-details-card-editor${DEV_SUFFIX}`;

// Register the card in Home Assistant's card picker
window.customCards = window.customCards || [];
window.customCards.push({
  type: CUSTOM_ELEMENT_NAME,
  name: `DWD Pollenflug Details Card${__DEV__ ? ' (Dev)' : ''}`,
  preview: true,
  description: 'Displays detailed pollen exposure forecast (3 days).',
});

@customElement(CUSTOM_ELEMENT_NAME)
export class HaDwdPollenDetailsCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: PollenDetailsCardConfig;

  public setConfig(config: PollenDetailsCardConfig): void {
    if (!config.entities || !Array.isArray(config.entities)) {
      throw new Error('Please define a list of pollen entities');
    }
    this.config = config;
  }

  public static getStubConfig(): object {
    return {
      type: `custom:${CUSTOM_ELEMENT_NAME}`,
      entities: [],
      title: 'Pollenflug Vorhersage',
      show_title: true,
      hide_empty: false,
      sort_by_level: true,
    };
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement(EDITOR_ELEMENT_NAME);
  }

  protected render(): TemplateResult {
    if (!this.config || !this.hass) {
      return html``;
    }

    let pollenData: PollenInfo[] = this.config.entities
      .map((entityId) => getPollenData(this.hass, entityId))
      .filter((data): data is PollenInfo => data !== null);

    // Filter out if hide_empty is true and today is 0
    if (this.config.hide_empty) {
      pollenData = pollenData.filter((p) => p.state > 0);
    }

    // Sort by level if enabled
    const sortByLevel = this.config.sort_by_level !== false;
    if (sortByLevel) {
      pollenData = [...pollenData].sort((a, b) => b.state - a.state);
    }

    if (pollenData.length === 0 && this.config.hide_empty) {
      return html``;
    }

    return html`
      <ha-card>
        ${this.config.show_title !== false
          ? html`
              <div class="card-header">
                ${this.config.title || 'Pollenflug Vorhersage'}
              </div>
            `
          : ''}
        <div class="card-content">
          ${pollenData.length === 0
            ? html`<div class="no-pollen">Keine Belastung</div>`
            : pollenData.map((pollen) => this.renderPollenRow(pollen))}
        </div>
      </ha-card>
    `;
  }

  private renderPollenRow(pollen: PollenInfo): TemplateResult {
    const icon = getPollenIcon(pollen.typeId);

    return html`
      <div class="pollen-row">
        <div class="pollen-title">${pollen.name}</div>
        <div class="forecast-container">
          <div class="forecast-day">
            <div class="day-label">Heute</div>
            <ha-icon icon="${icon}" style="color: ${pollen.color}"></ha-icon>
            <div class="day-desc">${pollen.description}</div>
          </div>
          <div class="forecast-day">
            <div class="day-label">Morgen</div>
            <ha-icon
              icon="${icon}"
              style="color: ${pollen.tomorrow?.color || 'var(--disabled-text-color)'}"
            ></ha-icon>
            <div class="day-desc">
              ${pollen.tomorrow?.description || 'Keine Daten'}
            </div>
          </div>
          <div class="forecast-day">
            <div class="day-label">Übermorgen</div>
            <ha-icon
              icon="${icon}"
              style="color: ${pollen.in2Days?.color || 'var(--disabled-text-color)'}"
            ></ha-icon>
            <div class="day-desc">
              ${pollen.in2Days?.description || 'Keine Daten'}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    ha-card {
      padding: 16px;
    }
    .card-header {
      margin-bottom: 16px;
      font-weight: 500;
      color: var(--primary-text-color);
      font-size: 16px;
    }
    .card-content {
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .pollen-row {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--divider-color);
    }
    .pollen-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .pollen-title {
      font-weight: bold;
      font-size: 14px;
      color: var(--primary-text-color);
    }
    .forecast-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      text-align: center;
    }
    .forecast-day {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    .day-label {
      font-size: 10px;
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }
    ha-icon {
      --mdc-icon-size: 28px;
    }
    .day-desc {
      font-size: 11px;
      line-height: 1.2;
      color: var(--secondary-text-color);
    }
    .no-pollen {
      color: var(--secondary-text-color);
      text-align: center;
      padding: 8px;
    }
  `;
}

@customElement(EDITOR_ELEMENT_NAME)
export class HaDwdPollenDetailsCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: PollenDetailsCardConfig;

  public setConfig(config: PollenDetailsCardConfig): void {
    this._config = config;
  }

  private _valueChanged(ev: CustomEvent, configKey?: keyof PollenDetailsCardConfig): void {
    if (!this._config || !this.hass) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const target = ev.target as any;
    const configValue = configKey || (target.configValue as keyof PollenDetailsCardConfig);

    if (!configValue) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let newValue: any;
    if (ev.detail && ev.detail.value !== undefined) {
      newValue = ev.detail.value;
    } else if (target.checked !== undefined) {
      newValue = target.checked;
    } else {
      newValue = target.value;
    }

    if (this._config[configValue] === newValue) {
      return;
    }

    this._config = {
      ...this._config,
      [configValue]: newValue,
    };

    const event = new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      <div class="card-config">
        <ha-textfield
          .label=${'Title (Optional)'}
          .value=${this._config.title || ''}
          .configValue=${'title'}
          @input=${this._valueChanged}
        ></ha-textfield>

        <ha-selector
          .hass=${this.hass}
          .selector=${{
            entity: {
              multiple: true,
              filter: {
                domain: 'sensor',
              },
            },
          }}
          .value=${this._config.entities}
          .label=${'Pollen Entities'}
          .configValue=${'entities'}
          @value-changed=${(ev: CustomEvent) => this._valueChanged(ev, 'entities')}
        ></ha-selector>

        <div class="switches">
          <ha-formfield label="Show Card Title">
            <ha-switch
              .checked=${this._config.show_title !== false}
              .configValue=${'show_title'}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>

          <ha-formfield label="Hide card if no pollen exposure">
            <ha-switch
              .checked=${this._config.hide_empty === true}
              .configValue=${'hide_empty'}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>

          <ha-formfield label="Sort by Exposure Level">
            <ha-switch
              .checked=${this._config.sort_by_level !== false}
              .configValue=${'sort_by_level'}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
        </div>
      </div>
    `;
  }

  static styles = css`
    .card-config {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .switches {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    ha-textfield,
    ha-selector {
      display: block;
      width: 100%;
    }
  `;
}

// Register the card in Home Assistant's card picker
window.customCards = window.customCards || [];
window.customCards.push({
  type: CUSTOM_ELEMENT_NAME,
  name: `DWD Pollenflug Details Card${__DEV__ ? ' (Dev)' : ''}`,
  preview: true,
  description: 'Displays detailed pollen exposure forecast (3 days).',
});
