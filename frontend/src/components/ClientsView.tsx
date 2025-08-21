import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container
} from '@mui/material';
import { Business as ClientsIcon } from '@mui/icons-material';

const ClientsView: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ClientsIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" fontWeight="bold">
          Client Management
        </Typography>
      </Box>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Client Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This is the Client Management view. Here you can manage client information,
            track client projects, and handle client communications.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ClientsView;