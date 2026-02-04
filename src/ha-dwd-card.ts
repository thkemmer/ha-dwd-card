import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, handleAction, ActionConfig } from 'custom-card-helpers';
import { getWarningIcon } from './warning-icons';
import { getDWDData, getPrewarningEntityId, Warning } from './dwd-data';

// Interface for the card configuration
interface DWDCardConfig {
  type: string;
  current_warning_entity: string; // The current warning level entity
  prewarning_entity?: string; // Optional: The prewarning level entity
  show_current_warnings_headline?: boolean; // Optional: Show section headlines
  compact_warning_headline?: boolean; // Optional: Use shorter warning name instead of the verbose headline
  show_last_update_footer?: boolean; // Optional: Show last update time in footer
  hide_empty?: boolean; // Optional: Hide card if no warnings
  tap_action?: ActionConfig; // Action to perform on tap
  hold_action?: ActionConfig; // Action to perform on hold
  double_tap_action?: ActionConfig; // Action to perform on double tap
}

const DEV_SUFFIX = __DEV__ ? '-dev' : '';
const CUSTOM_ELEMENT_NAME = `ha-dwd-card${DEV_SUFFIX}`;
const EDITOR_ELEMENT_NAME = `ha-dwd-card-editor${DEV_SUFFIX}`;

