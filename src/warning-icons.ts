export const WARNING_ICONS: Record<string, string> = {
  // --- Thunderstorm (Gewitter) ---
  '31': 'mdi:weather-lightning', // Gewitter
  '33': 'mdi:weather-lightning', // Starkes Gewitter
  '34': 'mdi:weather-lightning', // Starkes Gewitter
  '36': 'mdi:weather-lightning', // Starkes Gewitter
  '38': 'mdi:weather-lightning', // Starkes Gewitter
  '40': 'mdi:weather-lightning-rainy', // Schweres Gewitter mit Orkanböen
  '41': 'mdi:weather-lightning-rainy', // Schweres Gewitter mit extremen Orkanböen
  '42': 'mdi:weather-lightning-rainy', // Schweres Gewitter mit heftigem Starkregen
  '44': 'mdi:weather-lightning-rainy', // Schweres Gewitter mit Orkanböen und heftigem Starkregen
  '45': 'mdi:weather-lightning-rainy', // Schweres Gewitter mit extremen Orkanböen und heftigem Starkregen
  '46': 'mdi:weather-lightning-rainy', // Schweres Gewitter mit heftigem Starkregen und Hagel
  '48': 'mdi:weather-lightning-rainy', // Schweres Gewitter mit Orkanböen, heftigem Starkregen und Hagel
  '49': 'mdi:weather-lightning-rainy', // Schweres Gewitter mit extremen Orkanböen, heftigem Starkregen und Hagel

  // --- Wind / Storm (Wind/Sturm/Orkan) ---
  '11': 'mdi:weather-windy', // Windböen
  '12': 'mdi:weather-windy', // Windböen
  '13': 'mdi:weather-windy', // Sturm
  '51': 'mdi:weather-windy', // Windböen
  '52': 'mdi:weather-windy', // Sturmböen
  '53': 'mdi:weather-windy', // Schwere Sturmböen
  '54': 'mdi:weather-hurricane', // Orkanartige Böen
  '55': 'mdi:weather-hurricane', // Orkanböen
  '56': 'mdi:weather-hurricane', // Extreme Orkanböen
  '57': 'mdi:weather-windy', // Starkwind
  '58': 'mdi:weather-windy', // Sturm

  // --- Fog (Nebel) ---
  '59': 'mdi:weather-fog', // Nebel

  // --- Rain (Regen) ---
  '61': 'mdi:weather-pouring', // Starkregen
  '62': 'mdi:weather-pouring', // Heftiger Starkregen
  '63': 'mdi:weather-rainy', // Dauerregen
  '64': 'mdi:weather-rainy', // Ergiebiger Dauerregen
  '65': 'mdi:weather-rainy', // Extrem ergiebiger Dauerregen
  '66': 'mdi:weather-pouring', // Extrem heftiger Starkregen

  // --- Snow (Schnee) ---
  '70': 'mdi:weather-snowy', // Leichter Schneefall
  '71': 'mdi:weather-snowy', // Schneefall
  '72': 'mdi:weather-snowy-heavy', // Starker Schneefall
  '73': 'mdi:weather-snowy-heavy', // Extrem starker Schneefall
  '74': 'mdi:weather-snowy-windy', // Schneeverwehung
  '75': 'mdi:weather-snowy-windy', // Starke Schneeverwehung
  '76': 'mdi:weather-snowy-windy', // Extrem starke Schneeverwehung
  '79': 'mdi:weather-windy-variant', // Leiterseilschwingungen (Conductor Galloping)

  // --- Frost / Ice (Frost/Glätte) ---
  '22': 'mdi:snowflake', // Frost
  '24': 'mdi:car-traction-control', // Geringfügige Glätte
  '82': 'mdi:snowflake-alert', // Strenger Frost
  '84': 'mdi:car-traction-control', // Glätte
  '85': 'mdi:car-traction-control', // Glatteis (Rain freezing on ground)
  '87': 'mdi:car-traction-control', // Glatteis
  '88': 'mdi:snowflake-melt', // Tauwetter

  // --- Heat (Hitze) ---
  '247': 'mdi:weather-sunny-alert', // Starke Wärmebelastung
  '248': 'mdi:thermometer-alert', // Extreme Wärmebelastung

  // --- UV Radiation ---
  '246': 'mdi:sunglasses', // Erhöhte UV-Intensität

  // --- Test / Other ---
  '98': 'mdi:test-tube', // Test warning
  '99': 'mdi:test-tube', // Test warning

  // --- Legacy / Fallbacks from previous list ---
  '0': 'mdi:shield-outline',
  '1': 'mdi:weather-windy',
  '2': 'mdi:weather-windy',
  '3': 'mdi:weather-hurricane',
  '4': 'mdi:weather-fog',
  '5': 'mdi:snowflake',
  '6': 'mdi:weather-snowy',
  '7': 'mdi:snowflake-melt',
  '8': 'mdi:snowflake-alert',
  '9': 'mdi:weather-lightning',
  '10': 'mdi:weather-pouring',
  // 11-13 covered above
  '14': 'mdi:weather-sunny-alert',
  '15': 'mdi:water-percent',
  '16': 'mdi:weather-fog',
  '17': 'mdi:waves',
  '18': 'mdi:image-filter-hdr',
  '19': 'mdi:fire-alert',
  '20': 'mdi:grass',
  '21': 'mdi:snowflake',
  // 22 covered above
  '23': 'mdi:weather-hail',
  // 24 covered above
  '25': 'mdi:weather-lightning',
  '26': 'mdi:weather-lightning',
  '27': 'mdi:weather-hurricane',
  '28': 'mdi:weather-pouring',
  '29': 'mdi:snowflake-alert',
  '30': 'mdi:weather-hurricane',
  // 31 covered above
  '32': 'mdi:snowflake',
  // 33-38 covered above
  // 40-49 covered above
  // 51-59 covered above
  // 61-66 covered above
  // 70-76 covered above
  // 82, 84, 85, 87 covered above
  // 98, 99 covered above
};

export function getWarningIcon(warningType: string | number): string {
  const typeStr = String(warningType);
  return WARNING_ICONS[typeStr] || 'mdi:alert-circle-outline';
}
