import { describe, it, expect } from 'vitest';
import { getWarningIcon } from './warning-icons';

describe('getWarningIcon', () => {
  it('returns the correct icon for an existing mapping (Type 85)', () => {
    // 85 -> Glatteis -> mdi:car-traction-control
    expect(getWarningIcon(85)).toBe('mdi:car-traction-control');
    expect(getWarningIcon('85')).toBe('mdi:car-traction-control');
  });

  it('returns the correct icon for warning type 59 (Fog)', () => {
    expect(getWarningIcon(59)).toBe('mdi:weather-fog');
  });

  it('returns the correct icon for warning type 88 (Tauwetter)', () => {
    expect(getWarningIcon(88)).toBe('mdi:snowflake-melt');
    expect(getWarningIcon('88')).toBe('mdi:snowflake-melt');
  });

  it('returns the fallback icon for a non-existing mapping', () => {
    // 999 is likely not defined
    expect(getWarningIcon(999)).toBe('mdi:alert-circle-outline');
    expect(getWarningIcon('unknown')).toBe('mdi:alert-circle-outline');
  });
});
