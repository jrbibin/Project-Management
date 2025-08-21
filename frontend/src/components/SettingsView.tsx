import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';

const SettingsView: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SettingsIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" fontWeight="bold">
          System Settings
        </Typography>
      </Box>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Configuration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This is the Settings view. Here you can configure system preferences,
            manage user permissions, and adjust application settings.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SettingsView;