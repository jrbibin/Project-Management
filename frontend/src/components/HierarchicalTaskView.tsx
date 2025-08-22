import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
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
  Avatar,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  useTheme,
  Collapse,
  Menu,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CompleteIcon,
  PlayArrow as InProgressIcon,
  Pause as OnHoldIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowRight as ArrowRightIcon,
  Movie as PackageIcon,
  CameraAlt as ShotIcon,
  Business as DepartmentIcon,
  Person as UserIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Timeline as TimelineIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  GetApp as ExportIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Interfaces
interface Task {
  id: number;
  name: string;
  shot_id: number;
  department_id: number;
  status: 'not_started' | 'in_progress' | 'pending_review' | 'approved' | 'retake' | 'final';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  current_version: string;
  assignee_id?: number;
  due_date?: string;
  approved_bid_days: number;
  actual_bid_days: number;
  eta_date?: string;
  created_at: string;
  updated_at: string;
  shot?: Shot;
  department?: Department;
  assignee?: User;
  versions?: Version[];
}

interface Version {
  id: number;
  version_number: string;
  task_id: number;
  status: string;
  created_at: string;
  internal_versions?: InternalVersion[];
}

interface InternalVersion {
  id: number;
  internal_version_number: string;
  version_id: number;
  status: string;
  created_at: string;
}

interface Shot {
  id: number;
  name: string;
  code: string;
  package_id: number;
  status: string;
  package?: Package;
  departments?: Department[];
}

interface Package {
  id: number;
  name: string;
  code: string;
  sequence_id: number;
  sequence?: Sequence;
  shots?: Shot[];
}

interface Sequence {
  id: number;
  name: string;
  code: string;
  project_id: number;
  project?: Project;
  packages?: Package[];
}

interface Project {
  id: number;
  name: string;
  code: string;
}

interface Department {
  id: number;
  name: string;
  code: string;
  color: string;
  tasks?: Task[];
}

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  department_id?: number;
}

