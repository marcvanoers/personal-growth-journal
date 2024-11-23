import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { AuthProvider } from './contexts/AuthContext';
import { theme } from './styles/theme';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JournalEntry from './pages/JournalEntry';
import JournalList from './pages/JournalList';
import Goals from './pages/Goals';
import Habits from './pages/Habits';
import Questionnaires from './pages/Questionnaires';
import Analytics from './pages/Analytics';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Private routes - wrapped in Layout */}
              <Route
                path="/*"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/journal">
                          <Route index element={<JournalList />} />
                          <Route path="new" element={<JournalEntry />} />
                          <Route path=":date" element={<JournalEntry />} />
                        </Route>
                        <Route path="/goals" element={<Goals />} />
                        <Route path="/habits" element={<Habits />} />
                        <Route path="/questionnaires" element={<Questionnaires />} />
                        <Route path="/analytics" element={<Analytics />} />
                      </Routes>
                    </Layout>
                  </PrivateRoute>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
