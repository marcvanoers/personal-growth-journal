import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp,
  CheckCircle,
  SentimentSatisfied,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock data - will be replaced with real API calls
  const mockData = {
    streakDays: 7,
    completedHabits: 3,
    totalHabits: 5,
    currentMood: 'Good',
    recentJournals: [
      { date: '2023-11-15', title: 'Productive Day' },
      { date: '2023-11-14', title: 'New Insights' },
      { date: '2023-11-13', title: 'Morning Reflection' },
    ],
    activeGoals: [
      { title: 'Read 12 Books', progress: 75 },
      { title: 'Exercise Routine', progress: 60 },
      { title: 'Learn TypeScript', progress: 40 },
    ],
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/journal/new')}
        >
          New Journal Entry
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'primary.light',
              color: 'white',
            }}
          >
            <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4">{mockData.streakDays}</Typography>
            <Typography>Day Streak</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'secondary.light',
              color: 'white',
            }}
          >
            <CheckCircle sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4">
              {mockData.completedHabits}/{mockData.totalHabits}
            </Typography>
            <Typography>Habits Completed</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'success.light',
              color: 'white',
            }}
          >
            <SentimentSatisfied sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4">{mockData.currentMood}</Typography>
            <Typography>Current Mood</Typography>
          </Paper>
        </Grid>

        {/* Recent Journal Entries */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Journal Entries
              </Typography>
              <List>
                {mockData.recentJournals.map((journal, index) => (
                  <React.Fragment key={journal.date}>
                    <ListItem>
                      <ListItemText
                        primary={journal.title}
                        secondary={journal.date}
                      />
                      <Button
                        size="small"
                        onClick={() => navigate(`/journal/${journal.date}`)}
                      >
                        View
                      </Button>
                    </ListItem>
                    {index < mockData.recentJournals.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/journal')}>
                View All Entries
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Active Goals */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Goals
              </Typography>
              <List>
                {mockData.activeGoals.map((goal, index) => (
                  <React.Fragment key={goal.title}>
                    <ListItem>
                      <Box sx={{ width: '100%' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 1,
                          }}
                        >
                          <Typography variant="body1">{goal.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {goal.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={goal.progress}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    </ListItem>
                    {index < mockData.activeGoals.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/goals')}>
                View All Goals
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
