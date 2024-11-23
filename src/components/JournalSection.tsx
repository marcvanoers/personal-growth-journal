import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Rating,
  Chip,
  IconButton,
  Paper,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface JournalSectionProps {
  title: string;
  prompts?: string[];
  children: React.ReactNode;
}

const JournalSection: React.FC<JournalSectionProps> = ({
  title,
  prompts,
  children,
}) => {
  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {prompts && (
        <Box sx={{ mb: 2 }}>
          {prompts.map((prompt, index) => (
            <Typography
              key={index}
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              • {prompt}
            </Typography>
          ))}
        </Box>
      )}
      {children}
    </Paper>
  );
};

interface ListInputProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export const ListInput: React.FC<ListInputProps> = ({
  items,
  onChange,
  placeholder = 'Add item...',
}) => {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleDelete = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder={placeholder}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <IconButton onClick={handleAdd} color="primary">
          <AddIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {items.map((item, index) => (
          <Chip
            key={index}
            label={item}
            onDelete={() => handleDelete(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export const RatingInput: React.FC<RatingInputProps> = ({
  value,
  onChange,
  label,
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {label && (
        <Typography component="legend" sx={{ minWidth: 100 }}>
          {label}
        </Typography>
      )}
      <Rating
        value={value}
        onChange={(_, newValue) => onChange(newValue || 0)}
      />
    </Box>
  );
};

export default JournalSection;
