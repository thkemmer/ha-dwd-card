import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, hasConfigOrEntityChanged } from 'custom-card-helpers';

// Interface for the card configuration
interface DWDCardConfig {
  type: string;
  entity: string; // The base entity, e.g., sensor.dwd_weather_warnings_berlin_current_warning_level
}

@customElement('ha-dwd-card')
export class HaDwdCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: DWDCardConfig;

  // Configuration check
  public setConfig(config: DWDCardConfig): void {
    if (!config.entity) {
      throw new Error('Please define a DWD Warning entity');
    }
    this.config = config;
  }

  // Optimize rendering
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  // Define styles (Standard CSS works here!)
  static styles = css`
    :host {
      display: block;
    }
    ha-card {
      padding: 16px;
    }
    .warning-box {
      background-color: var(--secondary-background-color);
      color: var(--primary-text-color);
      padding: 12px;
      border-radius: 12px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .icon-box {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .content-box {
      flex-grow: 1;
    }
    .headline {
      font-weight: 600;
      font-size: 1.1em;
      line-height: 1.2;
      margin-bottom: 4px;
    }
    .time-range {
      font-size: 0.9em;
      opacity: 0.7;
    }
    .section-title {
      margin-top: 16px;
      margin-bottom: 8px;
      font-weight: 500;
    }
    .footer {
      text-align: right;
      font-size: 0.8em;
      opacity: 0.5;
      margin-top: 16px;
    }
    .no-warnings {
      text-align: center;
      padding: 24px;
      opacity: 0.8;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
    }
  `;

  // Icon mapping logic
  private getIcon(warningType: string | number): string {
    const typeStr = String(warningType);
    const icons: Record<string, string> = {
      "0": "mdi:shield-outline",
      "1": "mdi:weather-windy",
      "2": "mdi:weather-windy",
      "3": "mdi:weather-hurricane",
      "4": "mdi:weather-fog",
      "5": "mdi:snowflake",
      "6": "mdi:weather-snowy",
      "7": "mdi:snowflake-melt",
      "8": "mdi:snowflake-alert",
      "9": "mdi:weather-lightning",
      "10": "mdi:weather-pouring",
      "11": "mdi:weather-rainy",
      "12": "mdi:ice-pop",
      "13": "mdi:fire",
      "14": "mdi:weather-sunny-alert",
      "15": "mdi:water-percent",
      "16": "mdi:weather-fog",
      "17": "mdi:waves",
      "18": "mdi:image-filter-hdr",
      "19": "mdi:fire-alert",
      "20": "mdi:grass",
      "21": "mdi:snowflake",
      "22": "mdi:weather-snowy",
      "23": "mdi:weather-hail",
      "24": "mdi:water-percent",
      "25": "mdi:weather-lightning",
      "26": "mdi:weather-lightning",
      "27": "mdi:weather-hurricane",
      "28": "mdi:weather-pouring",
      "29": "mdi:snowflake-alert",
      "30": "mdi:weather-hurricane",
      "31": "mdi:fire",
      "32": "mdi:snowflake",
      "33": "mdi:ice-pop",
      "34": "mdi:water-percent",
      "35": "mdi:waves",
      "36": "mdi:image-filter-hdr",
      "37": "mdi:fire-alert",
      "38": "mdi:weather-lightning",
      "84": "mdi:car-traction-control",
      "98": "mdi:alert-circle-outline",
      "99": "mdi:help-circle-outline"
    };
    return icons[typeStr] || "mdi:alert-circle-outline";
  }

  // Format timestamp
  private formatTime(tsStr: string): string {
    if (!tsStr) return '';
    const date = new Date(tsStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}. ${hours}:${minutes}`;
  }

  // Render a single warning
  private renderWarning(entityId: string, index: number) {
    const headline = this.hass.states[entityId].attributes[`warning_${index}_headline`];
    const start = this.hass.states[entityId].attributes[`warning_${index}_start`];
    const end = this.hass.states[entityId].attributes[`warning_${index}_end`];
    const color = this.hass.states[entityId].attributes[`warning_${index}_color`] || '#cccccc';
    const type = this.hass.states[entityId].attributes[`warning_${index}_type`];
    const icon = this.getIcon(type);

    return html`
      <div class="warning-box">
        <div class="icon-box">
           <ha-icon icon="${icon}" style="color: ${color}"></ha-icon>
        </div>
        <div class="content-box">
          <div class="headline">${headline}</div>
          <div class="time-range">
            ${this.formatTime(start)} - ${this.formatTime(end)}
          </div>
        </div>
      </div>
    `;
  }

  protected render() {
    if (!this.config || !this.hass) {
      return html``;
    }

    const currentEntity = this.config.entity;
    // Assume advance entity follows standard naming convention based on current entity
    // or we could allow configuring it separately. For now, let's try to derive it.
    // e.g. ..._current_warning_level -> ..._advance_warning_level
    const advanceEntity = currentEntity.replace('_current_warning_level', '_advance_warning_level');
    
    const currentState = this.hass.states[currentEntity];
    const advanceState = this.hass.states[advanceEntity];

    if (!currentState) {
      return html`
        <ha-card header="DWD Warnings">
          <div style="padding: 16px; color: red;">Entity not found: ${currentEntity}</div>
        </ha-card>
      `;
    }

    const currentCount = currentState.attributes['warning_count'] || 0;
    const advanceCount = advanceState ? (advanceState.attributes['warning_count'] || 0) : 0;
    const lastUpdate = currentState.attributes['last_update'];

    return html`
      <ha-card header="Deutscher Wetterdienst">
        
        ${currentCount > 0 ? html`
          <div class="section-title">Aktuelle Warnungen</div>
          ${Array.from({length: currentCount}, (_, i) => this.renderWarning(currentEntity, i + 1))}
        ` : ''}

        ${advanceCount > 0 ? html`
          <div class="section-title">Vorabinformationen</div>
          ${Array.from({length: advanceCount}, (_, i) => this.renderWarning(advanceEntity, i + 1))}
        ` : ''}

        ${currentCount === 0 && advanceCount === 0 ? html`
          <div class="no-warnings">
            <ha-icon icon="mdi:check-circle-outline" style="color: var(--success-color); width: 48px; height: 48px; margin-bottom: 8px;"></ha-icon>
            <div>Keine Wetterwarnungen vorhanden.</div>
          </div>
        ` : ''}

        <div class="footer">
          Stand: ${lastUpdate ? this.formatTime(lastUpdate) : 'Unbekannt'}
        </div>
      </ha-card>
    `;
  }
}
