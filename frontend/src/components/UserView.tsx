import React, { useState } from 'react';
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
  Avatar,
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
  Tabs,
  Tab,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  ExpandMore as ExpandMoreIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  department_id?: number;
  is_active: boolean;
  created_at: string;
  department?: Department;
}

interface Department {
  id: number;
  name: string;
  code: string;
  color: string;
  description?: string;
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
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const UserView: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState<'user' | 'department' | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    full_name: '',
    department_id: '',
    password: '',
  });
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    code: '',
    color: '#3498db',
    description: '',
  });

  const queryClient = useQueryClient();

  // Fetch users
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axios.get('/api/users');
      return response.data;
    },
  });

  // Fetch departments
  const { data: departments = [], isLoading: departmentsLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await axios.get('/api/departments');
      return response.data;
    },
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/users', {
        ...data,
        department_id: data.department_id ? parseInt(data.department_id) : null,
        is_active: true,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpenDialog(null);
      setNewUser({
        username: '',
        email: '',
        full_name: '',
        department_id: '',
        password: '',
      });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await axios.put(`/api/users/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpenDialog(null);
      setSelectedUser(null);
    },
  });

  // Create department mutation
  const createDepartmentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/departments', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setOpenDialog(null);
      setNewDepartment({
        name: '',
        code: '',
        color: '#3498db',
        description: '',
      });
    },
  });

  // Update department mutation
  const updateDepartmentMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await axios.put(`/api/departments/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setOpenDialog(null);
      setSelectedDepartment(null);
    },
  });

  const handleCreateUser = () => {
    if (!newUser.username || !newUser.email || !newUser.full_name || !newUser.password) return;
    createUserMutation.mutate(newUser);
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;
    updateUserMutation.mutate({
      id: selectedUser.id,
      username: selectedUser.username,
      email: selectedUser.email,
      full_name: selectedUser.full_name,
      department_id: selectedUser.department_id,
      is_active: selectedUser.is_active,
    });
  };

  const handleCreateDepartment = () => {
    if (!newDepartment.name || !newDepartment.code) return;
    createDepartmentMutation.mutate(newDepartment);
  };

  const handleUpdateDepartment = () => {
    if (!selectedDepartment) return;
    updateDepartmentMutation.mutate(selectedDepartment);
  };

  const getUsersByDepartment = () => {
    const usersByDept: { [key: string]: User[] } = {
      unassigned: users.filter((user: User) => !user.department_id),
    };
    
    departments.forEach((dept: Department) => {
      usersByDept[dept.id] = users.filter((user: User) => user.department_id === dept.id);
    });
    
    return usersByDept;
  };

  const usersByDepartment = getUsersByDepartment();

  const colorOptions = [
    '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#f1c40f'
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          User & Department Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<GroupIcon />}
            onClick={() => {
              setSelectedDepartment(null);
              setOpenDialog('department');
            }}
          >
            Add Department
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedUser(null);
              setOpenDialog('user');
            }}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Department View" />
          <Tab label="User List" />
          <Tab label="Departments" />
        </Tabs>
      </Box>

      {/* Department View */}
      <TabPanel value={tabValue} index={0}>
        {/* Unassigned Users */}
        {usersByDepartment.unassigned?.length > 0 && (
          <Accordion sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: '#95a5a6',
                  }}
                />
                <Typography variant="h6">Unassigned</Typography>
                <Badge badgeContent={usersByDepartment.unassigned.length} color="warning" sx={{ ml: 'auto' }} />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
                {usersByDepartment.unassigned.map((user: User) => (
                  <Box key={user.id}>
                    <Card 
                      variant="outlined"
                      sx={{
                        background: theme.palette.mode === 'dark' 
                          ? 'linear-gradient(135deg, rgba(233, 30, 99, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)'
                          : 'linear-gradient(135deg, rgba(233, 30, 99, 0.05) 0%, rgba(33, 150, 243, 0.05) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${theme.palette.divider}`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.02)',
                          boxShadow: theme.palette.mode === 'dark'
                            ? '0 20px 40px rgba(233, 30, 99, 0.3)'
                            : '0 20px 40px rgba(0, 0, 0, 0.15)',
                          border: `1px solid ${theme.palette.primary.main}`
                        }
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar sx={{ bgcolor: '#95a5a6' }}>
                            {user.full_name.charAt(0)}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {user.full_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              @{user.username}
                            </Typography>
                          </Box>
                          <Chip
                            label={user.is_active ? 'Active' : 'Inactive'}
                            size="small"
                            color={user.is_active ? 'success' : 'default'}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2">{user.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenDialog('user');
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Department Users */}
        {departments.map((department: Department) => {
          const deptUsers = usersByDepartment[department.id] || [];
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
                  <Typography variant="body2" color="text.secondary">
                    ({department.code})
                  </Typography>
                  <Badge badgeContent={deptUsers.length} color="primary" sx={{ ml: 'auto' }} />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {deptUsers.length === 0 ? (
                  <Alert severity="info">No users assigned to this department</Alert>
                ) : (
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
                    {deptUsers.map((user: User) => (
                      <Box key={user.id}>
                        <Card 
                          variant="outlined"
                          sx={{
                            background: theme.palette.mode === 'dark' 
                              ? 'linear-gradient(135deg, rgba(233, 30, 99, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)'
                              : 'linear-gradient(135deg, rgba(233, 30, 99, 0.05) 0%, rgba(33, 150, 243, 0.05) 100%)',
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${theme.palette.divider}`,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              transform: 'translateY(-8px) scale(1.02)',
                              boxShadow: theme.palette.mode === 'dark'
                                ? '0 20px 40px rgba(233, 30, 99, 0.3)'
                                : '0 20px 40px rgba(0, 0, 0, 0.15)',
                              border: `1px solid ${theme.palette.primary.main}`
                            }
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Avatar sx={{ bgcolor: department.color }}>
                                {user.full_name.charAt(0)}
                              </Avatar>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                  {user.full_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  @{user.username}
                                </Typography>
                              </Box>
                              <Chip
                                label={user.is_active ? 'Active' : 'Inactive'}
                                size="small"
                                color={user.is_active ? 'success' : 'default'}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <EmailIcon fontSize="small" color="action" />
                              <Typography variant="body2">{user.email}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <WorkIcon fontSize="small" color="action" />
                              <Typography variant="body2">{department.name}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setOpenDialog('user');
                                }}
                              >
                                <EditIcon fontSize="small" />
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

      {/* User List */}
      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: user.department?.color || '#95a5a6' }}>
                        {user.full_name.charAt(0)}
                      </Avatar>
                      <Typography>{user.full_name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>@{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.department ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: user.department.color,
                          }}
                        />
                        {user.department.name}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Unassigned
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      color={user.is_active ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedUser(user);
                        setOpenDialog('user');
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Departments */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
          {departments?.map((department: Department) => {
            const deptUsers = usersByDepartment[department.id] || [];
            return (
              <Box key={department.id}>
                <Card
                  sx={{
                    background: theme.palette.mode === 'dark' 
                      ? 'linear-gradient(135deg, rgba(233, 30, 99, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(233, 30, 99, 0.05) 0%, rgba(33, 150, 243, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 20px 40px rgba(233, 30, 99, 0.3)'
                        : '0 20px 40px rgba(0, 0, 0, 0.15)',
                      border: `1px solid ${theme.palette.primary.main}`
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: department.color,
                        }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">{department.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {department.code}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedDepartment(department);
                          setOpenDialog('department');
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    {department.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {department.description}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {deptUsers.length} user{deptUsers.length !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
      </TabPanel>

      {/* User Dialog */}
      <Dialog open={openDialog === 'user'} onClose={() => setOpenDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Create New User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={selectedUser ? selectedUser.full_name : newUser.full_name}
              onChange={(e) => {
                if (selectedUser) {
                  setSelectedUser({ ...selectedUser, full_name: e.target.value });
                } else {
                  setNewUser({ ...newUser, full_name: e.target.value });
                }
              }}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Username"
              value={selectedUser ? selectedUser.username : newUser.username}
              onChange={(e) => {
                if (selectedUser) {
                  setSelectedUser({ ...selectedUser, username: e.target.value });
                } else {
                  setNewUser({ ...newUser, username: e.target.value });
                }
              }}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={selectedUser ? selectedUser.email : newUser.email}
              onChange={(e) => {
                if (selectedUser) {
                  setSelectedUser({ ...selectedUser, email: e.target.value });
                } else {
                  setNewUser({ ...newUser, email: e.target.value });
                }
              }}
              sx={{ mb: 2 }}
              required
            />
            {!selectedUser && (
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                sx={{ mb: 2 }}
                required
              />
            )}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Department</InputLabel>
              <Select
                value={selectedUser ? selectedUser.department_id || '' : newUser.department_id}
                label="Department"
                onChange={(e) => {
                  if (selectedUser) {
                    setSelectedUser({ ...selectedUser, department_id: e.target.value as number || undefined });
                  } else {
                    setNewUser({ ...newUser, department_id: e.target.value as string });
                  }
                }}
              >
                <MenuItem value="">No Department</MenuItem>
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
            {selectedUser && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedUser.is_active.toString()}
                  label="Status"
                  onChange={(e) => setSelectedUser({ ...selectedUser, is_active: e.target.value === 'true' })}
                >
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>Cancel</Button>
          <Button
            onClick={selectedUser ? handleUpdateUser : handleCreateUser}
            variant="contained"
            disabled={
              selectedUser
                ? !selectedUser.username || !selectedUser.email || !selectedUser.full_name
                : !newUser.username || !newUser.email || !newUser.full_name || !newUser.password
            }
          >
            {selectedUser ? 'Update User' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Department Dialog */}
      <Dialog open={openDialog === 'department'} onClose={() => setOpenDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedDepartment ? 'Edit Department' : 'Create New Department'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Department Name"
              value={selectedDepartment ? selectedDepartment.name : newDepartment.name}
              onChange={(e) => {
                if (selectedDepartment) {
                  setSelectedDepartment({ ...selectedDepartment, name: e.target.value });
                } else {
                  setNewDepartment({ ...newDepartment, name: e.target.value });
                }
              }}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Department Code"
              value={selectedDepartment ? selectedDepartment.code : newDepartment.code}
              onChange={(e) => {
                if (selectedDepartment) {
                  setSelectedDepartment({ ...selectedDepartment, code: e.target.value.toUpperCase() });
                } else {
                  setNewDepartment({ ...newDepartment, code: e.target.value.toUpperCase() });
                }
              }}
              sx={{ mb: 2 }}
              required
              helperText="e.g., ROTO, PAINT, COMP"
            />
            <TextField
              fullWidth
              label="Description"
              value={selectedDepartment ? selectedDepartment.description || '' : newDepartment.description}
              onChange={(e) => {
                if (selectedDepartment) {
                  setSelectedDepartment({ ...selectedDepartment, description: e.target.value });
                } else {
                  setNewDepartment({ ...newDepartment, description: e.target.value });
                }
              }}
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Department Color
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {colorOptions.map((color) => (
                  <Box
                    key={color}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: color,
                      cursor: 'pointer',
                      border: (selectedDepartment ? selectedDepartment.color : newDepartment.color) === color ? '3px solid #000' : '2px solid #ddd',
                    }}
                    onClick={() => {
                      if (selectedDepartment) {
                        setSelectedDepartment({ ...selectedDepartment, color });
                      } else {
                        setNewDepartment({ ...newDepartment, color });
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>Cancel</Button>
          <Button
            onClick={selectedDepartment ? handleUpdateDepartment : handleCreateDepartment}
            variant="contained"
            disabled={
              selectedDepartment
                ? !selectedDepartment.name || !selectedDepartment.code
                : !newDepartment.name || !newDepartment.code
            }
          >
            {selectedDepartment ? 'Update Department' : 'Create Department'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserView;