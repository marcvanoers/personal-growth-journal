import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  CardActionArea,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Mood as MoodIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  mood: number;
  content: string;
  tags: string[];
  gratitude: string[];
  achievements: string[];
  improvements: string[];
  userId: number;
}

const JournalList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    // Load entries from localStorage
    const loadEntries = () => {
      const storedEntries = localStorage.getItem('journalEntries');
      if (storedEntries) {
        const allEntries: JournalEntry[] = JSON.parse(storedEntries);
        // Filter entries for current user
        const userEntries = allEntries.filter(entry => entry.userId === user?.id);
        setEntries(userEntries);
      }
    };

    loadEntries();
  }, [user?.id]);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleMoodFilter = (mood: number) => {
    setSelectedMood(mood === selectedMood ? null : mood);
    handleFilterClose();
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = searchTerm === '' || (
      (entry.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (entry.content?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (entry.tags || []).some(tag => (tag?.toLowerCase() || '').includes(searchTerm.toLowerCase())) ||
      (entry.gratitude || []).some(item => (item?.toLowerCase() || '').includes(searchTerm.toLowerCase())) ||
      (entry.achievements || []).some(item => (item?.toLowerCase() || '').includes(searchTerm.toLowerCase())) ||
      (entry.improvements || []).some(item => (item?.toLowerCase() || '').includes(searchTerm.toLowerCase()))
    );
    
    const matchesMood = !selectedMood || entry.mood === selectedMood;
    
    return matchesSearch && matchesMood;
  });

  const getMoodColor = (mood: number): "error" | "warning" | "info" | "success" | "default" => {
    if (mood <= 1) return "error";
    if (mood <= 2) return "warning";
    if (mood <= 3) return "info";
    if (mood <= 4) return "success";
    return "default";
  };

  const getMoodLabel = (mood: number): string => {
    if (mood <= 1) return "Challenging";
    if (mood <= 2) return "Difficult";
    if (mood <= 3) return "Neutral";
    if (mood <= 4) return "Good";
    return "Excellent";
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Journal Entries
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/journal/new')}
        >
          New Entry
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={8}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={handleFilterClick}
              sx={{ mr: 1 }}
            >
              Filter by Mood
            </Button>
            {selectedMood !== null && (
              <Chip
                label={getMoodLabel(selectedMood)}
                onDelete={() => setSelectedMood(null)}
                color={getMoodColor(selectedMood)}
                sx={{ ml: 1 }}
              />
            )}
          </Grid>
        </Grid>

        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
        >
          {[5, 4, 3, 2, 1].map((mood) => (
            <MenuItem key={mood} onClick={() => handleMoodFilter(mood)}>
              <Chip 
                label={getMoodLabel(mood)}
                color={getMoodColor(mood)}
                size="small"
                sx={{ mr: 1 }}
              />
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <Grid container spacing={3}>
        {!filteredEntries || filteredEntries.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center" color="text.secondary">
                  {searchTerm
                    ? "No entries match your search"
                    : "No journal entries yet. Click 'New Entry' to get started!"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          filteredEntries.map((entry) => (
            <Grid item xs={12} key={entry.id}>
              <Card>
                <CardActionArea onClick={() => navigate(`/journal/${entry.date}`)}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {entry.title || 'Untitled Entry'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CalendarIcon sx={{ fontSize: 'small', mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {format(new Date(entry.date || new Date()), 'MMMM d, yyyy')}
                          </Typography>
                          <Chip
                            icon={<MoodIcon />}
                            label={getMoodLabel(entry.mood || 3)}
                            color={getMoodColor(entry.mood || 3)}
                            size="small"
                            sx={{ ml: 2 }}
                          />
                        </Box>
                      </Box>
                      <Tooltip title="Edit Entry">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/journal/${entry.date}`);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="body1" paragraph>
                      {(entry.content?.length || 0) > 200
                        ? `${(entry.content || '').substring(0, 200)}...`
                        : entry.content || ''}
                    </Typography>
                    {(entry.tags?.length || 0) > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {(entry.tags || []).map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default JournalList;