const HierarchicalTaskView: React.FC = () => {
  const theme = useTheme();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [expandedPackages, setExpandedPackages] = useState<Set<number>>(new Set());
  const [expandedShots, setExpandedShots] = useState<Set<number>>(new Set());
  const [expandedDepartments, setExpandedDepartments] = useState<Set<number>>(new Set());
  const [versionMenuAnchor, setVersionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedTaskForVersion, setSelectedTaskForVersion] = useState<Task | null>(null);
  const [internalVersionMenuAnchor, setInternalVersionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedVersionForInternal, setSelectedVersionForInternal] = useState<Version | null>(null);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    shot_id: '',
    department_id: '',
    priority: 'medium',
    assignee_id: '',
    approved_bid_days: 1.0,
  });

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
  const { data: sequences = [] } = useQuery({
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

  // Fetch tasks
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await axios.get('/api/tasks');
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

  // Fetch users
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axios.get('/api/users');
      return response.data;
    },
  });

  // Create task with version mutation
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: any) => {
      const response = await axios.post('/api/tasks/with-version', taskData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setOpenTaskDialog(false);
      setNewTask({
        name: '',
        shot_id: '',
        department_id: '',
        priority: 'medium',
        assignee_id: '',
        approved_bid_days: 1.0,
      });
    },
  });

  // Create new version mutation
  const createVersionMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const response = await axios.post(`/api/versions/new/${taskId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setVersionMenuAnchor(null);
    },
  });

  // Create internal version mutation
  const createInternalVersionMutation = useMutation({
    mutationFn: async (versionId: number) => {
      const response = await axios.post(`/api/internal-versions/new/${versionId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['versions'] });
      setInternalVersionMenuAnchor(null);
    },
  });

  // Fetch versions for a task
  const { data: taskVersions = [] } = useQuery({
    queryKey: ['versions', selectedTaskForVersion?.id],
    queryFn: async () => {
      if (!selectedTaskForVersion) return [];
      const response = await axios.get(`/api/versions/task/${selectedTaskForVersion.id}`);
      return response.data;
    },
    enabled: !!selectedTaskForVersion,
  });

  // Fetch internal versions for a version
  const { data: versionInternalVersions = [] } = useQuery({
    queryKey: ['internal-versions', selectedVersionForInternal?.id],
    queryFn: async () => {
      if (!selectedVersionForInternal) return [];
      const response = await axios.get(`/api/internal-versions/version/${selectedVersionForInternal.id}`);
      return response.data;
    },
    enabled: !!selectedVersionForInternal,
  });

  const togglePackageExpansion = (packageId: number) => {
    const newExpanded = new Set(expandedPackages);
    if (newExpanded.has(packageId)) {
      newExpanded.delete(packageId);
    } else {
      newExpanded.add(packageId);
    }
    setExpandedPackages(newExpanded);
  };

  const toggleShotExpansion = (shotId: number) => {
    const newExpanded = new Set(expandedShots);
    if (newExpanded.has(shotId)) {
      newExpanded.delete(shotId);
    } else {
      newExpanded.add(shotId);
    }
    setExpandedShots(newExpanded);
  };

  const toggleDepartmentExpansion = (deptId: number) => {
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId);
    } else {
      newExpanded.add(deptId);
    }
    setExpandedDepartments(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'default';
      case 'in_progress': return 'primary';
      case 'pending_review': return 'warning';
      case 'approved': return 'success';
      case 'retake': return 'error';
      case 'final': return 'success';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'primary';
      case 'high': return 'warning';
      case 'urgent': return 'error';
      default: return 'default';
    }
  };

  const handleCreateTask = () => {
    createTaskMutation.mutate({
      ...newTask,
      shot_id: parseInt(newTask.shot_id),
      department_id: parseInt(newTask.department_id),
      assignee_id: newTask.assignee_id ? parseInt(newTask.assignee_id) : null,
    });
  };

  const handleVersionMenuClick = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    setVersionMenuAnchor(event.currentTarget);
    setSelectedTaskForVersion(task);
  };

  const handleVersionMenuClose = () => {
    setVersionMenuAnchor(null);
    setSelectedTaskForVersion(null);
  };

  const handleAddVersion = () => {
    if (selectedTaskForVersion) {
      createVersionMutation.mutate(selectedTaskForVersion.id);
    }
  };

  const handleInternalVersionMenuClick = (event: React.MouseEvent<HTMLElement>, version: Version) => {
    setInternalVersionMenuAnchor(event.currentTarget);
    setSelectedVersionForInternal(version);
  };

  const handleInternalVersionMenuClose = () => {
    setInternalVersionMenuAnchor(null);
    setSelectedVersionForInternal(null);
  };

  const handleAddInternalVersion = () => {
    if (selectedVersionForInternal) {
      createInternalVersionMutation.mutate(selectedVersionForInternal.id);
    }
  };

  const getCurrentInternalVersion = (task: Task) => {
    // Get the current version's latest internal version
    const currentVersion = taskVersions.find((v: Version) => v.version_number === task.current_version);
    if (currentVersion && currentVersion.internal_versions && currentVersion.internal_versions.length > 0) {
      const latestInternal = currentVersion.internal_versions[currentVersion.internal_versions.length - 1];
      return latestInternal.internal_version_number;
    }
    return 'E001';
  };

  // Group data hierarchically
  const groupedData = sequences.map((sequence: Sequence) => ({
    ...sequence,
    packages: packages.filter((pkg: Package) => pkg.sequence_id === sequence.id).map((pkg: Package) => ({
      ...pkg,
      shots: shots.filter((shot: Shot) => shot.package_id === pkg.id).map((shot: Shot) => ({
        ...shot,
        departments: departments.map((dept: Department) => ({
          ...dept,
          tasks: tasks.filter((task: Task) => task.shot_id === shot.id && task.department_id === dept.id)
        })).filter((dept: any) => dept.tasks.length > 0)
      }))
    }))
  }));

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            VFX Project Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Project Timeline
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Select Project</InputLabel>
            <Select
              value={selectedProject || ''}
              onChange={(e) => setSelectedProject(e.target.value as number)}
              label="Select Project"
            >
              {projects.map((project: Project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenTaskDialog(true)}
            sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#45a049' } }}
          >
            Add Package
          </Button>
        </Box>
      </Box>

      {/* Project Info Card */}
      {selectedProject && (
        <Card sx={{ mb: 3, bgcolor: '#f8f9fa' }}>
          <CardContent sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Project
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Master Timeline
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    ₹50,27,000
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Budget
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                    ₹1,00,700.23
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Spent
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                    ₹49,26,299.77
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Remaining
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Filter Tabs */}
      {selectedProject && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label="All Packages" variant="filled" sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }} />
            <Chip label="Add Package" variant="outlined" sx={{ color: '#4caf50', borderColor: '#4caf50' }} />
            <Chip label="Add Shot List" variant="outlined" sx={{ color: '#ff9800', borderColor: '#ff9800' }} />
            <Chip label="Add Department" variant="outlined" sx={{ color: '#9c27b0', borderColor: '#9c27b0' }} />
            <Chip label="Add Task" variant="outlined" sx={{ color: '#f44336', borderColor: '#f44336' }} />
            <Chip label="Add User" variant="outlined" sx={{ color: '#607d8b', borderColor: '#607d8b' }} />
          </Box>
        </Box>
      )}

      {/* Main Hierarchical Table */}
      {selectedProject && (
        <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Shot</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Approved Bid</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actual Bid</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>ETA</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Version</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedData.map((sequence: Sequence) => (
                <React.Fragment key={`sequence-${sequence.id}`}>
                  {sequence.packages?.map((pkg: Package) => (
                    <React.Fragment key={`package-${pkg.id}`}>
                      {/* Package Header Row */}
                      <TableRow sx={{ bgcolor: '#f0f8ff', '&:hover': { bgcolor: '#e6f3ff' } }}>
                        <TableCell colSpan={9}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => togglePackageExpansion(pkg.id)}
                              sx={{ p: 0.5 }}
                            >
                              {expandedPackages.has(pkg.id) ? <ArrowDownIcon /> : <ArrowRightIcon />}
                            </IconButton>
                            <PackageIcon fontSize="small" sx={{ color: '#1976d2' }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                              {pkg.name} ({pkg.code})
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                      
                      {/* Package Content - Shots */}
                      <Collapse in={expandedPackages.has(pkg.id)} timeout="auto" unmountOnExit>
                        <TableRow>
                          <TableCell colSpan={9} sx={{ p: 0, border: 'none' }}>
                            <Table size="small">
                              <TableBody>
                                {pkg.shots?.map((shot: Shot) => (
                                  <React.Fragment key={`shot-${shot.id}`}>
                                    {/* Shot Header Row */}
                                    <TableRow sx={{ bgcolor: '#f8f9fa', '&:hover': { bgcolor: '#e9ecef' } }}>
                                      <TableCell colSpan={9}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5, pl: 4 }}>
                                          <IconButton
                                            size="small"
                                            onClick={() => toggleShotExpansion(shot.id)}
                                            sx={{ p: 0.5 }}
                                          >
                                            {expandedShots.has(shot.id) ? <ArrowDownIcon /> : <ArrowRightIcon />}
                                          </IconButton>
                                          <ShotIcon fontSize="small" sx={{ color: '#4caf50' }} />
                                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>
                                            {shot.name} ({shot.code})
                                          </Typography>
                                        </Box>
                                      </TableCell>
                                    </TableRow>
                                    
                                    {/* Shot Content - Departments */}
                                    <Collapse in={expandedShots.has(shot.id)} timeout="auto" unmountOnExit>
                                      <TableRow>
                                        <TableCell colSpan={9} sx={{ p: 0, border: 'none' }}>
                                          <Table size="small">
                                            <TableBody>
                                              {shot.departments?.map((dept: Department) => (
                                                <React.Fragment key={`dept-${dept.id}-shot-${shot.id}`}>
                                                  {/* Department Header Row */}
                                                  <TableRow sx={{ bgcolor: '#fff8e1', '&:hover': { bgcolor: '#fff3c4' } }}>
                                                    <TableCell colSpan={9}>
                                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5, pl: 8 }}>
                                                        <IconButton
                                                          size="small"
                                                          onClick={() => toggleDepartmentExpansion(dept.id)}
                                                          sx={{ p: 0.5 }}
                                                        >
                                                          {expandedDepartments.has(dept.id) ? <ArrowDownIcon /> : <ArrowRightIcon />}
                                                        </IconButton>
                                                        <DepartmentIcon fontSize="small" sx={{ color: '#ff9800' }} />
                                                        <Box
                                                          sx={{
                                                            width: 12,
                                                            height: 12,
                                                            borderRadius: '50%',
                                                            backgroundColor: dept.color,
                                                            mr: 1
                                                          }}
                                                        />
                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff9800' }}>
                                                          {dept.name}
                                                        </Typography>
                                                      </Box>
                                                    </TableCell>
                                                  </TableRow>
                                                  
                                                  {/* Department Content - Tasks */}
                                                  <Collapse in={expandedDepartments.has(dept.id)} timeout="auto" unmountOnExit>
                                                    <TableRow>
                                                      <TableCell colSpan={9} sx={{ p: 0, border: 'none' }}>
                                                        <Table size="small">
                                                          <TableBody>
                                                            {dept.tasks?.map((task: Task) => {
                                                              const assignee = users.find((u: User) => u.id === task.assignee_id);
                                                              
                                                              return (
                                                                <TableRow key={`task-${task.id}`} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                                                                  <TableCell sx={{ pl: 12 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                      <TaskIcon fontSize="small" color="primary" />
                                                                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                        {task.name}
                                                                      </Typography>
                                                                    </Box>
                                                                  </TableCell>
                                                                  <TableCell>
                                                                    <Typography variant="body2">{dept.name}</Typography>
                                                                  </TableCell>
                                                                  <TableCell>
                                                                    <Typography variant="body2">{task.approved_bid_days}</Typography>
                                                                  </TableCell>
                                                                  <TableCell>
                                                                    <Typography variant="body2">{task.actual_bid_days}</Typography>
                                                                  </TableCell>
                                                                  <TableCell>
                                                                    <Typography variant="body2">
                                                                      {task.eta_date ? new Date(task.eta_date).toLocaleDateString() : '-'}
                                                                    </Typography>
                                                                  </TableCell>
                                                                  <TableCell>
                                                                    <Button
                                                                      size="small"
                                                                      variant="outlined"
                                                                      onClick={(e) => handleVersionMenuClick(e, task)}
                                                                      endIcon={<ArrowDownIcon />}
                                                                      sx={{ minWidth: 80 }}
                                                                    >
                                                                      {task.current_version}
                                                                    </Button>
                                                                  </TableCell>
                                                                  <TableCell>
                                                                    <Chip
                                                                      label={task.priority.toUpperCase()}
                                                                      size="small"
                                                                      sx={{
                                                                        bgcolor: task.priority === 'high' ? '#ffebee' : task.priority === 'medium' ? '#fff3e0' : '#e8f5e8',
                                                                        color: task.priority === 'high' ? '#d32f2f' : task.priority === 'medium' ? '#f57c00' : '#388e3c',
                                                                        fontWeight: 'bold',
                                                                        fontSize: '0.7rem'
                                                                      }}
                                                                    />
                                                                  </TableCell>
                                                                  <TableCell>
                                                                    <Chip
                                                                      label={task.status.replace('_', ' ').toUpperCase()}
                                                                      size="small"
                                                                      sx={{
                                                                        bgcolor: task.status === 'approved' ? '#e8f5e8' : task.status === 'in_progress' ? '#e3f2fd' : '#fff3e0',
                                                                        color: task.status === 'approved' ? '#388e3c' : task.status === 'in_progress' ? '#1976d2' : '#f57c00',
                                                                        fontWeight: 'bold',
                                                                        fontSize: '0.7rem'
                                                                      }}
                                                                    />
                                                                  </TableCell>
                                                                  <TableCell>
                                                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                                      <Button
                                                                        size="small"
                                                                        variant="contained"
                                                                        sx={{ 
                                                                          bgcolor: '#4caf50', 
                                                                          '&:hover': { bgcolor: '#45a049' },
                                                                          minWidth: 'auto',
                                                                          px: 1,
                                                                          fontSize: '0.6rem'
                                                                        }}
                                                                      >
                                                                        Notes Query
                                                                      </Button>
                                                                      <Button
                                                                        size="small"
                                                                        variant="contained"
                                                                        sx={{ 
                                                                          bgcolor: '#2196f3', 
                                                                          '&:hover': { bgcolor: '#1976d2' },
                                                                          minWidth: 'auto',
                                                                          px: 1,
                                                                          fontSize: '0.6rem'
                                                                        }}
                                                                      >
                                                                        Add Version
                                                                      </Button>
                                                                      <Button
                                                                        size="small"
                                                                        variant="contained"
                                                                        color="secondary"
                                                                        sx={{ 
                                                                          minWidth: 'auto', 
                                                                          px: 1,
                                                                          fontSize: '0.6rem'
                                                                        }}
                                                                        onClick={(e) => {
                                                                          const currentVersion = taskVersions.find((v: Version) => v.version_number === task.current_version);
                                                                          if (currentVersion) {
                                                                            handleInternalVersionMenuClick(e, currentVersion);
                                                                          }
                                                                        }}
                                                                      >
                                                                        {getCurrentInternalVersion(task)}
                                                                      </Button>
                                                                    </Box>
                                                                  </TableCell>
                                                                </TableRow>
                                                              );
                                                            })}
                                                            
                                                            {/* Add Task Row for Department */}
                                                            <TableRow sx={{ bgcolor: '#fafafa' }}>
                                                              <TableCell colSpan={9} sx={{ pl: 12 }}>
                                                                <Button
                                                                  size="small"
                                                                  variant="outlined"
                                                                  startIcon={<AddIcon />}
                                                                  onClick={() => {
                                                                    setNewTask({
                                                                      ...newTask,
                                                                      shot_id: shot.id.toString(),
                                                                      department_id: dept.id.toString()
                                                                    });
                                                                    setOpenTaskDialog(true);
                                                                  }}
                                                                  sx={{ 
                                                                    color: '#666',
                                                                    borderColor: '#ddd',
                                                                    '&:hover': { bgcolor: '#f5f5f5' },
                                                                    fontSize: '0.7rem'
                                                                  }}
                                                                >
                                                                  Add Task
                                                                </Button>
                                                              </TableCell>
                                                            </TableRow>
                                                          </TableBody>
                                                        </Table>
                                                      </TableCell>
                                                    </TableRow>
                                                  </Collapse>
                                                </React.Fragment>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        </TableCell>
                                      </TableRow>
                                    </Collapse>
                                  </React.Fragment>
                                ))}
                              </TableBody>
                            </Table>
                          </TableCell>
                        </TableRow>
                      </Collapse>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Version Menu */}
      <Menu
        anchorEl={versionMenuAnchor}
        open={Boolean(versionMenuAnchor)}
        onClose={handleVersionMenuClose}
      >
        <MenuItem onClick={handleAddVersion}>
          <AddIcon sx={{ mr: 1 }} />
          Add New Version
        </MenuItem>
        {taskVersions.map((version: Version) => (
          <MenuItem key={version.id} onClick={() => {
            // Switch to this version logic can be added here
            handleVersionMenuClose();
          }}>
            {version.version_number}
          </MenuItem>
        ))}
      </Menu>

      {/* Internal Version Menu */}
      <Menu
        anchorEl={internalVersionMenuAnchor}
        open={Boolean(internalVersionMenuAnchor)}
        onClose={handleInternalVersionMenuClose}
      >
        <MenuItem onClick={handleAddInternalVersion}>
          <AddIcon sx={{ mr: 1 }} />
          Add New Internal Version
        </MenuItem>
        {versionInternalVersions.map((internalVersion: InternalVersion) => (
          <MenuItem key={internalVersion.id} onClick={() => {
            // Switch to this internal version logic can be added here
            handleInternalVersionMenuClose();
          }}>
            {internalVersion.internal_version_number}
          </MenuItem>
        ))}
      </Menu>

      {/* Create Task Dialog */}
      <Dialog open={openTaskDialog} onClose={() => setOpenTaskDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Task Name"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Shot</InputLabel>
              <Select
                value={newTask.shot_id}
                onChange={(e) => setNewTask({ ...newTask, shot_id: e.target.value })}
                label="Shot"
              >
                {shots.map((shot: Shot) => (
                  <MenuItem key={shot.id} value={shot.id}>
                    {shot.name} ({shot.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={newTask.department_id}
                onChange={(e) => setNewTask({ ...newTask, department_id: e.target.value })}
                label="Department"
              >
                {departments.map((dept: Department) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Assignee</InputLabel>
              <Select
                value={newTask.assignee_id}
                onChange={(e) => setNewTask({ ...newTask, assignee_id: e.target.value })}
                label="Assignee"
              >
                <MenuItem value="">Unassigned</MenuItem>
                {users.map((user: User) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.full_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Approved Bid Days"
              type="number"
              value={newTask.approved_bid_days}
              onChange={(e) => setNewTask({ ...newTask, approved_bid_days: parseFloat(e.target.value) })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTaskDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateTask} variant="contained">
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HierarchicalTaskView;