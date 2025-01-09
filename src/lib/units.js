export const units = {
    // Existing units
    'Space Marines': {
      movement: 6,
      toughness: 4,
      save: 3,
      wounds: 2,
      leadership: 6,
      objectiveControl: 2,
      attacks: 2,
      ballisticSkill: 3,
      weaponSkill: 3,
      weapons: {
        'Bolt Rifle': {
          range: 24,
          shots: 2,
          strength: 4,
          ap: -1,
        },
        'Close Combat Weapon': {
          range: 0,
          shots: 0,
          strength: 4,
          ap: 0,
        }
      }
    },
    'Ork Boys': {
      movement: 5,
      toughness: 5,
      save: 6,
      wounds: 1,
      leadership: 7,
      objectiveControl: 2,
      attacks: 2,
      ballisticSkill: 5,
      weaponSkill: 3,
      weapons: {
        'Slugga': {
          range: 12,
          shots: 1,
          strength: 4,
          ap: 0,
        },
        'Choppa': {
          range: 0,
          shots: 1,
          strength: 4,
          ap: -1,
        }
      }
    },
    // New units
    'Tyranid Warriors': {
      movement: 6,
      toughness: 5,
      save: 4,
      wounds: 3,
      leadership: 7,
      objectiveControl: 2,
      attacks: 3,
      ballisticSkill: 4,
      weaponSkill: 3,
      weapons: {
        'Deathspitter': {
          range: 24,
          shots: 3,
          strength: 5,
          ap: -1,
        },
        'Talons': {
          range: 0,
          shots: 1,
          strength: 5,
          ap: -1,
        }
      }
    },
    'Guardian Defenders': {
      movement: 7,
      toughness: 3,
      save: 4,
      wounds: 1,
      leadership: 6,
      objectiveControl: 2,
      attacks: 1,
      ballisticSkill: 3,
      weaponSkill: 3,
      weapons: {
        'Shuriken Catapult': {
          range: 18,
          shots: 2,
          strength: 4,
          ap: -1,
        },
        'Close Combat Weapon': {
          range: 0,
          shots: 0,
          strength: 3,
          ap: 0,
        }
      }
    },
    'Necron Warriors': {
      movement: 5,
      toughness: 4,
      save: 4,
      wounds: 1,
      leadership: 6,
      objectiveControl: 2,
      attacks: 1,
      ballisticSkill: 4,
      weaponSkill: 4,
      weapons: {
        'Gauss Flayer': {
          range: 24,
          shots: 1,
          strength: 4,
          ap: -1,
        },
        'Close Combat Weapon': {
          range: 0,
          shots: 0,
          strength: 4,
          ap: 0,
        }
      }
    },
    'Fire Warriors': {
      movement: 6,
      toughness: 3,
      save: 4,
      wounds: 1,
      leadership: 6,
      objectiveControl: 2,
      attacks: 1,
      ballisticSkill: 4,
      weaponSkill: 5,
      weapons: {
        'Pulse Rifle': {
          range: 30,
          shots: 1,
          strength: 5,
          ap: -1,
        },
        'Close Combat Weapon': {
          range: 0,
          shots: 0,
          strength: 3,
          ap: 0,
        }
      }
    }
  };