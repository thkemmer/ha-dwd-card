import { LitElement, html, css, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { getWarningIcon } from './warning-icons';
import { getDWDData, getPrewarningEntityId, Warning } from './dwd-data';

interface DWDDetailsCardConfig {
  type: string;
  current_warning_entity: string;
  prewarning_entity?: string;
  hide_empty?: boolean;
  show_dwd_attribution?: boolean;
}

@customElement('ha-dwd-details-card')
export class HaDwdDetailsCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: DWDDetailsCardConfig;

  public setConfig(config: DWDDetailsCardConfig): void {
    if (!config.current_warning_entity) {
      throw new Error('Please define a DWD Warning entity (current_warning_entity)');
    }
    this.config = config;
  }

  public static getStubConfig(): object {
    return {
      type: 'custom:ha-dwd-details-card',
      current_warning_entity: 'sensor.dwd_weather_warnings__aktuelle_warnstufe',
      prewarning_entity: 'sensor.dwd_weather_warnings__vorwarnstufe',
      show_dwd_attribution: true,
    };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has('config')) return true;

    const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
    if (!oldHass || !this.hass || !this.config) return true;

    const entitiesToCheck = [
      this.config.current_warning_entity,
      getPrewarningEntityId(this.config.current_warning_entity, this.config.prewarning_entity),
    ];

    for (const entity of entitiesToCheck) {
      if (entity && oldHass.states[entity] !== this.hass.states[entity]) {
        return true;
      }
    }

    return false;
  }

  private formatTime(tsStr: string): string {
    if (!tsStr) return '';
    const date = new Date(tsStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  private renderWarningCard(warning: Warning, isPrewarning: boolean): TemplateResult {
    const icon = getWarningIcon(warning.type);
    
    // Determine level text
    const levelText = warning.level ? `Warnstufe ${warning.level}` : '';

    return html`
      <ha-card class="warning-card">
        <div class="header">
          <ha-icon icon="${icon}" class="header-icon" style="color: ${warning.color};"></ha-icon>
          <div class="header-content">
            <div class="headline" style="color: ${warning.color};">${warning.headline}</div>
            <div class="time-range">
              <ha-icon icon="mdi:clock-outline" class="inline-icon"></ha-icon>
              <span>${this.formatTime(warning.start)} - ${this.formatTime(warning.end)}</span>
            </div>
          </div>
        </div>

        <div class="body">
          <div class="section">
            <div class="level-info">
              <ha-icon icon="mdi:alert" class="inline-icon"></ha-icon>
              <span>${levelText} ${isPrewarning ? '(Vorabinformation)' : ''}</span>
            </div>
            ${warning.description
              ? html`<div class="description">${warning.description}</div>`
              : ''}
          </div>

          ${warning.instruction
            ? html`
                <div class="section">
                  <div class="instruction-title">
                    <ha-icon icon="mdi:information-outline" class="inline-icon"></ha-icon>
                    Empfehlungen
                  </div>
                  <div class="instruction-text">${warning.instruction}</div>
                </div>
              `
            : ''}
        </div>
      </ha-card>
    `;
  }

  protected render(): TemplateResult {
    if (!this.config || !this.hass) return html``;

    const currentEntity = this.config.current_warning_entity;
    const prewarningEntity = getPrewarningEntityId(
      currentEntity,
      this.config.prewarning_entity
    );

    const currentData = getDWDData(this.hass, currentEntity);
    const prewarningData = getDWDData(this.hass, prewarningEntity);
    
    const allWarnings = [
        ...currentData.warnings.map(w => ({...w, isPre: false})),
        ...prewarningData.warnings.map(w => ({...w, isPre: true}))
    ];

    if (allWarnings.length === 0) {
        if (this.config.hide_empty) return html``;
        return html`
            <ha-card class="no-warnings">
                <ha-icon icon="mdi:check-circle-outline" style="color: var(--success-color); width: 48px; height: 48px; margin-bottom: 4px;"></ha-icon>
                <div class="text">Keine Wetterwarnungen vorhanden.</div>
            </ha-card>
        `;
    }

    const lastUpdate = currentData.lastUpdate || prewarningData.lastUpdate;

    return html`
      <div class="container">
        ${allWarnings.map(w => this.renderWarningCard(w, w.isPre))}
        
        <div class="footer">
          Stand: ${lastUpdate ? this.formatTime(lastUpdate) : 'Unbekannt'}
          <br>
          ${currentData.warnings.length > 0 ? this.hass.states[currentEntity]?.attributes['region_name'] : ''}
          ${this.config.show_dwd_attribution !== false ? html`<div class="attribution">${this.hass.states[currentEntity]?.attributes['attribution']}</div>` : ''}
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(--primary-font-family);
    }
    .container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .warning-card {
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .header {
      padding: 16px;
      display: flex;
      align-items: flex-start;
      column-gap: 8px;
      background: var(--ha-card-background, var(--card-background-color, #fff));
    }
    .header-icon {
      --mdc-icon-size: 32px;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .header-content {
      flex: 1;
    }
    .headline {
      font-weight: 700;
      font-size: 1.1rem;
      line-height: 1.2;
      margin-bottom: 4px;
    }
    .time-range {
      font-size: 0.9rem;
      color: var(--secondary-text-color);
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .body {
      padding: 0 16px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .section {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .level-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      color: var(--primary-text-color);
      font-size: 0.95rem;
    }
    .inline-icon {
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
    }
    .description {
      white-space: pre-line;
      font-size: 1rem;
      line-height: 1.5;
      color: var(--primary-text-color);
    }
    .instruction-title {
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--primary-text-color);
    }
    .instruction-text {
      white-space: pre-line;
      font-size: 0.95rem;
      color: var(--primary-text-color);
    }
    .no-warnings {
      padding: 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: var(--success-color);
    }
    .no-warnings ha-icon {
      --mdc-icon-size: 48px;
      margin-bottom: 8px;
    }
    .no-warnings .text {
      font-size: 1.2rem;
      color: var(--primary-text-color);
    }
    .footer {
      text-align: center;
      font-size: 0.8rem;
      color: var(--secondary-text-color);
      margin-top: 8px;
      padding: 8px;
    }
    .attribution {
      text-align: right;
      margin-top: 4px;
      font-size: 0.75rem;
      opacity: 0.8;
    }
  `;
}
