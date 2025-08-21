import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  LinearProgress,
  Chip,
  IconButton
} from '@mui/material';
import { 
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import ProjectDetails from './ProjectDetails';

interface Project {
  id: string;
  name: string;
  code: string;
  client: string;
  type: string;
  description: string;
  budget: number;
  actualCost: number;
  profit: number;
  progress: number;
  status: 'active' | 'completed' | 'on-hold';
}

const ProjectView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    code: '',
    client: '',
    type: 'Film',
    description: ''
  });

  const clients = ['Starlight Pictures', 'Marvel Studios', 'Warner Bros', 'Universal Pictures', 'Sony Pictures'];
  const projectTypes = ['Film', 'Episode', 'Commercial', 'Test'];

  const handleCreateProject = () => {
    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      code: newProject.code,
      client: newProject.client,
      type: newProject.type,
      description: newProject.description,
      budget: 0,
      actualCost: 0,
      profit: 0,
      progress: 0,
      status: 'active'
    };
    
    setProjects([...projects, project]);
    setOpenDialog(false);
    setNewProject({ name: '', code: '', client: '', type: 'Film', description: '' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'primary';
      case 'completed': return 'success';
      case 'on-hold': return 'warning';
      default: return 'default';
    }
  };

  const handleProjectDoubleClick = (project: Project) => {
    setSelectedProject(project);
    setShowDetails(true);
  };

  const handleBackToProjects = () => {
    setShowDetails(false);
    setSelectedProject(null);
  };

  // Show project details if a project is selected
  if (showDetails && selectedProject) {
    return <ProjectDetails project={selectedProject} onBack={handleBackToProjects} />;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ borderRadius: 2 }}
        >
          New Project
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {projects.map((project) => (
          <Box key={project.id} sx={{ flex: '1 1 300px', minWidth: '300px', maxWidth: '400px' }}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 4
                }
              }}
              onDoubleClick={() => handleProjectDoubleClick(project)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h2" fontWeight="bold">
                    {project.name}
                  </Typography>
                  <Chip 
                    label={project.status.charAt(0).toUpperCase() + project.status.slice(1)} 
                    color={getStatusColor(project.status) as any}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Code: {project.code} • {project.client}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={project.progress} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Budget</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(project.budget)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Actual Cost</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(project.actualCost)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Profit/Loss</Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="medium"
                    color={project.profit >= 0 ? 'success.main' : 'error.main'}
                  >
                    {formatCurrency(project.profit)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Create New Project Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">
            Create New Project
          </Typography>
          <IconButton onClick={() => setOpenDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Project Name
              </Typography>
              <TextField
                fullWidth
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2
                  }
                }}
              />
            </Box>
            
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Project Code
              </Typography>
              <TextField
                fullWidth
                value={newProject.code}
                onChange={(e) => setNewProject({ ...newProject, code: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2
                  }
                }}
              />
            </Box>
            
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Client
              </Typography>
              <TextField
                select
                fullWidth
                value={newProject.client}
                onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2
                  }
                }}
              >
                <MenuItem value="" disabled>
                  Select a client
                </MenuItem>
                {clients.map((client) => (
                  <MenuItem key={client} value={client}>
                    {client}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Project Type
              </Typography>
              <TextField
                select
                fullWidth
                value={newProject.type}
                onChange={(e) => setNewProject({ ...newProject, type: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2
                  }
                }}
              >
                {projectTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Description
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreateProject}
            disabled={!newProject.name || !newProject.client}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Create Project
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectView;