/**
 * Maps pollen type IDs to suitable MDI icons.
 */
export const getPollenIcon = (typeId: string): string => {
  const icons: Record<string, string> = {
    birke: 'mdi:tree-outline',
    graser: 'mdi:grass',
    roggen: 'mdi:wheat',
    hasel: 'mdi:nature',
    erle: 'mdi:tree',
    esche: 'mdi:tree-variant',
    beifuss: 'mdi:flower',
    ambrosia: 'mdi:sprout',
  };

  return icons[typeId] || 'mdi:flower-pollen';
};
