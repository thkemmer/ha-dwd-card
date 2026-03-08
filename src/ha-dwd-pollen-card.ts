import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { getPollenData, PollenInfo, getPollenColor } from './pollen-data';
import { getPollenIcon } from './pollen-icons';

interface PollenCardConfig {
  type: string;
  entities: string[];
  title?: string;
  hide_empty?: boolean;
}

const DEV_SUFFIX = __DEV__ ? '-dev' : '';
const CUSTOM_ELEMENT_NAME = `ha-dwd-pollen-card${DEV_SUFFIX}`;

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

  protected render() {
    if (!this.config || !this.hass) {
      return html``;
    }

    const pollenData: PollenInfo[] = this.config.entities
      .map((entityId) => getPollenData(this.hass, entityId))
      .filter((data): data is PollenInfo => data !== null && data.state > 0);

    if (pollenData.length === 0 && this.config.hide_empty) {
      return html``;
    }

    // Determine highest risk for header color
    const maxRisk = pollenData.length > 0 
      ? Math.max(...pollenData.map(p => p.state))
      : 0;
    const headerColor = getPollenColor(maxRisk);

    return html`
      <ha-card header=${this.config.title || 'Pollenflug'}>
        <div class="header-color-bar" style="background-color: ${headerColor}"></div>
        <div class="card-content">
          ${pollenData.length === 0
            ? html`<div class="no-pollen">Keine Belastung</div>`
            : pollenData.map(
                (pollen) => html`
                  <div class="pollen-row">
                    <ha-icon
                      .icon=${getPollenIcon(pollen.typeId)}
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

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .header-color-bar {
        height: 4px;
        width: 100%;
        margin-top: -4px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }
      .card-content {
        padding: 16px;
      }
      .pollen-row {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
      }
      .pollen-row:last-child {
        margin-bottom: 0;
      }
      ha-icon {
        margin-right: 16px;
        --mdc-icon-size: 24px;
      }
      .pollen-info {
        display: flex;
        flex-direction: column;
      }
      .pollen-name {
        font-weight: bold;
      }
      .pollen-desc {
        font-size: 0.9em;
        color: var(--secondary-text-color);
      }
      .no-pollen {
        color: var(--secondary-text-color);
        text-align: center;
      }
    `;
  }
}
