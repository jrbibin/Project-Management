import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Movie as SequenceIcon,
  Folder as PackageIcon,
  CameraAlt as ShotIcon,
  Assignment as TaskIcon,
  PlayArrow as PlayIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Project {
  id: number;
  name: string;
  code: string;
}

interface Sequence {
  id: number;
  name: string;
  code: string;
  project_id: number;
  packages?: Package[];
}

interface Package {
  id: number;
  name: string;
  code: string;
  sequence_id: number;
  frame_start?: number;
  frame_end?: number;
  shots?: Shot[];
}

interface Shot {
  id: number;
  name: string;
  code: string;
  package_id: number;
  frame_start?: number;
  frame_end?: number;
  frame_count?: number;
  status: string;
  tasks?: Task[];
}

interface Task {
  id: number;
  name: string;
  shot_id: number;
  department_id: number;
  status: string;
  current_version: string;
  assignee_id?: number;
}

interface Department {
  id: number;
  name: string;
  code: string;
  color: string;
}

const PipelineView: React.FC = () => {
  const theme = useTheme();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState<'sequence' | 'package' | 'shot' | null>(null);
  const [selectedSequence, setSelectedSequence] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [newItem, setNewItem] = useState({ name: '', code: '', description: '' });

  const queryClient = useQueryClient();

  // Fetch projects
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await axios.get('/api/projects');
      return response.data;
    },
  });

  // Fetch sequences
  const { data: sequences = [], isLoading: sequencesLoading } = useQuery({
    queryKey: ['sequences', selectedProject],
    queryFn: async () => {
      if (!selectedProject) return [];
      const response = await axios.get(`/api/sequences?project_id=${selectedProject}`);
      return response.data;
    },
    enabled: !!selectedProject,
  });

  // Fetch packages
  const { data: packages = [] } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const response = await axios.get('/api/packages');
      return response.data;
    },
  });

  // Fetch shots
  const { data: shots = [] } = useQuery({
    queryKey: ['shots'],
    queryFn: async () => {
      const response = await axios.get('/api/shots');
      return response.data;
    },
  });

  // Fetch departments
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await axios.get('/api/departments');
      return response.data;
    },
  });

  // Create sequence mutation
  const createSequenceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/sequences', {
        ...data,
        project_id: selectedProject,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sequences'] });
      setOpenDialog(null);
      setNewItem({ name: '', code: '', description: '' });
    },
  });

  // Create package mutation
  const createPackageMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/packages', {
        ...data,
        sequence_id: selectedSequence,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      setOpenDialog(null);
      setNewItem({ name: '', code: '', description: '' });
    },
  });

  // Create shot mutation
  const createShotMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/shots', {
        ...data,
        package_id: selectedPackage,
        status: 'active',
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shots'] });
      setOpenDialog(null);
      setNewItem({ name: '', code: '', description: '' });
    },
  });

  const handleCreate = () => {
    if (!newItem.name || !newItem.code) return;

    switch (openDialog) {
      case 'sequence':
        createSequenceMutation.mutate(newItem);
        break;
      case 'package':
        createPackageMutation.mutate(newItem);
        break;
      case 'shot':
        createShotMutation.mutate(newItem);
        break;
    }
  };

  const getSequencePackages = (sequenceId: number) => {
    return packages.filter((pkg: Package) => pkg.sequence_id === sequenceId);
  };

  const getPackageShots = (packageId: number) => {
    return shots.filter((shot: Shot) => shot.package_id === packageId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'info';
      case 'on_hold': return 'warning';
      default: return 'default';
    }
  };

  const getDepartmentColor = (deptId: number) => {
    const dept = departments.find((d: Department) => d.id === deptId);
    return dept?.color || '#3498db';
  };

  // Auto-select first project if available
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].id);
    }
  }, [projects, selectedProject]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          VFX Pipeline Structure
        </Typography>
        {selectedProject && (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Project</InputLabel>
            <Select
              value={selectedProject}
              label="Project"
              onChange={(e) => setSelectedProject(e.target.value as number)}
            >
              {projects.map((project: Project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name} ({project.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {!selectedProject ? (
        <Alert severity="info">
          Please create a project first to start building your pipeline structure.
        </Alert>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Sequences & Packages Structure
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setOpenDialog('sequence');
                setSelectedSequence(null);
              }}
            >
              Add Sequence
            </Button>
          </Box>

          {sequencesLoading ? (
            <LinearProgress sx={{ mb: 2 }} />
          ) : sequences.length === 0 ? (
            <Card sx={{ textAlign: 'center', py: 4 }}>
              <CardContent>
                <SequenceIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Sequences Yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Create sequences to organize your shots into packages
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog('sequence')}
                >
                  Create First Sequence
                </Button>
              </CardContent>
            </Card>
          ) : (
            sequences.map((sequence: Sequence) => {
              const sequencePackages = getSequencePackages(sequence.id);
              return (
                <Accordion key={sequence.id} sx={{ 
                  mb: 1,
                  background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(135deg, rgba(233, 30, 99, 0.08) 0%, rgba(33, 150, 243, 0.08) 100%)'
                    : 'linear-gradient(135deg, rgba(233, 30, 99, 0.03) 0%, rgba(33, 150, 243, 0.03) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 12px 24px rgba(233, 30, 99, 0.2)'
                      : '0 12px 24px rgba(0, 0, 0, 0.1)',
                    border: `1px solid ${theme.palette.primary.main}`
                  }
                }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <SequenceIcon color="primary" />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">{sequence.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {sequence.code} • {sequencePackages.length} packages
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSequence(sequence.id);
                          setOpenDialog('package');
                        }}
                      >
                        Add Package
                      </Button>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {sequencePackages.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <PackageIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          No packages in this sequence yet
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {sequencePackages.map((pkg: Package) => {
                          const packageShots = getPackageShots(pkg.id);
                          return (
                            <Box key={pkg.id} sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                              <Card variant="outlined" sx={{
                                background: theme.palette.mode === 'dark' 
                                  ? 'rgba(255, 255, 255, 0.05)'
                                  : 'rgba(0, 0, 0, 0.02)',
                                border: `1px solid ${theme.palette.divider}`,
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                  background: theme.palette.mode === 'dark'
                                    ? 'rgba(233, 30, 99, 0.1)'
                                    : 'rgba(233, 30, 99, 0.05)',
                                  transform: 'translateX(8px)',
                                  border: `1px solid ${theme.palette.secondary.main}`
                                }
                              }}>
                                <CardContent>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <PackageIcon fontSize="small" />
                                    <Typography variant="subtitle1">{pkg.name}</Typography>
                                  </Box>
                                  <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {pkg.code}
                                  </Typography>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Chip
                                      icon={<ShotIcon />}
                                      label={`${packageShots.length} shots`}
                                      size="small"
                                      variant="outlined"
                                    />
                                    <Button
                                      size="small"
                                      startIcon={<AddIcon />}
                                      onClick={() => {
                                        setSelectedPackage(pkg.id);
                                        setOpenDialog('shot');
                                      }}
                                    >
                                      Add Shot
                                    </Button>
                                  </Box>
                                  {packageShots.length > 0 && (
                                    <Box>
                                      <Typography variant="caption" color="text.secondary">
                                        Shots:
                                      </Typography>
                                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                        {packageShots.slice(0, 3).map((shot: Shot) => (
                                          <Chip
                                            key={shot.id}
                                            label={shot.code}
                                            size="small"
                                            color={getStatusColor(shot.status) as any}
                                          />
                                        ))}
                                        {packageShots.length > 3 && (
                                          <Chip
                                            label={`+${packageShots.length - 3} more`}
                                            size="small"
                                            variant="outlined"
                                          />
                                        )}
                                      </Box>
                                    </Box>
                                  )}
                                </CardContent>
                              </Card>
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })
          )}
        </Box>
      )}

      {/* Create Dialog */}
      <Dialog open={!!openDialog} onClose={() => setOpenDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Create New {openDialog === 'sequence' ? 'Sequence' : openDialog === 'package' ? 'Package' : 'Shot'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Code"
              value={newItem.code}
              onChange={(e) => setNewItem({ ...newItem, code: e.target.value.toUpperCase() })}
              sx={{ mb: 2 }}
              required
              helperText={
                openDialog === 'sequence' ? 'e.g., SEQ_010' :
                openDialog === 'package' ? 'e.g., CS_010' :
                'e.g., CS_010_0010'
              }
            />
            <TextField
              fullWidth
              label="Description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>Cancel</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={!newItem.name || !newItem.code}
          >
            Create {openDialog === 'sequence' ? 'Sequence' : openDialog === 'package' ? 'Package' : 'Shot'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PipelineView;