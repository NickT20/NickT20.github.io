export interface ApiPlayer {
  playerId: string;
  teamId: number;
  hitter: boolean;
  farm: boolean;
  starter: boolean;
  order: number;
}

export interface Player {
    id: string;
    position: string;
    name: string;
    atBats?: number;
    hits?: number;
    homeRuns?: number;
    baseOnBalls?: number;
    avg?: number;
    obp?: number;
    slg?: number;
    ops?: number;
    stolenBases?: number;
    caughtStealing?: number;
  }
  
  export interface Pitcher {
    id: string;
    position?: string;
    name?: string;
    gamesPlayed?: number;
    gamesStarted?: number;
    inningsPitched?: number;
    hits?: number;
    earnedRuns?: number;
    baseOnBalls?: number;
    strikeOuts?: number;
    era?: number;
    whip?: number;
  }
  
  export interface PrimaryPosition {
    abbreviation: string;
  }
  
  export interface PitcherStat {
    gamesPlayed: string;
    gamesStarted: string;
    inningsPitched: number;
    hits: number;
    earnedRuns: number;
    baseOnBalls: number;
    strikeOuts: number;
    era: number;
    whip: number;
  }
  
  export interface Stat {
    atBats?: number;
    hits?: number;
    homeRuns?: number;
    baseOnBalls?: number;
    avg?: number;
    obp?: number;
    slg?: number;
    ops?: number;
    stolenBases?: number;
    caughtStealing?: number;
  }
  
  export interface Splits {
    stat: Stat | PitcherStat;
  }
  
  export interface Stats {
    splits: Splits[];
  }
  
  export interface Sport {
    id: number;
  }
  
  export interface CurrentTeam {
    sport: Sport;
  }
  
  export interface People {
    stats: Stats[];
    fullName: string;
    primaryPosition: PrimaryPosition;
    currentTeam: CurrentTeam;
  }
  
  export interface PersonResponse {
    people: People[];
  }