import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container
} from '@mui/material';
import { CameraAlt as ShotsIcon } from '@mui/icons-material';

const ShotsView: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ShotsIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" fontWeight="bold">
          Shots Management
        </Typography>
      </Box>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Shot Tracking
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This is the Shots Management view. Here you can track individual shots,
            their progress, and manage shot-specific details and assets.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ShotsView;