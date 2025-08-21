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
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  useTheme,
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
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Task {
  id: number;
  name: string;
  shot_id: number;
  department_id: number;
  status: 'pending' | 'in_progress' | 'review' | 'approved' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  current_version: string;
  assignee_id?: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
  shot?: Shot;
  department?: Department;
  assignee?: User;
}

interface Shot {
  id: number;
  name: string;
  code: string;
  package_id: number;
  status: string;
  package?: Package;
}

interface Package {
  id: number;
  name: string;
  code: string;
  sequence_id: number;
  sequence?: Sequence;
}

interface Sequence {
  id: number;
  name: string;
  code: string;
  project_id: number;
  project?: Project;
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
}

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  department_id?: number;
}

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
      id={`task-tabpanel-${index}`}
      aria-labelledby={`task-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const TaskView: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [openDialog, setOpenDialog] = useState<'create' | 'edit' | 'version' | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    name: '',
    shot_id: '',
    department_id: '',
    priority: 'medium',
    assignee_id: '',
    due_date: '',
  });

  const queryClient = useQueryClient();

  // Fetch tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', selectedDepartment, selectedStatus, selectedPriority],
    queryFn: async () => {
      let url = '/api/tasks';
      const params = new URLSearchParams();
      if (selectedDepartment) params.append('department_id', selectedDepartment.toString());
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (selectedPriority !== 'all') params.append('priority', selectedPriority);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await axios.get(url);
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

  // Fetch shots
  const { data: shots = [] } = useQuery({
    queryKey: ['shots'],
    queryFn: async () => {
      const response = await axios.get('/api/shots');
      return response.data;
    },
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/tasks', {
        ...data,
        current_version: 'v001',
        status: 'pending',
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setOpenDialog(null);
      setNewTask({
        name: '',
        shot_id: '',
        department_id: '',
        priority: 'medium',
        assignee_id: '',
        due_date: '',
      });
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await axios.put(`/api/tasks/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setOpenDialog(null);
      setSelectedTask(null);
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CompleteIcon color="success" />;
      case 'in_progress': return <InProgressIcon color="primary" />;
      case 'on_hold': return <OnHoldIcon color="warning" />;
      default: return <ScheduleIcon color="action" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'primary';
      case 'review': return 'info';
      case 'approved': return 'success';
      case 'on_hold': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'default';
    }
  };

  const getDepartmentColor = (deptId: number) => {
    const dept = departments.find((d: Department) => d.id === deptId);
    return dept?.color || '#3498db';
  };

  const getTasksByDepartment = () => {
    const tasksByDept: { [key: number]: Task[] } = {};
    departments.forEach((dept: Department) => {
      tasksByDept[dept.id] = tasks.filter((task: Task) => task.department_id === dept.id);
    });
    return tasksByDept;
  };

  const handleCreateTask = () => {
    if (!newTask.name || !newTask.shot_id || !newTask.department_id) return;
    createTaskMutation.mutate({
      ...newTask,
      shot_id: parseInt(newTask.shot_id),
      department_id: parseInt(newTask.department_id),
      assignee_id: newTask.assignee_id ? parseInt(newTask.assignee_id) : null,
    });
  };

  const handleUpdateTaskStatus = (task: Task, newStatus: string) => {
    updateTaskMutation.mutate({
      id: task.id,
      status: newStatus,
    });
  };

  const handleVersionUpdate = (task: Task) => {
    const currentVersion = parseInt(task.current_version.replace('v', ''));
    const newVersion = `v${String(currentVersion + 1).padStart(3, '0')}`;
    updateTaskMutation.mutate({
      id: task.id,
      current_version: newVersion,
    });
  };

  const tasksByDepartment = getTasksByDepartment();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Task Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog('create')}
        >
          Create Task
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FilterIcon color="action" />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Department</InputLabel>
            <Select
              value={selectedDepartment || ''}
              label="Department"
              onChange={(e) => setSelectedDepartment(e.target.value as number || null)}
            >
              <MenuItem value="">All Departments</MenuItem>
              {departments.map((dept: Department) => (
                <MenuItem key={dept.id} value={dept.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: dept.color,
                      }}
                    />
                    {dept.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              label="Status"
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="review">Review</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="on_hold">On Hold</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={selectedPriority}
              label="Priority"
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <MenuItem value="all">All Priority</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Department View" />
          <Tab label="List View" />
          <Tab label="My Tasks" />
        </Tabs>
      </Box>

      {/* Department View */}
      <TabPanel value={tabValue} index={0}>
        {departments.map((department: Department) => {
          const deptTasks = tasksByDepartment[department.id] || [];
          return (
            <Accordion key={department.id} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: department.color,
                    }}
                  />
                  <Typography variant="h6">{department.name}</Typography>
                  <Badge badgeContent={deptTasks.length} color="primary" sx={{ ml: 'auto' }} />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {deptTasks.length === 0 ? (
                  <Alert severity="info">No tasks assigned to this department</Alert>
                ) : (
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
                    {deptTasks.map((task: Task) => (
                      <Box key={task.id}>
                        <Card 
                          variant="outlined"
                          sx={{
                            background: theme.palette.mode === 'dark' 
                              ? 'linear-gradient(135deg, rgba(233, 30, 99, 0.08) 0%, rgba(33, 150, 243, 0.08) 100%)'
                              : 'linear-gradient(135deg, rgba(233, 30, 99, 0.03) 0%, rgba(33, 150, 243, 0.03) 100%)',
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${theme.palette.divider}`,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              transform: 'translateY(-4px) scale(1.01)',
                              boxShadow: theme.palette.mode === 'dark'
                                ? '0 12px 24px rgba(233, 30, 99, 0.2)'
                                : '0 12px 24px rgba(0, 0, 0, 0.1)',
                              border: `1px solid ${theme.palette.primary.main}`
                            }
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {task.name}
                              </Typography>
                              <Chip
                                label={task.priority}
                                size="small"
                                color={getPriorityColor(task.priority) as any}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {task.shot?.code} • {task.current_version}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              {getStatusIcon(task.status)}
                              <Chip
                                label={task.status.replace('_', ' ')}
                                size="small"
                                color={getStatusColor(task.status) as any}
                              />
                            </Box>
                            {task.assignee && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Avatar sx={{ width: 24, height: 24 }}>
                                  {task.assignee.full_name.charAt(0)}
                                </Avatar>
                                <Typography variant="caption">
                                  {task.assignee.full_name}
                                </Typography>
                              </Box>
                            )}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedTask(task);
                                  setOpenDialog('edit');
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleVersionUpdate(task)}
                                disabled={task.status === 'completed'}
                              >
                                <UploadIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    ))}
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </TabPanel>

      {/* List View */}
      <TabPanel value={tabValue} index={1}>
        {tasksLoading ? (
          <LinearProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task</TableCell>
                  <TableCell>Shot</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Version</TableCell>
                  <TableCell>Assignee</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task: Task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.name}</TableCell>
                    <TableCell>{task.shot?.code}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: getDepartmentColor(task.department_id),
                          }}
                        />
                        {task.department?.name}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.status.replace('_', ' ')}
                        size="small"
                        color={getStatusColor(task.status) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.priority}
                        size="small"
                        color={getPriorityColor(task.priority) as any}
                      />
                    </TableCell>
                    <TableCell>{task.current_version}</TableCell>
                    <TableCell>
                      {task.assignee ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24 }}>
                            {task.assignee.full_name.charAt(0)}
                          </Avatar>
                          <Typography variant="caption">
                            {task.assignee.full_name}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Unassigned
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedTask(task);
                            setOpenDialog('edit');
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleVersionUpdate(task)}
                          disabled={task.status === 'completed'}
                        >
                          <UploadIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      {/* My Tasks */}
      <TabPanel value={tabValue} index={2}>
        <Alert severity="info" sx={{ mb: 2 }}>
          This view would show tasks assigned to the current user. User authentication needed.
        </Alert>
      </TabPanel>

      {/* Create/Edit Task Dialog */}
      <Dialog open={openDialog === 'create' || openDialog === 'edit'} onClose={() => setOpenDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {openDialog === 'create' ? 'Create New Task' : 'Edit Task'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Task Name"
              value={openDialog === 'edit' && selectedTask ? selectedTask.name : newTask.name}
              onChange={(e) => {
                if (openDialog === 'edit' && selectedTask) {
                  setSelectedTask({ ...selectedTask, name: e.target.value });
                } else {
                  setNewTask({ ...newTask, name: e.target.value });
                }
              }}
              sx={{ mb: 2 }}
              required
            />
            <FormControl fullWidth sx={{ mb: 2 }} required>
              <InputLabel>Shot</InputLabel>
              <Select
                value={openDialog === 'edit' && selectedTask ? selectedTask.shot_id : newTask.shot_id}
                label="Shot"
                onChange={(e) => {
                  if (openDialog === 'edit' && selectedTask) {
                    setSelectedTask({ ...selectedTask, shot_id: e.target.value as number });
                  } else {
                    setNewTask({ ...newTask, shot_id: e.target.value as string });
                  }
                }}
              >
                {shots.map((shot: Shot) => (
                  <MenuItem key={shot.id} value={shot.id}>
                    {shot.code} - {shot.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }} required>
              <InputLabel>Department</InputLabel>
              <Select
                value={openDialog === 'edit' && selectedTask ? selectedTask.department_id : newTask.department_id}
                label="Department"
                onChange={(e) => {
                  if (openDialog === 'edit' && selectedTask) {
                    setSelectedTask({ ...selectedTask, department_id: e.target.value as number });
                  } else {
                    setNewTask({ ...newTask, department_id: e.target.value as string });
                  }
                }}
              >
                {departments.map((dept: Department) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: dept.color,
                        }}
                      />
                      {dept.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={openDialog === 'edit' && selectedTask ? selectedTask.priority : newTask.priority}
                label="Priority"
                onChange={(e) => {
                  if (openDialog === 'edit' && selectedTask) {
                    setSelectedTask({ ...selectedTask, priority: e.target.value as any });
                  } else {
                    setNewTask({ ...newTask, priority: e.target.value });
                  }
                }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Assignee</InputLabel>
              <Select
                value={openDialog === 'edit' && selectedTask ? selectedTask.assignee_id || '' : newTask.assignee_id}
                label="Assignee"
                onChange={(e) => {
                  if (openDialog === 'edit' && selectedTask) {
                    setSelectedTask({ ...selectedTask, assignee_id: e.target.value as number || undefined });
                  } else {
                    setNewTask({ ...newTask, assignee_id: e.target.value as string });
                  }
                }}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {users.map((user: User) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.full_name} ({user.username})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {openDialog === 'edit' && selectedTask && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedTask.status}
                  label="Status"
                  onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value as any })}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="review">Review</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="on_hold">On Hold</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>Cancel</Button>
          <Button
            onClick={() => {
              if (openDialog === 'create') {
                handleCreateTask();
              } else if (selectedTask) {
                updateTaskMutation.mutate(selectedTask);
              }
            }}
            variant="contained"
            disabled={openDialog === 'create' ? !newTask.name || !newTask.shot_id || !newTask.department_id : false}
          >
            {openDialog === 'create' ? 'Create Task' : 'Update Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskView;