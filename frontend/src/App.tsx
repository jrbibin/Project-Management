import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  FolderOpen as ProjectIcon,
  CameraAlt as ShotsIcon,
  Assignment as TaskIcon,
  AccountTree as HierarchicalIcon,
  Help as QueriesIcon,
  Business as ClientsIcon,
  Archive as ArchiveIcon,
  Description as LogsIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';

// Import components
import ProjectDashboard from './components/ProjectDashboard';
import ProjectView from './components/ProjectView';
import ShotsView from './components/ShotsView';
import TaskView from './components/TaskView';
import HierarchicalTaskView from './components/HierarchicalTaskView';
import QueriesView from './components/QueriesView';
import ClientsView from './components/ClientsView';
import ArchiveView from './components/ArchiveView';
import LogsView from './components/LogsView';
import UserView from './components/UserView';
import SettingsView from './components/SettingsView';
import { ThemeContextProvider, useTheme } from './contexts/ThemeContext';
import Logo from './components/Logo';



// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Configure axios
axios.defaults.baseURL = 'http://localhost:8000';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function NavigationTabs() {
  const location = useLocation();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') setValue(0);
    else if (path === '/project') setValue(1);
    else if (path === '/shots') setValue(2);
    else if (path === '/tasks') setValue(3);
    else if (path === '/hierarchical-tasks') setValue(4);
    else if (path === '/queries') setValue(5);
    else if (path === '/clients') setValue(6);
    else if (path === '/archive') setValue(7);
    else if (path === '/logs') setValue(8);
    else if (path === '/users') setValue(9);
    else if (path === '/settings') setValue(10);
  }, [location]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      aria-label="navigation tabs"
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      <Tab
        icon={<DashboardIcon />}
        label="Dashboard"
        component={Link}
        to="/dashboard"
      />
      <Tab
        icon={<ProjectIcon />}
        label="Projects"
        component={Link}
        to="/project"
      />
      <Tab
        icon={<ShotsIcon />}
        label="Shots"
        component={Link}
        to="/shots"
      />
      <Tab
        icon={<TaskIcon />}
        label="Tasks"
        component={Link}
        to="/tasks"
      />
      <Tab
        icon={<HierarchicalIcon />}
        label="Hierarchical Tasks"
        component={Link}
        to="/hierarchical-tasks"
      />
      <Tab
        icon={<QueriesIcon />}
        label="Queries"
        component={Link}
        to="/queries"
      />
      <Tab
        icon={<ClientsIcon />}
        label="Clients"
        component={Link}
        to="/clients"
      />
      <Tab
        icon={<ArchiveIcon />}
        label="Archive"
        component={Link}
        to="/archive"
      />
      <Tab
        icon={<LogsIcon />}
        label="Logs"
        component={Link}
        to="/logs"
      />
      <Tab
        icon={<UsersIcon />}
        label="Users"
        component={Link}
        to="/users"
      />
      <Tab
        icon={<SettingsIcon />}
        label="Settings"
        component={Link}
        to="/settings"
      />
    </Tabs>
  );
}

function AppContent() {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Logo variant="icon" sx={{ mr: 2, fontSize: 40 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              ETRA Project Management
            </Typography>
          <Chip
            label="Production Ready"
            color="success"
            size="small"
            sx={{ ml: 2 }}
          />
          <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton 
              onClick={toggleTheme} 
              color="inherit"
              sx={{ 
                ml: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <NavigationTabs />
        
        <Routes>
          <Route path="/" element={<ProjectDashboard />} />
          <Route path="/dashboard" element={<ProjectDashboard />} />
          <Route path="/project" element={<ProjectView />} />
          <Route path="/shots" element={<ShotsView />} />
          <Route path="/tasks" element={<TaskView />} />
          <Route path="/hierarchical-tasks" element={<HierarchicalTaskView />} />
          <Route path="/queries" element={<QueriesView />} />
          <Route path="/clients" element={<ClientsView />} />
          <Route path="/archive" element={<ArchiveView />} />
          <Route path="/logs" element={<LogsView />} />
          <Route path="/users" element={<UserView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </Container>
    </Box>
  );
}

function App() {
  return (
    <ThemeContextProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppContent />
        </Router>
      </QueryClientProvider>
    </ThemeContextProvider>
  );
}

export default App;
