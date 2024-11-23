import { Habit } from '../types/journal';

// Key for storing habits in localStorage
export const HABITS_STORAGE_KEY = 'app_habits';

// Validate habit data structure
const validateHabit = (habit: any): Habit => {
  return {
    id: habit.id || crypto.randomUUID(),
    userId: habit.userId || 1,
    name: habit.name || '',
    description: habit.description || '',
    target: {
      value: habit.target?.value || 1,
      unit: habit.target?.unit || 'times',
    },
    frequency: habit.frequency || 'daily',
    category: habit.category || 'other',
    isActive: habit.isActive ?? true,
    createdAt: habit.createdAt || new Date().toISOString(),
    updatedAt: habit.updatedAt || new Date().toISOString(),
    rating: habit.rating || 0,
  };
};

// Get all habits from storage
export const getHabits = (): Habit[] => {
  try {
    const storedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
    if (!storedHabits) return [];
    
    const habits = JSON.parse(storedHabits);
    return Array.isArray(habits) ? habits.map(validateHabit) : [];
  } catch (error) {
    console.error('Error loading habits:', error);
    return [];
  }
};

// Save habits to storage
export const saveHabits = (habits: Habit[]): void => {
  try {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error('Error saving habits:', error);
  }
};

// Add a new habit
export const addHabit = (habit: Habit): void => {
  try {
    const habits = getHabits();
    habits.push(validateHabit(habit));
    saveHabits(habits);
  } catch (error) {
    console.error('Error adding habit:', error);
  }
};

// Delete a habit
export const deleteHabit = (habitId: string): void => {
  try {
    const habits = getHabits();
    const updatedHabits = habits.filter(h => h.id !== habitId);
    saveHabits(updatedHabits);
  } catch (error) {
    console.error('Error deleting habit:', error);
  }
};

// Update a habit
export const updateHabit = (updatedHabit: Habit): void => {
  try {
    const habits = getHabits();
    const updatedHabits = habits.map(h => 
      h.id === updatedHabit.id ? validateHabit(updatedHabit) : h
    );
    saveHabits(updatedHabits);
  } catch (error) {
    console.error('Error updating habit:', error);
  }
};
