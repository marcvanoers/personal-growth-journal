import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Rating,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { JournalEntryData, Habit } from '../types/journal';
import { getHabits } from '../services/habitService';
import HabitList from '../components/HabitList';
import JournalSection, { ListInput, RatingInput } from '../components/JournalSection';

const JournalEntry: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { date } = useParams();
  const isNewEntry = !date;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  const [entry, setEntry] = useState<JournalEntryData>({
    id: crypto.randomUUID(),
    date: date || format(new Date(), 'yyyy-MM-dd'),
    userId: user?.id || 0,
    habits: [],
    initialRating: 3,
    finalRating: 3,
    gratitude: {
      items: [],
      smallThings: [],
      positiveExperiences: [],
    },
    dailyReflection: {
      mood: 3,
      feelings: '',
      accomplishments: '',
      challenges: '',
      learnings: '',
    },
    mindfulness: {
      exercises: [],
      effects: '',
      observations: '',
    },
    stressManagement: {
      situations: [],
      copingMechanisms: [],
      effectiveness: '',
    },
    personalGrowth: {
      skillsGained: [],
      qualitiesDeveloped: [],
      areasForImprovement: [],
    },
    goalTracking: {
      dailyGoals: [],
      weeklyGoals: [],
      progress: '',
      nextSteps: '',
    },
    inspiration: {
      motivators: [],
      quotes: [],
      actionItems: [],
    },
    finalReflection: {
      rating: 3,
      summary: '',
    },
  });

  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    // Load habits when component mounts
    const loadedHabits = getHabits();
    
    // If editing an existing entry, merge saved ratings with habits
    if (date) {
      const storedEntries = localStorage.getItem('journalEntries');
      if (storedEntries) {
        const entries: JournalEntryData[] = JSON.parse(storedEntries);
        const existingEntry = entries.find(
          (e) => e.date === date && e.userId === user?.id
        );
        if (existingEntry && existingEntry.habits) {
          // Merge existing habits with their saved ratings
          const mergedHabits = loadedHabits.map(habit => {
            const savedHabit = existingEntry.habits.find(h => h.id === habit.id);
            return {
              ...habit,
              rating: savedHabit ? savedHabit.rating : 0
            };
          });
          setHabits(mergedHabits);
          return;
        }
      }
    }
    
    // For new entries, initialize habits with 0 rating
    setHabits(loadedHabits.map(habit => ({ ...habit, rating: 0 })));
  }, [date, user?.id]);

  useEffect(() => {
    setEntry(prev => ({
      ...prev,
      habits: habits
    }));
  }, [habits]);

  useEffect(() => {
    if (!isNewEntry) {
      const storedEntries = localStorage.getItem('journalEntries');
      if (storedEntries) {
        const entries: JournalEntryData[] = JSON.parse(storedEntries);
        const existingEntry = entries.find(
          e => e.date === date && e.userId === user?.id
        );
        if (existingEntry) {
          setEntry(existingEntry);
        }
      }
    }
  }, [date, user?.id, isNewEntry]);

  const handleSave = async () => {
    try {
      // Load existing entries
      const storedEntries = localStorage.getItem('journalEntries');
      let entries: JournalEntryData[] = storedEntries ? JSON.parse(storedEntries) : [];

      // Remove existing entry if editing
      if (!isNewEntry) {
        entries = entries.filter((e) => !(e.date === date && e.userId === user?.id));
      }

      // Add new entry
      entries.push(entry);

      // Save to localStorage
      localStorage.setItem('journalEntries', JSON.stringify(entries));

      setSaveStatus('success');
      setTimeout(() => {
        navigate('/journal');
      }, 1500);
    } catch (error) {
      console.error('Error saving entry:', error);
      setSaveStatus('error');
    }
  };

  const handleDelete = async () => {
    try {
      const storedEntries = localStorage.getItem('journalEntries');
      if (storedEntries) {
        const entries: JournalEntryData[] = JSON.parse(storedEntries);
        const updatedEntries = entries.filter(
          (e) => !(e.date === date && e.userId === user?.id)
        );
        localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
      }
      setDeleteDialogOpen(false);
      navigate('/journal');
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton onClick={() => navigate('/journal')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {isNewEntry ? 'New Journal Entry' : `Edit Entry: ${format(parseISO(entry.date), 'MMMM d, yyyy')}`}
        </Typography>
        <Box>
          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            onClick={handleSave}
            sx={{ mr: 1 }}
          >
            Save
          </Button>
          {!isNewEntry && (
            <IconButton onClick={() => setDeleteDialogOpen(true)} color="error">
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {saveStatus && (
        <Alert 
          severity={saveStatus} 
          sx={{ mb: 2 }}
          onClose={() => setSaveStatus(null)}
        >
          {saveStatus === 'success' ? 'Entry saved successfully!' : 'Error saving entry'}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Initial Day Rating */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              How do you feel about today? (Initial Rating)
            </Typography>
            <Rating
              value={entry.initialRating}
              onChange={(_, value) => {
                setEntry(prev => ({
                  ...prev,
                  initialRating: value || 3
                }));
              }}
              max={5}
              size="large"
            />
          </Paper>
        </Grid>

        {/* Habits Section */}
        <Grid item xs={12}>
          <JournalSection title="Daily Habits">
            <HabitList
              habits={habits}
              onChange={setHabits}
            />
          </JournalSection>
        </Grid>

        {/* Gratitude */}
        <Grid item xs={12}>
          <JournalSection
            title="Gratitude"
            prompts={[
              'What are you grateful for today?',
              'What small things can you appreciate in your life?',
              'What positive experiences have you had?',
            ]}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Things I'm grateful for:
                </Typography>
                <ListInput
                  items={entry.gratitude.items}
                  onChange={(items) =>
                    setEntry({
                      ...entry,
                      gratitude: { ...entry.gratitude, items },
                    })
                  }
                  placeholder="Add something you're grateful for..."
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Small things to appreciate:
                </Typography>
                <ListInput
                  items={entry.gratitude.smallThings}
                  onChange={(smallThings) =>
                    setEntry({
                      ...entry,
                      gratitude: { ...entry.gratitude, smallThings },
                    })
                  }
                  placeholder="Add something to appreciate..."
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Positive experiences:
                </Typography>
                <ListInput
                  items={entry.gratitude.positiveExperiences}
                  onChange={(positiveExperiences) =>
                    setEntry({
                      ...entry,
                      gratitude: { ...entry.gratitude, positiveExperiences },
                    })
                  }
                  placeholder="Add a positive experience..."
                />
              </Grid>
            </Grid>
          </JournalSection>
        </Grid>

        {/* Daily Reflections */}
        <Grid item xs={12}>
          <JournalSection
            title="Daily Reflections"
            prompts={[
              'How did you feel today?',
              'What were your biggest accomplishments or challenges?',
              'What did you learn or reflect on today?',
            ]}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="How did you feel today?"
                  value={entry.dailyReflection.feelings}
                  onChange={(e) =>
                    setEntry({
                      ...entry,
                      dailyReflection: {
                        ...entry.dailyReflection,
                        feelings: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="What were your accomplishments?"
                  value={entry.dailyReflection.accomplishments}
                  onChange={(e) =>
                    setEntry({
                      ...entry,
                      dailyReflection: {
                        ...entry.dailyReflection,
                        accomplishments: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="What did you learn today?"
                  value={entry.dailyReflection.learnings}
                  onChange={(e) =>
                    setEntry({
                      ...entry,
                      dailyReflection: {
                        ...entry.dailyReflection,
                        learnings: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
            </Grid>
          </JournalSection>
        </Grid>

        {/* Mindfulness Exercises */}
        <Grid item xs={12}>
          <JournalSection
            title="Mindfulness Exercises"
            prompts={[
              'What mindfulness exercises did you practice today?',
              'How did they affect your mood and well-being?',
              'What did you notice about your thoughts and emotions?',
            ]}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ListInput
                  items={entry.mindfulness.exercises}
                  onChange={(exercises) =>
                    setEntry({
                      ...entry,
                      mindfulness: { ...entry.mindfulness, exercises },
                    })
                  }
                  placeholder="Add a mindfulness exercise..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="How did they affect your mood and well-being?"
                  value={entry.mindfulness.effects}
                  onChange={(e) =>
                    setEntry({
                      ...entry,
                      mindfulness: {
                        ...entry.mindfulness,
                        effects: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="What did you notice about your thoughts and emotions?"
                  value={entry.mindfulness.observations}
                  onChange={(e) =>
                    setEntry({
                      ...entry,
                      mindfulness: {
                        ...entry.mindfulness,
                        observations: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
            </Grid>
          </JournalSection>
        </Grid>

        {/* Stress Management */}
        <Grid item xs={12}>
          <JournalSection
            title="Stress Management and Coping Mechanisms"
            prompts={[
              'What stressful situations did you encounter today?',
              'How did you manage your stress?',
              'What coping mechanisms did you use?',
            ]}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ListInput
                  items={entry.stressManagement.situations}
                  onChange={(situations) =>
                    setEntry({
                      ...entry,
                      stressManagement: { ...entry.stressManagement, situations },
                    })
                  }
                  placeholder="Add a stressful situation..."
                />
              </Grid>
              <Grid item xs={12}>
                <ListInput
                  items={entry.stressManagement.copingMechanisms}
                  onChange={(copingMechanisms) =>
                    setEntry({
                      ...entry,
                      stressManagement: { ...entry.stressManagement, copingMechanisms },
                    })
                  }
                  placeholder="Add a coping mechanism..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="How effective were your coping strategies?"
                  value={entry.stressManagement.effectiveness}
                  onChange={(e) =>
                    setEntry({
                      ...entry,
                      stressManagement: {
                        ...entry.stressManagement,
                        effectiveness: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
            </Grid>
          </JournalSection>
        </Grid>

        {/* Personal Growth */}
        <Grid item xs={12}>
          <JournalSection
            title="Personal Growth and Development"
            prompts={[
              'What skills or knowledge did you gain today?',
              'What personal qualities did you develop?',
              'What challenges or limitations did you identify?',
            ]}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ListInput
                  items={entry.personalGrowth.skillsGained}
                  onChange={(skillsGained) =>
                    setEntry({
                      ...entry,
                      personalGrowth: { ...entry.personalGrowth, skillsGained },
                    })
                  }
                  placeholder="Add a skill or knowledge gained..."
                />
              </Grid>
              <Grid item xs={12}>
                <ListInput
                  items={entry.personalGrowth.qualitiesDeveloped}
                  onChange={(qualitiesDeveloped) =>
                    setEntry({
                      ...entry,
                      personalGrowth: { ...entry.personalGrowth, qualitiesDeveloped },
                    })
                  }
                  placeholder="Add a quality you developed..."
                />
              </Grid>
              <Grid item xs={12}>
                <ListInput
                  items={entry.personalGrowth.areasForImprovement}
                  onChange={(areasForImprovement) =>
                    setEntry({
                      ...entry,
                      personalGrowth: { ...entry.personalGrowth, areasForImprovement },
                    })
                  }
                  placeholder="Add an area for improvement..."
                />
              </Grid>
            </Grid>
          </JournalSection>
        </Grid>

        {/* Goal Setting */}
        <Grid item xs={12}>
          <JournalSection
            title="Goal Setting and Progress Tracking"
            prompts={[
              'What are your goals for today or this week?',
              'What steps did you take to achieve your goals?',
              'How are you tracking your progress?',
            ]}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ListInput
                  items={entry.goalTracking.dailyGoals}
                  onChange={(dailyGoals) =>
                    setEntry({
                      ...entry,
                      goalTracking: { ...entry.goalTracking, dailyGoals },
                    })
                  }
                  placeholder="Add a daily goal..."
                />
              </Grid>
              <Grid item xs={12}>
                <ListInput
                  items={entry.goalTracking.weeklyGoals}
                  onChange={(weeklyGoals) =>
                    setEntry({
                      ...entry,
                      goalTracking: { ...entry.goalTracking, weeklyGoals },
                    })
                  }
                  placeholder="Add a weekly goal..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="What progress have you made?"
                  value={entry.goalTracking.progress}
                  onChange={(e) =>
                    setEntry({
                      ...entry,
                      goalTracking: {
                        ...entry.goalTracking,
                        progress: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="What are your next steps?"
                  value={entry.goalTracking.nextSteps}
                  onChange={(e) =>
                    setEntry({
                      ...entry,
                      goalTracking: {
                        ...entry.goalTracking,
                        nextSteps: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
            </Grid>
          </JournalSection>
        </Grid>

        {/* Inspiration */}
        <Grid item xs={12}>
          <JournalSection
            title="Inspiration and Motivation"
            prompts={[
              'What motivated you today?',
              'What inspiring quotes or stories did you read or hear?',
              'What actions can you take to stay motivated?',
            ]}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ListInput
                  items={entry.inspiration.motivators}
                  onChange={(motivators) =>
                    setEntry({
                      ...entry,
                      inspiration: { ...entry.inspiration, motivators },
                    })
                  }
                  placeholder="Add something that motivated you..."
                />
              </Grid>
              <Grid item xs={12}>
                <ListInput
                  items={entry.inspiration.quotes}
                  onChange={(quotes) =>
                    setEntry({
                      ...entry,
                      inspiration: { ...entry.inspiration, quotes },
                    })
                  }
                  placeholder="Add an inspiring quote..."
                />
              </Grid>
              <Grid item xs={12}>
                <ListInput
                  items={entry.inspiration.actionItems}
                  onChange={(actionItems) =>
                    setEntry({
                      ...entry,
                      inspiration: { ...entry.inspiration, actionItems },
                    })
                  }
                  placeholder="Add an action to stay motivated..."
                />
              </Grid>
            </Grid>
          </JournalSection>
        </Grid>

        {/* Final Rating After Reflection */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              After reflecting, how would you rate your day?
            </Typography>
            <Rating
              value={entry.finalRating}
              onChange={(_, value) => {
                setEntry(prev => ({
                  ...prev,
                  finalRating: value || 3
                }));
              }}
              max={5}
              size="large"
            />
          </Paper>
        </Grid>

        {/* Final Reflection */}
        <Grid item xs={12}>
          <JournalSection
            title="Final Reflection"
            prompts={[
              'Considering all you have written down, how do you feel about your day?',
            ]}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Final thoughts about your day"
                  value={entry.finalReflection.summary}
                  onChange={(e) =>
                    setEntry({
                      ...entry,
                      finalReflection: {
                        ...entry.finalReflection,
                        summary: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
            </Grid>
          </JournalSection>
        </Grid>
      </Grid>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Journal Entry</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this journal entry? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JournalEntry;
