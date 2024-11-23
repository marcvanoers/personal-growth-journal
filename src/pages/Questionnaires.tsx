import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';

interface Question {
  id: number;
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    text: 'How would you rate your overall mood today?',
    options: ['Very Poor', 'Poor', 'Neutral', 'Good', 'Excellent'],
  },
  {
    id: 2,
    text: 'How well did you sleep last night?',
    options: ['Very Poorly', 'Poorly', 'Average', 'Well', 'Very Well'],
  },
  {
    id: 3,
    text: 'How productive do you feel today?',
    options: ['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely'],
  },
  {
    id: 4,
    text: 'How stressed do you feel?',
    options: ['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely'],
  },
  {
    id: 5,
    text: 'How satisfied are you with your progress towards your goals?',
    options: ['Very Unsatisfied', 'Unsatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
  },
];

const Questionnaires: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    // Here you would typically send the answers to your backend
    console.log('Submitted answers:', answers);
    setSubmitted(true);
  };

  const currentQuestion = questions[activeStep];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Daily Check-in
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {questions.map((_, index) => (
          <Step key={index}>
            <StepLabel>Question {index + 1}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {submitted ? (
        <Alert severity="success" sx={{ mt: 2 }}>
          Thank you for completing today's check-in!
        </Alert>
      ) : (
        <Paper sx={{ p: 3 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ mb: 2 }}>
              {currentQuestion.text}
            </FormLabel>
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            >
              {currentQuestion.options.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              variant="outlined"
            >
              Back
            </Button>
            {activeStep === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={!answers[currentQuestion.id]}
              >
                Submit
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                disabled={!answers[currentQuestion.id]}
              >
                Next
              </Button>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Questionnaires;
