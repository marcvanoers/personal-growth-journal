import { HabitCompletion } from '../types/journal';

// For now, we'll store completions in localStorage
const STORAGE_KEY = 'habit_completions';

const getCompletions = (habitId: string): HabitCompletion[] => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) return [];
  
  const allCompletions: HabitCompletion[] = JSON.parse(storedData);
  return allCompletions.filter(completion => completion.habitId === habitId);
};

const addCompletion = (completion: Omit<HabitCompletion, 'id' | 'createdAt'>): HabitCompletion => {
  const newCompletion: HabitCompletion = {
    ...completion,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const storedData = localStorage.getItem(STORAGE_KEY);
  const existingCompletions: HabitCompletion[] = storedData ? JSON.parse(storedData) : [];
  
  existingCompletions.push(newCompletion);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existingCompletions));
  
  return newCompletion;
};

const removeCompletion = (completionId: string): void => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) return;

  const completions: HabitCompletion[] = JSON.parse(storedData);
  const updatedCompletions = completions.filter(c => c.id !== completionId);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCompletions));
};

const getCompletionsInDateRange = (habitId: string, startDate: Date, endDate: Date): HabitCompletion[] => {
  const completions = getCompletions(habitId);
  return completions.filter(completion => {
    const completionDate = new Date(completion.date);
    return completionDate >= startDate && completionDate <= endDate;
  });
};

export {
  getCompletions,
  addCompletion,
  removeCompletion,
  getCompletionsInDateRange,
};
