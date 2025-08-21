import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container
} from '@mui/material';
import { Archive as ArchiveIcon } from '@mui/icons-material';

const ArchiveView: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ArchiveIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" fontWeight="bold">
          Archive Management
        </Typography>
      </Box>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Archived Projects
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This is the Archive view. Here you can access archived projects,
            completed tasks, and historical data for reference.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ArchiveView;