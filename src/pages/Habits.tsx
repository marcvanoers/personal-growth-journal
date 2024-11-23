import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { Habit, HabitMetrics } from '../types/journal';
import { getHabits, addHabit, deleteHabit, updateHabit } from '../services/habitService';
import { useAuth } from '../contexts/AuthContext';

interface HabitMetricsMap {
  [key: string]: HabitMetrics;
}

const Habits: React.FC = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitMetrics, setHabitMetrics] = useState<HabitMetricsMap>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const defaultHabit: Omit<Habit, 'id'> = {
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
  };
  const [newHabit, setNewHabit] = useState<Omit<Habit, 'id'>>(defaultHabit);

  useEffect(() => {
    try {
      const loadedHabits = getHabits();
      setHabits(loadedHabits);
      
      // Initialize metrics for each habit
      const metrics: HabitMetricsMap = {};
      loadedHabits.forEach(habit => {
        metrics[habit.id] = {
          averageRating: habit.rating || 0,
          completionRate: 0,
          streak: 0,
          totalEntries: 0
        };
      });
      setHabitMetrics(metrics);
      setError(null);
    } catch (err) {
      setError('Failed to load habits');
      console.error('Error loading habits:', err);
    }
  }, []);

  const handleAddHabit = () => {
    try {
      const habitWithId: Habit = {
        ...newHabit,
        id: crypto.randomUUID(),
      };
      
      addHabit(habitWithId);
      setHabits([...habits, habitWithId]);
      setOpenDialog(false);
      setNewHabit(defaultHabit);
      setError(null);
    } catch (err) {
      setError('Failed to add habit');
      console.error('Error adding habit:', err);
    }
  };

  const handleDeleteHabit = (habitId: string) => {
    try {
      deleteHabit(habitId);
      setHabits(habits.filter(h => h.id !== habitId));
      setError(null);
    } catch (err) {
      setError('Failed to delete habit');
      console.error('Error deleting habit:', err);
    }
  };

  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setNewHabit(habit);
    setOpenDialog(true);
  };

  const handleUpdateHabit = () => {
    if (selectedHabit) {
      try {
        const updatedHabit: Habit = {
          ...newHabit,
          id: selectedHabit.id,
          updatedAt: new Date().toISOString(),
        };
        updateHabit(updatedHabit);
        setHabits(habits.map(h => h.id === selectedHabit.id ? updatedHabit : h));
        setOpenDialog(false);
        setSelectedHabit(null);
        setNewHabit(defaultHabit);
        setError(null);
      } catch (err) {
        setError('Failed to update habit');
        console.error('Error updating habit:', err);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewHabit(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setNewHabit(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Habits</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedHabit(null);
            setOpenDialog(true);
          }}
        >
          Add Habit
        </Button>
      </Box>

      <Grid container spacing={3}>
        {habits.map((habit) => (
          <Grid item xs={12} sm={6} md={4} key={habit.id}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6">{habit.name}</Typography>
                  <Typography color="text.secondary" sx={{ mb: 1 }}>
                    {habit.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip
                      label={habit.category}
                      size="small"
                      color="primary"
                    />
                    <Chip
                      label={habit.frequency}
                      size="small"
                      color="secondary"
                    />
                  </Box>
                  <Typography variant="body2">
                    Target: {habit.target.value} {habit.target.unit}
                  </Typography>
                </Box>
                <Box>
                  <IconButton onClick={() => handleEditHabit(habit)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteHabit(habit.id)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedHabit ? 'Edit Habit' : 'Add New Habit'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={newHabit.name}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={newHabit.description}
              onChange={handleInputChange}
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Target Value"
                  value={newHabit.target.value}
                  onChange={(e) => setNewHabit(prev => ({
                    ...prev,
                    target: { ...prev.target, value: Number(e.target.value) }
                  }))}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Target Unit"
                  value={newHabit.target.unit}
                  onChange={(e) => setNewHabit(prev => ({
                    ...prev,
                    target: { ...prev.target, unit: e.target.value }
                  }))}
                />
              </Grid>
            </Grid>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={newHabit.category}
                label="Category"
                onChange={handleSelectChange}
              >
                <MenuItem value="health">Health</MenuItem>
                <MenuItem value="productivity">Productivity</MenuItem>
                <MenuItem value="mindfulness">Mindfulness</MenuItem>
                <MenuItem value="personal">Personal</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Frequency</InputLabel>
              <Select
                name="frequency"
                value={newHabit.frequency}
                label="Frequency"
                onChange={handleSelectChange}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={selectedHabit ? handleUpdateHabit : handleAddHabit}
            variant="contained"
            disabled={!newHabit.name}
          >
            {selectedHabit ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Habits;
