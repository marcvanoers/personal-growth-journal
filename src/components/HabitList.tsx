import React from 'react';
import {
  Box,
  Typography,
  Rating,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { Habit } from '../types/journal';

interface HabitListProps {
  habits: Habit[];
  onChange: (habits: Habit[]) => void;
}

const HabitList: React.FC<HabitListProps> = ({ habits, onChange }) => {
  const handleRatingChange = (habitId: string, newRating: number | null) => {
    const updatedHabits = habits.map((h) =>
      h.id === habitId ? { ...h, rating: newRating || 0 } : h
    );
    onChange(updatedHabits);
  };

  const getCategoryColor = (category: string): 'default' | 'success' | 'primary' | 'secondary' | 'warning' | 'error' | 'info' => {
    const colors: Record<string, 'default' | 'success' | 'primary' | 'secondary' | 'warning' | 'error' | 'info'> = {
      health: 'success',
      productivity: 'primary',
      mindfulness: 'secondary',
      personal: 'warning',
      other: 'default',
    };
    return colors[category] || 'default';
  };

  if (habits.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography color="text.secondary">
          No habits found. Create some habits in the Habits page first.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <List>
        {habits.map((habit) => (
          <ListItem key={habit.id}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {habit.name}
                    <Tooltip title={habit.description || ''}>
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Target: {habit.target?.value || 1} {habit.target?.unit || 'times'} ({habit.frequency})
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={habit.category}
                        size="small"
                        color={getCategoryColor(habit.category)}
                        sx={{ mr: 1 }}
                      />
                    </Box>
                  </Box>
                }
              />
            </Box>
            <ListItemSecondaryAction>
              <Rating
                name={`habit-rating-${habit.id}`}
                value={habit.rating || 0}
                onChange={(_, newValue) => handleRatingChange(habit.id, newValue)}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default HabitList;
