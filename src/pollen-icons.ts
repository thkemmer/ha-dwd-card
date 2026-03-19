/**
 * Maps pollen type IDs to suitable MDI icons.
 */
export const getPollenIcon = (typeId: string): string => {
  const icons: Record<string, string> = {
    birke: 'mdi:tree-outline',
    graser: 'mdi:grass',
    roggen: 'mdi:barley',
    hasel: 'mdi:sprout',
    erle: 'mdi:nature',
    esche: 'mdi:tree',
    beifuss: 'mdi:flower',
    ambrosia: 'mdi:flower-pollen',
  };

  return icons[typeId] || 'mdi:flower-pollen';
};
