export interface ContentBlock {
  text_sharii: string;
  tarbawi_psych: string;
  science_experience: string;
  tactile_tip: string;
}

export interface Card {
  card_id: string;
  title: string;
  content_blocks: ContentBlock;
}

export interface Exercise {
  title: string;
  instructions: string;
  cta_label: string;
}

export interface Reward {
  badge: string;
  points: number;
  message: string;
}

export interface Unit {
  unit_id: number;
  title: string;
  cards: Card[];
  exercise: Exercise;
  reward: Reward;
}

export interface Level {
  level_id: number;
  title: string;
  is_unlocked: boolean;
  units: Unit[];
  teaser?: string;
}

export interface AppData {
  app: {
    name: string;
    locale: string;
    rtl: boolean;
  };
  levels: Level[];
}

export interface UnitProgress {
  completedCards: Set<string>;
  exerciseCompleted: boolean;
  rewardClaimed: boolean;
}

export interface UserProgress {
  [unitId: number]: UnitProgress;
}