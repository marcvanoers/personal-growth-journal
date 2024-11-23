import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Habit } from '../types/journal';
import { getHabits, addHabit } from '../services/habitService';
import HabitList from './HabitList';
import { useAuth } from '../contexts/AuthContext';

interface HabitManagerProps {
  selectedHabits: Habit[];
  onHabitsChange: (habits: Habit[]) => void;
}

const HabitManager: React.FC<HabitManagerProps> = ({
  selectedHabits,
  onHabitsChange,
}) => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState<Omit<Habit, 'id'>>({
    userId: user?.id || 1,
    name: '',
    description: '',
    target: {
      value: 1,
      unit: 'times',
    },
    frequency: 'daily',
    category: 'health',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 0,
  });

  useEffect(() => {
    const userHabits = getHabits();
    setHabits(userHabits);
    
    // Initialize selected habits if empty
    if (selectedHabits.length === 0) {
      onHabitsChange(userHabits.map((h: Habit) => ({ ...h, rating: 0 })));
    }
  }, []);

  const handleAddHabit = () => {
    const newHabitWithId: Habit = {
      ...newHabit,
      id: crypto.randomUUID(),
    };
    addHabit(newHabitWithId);
    setHabits([...habits, newHabitWithId]);
    onHabitsChange([...selectedHabits, { ...newHabitWithId, rating: 0 }]);
    setDialogOpen(false);
    setNewHabit({
      ...newHabit,
      name: '',
      description: '',
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewHabit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setNewHabit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setDialogOpen(true)}
        sx={{ mb: 2 }}
      >
        Add Habit
      </Button>

      <HabitList
        habits={selectedHabits}
        onChange={(updatedHabits) => onHabitsChange(updatedHabits)}
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add New Habit</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Habit Name"
            type="text"
            fullWidth
            value={newHabit.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={2}
            value={newHabit.description}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={newHabit.category}
              onChange={handleSelectChange}
            >
              <MenuItem value="health">Health</MenuItem>
              <MenuItem value="productivity">Productivity</MenuItem>
              <MenuItem value="mindfulness">Mindfulness</MenuItem>
              <MenuItem value="personal">Personal</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Frequency</InputLabel>
            <Select
              name="frequency"
              value={newHabit.frequency}
              onChange={handleSelectChange}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddHabit} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HabitManager;
