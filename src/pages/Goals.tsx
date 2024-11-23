import React, { useState } from 'react';
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
  LinearProgress,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Flag as FlagIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  deadline: Date;
  progress: number;
  steps: {
    id: string;
    description: string;
    completed: boolean;
  }[];
  completed: boolean;
}

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Read 12 Books',
      description: 'Read one book per month to expand knowledge',
      category: 'Learning',
      deadline: new Date('2024-12-31'),
      progress: 75,
      steps: [
        { id: '1', description: 'Create reading list', completed: true },
        { id: '2', description: 'Read 30 minutes daily', completed: true },
        { id: '3', description: 'Take notes on key insights', completed: false },
      ],
      completed: false,
    },
    // Add more mock goals here
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newStep, setNewStep] = useState('');

  const categories = ['Health', 'Learning', 'Career', 'Personal', 'Financial'];

  const handleOpenDialog = (goal?: Goal) => {
    if (goal) {
      setSelectedGoal(goal);
    } else {
      setSelectedGoal({
        id: Math.random().toString(),
        title: '',
        description: '',
        category: '',
        deadline: new Date(),
        progress: 0,
        steps: [],
        completed: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedGoal(null);
    setNewStep('');
  };

  const handleSaveGoal = () => {
    if (selectedGoal) {
      const updatedGoals = goals.map((g) =>
        g.id === selectedGoal.id ? selectedGoal : g
      );
      setGoals(
        selectedGoal.id === Math.random().toString()
          ? [...goals, selectedGoal]
          : updatedGoals
      );
    }
    handleCloseDialog();
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter((g) => g.id !== goalId));
  };

  const handleAddStep = () => {
    if (selectedGoal && newStep.trim()) {
      setSelectedGoal({
        ...selectedGoal,
        steps: [
          ...selectedGoal.steps,
          {
            id: Math.random().toString(),
            description: newStep,
            completed: false,
          },
        ],
      });
      setNewStep('');
    }
  };

  const handleToggleStep = (goalId: string, stepId: string) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          const updatedSteps = goal.steps.map((step) =>
            step.id === stepId ? { ...step, completed: !step.completed } : step
          );
          const progress =
            (updatedSteps.filter((step) => step.completed).length /
              updatedSteps.length) *
            100;
          return {
            ...goal,
            steps: updatedSteps,
            progress,
            completed: progress === 100,
          };
        }
        return goal;
      })
    );
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Goals
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Goal
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Goal Statistics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">
                    {goals.filter((g) => g.completed).length}
                  </Typography>
                  <Typography color="text.secondary">Completed Goals</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <TimelineIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">
                    {goals.filter((g) => !g.completed).length}
                  </Typography>
                  <Typography color="text.secondary">In Progress</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <FlagIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">{goals.length}</Typography>
                  <Typography color="text.secondary">Total Goals</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Goals List */}
        {goals.map((goal) => (
          <Grid item xs={12} md={6} key={goal.id}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">{goal.title}</Typography>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(goal)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteGoal(goal.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>

              <Typography color="text.secondary" paragraph>
                {goal.description}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Chip
                  label={goal.category}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={`Due: ${new Date(goal.deadline).toLocaleDateString()}`}
                  size="small"
                  variant="outlined"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Progress
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(goal.progress)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={goal.progress}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <List dense>
                {goal.steps.map((step) => (
                  <ListItem key={step.id} disablePadding>
                    <ListItemText
                      primary={step.description}
                      sx={{
                        textDecoration: step.completed ? 'line-through' : 'none',
                      }}
                    />
                    <ListItemSecondaryAction>
                      <Checkbox
                        edge="end"
                        checked={step.completed}
                        onChange={() => handleToggleStep(goal.id, step.id)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Goal Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedGoal?.id === Math.random().toString()
            ? 'Create New Goal'
            : 'Edit Goal'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={selectedGoal?.title || ''}
              onChange={(e) =>
                setSelectedGoal(
                  selectedGoal
                    ? { ...selectedGoal, title: e.target.value }
                    : null
                )
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={selectedGoal?.description || ''}
              onChange={(e) =>
                setSelectedGoal(
                  selectedGoal
                    ? { ...selectedGoal, description: e.target.value }
                    : null
                )
              }
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedGoal?.category || ''}
                label="Category"
                onChange={(e) =>
                  setSelectedGoal(
                    selectedGoal
                      ? { ...selectedGoal, category: e.target.value }
                      : null
                  )
                }
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <DatePicker
              label="Deadline"
              value={selectedGoal?.deadline || null}
              onChange={(date) =>
                setSelectedGoal(
                  selectedGoal ? { ...selectedGoal, deadline: date || new Date() } : null
                )
              }
              sx={{ width: '100%', mb: 2 }}
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Steps
            </Typography>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <TextField
                fullWidth
                label="New Step"
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                sx={{ mr: 1 }}
              />
              <Button variant="contained" onClick={handleAddStep}>
                Add
              </Button>
            </Box>
            <List dense>
              {selectedGoal?.steps.map((step, index) => (
                <ListItem key={step.id}>
                  <ListItemText primary={step.description} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() =>
                        setSelectedGoal(
                          selectedGoal
                            ? {
                                ...selectedGoal,
                                steps: selectedGoal.steps.filter(
                                  (s) => s.id !== step.id
                                ),
                              }
                            : null
                        )
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveGoal} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Goals;
