import React, { createContext, useContext, useState, useEffect } from 'react';
import { JournalEntryData as JournalEntry, Habit } from '../types/journal';

interface JournalContextType {
  entries: JournalEntry[];
  addEntry: (entry: JournalEntry) => void;
  updateEntry: (entry: JournalEntry) => void;
  deleteEntry: (id: string) => void;
  getEntry: (id: string) => JournalEntry | undefined;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries);
      // Migrate old entries to new format if needed
      const migratedEntries = parsedEntries.map((entry: any) => ({
        ...entry,
        initialRating: entry.initialRating || entry.dayRating || 0,
        finalRating: entry.finalRating || entry.reflectionRating || 0,
      }));
      setEntries(migratedEntries);
    }
  }, []);

  useEffect(() => {
    // Save entries to localStorage whenever they change
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry: JournalEntry) => {
    setEntries(prev => [...prev, entry]);
  };

  const updateEntry = (updatedEntry: JournalEntry) => {
    setEntries(prev => prev.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    ));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const getEntry = (id: string) => {
    return entries.find(entry => entry.id === id);
  };

  return (
    <JournalContext.Provider value={{ entries, addEntry, updateEntry, deleteEntry, getEntry }}>
      {children}
    </JournalContext.Provider>
  );
};
