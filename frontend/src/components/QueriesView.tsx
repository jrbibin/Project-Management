import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container
} from '@mui/material';
import { Help as QueriesIcon } from '@mui/icons-material';

const QueriesView: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <QueriesIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" fontWeight="bold">
          Queries & Support
        </Typography>
      </Box>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Query Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This is the Queries view. Here you can manage support requests,
            track issues, and handle client or team queries.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default QueriesView;