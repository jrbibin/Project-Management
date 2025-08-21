import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container
} from '@mui/material';
import { Description as LogsIcon } from '@mui/icons-material';

const LogsView: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <LogsIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" fontWeight="bold">
          System Logs
        </Typography>
      </Box>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Activity Logs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This is the Logs view. Here you can monitor system activity,
            track user actions, and review system events and errors.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LogsView;