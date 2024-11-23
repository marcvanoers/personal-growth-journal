export interface Habit {
  id: string;
  userId: number;
  name: string;
  description: string;
  target: {
    value: number;
    unit: string;
  };
  frequency: 'daily' | 'weekly' | 'monthly';
  category: 'health' | 'productivity' | 'mindfulness' | 'personal' | 'other';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  rating: number;
}

export interface DailyReflection {
  mood: number;
  feelings: string;
  accomplishments: string;
  challenges: string;
  learnings: string;
}

export interface MindfulnessExercise {
  exercises: string[];
  effects: string;
  observations: string;
}

export interface StressManagement {
  situations: string[];
  copingMechanisms: string[];
  effectiveness: string;
}

export interface PersonalGrowth {
  skillsGained: string[];
  qualitiesDeveloped: string[];
  areasForImprovement: string[];
}

export interface GoalTracking {
  dailyGoals: string[];
  weeklyGoals: string[];
  progress: string;
  nextSteps: string;
}

export interface Inspiration {
  motivators: string[];
  quotes: string[];
  actionItems: string[];
}

export interface HabitMetrics {
  averageRating: number;
  completionRate: number;
  streak: number;
  totalEntries: number;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  userId: number;
  date: string;
  completed: boolean;
  value?: number;  // Optional value for quantitative habits
  notes?: string;  // Optional notes about the completion
  createdAt: string;
}

export interface HabitWithCompletions extends Habit {
  completions?: HabitCompletion[];
}

export interface FinalReflection {
  rating: number;
  summary: string;
}

export interface JournalEntryData {
  id: string;
  date: string;
  userId: number;
  habits: HabitWithCompletions[];
  initialRating: number;  // Rating at the start of journaling
  finalRating: number;    // Rating after reflection
  gratitude: {
    items: string[];
    smallThings: string[];
    positiveExperiences: string[];
  };
  dailyReflection: DailyReflection;
  mindfulness: MindfulnessExercise;
  stressManagement: StressManagement;
  personalGrowth: PersonalGrowth;
  goalTracking: GoalTracking;
  inspiration: Inspiration;
  finalReflection: FinalReflection;
}
