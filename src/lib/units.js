export const units = {
    'Space Marines': {
      movement: 6,
      toughness: 4,
      save: 3,
      wounds: 2,
      leadership: 6,
      attacks: 2,
      weaponSkill: 3,
      ballisticSkill: 3,
      strength: 4,
      weapons: {
        'Bolter': { range: 24, strength: 4, ap: 0, shots: 2 },
        'Combat Knife': { range: 0, strength: 4, ap: 0, shots: 1 }
      }
    },
    'Ork Boys': {
      movement: 5,
      toughness: 5,
      save: 6,
      wounds: 1,
      leadership: 7,
      attacks: 2,
      weaponSkill: 3,
      ballisticSkill: 5,
      strength: 4,
      weapons: {
        'Slugga': { range: 12, strength: 4, ap: 0, shots: 1 },
        'Choppa': { range: 0, strength: 4, ap: -1, shots: 1 }
      }
    }
  };