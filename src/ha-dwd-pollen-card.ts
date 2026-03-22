import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { getPollenData, PollenInfo } from './pollen-data';
import { getPollenIcon } from './pollen-icons';

interface PollenCardConfig {
  type: string;
  entities: string[];
  title?: string;
  show_title?: boolean;
  hide_empty?: boolean;
  sort_by_level?: boolean;
}

const DEV_SUFFIX = __DEV__ ? '-dev' : '';
const CUSTOM_ELEMENT_NAME = `ha-dwd-pollen-card${DEV_SUFFIX}`;
const EDITOR_ELEMENT_NAME = `ha-dwd-pollen-card-editor${DEV_SUFFIX}`;

@customElement(CUSTOM_ELEMENT_NAME)
export class HaDwdPollenCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: PollenCardConfig;

  public setConfig(config: PollenCardConfig): void {
    if (!config.entities || !Array.isArray(config.entities)) {
      throw new Error('Please define a list of pollen entities');
    }
    this.config = config;
  }

  public static getStubConfig(): object {
    return {
      type: `custom:${CUSTOM_ELEMENT_NAME}`,
      entities: [],
      title: 'Pollenflug',
      show_title: true,
      hide_empty: false,
      sort_by_level: true,
    };
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement(EDITOR_ELEMENT_NAME);
  }

  protected render() {
    if (!this.config || !this.hass) {
      return html``;
    }

    let pollenData: PollenInfo[] = this.config.entities
      .map((entityId) => getPollenData(this.hass, entityId))
      .filter((data): data is PollenInfo => data !== null && data.state > 0);

    // Default to true if not specified
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
                ${this.config.title || 'Pollenflug'}
              </div>
            `
          : ''}
        <div class="card-content">
          ${pollenData.length === 0
            ? html`<div class="no-pollen">Keine Belastung</div>`
            : pollenData.map(
                (pollen) => html`
                  <div class="pollen-row">
                    <ha-icon
                      icon="${getPollenIcon(pollen.typeId)}"
                      style="color: ${pollen.color}"
                    ></ha-icon>
                    <div class="pollen-info">
                      <div class="pollen-name">${pollen.name}</div>
                      <div class="pollen-desc">${pollen.description}</div>
                    </div>
                  </div>
                `
              )}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    ha-card {
      padding: 8px;
    }
    .card-header {
      margin: 0 0 8px 8px;
      font-weight: 500;
      color: var(--primary-text-color);
      font-size: 14px;
    }
    .card-content {
      padding: 0;
    }
    .pollen-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    .pollen-row:last-child {
      margin-bottom: 0;
    }
    ha-icon {
      margin-right: 12px;
      --mdc-icon-size: 24px;
    }
    .pollen-info {
      display: flex;
      flex-direction: column;
    }
    .pollen-name {
      font-weight: bold;
      font-size: 14px;
    }
    .pollen-desc {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .no-pollen {
      color: var(--secondary-text-color);
      text-align: center;
      padding: 4px;
    }
  `;
}

// --- Editor Class ---

@customElement(EDITOR_ELEMENT_NAME)
export class HaDwdPollenCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: PollenCardConfig;

  public setConfig(config: PollenCardConfig): void {
    this._config = config;
  }

  private _valueChanged(ev: CustomEvent, configKey?: keyof PollenCardConfig): void {
    if (!this._config || !this.hass) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const target = ev.target as any;
    const configValue = configKey || (target.configValue as keyof PollenCardConfig);

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
  name: `DWD Pollenflug Card${__DEV__ ? ' (Dev)' : ''}`,
  preview: true,
  description: 'Displays current pollen exposure from DWD.',
});