@customElement(CUSTOM_ELEMENT_NAME)
export class HaDwdCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: DWDCardConfig;

  // Configuration check
  public setConfig(config: DWDCardConfig): void {
    if (!config.current_warning_entity) {
      throw new Error(
        'Please define a DWD Warning entity (current_warning_entity)'
      );
    }
    this.config = config;
  }

  public static getStubConfig(): object {
    return {
      type: `custom:${CUSTOM_ELEMENT_NAME}`,
      current_warning_entity: 'sensor.dwd_weather_warnings__aktuelle_warnstufe',
      prewarning_entity: 'sensor.dwd_weather_warnings__vorwarnstufe',
      show_current_warnings_headline: false,
      compact_warning_headline: false,
      show_last_update_footer: true,
      hide_empty: false,
      tap_action: { action: 'more-info' },
    };
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement(EDITOR_ELEMENT_NAME);
  }

  public getLayoutOptions() {
    const compact = this.config?.compact_warning_headline ?? false;
    const currentSize = this.getCardSize ? this.getCardSize() : 2;
    return {
      grid_min_rows: 2,
      grid_rows: Math.max(2, currentSize),
      grid_min_columns: compact ? 6 : 12,
      grid_columns: compact ? 6 : 12,
    };
  }

  public getCardSize(): number {
    if (!this.config || !this.hass) {
      return 1;
    }
    const currentEntity = this.config.current_warning_entity;
    const prewarningEntity = getPrewarningEntityId(
      currentEntity,
      this.config.prewarning_entity
    );

    const currentData = getDWDData(this.hass, currentEntity);
    const prewarningData = getDWDData(this.hass, prewarningEntity);

    const currentCount = currentData.warningCount;
    const prewarningCount = prewarningData.warningCount;

    // No active warnings
    if (currentCount === 0 && prewarningCount === 0) {
      return this.config.hide_empty ? 0 : 2;
    }

    // let's do the calculations a bit more intelligently. 1 - unit is about 50px in height.
    // e.g. for 5 Elements the final height is about 304 with header and footer
    const warning_element_height = 45;
    const card_base_height = 10; // padding and border
    const footer_height = this.config.show_last_update_footer ? 19 : 0;
    const header_height = this.config.show_current_warnings_headline ? 30 : 0;

    const total_height =
      card_base_height +
      warning_element_height * currentCount +
      (prewarningCount > 0
        ? header_height + warning_element_height * prewarningCount
        : 0) +
      footer_height +
      header_height;

    return Math.ceil(total_height / 50.0);
  }

  // Optimize rendering
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has('config')) {
      return true;
    }

    const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
    if (!oldHass || !this.hass || !this.config) {
      return true;
    }

    const entitiesToCheck = [
      this.config.current_warning_entity,
      getPrewarningEntityId(
        this.config.current_warning_entity,
        this.config.prewarning_entity
      ),
    ];

    for (const entity of entitiesToCheck) {
      if (entity && oldHass.states[entity] !== this.hass.states[entity]) {
        return true;
      }
    }

    return false;
  }

  private _handleAction(): void {
    if (this.config && this.hass) {
      handleAction(this, this.hass, this.config, 'tap');
    }
  }

  // Define styles (Standard CSS works here!)
  static styles = css`
    :host {
      display: block;
      font-family: var(--primary-font-family);
      box-sizing: border-box;
    }
    ha-card {
      padding: 4px;
      transition: box-shadow 0.3s;
    }
    ha-card.clickable {
      cursor: pointer;
    }
    .warning-box {
      color: var(--primary-text-color);
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .icon-box {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .content-box {
      flex-grow: 1;
      font-size: var(--paper-font-body1_-_font-size, 14px);
    }
    .headline {
      font-weight: 700;
      font-size: 14px;
      line-height: 1.2;
      margin-top: 2px;
    }
    .time-range {
      color: var(--secondary-text-color);
      font-size: 12px;
    }
    .section-title {
      margin: 4px;
      margin-left: 12px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .footer {
      text-align: right;
      padding-right: 8px;
      font-size: var(--paper-font-caption_-_font-size, 12px);
      color: var(--secondary-text-color);
    }
    .no-warnings {
      text-align: center;
      padding: 8px 4px;
      color: var(--secondary-text-color);
      border: 1px solid var(--divider-color);
      border-radius: 12px;
    }
  `;

  // Icon mapping logic
  private getIcon(warningType: string | number): string {
    return getWarningIcon(warningType);
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
  private renderWarning(warning: Warning) {
    const headline = this.config.compact_warning_headline
      ? warning.name || warning.headline
      : warning.headline;
    const icon = this.getIcon(warning.type);

    return html`
      <div class="warning-box">
        <div class="icon-box">
          <ha-icon icon="${icon}" style="color: ${warning.color}"></ha-icon>
        </div>
        <div class="content-box">
          <div class="headline">${headline}</div>
          <div class="time-range">
            ${this.formatTime(warning.start)} - ${this.formatTime(warning.end)}
          </div>
        </div>
      </div>
    `;
  }

  protected render() {
    if (!this.config || !this.hass) {
      return html``;
    }

    const currentEntity = this.config.current_warning_entity;
    // Use configured prewarning entity or derive it from the current entity
    const prewarningEntity = getPrewarningEntityId(
      currentEntity,
      this.config.prewarning_entity
    );

    const currentData = getDWDData(this.hass, currentEntity);
    const prewarningData = getDWDData(this.hass, prewarningEntity);

    if (!this.hass.states[currentEntity]) {
      return html`
        <ha-card>
          <div style="padding: 16px; color: red;">
            Entity not found: ${currentEntity}
          </div>
        </ha-card>
      `;
    }

    const currentCount = currentData.warningCount;
    const prewarningCount = prewarningData.warningCount;
    const lastUpdate = currentData.lastUpdate;

    if (currentCount === 0 && prewarningCount === 0 && this.config.hide_empty) {
      return html``;
    }

    // Check if card is clickable (has tap action other than none)
    const isClickable =
      this.config.tap_action && this.config.tap_action.action !== 'none';

    return html`
      <ha-card
        @click=${this._handleAction}
        class=${isClickable ? 'clickable' : ''}
      >
        ${currentCount > 0
          ? html`
              ${this.config.show_current_warnings_headline
                ? html`<div class="section-title">
                    Aktuelle Warnungen (${currentCount})
                  </div>`
                : ''}
              ${currentData.warnings.map((warning) =>
                this.renderWarning(warning)
              )}
            `
          : ''}
        ${prewarningCount > 0
          ? html`
              ${this.config.show_current_warnings_headline
                ? html`<div class="section-title">Vorabinformationen</div>`
                : ''}
              ${prewarningData.warnings.map((warning) =>
                this.renderWarning(warning)
              )}
            `
          : ''}
        ${currentCount === 0 && prewarningCount === 0
          ? html`
              <div class="no-warnings">
                <ha-icon
                  icon="mdi:check-circle-outline"
                  style="color: var(--success-color); margin-bottom: 4px;"
                ></ha-icon>
                <div>Keine Wetterwarnungen vorhanden.</div>
              </div>
            `
          : ''}
        ${this.config.show_last_update_footer
          ? html`
              <div class="footer">
                Stand: ${lastUpdate ? this.formatTime(lastUpdate) : 'Unbekannt'}
              </div>
            `
          : ''}
      </ha-card>
    `;
  }
}

