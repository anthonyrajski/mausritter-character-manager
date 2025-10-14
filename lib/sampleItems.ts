import type { InventoryItem } from './types'

export const SAMPLE_ITEMS: Omit<InventoryItem, 'id' | 'position' | 'currentUsage'>[] = [
  // 1-slot items
  {
    name: 'Sword',
    description: 'A sharp blade for combat. d6 damage.',
    slots: 1,
    usageDots: 0,
  },
  {
    name: 'Shield',
    description: 'Wooden shield. +1 to defense rolls.',
    slots: 1,
    usageDots: 0,
  },
  {
    name: 'Torch',
    description: 'Provides light in dark places. Burns for 1 hour.',
    slots: 1,
    usageDots: 3,
  },
  {
    name: 'Rope (50ft)',
    description: 'Sturdy rope for climbing and binding.',
    slots: 1,
    usageDots: 0,
  },
  {
    name: 'Rations',
    description: 'Food for one meal. Restores 1d6 HP when eaten.',
    slots: 1,
    usageDots: 3,
  },
  {
    name: 'Lantern',
    description: 'Bright light source. Requires oil.',
    slots: 1,
    usageDots: 3,
  },
  {
    name: 'Healing Potion',
    description: 'Restores 2d6 HP when consumed.',
    slots: 1,
    usageDots: 1,
  },
  {
    name: 'Lockpicks',
    description: 'Tools for picking locks. Requires DEX check.',
    slots: 1,
    usageDots: 3,
  },
  {
    name: 'Mirror',
    description: 'Small hand mirror. Useful for looking around corners.',
    slots: 1,
    usageDots: 0,
  },
  {
    name: 'Chalk',
    description: 'For marking walls and leaving messages.',
    slots: 1,
    usageDots: 0,
  },
  {
    name: 'Iron Spike',
    description: 'Useful for climbing, wedging doors, etc.',
    slots: 1,
    usageDots: 0,
  },

  // 2-slot items (larger equipment)
  {
    name: 'Bow',
    description: 'Ranged weapon. d6 damage, requires arrows.',
    slots: 2,
    usageDots: 0,
  },
  {
    name: 'Spear',
    description: 'Long polearm. d8 damage, can be thrown.',
    slots: 2,
    usageDots: 0,
  },
  {
    name: 'Two-Handed Sword',
    description: 'Heavy blade. d10 damage, requires both paws.',
    slots: 2,
    usageDots: 0,
  },
  {
    name: 'Crossbow',
    description: 'Heavy ranged weapon. d8 damage, slow to reload.',
    slots: 2,
    usageDots: 0,
  },
  {
    name: 'Bedroll',
    description: 'For sleeping comfortably while camping.',
    slots: 2,
    usageDots: 0,
  },
  {
    name: 'Tent',
    description: 'Shelter for 2-3 mice. Keeps dry and warm.',
    slots: 2,
    usageDots: 0,
  },
  {
    name: 'Fishing Rod',
    description: 'For catching fish in streams and ponds.',
    slots: 2,
    usageDots: 3,
  },
  {
    name: 'Large Sack',
    description: 'Can carry many small items or one large item.',
    slots: 2,
    usageDots: 0,
  },
]

export function createItemFromTemplate(
  template: typeof SAMPLE_ITEMS[0],
  position: string
): InventoryItem {
  return {
    ...template,
    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    position,
    currentUsage: template.usageDots,
  }
}
