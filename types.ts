export enum SectionType {
  Sharii = 'sharii',
  Tarbawi = 'tarbawi',
  Science = 'science',
  Tactile = 'tactile',
  Summary = 'summary',
}

export interface MotivationalQuestion {
  question: string;
  options: string[];
  correct_option_index: number;
}

export interface Section {
  id: SectionType;
  title: string;
  content: string;
  motivational_question?: MotivationalQuestion;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_option_index: number;
  explanation: string;
}

export interface Card {
  card_id: string;
  title: string;
  sections: Section[];
  imageUrl?: string;
  quiz?: QuizQuestion[];
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