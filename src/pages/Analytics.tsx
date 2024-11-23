import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Paper, 
  Grid, 
  Typography, 
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { blue, green, red, orange } from '@mui/material/colors';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { format, parseISO, subDays, isWithinInterval } from 'date-fns';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import StarIcon from '@mui/icons-material/Star';
import { JournalEntryData as JournalEntry, Habit } from '../types/journal';
import { getHabits } from '../services/habitService';
import { useAuth } from '../contexts/AuthContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HabitMetrics {
  currentRating: number;
  previousRating: number;
  trend: 'up' | 'down' | 'flat';
  streak: number;
  bestRating: number;
  completionRate: number;
  recentRatings: number[];
}

interface DayRatings {
  initialRating: number[];
  finalRating: number[];
  dates: string[];
  averageInitial: number;
  averageFinal: number;
  trend: 'up' | 'down' | 'flat';
  improvement: number;
}

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<number>(7); // days
  const [habits, setHabits] = useState<Habit[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [habitMetrics, setHabitMetrics] = useState<Record<string, HabitMetrics>>({});
  const [dayRatings, setDayRatings] = useState<DayRatings>({
    initialRating: [],
    finalRating: [],
    dates: [],
    averageInitial: 0,
    averageFinal: 0,
    trend: 'flat',
    improvement: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load habits
        const loadedHabits = getHabits();
        setHabits(loadedHabits);

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
      } catch (error) {
        console.error('Error loading journal entries:', error);
      }
    };

    loadData();
  }, [user?.id]);

  useEffect(() => {
    calculateHabitMetrics();
    calculateDayRatings();
  }, [entries, habits, timeRange]);

  const calculateHabitMetrics = () => {
    const metrics: Record<string, HabitMetrics> = {};
    
    habits.forEach(habit => {
      const habitEntries = entries
        .filter(entry => entry.habits.some(h => h.id === habit.id))
        .map(entry => entry.habits.find(h => h.id === habit.id))
        .filter((habit): habit is Habit => habit !== undefined)
        .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));

      const currentRating = habitEntries[habitEntries.length - 1]?.rating || 0;
      const previousRating = habitEntries[habitEntries.length - 2]?.rating || 0;

      let trend: 'up' | 'down' | 'flat' = 'flat';
      if (currentRating > previousRating) trend = 'up';
      else if (currentRating < previousRating) trend = 'down';

      let streak = 0;
      for (let i = habitEntries.length - 1; i >= 0; i--) {
        if (habitEntries[i].rating >= 3) streak++;
        else break;
      }

      const recentRatings = habitEntries.slice(-7).map(entry => entry.rating);

      metrics[habit.id] = {
        currentRating,
        previousRating,
        trend,
        streak,
        bestRating: Math.max(...habitEntries.map(entry => entry.rating)),
        completionRate: habitEntries.filter(entry => entry.rating >= 3).length / habitEntries.length * 100,
        recentRatings
      };
    });

    setHabitMetrics(metrics);
  };

  const calculateDayRatings = () => {
    const endDate = new Date();
    const startDate = subDays(endDate, timeRange);
    
    const relevantEntries = entries
      .filter(entry => {
        const entryDate = parseISO(entry.date);
        return isWithinInterval(entryDate, { start: startDate, end: endDate });
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    const initialRatings = relevantEntries.map(entry => entry.initialRating || 0);
    const finalRatings = relevantEntries.map(entry => entry.finalRating || 0);
    const dates = relevantEntries.map(entry => format(parseISO(entry.date), 'MMM d'));

    const avgInitial = initialRatings.length > 0 
      ? Number((initialRatings.reduce((a, b) => a + b, 0) / initialRatings.length).toFixed(1))
      : 0;

    const avgFinal = finalRatings.length > 0
      ? Number((finalRatings.reduce((a, b) => a + b, 0) / finalRatings.length).toFixed(1))
      : 0;

    const improvement = Number((avgFinal - avgInitial).toFixed(1));
    
    let trend: 'up' | 'down' | 'flat' = 'flat';
    if (improvement > 0) trend = 'up';
    else if (improvement < 0) trend = 'down';

    setDayRatings({
      initialRating: initialRatings,
      finalRating: finalRatings,
      dates,
      averageInitial: avgInitial,
      averageFinal: avgFinal,
      trend,
      improvement
    });
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'flat') => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon sx={{ color: green[500] }} />;
      case 'down':
        return <TrendingDownIcon sx={{ color: red[500] }} />;
      default:
        return <TrendingFlatIcon sx={{ color: orange[500] }} />;
    }
  };

  const SparklineChart: React.FC<{ data: number[] }> = ({ data }) => {
    const chartData = {
      labels: new Array(data.length).fill(''),
      datasets: [
        {
          data: data,
          borderColor: `${blue[200]}`,
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 80);
            gradient.addColorStop(0, `${blue[50]}33`); // 33 is hex for 20% opacity
            gradient.addColorStop(1, `${blue[50]}00`); // 00 is hex for 0% opacity
            return gradient;
          },
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.4,
          fill: true,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false,
          },
        },
        y: {
          display: false,
          min: 0,
          max: 5,
          grid: {
            display: false,
          },
        },
      },
    };

    return (
      <Box sx={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        height: '60px', 
        opacity: 0.6,
        pointerEvents: 'none',
      }}>
        <Line data={chartData} options={options} />
      </Box>
    );
  };

  const DayRatingChart: React.FC<{ data: DayRatings }> = ({ data }) => {
    const chartData = {
      labels: data.dates,
      datasets: [
        {
          label: 'Initial Rating',
          data: data.initialRating,
          borderColor: blue[300],
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 160);
            gradient.addColorStop(0, `${blue[50]}33`);
            gradient.addColorStop(1, `${blue[50]}00`);
            return gradient;
          },
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Final Rating',
          data: data.finalRating,
          borderColor: green[300],
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 160);
            gradient.addColorStop(0, `${green[50]}33`);
            gradient.addColorStop(1, `${green[50]}00`);
            return gradient;
          },
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          fill: true,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false,
          },
        },
        y: {
          display: false,
          min: 0,
          max: 5,
          grid: {
            display: false,
          },
        },
      },
    };

    return (
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '160px',
        opacity: 0.5,
        pointerEvents: 'none',
      }}>
        <Line data={chartData} options={options} />
      </Box>
    );
  };

  // Process data for the charts
  const processHabitData = () => {
    const endDate = new Date();
    const startDate = subDays(endDate, timeRange);
    
    // Filter entries within the time range
    const filteredEntries = entries
      .filter(entry => {
        const entryDate = parseISO(entry.date);
        return entryDate >= startDate && entryDate <= endDate;
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    // Generate labels (dates)
    const labels = filteredEntries.map(entry => 
      format(parseISO(entry.date), 'MMM d')
    );

    // Generate datasets for each habit
    const datasets = habits.map(habit => {
      const data = filteredEntries.map(entry => {
        const habitEntry = entry.habits?.find(h => h.id === habit.id);
        return habitEntry?.rating || 0;
      });

      return {
        label: habit.name,
        data,
        borderColor: getRandomColor(),
        tension: 0.1,
        fill: false
      };
    });

    return { labels, datasets };
  };

  const getRandomColor = () => {
    const colors = [
      'rgb(75, 192, 192)',   // Teal
      'rgb(153, 102, 255)',  // Purple
      'rgb(255, 99, 132)',   // Pink
      'rgb(255, 159, 64)',   // Orange
      'rgb(54, 162, 235)',   // Blue
      'rgb(255, 205, 86)',   // Yellow
      'rgb(201, 203, 207)'   // Grey
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y} rating`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const habitData = processHabitData();

  const calculateAverageRating = (habitId: string): number => {
    const habitEntries = entries.filter(entry => 
      entry.habits?.some(h => h.id === habitId && h.rating > 0)
    );
    
    if (habitEntries.length === 0) return 0;

    const sum = habitEntries.reduce((acc, entry) => {
      const habitRating = entry.habits?.find(h => h.id === habitId)?.rating || 0;
      return acc + habitRating;
    }, 0);

    return Number((sum / habitEntries.length).toFixed(1));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">
          Analytics Dashboard
        </Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(Number(e.target.value))}
          >
            <MenuItem value={7}>Last 7 days</MenuItem>
            <MenuItem value={14}>Last 14 days</MenuItem>
            <MenuItem value={30}>Last 30 days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Overall Day Rating Card */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3,
              background: `linear-gradient(135deg, ${blue[50]}, white)`,
              borderTop: `4px solid ${blue[400]}`,
              position: 'relative',
              overflow: 'hidden',
              minHeight: '200px'
            }}
          >
            <Box sx={{ 
              position: 'relative', 
              zIndex: 1,
              '& > *': { backgroundColor: 'transparent' }
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <Typography variant="h5" sx={{ color: blue[700], fontWeight: 'bold', mb: 1 }}>
                    Day Rating Comparison
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Initial vs Final ratings after reflection
                  </Typography>
                </Box>
                {getTrendIcon(dayRatings.trend)}
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: blue[300], 
                      mr: 1 
                    }} />
                    <Typography variant="body2" color="text.secondary">
                      Initial Rating Average
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ color: blue[700] }}>
                    {dayRatings.averageInitial}/5
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: green[300], 
                      mr: 1 
                    }} />
                    <Typography variant="body2" color="text.secondary">
                      Final Rating Average
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ color: green[700] }}>
                    {dayRatings.averageFinal}/5
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Reflection Impact
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ 
                      color: dayRatings.improvement > 0 ? green[700] : 
                            dayRatings.improvement < 0 ? red[700] : 
                            'text.primary'
                    }}>
                      {dayRatings.improvement > 0 ? '+' : ''}{dayRatings.improvement}
                    </Typography>
                    <Typography variant="body1" sx={{ ml: 1, color: 'text.secondary' }}>
                      points
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            
            <DayRatingChart data={dayRatings} />
          </Paper>
        </Grid>
      </Grid>

      {/* Habit Score Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {habits.map(habit => (
          <Grid item xs={12} sm={6} md={4} key={habit.id}>
            <Paper 
              sx={{ 
                p: 2,
                height: '100%',
                background: `linear-gradient(135deg, ${blue[50]}, white)`,
                borderTop: `4px solid ${blue[400]}`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ 
                position: 'relative', 
                zIndex: 1, 
                height: '100%',
                '& > *': { backgroundColor: 'transparent' }
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: blue[700], fontWeight: 'bold' }}>
                    {habit.name}
                  </Typography>
                  {getTrendIcon(habitMetrics[habit.id]?.trend || 'flat')}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Current Rating</Typography>
                    <Typography variant="h6">
                      {habitMetrics[habit.id]?.currentRating || 0}/5
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Streak</Typography>
                    <Typography variant="h6">
                      {habitMetrics[habit.id]?.streak || 0} days
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Average Rating</Typography>
                    <Typography variant="h6">
                      {habitMetrics[habit.id]?.averageRating || 0}/5
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Best Rating</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h6">
                        {habitMetrics[habit.id]?.bestRating || 0}/5
                      </Typography>
                      {(habitMetrics[habit.id]?.bestRating || 0) >= 4 && 
                        <StarIcon sx={{ color: orange[500], ml: 0.5 }} />
                      }
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Completion Rate</Typography>
                    <Typography variant="h6">
                      {habitMetrics[habit.id]?.completionRate || 0}%
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              {/* Sparkline background */}
              <SparklineChart data={habitMetrics[habit.id]?.recentRatings || []} />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Habit Rating Trends
            </Typography>
            <Line options={options} data={habitData} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Habit Performance Insights
            </Typography>
            {habits.map(habit => (
              <Typography key={habit.id} variant="body1" sx={{ mb: 1 }}>
                • {habit.name}: Average rating of {calculateAverageRating(habit.id)}/5
                {calculateAverageRating(habit.id) >= 4 && ' - Great performance! 🌟'}
                {calculateAverageRating(habit.id) >= 3 && calculateAverageRating(habit.id) < 4 && ' - Good progress! 👍'}
                {calculateAverageRating(habit.id) < 3 && calculateAverageRating(habit.id) > 0 && ' - Room for improvement 💪'}
              </Typography>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
