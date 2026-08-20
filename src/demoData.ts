export type DemoCharacterStatus = 'idle' | 'expedition'

export interface DemoStats {
  hp: number
  attack: number
  defense: number
  speed: number
}

export interface DemoCharacter {
  id: string
  name: string
  className: string
  level: number
  status: DemoCharacterStatus
  stats: DemoStats
  equipment: string[]
}

export interface DemoDungeon {
  id: string
  name: string
  floor: number
  totalFloors: number
  danger: 'low' | 'medium'
  rewardPreview: {
    xp: number
    gems: number
  }
}

export interface DemoGameSnapshot {
  mode: 'demo'
  source: 'public-synthetic-data'
  resources: {
    gems: number
    rations: number
  }
  characters: DemoCharacter[]
  activeDungeon: DemoDungeon
}

/**
 * Synthetic values for documenting the frontend shape. These are not live
 * character, dungeon, balance or economy values from production.
 */
export const demoGameSnapshot: DemoGameSnapshot = {
  mode: 'demo',
  source: 'public-synthetic-data',
  resources: { gems: 240, rations: 8 },
  characters: [
    {
      id: 'demo-character-1',
      name: 'Aster',
      className: 'Knight',
      level: 3,
      status: 'expedition',
      stats: { hp: 120, attack: 18, defense: 14, speed: 9 },
      equipment: ['Demo blade', 'Demo guard'],
    },
    {
      id: 'demo-character-2',
      name: 'Nia',
      className: 'Warden',
      level: 2,
      status: 'idle',
      stats: { hp: 96, attack: 13, defense: 17, speed: 11 },
      equipment: ['Demo bow'],
    },
  ],
  activeDungeon: {
    id: 'demo-dungeon-1',
    name: 'Lantern Hollow',
    floor: 2,
    totalFloors: 6,
    danger: 'low',
    rewardPreview: { xp: 34, gems: 7 },
  },
}