// --- Editor Class ---

@customElement(EDITOR_ELEMENT_NAME)
export class HaDwdCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: DWDCardConfig;

  public setConfig(config: DWDCardConfig): void {
    this._config = config;
  }

  private _valueChanged(ev: CustomEvent, configKey?: keyof DWDCardConfig): void {
    if (!this._config || !this.hass) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const target = ev.target as any;
    const configValue = configKey || (target.configValue as keyof DWDCardConfig);

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
        <ha-selector
          .hass=${this.hass}
          .selector=${{ entity: { integration: 'dwd_weather_warnings', domain: 'sensor' } }}
          .value=${this._config.current_warning_entity}
          .label=${'Current Warning Entity'}
          .configValue=${'current_warning_entity'}
          @value-changed=${(ev: CustomEvent) => this._valueChanged(ev, 'current_warning_entity')}
        ></ha-selector>

        <ha-selector
          .hass=${this.hass}
          .selector=${{ entity: { integration: 'dwd_weather_warnings', domain: 'sensor' } }}
          .value=${this._config.prewarning_entity}
          .label=${'Pre-warning Entity (Optional)'}
          .configValue=${'prewarning_entity'}
          @value-changed=${(ev: CustomEvent) => this._valueChanged(ev, 'prewarning_entity')}
        ></ha-selector>

        <div class="switches">
          <ha-formfield label="Show Section Headlines">
            <ha-switch
              .checked=${this._config.show_current_warnings_headline === true}
              .configValue=${'show_current_warnings_headline'}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>

          <ha-formfield label="Compact Headline">
            <ha-switch
              .checked=${this._config.compact_warning_headline === true}
              .configValue=${'compact_warning_headline'}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>

          <ha-formfield label="Show Last Update Footer">
            <ha-switch
              .checked=${this._config.show_last_update_footer !== false}
              .configValue=${'show_last_update_footer'}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>

          <ha-formfield label="Hide if Empty">
            <ha-switch
              .checked=${this._config.hide_empty === true}
              .configValue=${'hide_empty'}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
        </div>

        <div class="actions">
          <ha-selector
            .hass=${this.hass}
            .selector=${{ ui_action: {} }}
            .value=${this._config.tap_action}
            .label=${'Tap Action'}
            .configValue=${'tap_action'}
            @value-changed=${(ev: CustomEvent) => this._valueChanged(ev, 'tap_action')}
          ></ha-selector>

          <ha-selector
            .hass=${this.hass}
            .selector=${{ ui_action: {} }}
            .value=${this._config.hold_action}
            .label=${'Hold Action'}
            .configValue=${'hold_action'}
            @value-changed=${(ev: CustomEvent) => this._valueChanged(ev, 'hold_action')}
          ></ha-selector>

          <ha-selector
            .hass=${this.hass}
            .selector=${{ ui_action: {} }}
            .value=${this._config.double_tap_action}
            .label=${'Double Tap Action'}
            .configValue=${'double_tap_action'}
            @value-changed=${(ev: CustomEvent) => this._valueChanged(ev, 'double_tap_action')}
          ></ha-selector>
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
    .actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 8px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
    }
    ha-entity-picker,
    ha-selector,
    ha-textfield {
      display: block;
      width: 100%;
    }
  `;
}

// Register the card in Home Assistant's card picker
window.customCards = window.customCards || [];
window.customCards.push({
  type: `custom:${CUSTOM_ELEMENT_NAME}`,
  name: `DWD Warnwetter Card${__DEV__ ? ' (Dev)' : ''}`,
  preview: true,
  description: 'Displays current DWD weather warnings in a compact list.',
});