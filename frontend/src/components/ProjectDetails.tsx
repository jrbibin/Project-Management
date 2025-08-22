import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Chip,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  OutlinedInput
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Info as InfoIcon,
  Add as AddIcon
} from '@mui/icons-material';

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

interface ProjectDetailsProps {
  project: Project;
  onBack: () => void;
}

interface Package {
  id: string;
  name: string;
  shotCount: number;
  totalBid: string;
  shots: Shot[];
}

interface Department {
  id: string;
  name: string;
  approvedBidDays: number;
  actualBidDays?: number;
  etaDate: string;
  description: string;
}

interface Shot {
  id: string;
  name: string;
  departments: Department[];
  packageId: string;
}

const AVAILABLE_DEPARTMENTS = [
  'Roto',
  'Paint',
  'Composite',
  'Matchmove',
  'Animation',
  'Modeling',
  'Texturing',
  'Lighting',
  'FX'
];

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onBack }) => {
  console.log('ProjectDetails component rendered');
  const [openAddPackageDialog, setOpenAddPackageDialog] = useState(false);
  const [packageName, setPackageName] = useState('');
  const [packages, setPackages] = useState<Package[]>([]);
  const [currentPackageId, setCurrentPackageId] = useState<string>('');
  
  // Add Shot Dialog States
  const [openAddShotDialog, setOpenAddShotDialog] = useState(false);
  const [shotName, setShotName] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [departmentDetails, setDepartmentDetails] = useState<{[key: string]: {bidDays: number, etaDate: string, description: string}}>({});
  
  // Add Version Dialog States
  const [openAddVersionDialog, setOpenAddVersionDialog] = useState(false);
  const [clientNotes, setClientNotes] = useState('');
  const [currentDepartmentId, setCurrentDepartmentId] = useState<string>('');
  const [versions, setVersions] = useState<{[key: string]: {id: string, version: string, notes: string, status: string, task: {id: string, name: string, description: string, status: string, priority: string}}[]}>({});
  
  // Add Task Dialog States
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [bidDays, setBidDays] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [currentTaskDepartmentId, setCurrentTaskDepartmentId] = useState<string>('');
  const [currentTaskShotId, setCurrentTaskShotId] = useState<number>(1);
  


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'on-hold': return 'warning';
      default: return 'default';
    }
  };

  const handleAddPackage = () => {
    if (packageName.trim()) {
      const newPackage: Package = {
        id: Date.now().toString(),
        name: packageName.trim(),
        shotCount: 0,
        totalBid: '0d',
        shots: []
      };
      setPackages([...packages, newPackage]);
      setPackageName('');
      setOpenAddPackageDialog(false);
    }
  };

  const handleCloseDialog = () => {
    setPackageName('');
    setOpenAddPackageDialog(false);
  };

  // Add Shot Dialog Handlers
  const handleOpenAddShotDialog = (packageId?: string) => {
    if (packageId) {
      setCurrentPackageId(packageId);
    }
    setOpenAddShotDialog(true);
  };

  const handleCloseAddShotDialog = () => {
    setShotName('');
    setSelectedDepartments([]);
    setDepartmentDetails({});
    setCurrentPackageId('');
    setOpenAddShotDialog(false);
  };

  // Add Version Dialog Handlers
  const handleOpenAddVersionDialog = (departmentId: string) => {
    setCurrentDepartmentId(departmentId);
    setOpenAddVersionDialog(true);
  };

  const handleCloseAddVersionDialog = () => {
    setClientNotes('');
    setCurrentDepartmentId('');
    setOpenAddVersionDialog(false);
  };

  // Add Task Dialog Handlers
  const handleOpenAddTaskDialog = (departmentId: string, shotId?: string) => {
    setCurrentTaskDepartmentId(departmentId);
    setCurrentTaskShotId(parseInt(shotId || '1')); // Store the shot ID as number
    setOpenAddTaskDialog(true);
  };

  const handleCloseAddTaskDialog = () => {
    setOpenAddTaskDialog(false);
    setTaskName('');
    setTaskDescription('');
    setBidDays('');
    setDueDate('');
    setCurrentTaskDepartmentId('');
  };

  const handleAddTask = async () => {
    if (!taskName.trim() || !taskDescription.trim() || !bidDays || parseFloat(bidDays) <= 0) {
      alert('Please fill in all required fields correctly.');
      return;
    }
    
    try {
      const taskData = {
        name: taskName,
        description: taskDescription,
        approved_bid_days: parseFloat(bidDays) || 1.0,
        due_date: dueDate || null,
        department_id: parseInt(currentTaskDepartmentId),
        shot_id: parseInt(currentTaskShotId.toString()),
        status: 'not_started',
        priority: 'medium',
        estimated_hours: null,
        actual_hours: 0.0,
        start_date: null,
        completed_date: null,
        current_version: 'v001',
        actual_bid_days: 0.0,
        eta_date: null,
        assignee_id: null
      };
      
      const response = await fetch('http://localhost:8000/api/tasks/with-version', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      if (response.ok) {
        const newTask = await response.json();
        console.log('Task created successfully:', newTask);
        alert('Task created successfully!');
        handleCloseAddTaskDialog();
        // TODO: Refresh the tasks list or update the UI to show the new task
      } else {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        console.error('Failed to create task:', errorData);
        alert(`Failed to create task: ${errorData.detail || response.statusText}`);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Network error: Unable to create task. Please try again.');
    }
  };

  const handleAddVersion = () => {
    if (!clientNotes.trim() || !currentDepartmentId) return;
    
    const departmentVersions = versions[currentDepartmentId] || [];
    const nextVersionNumber = `v${String(departmentVersions.length + 1).padStart(3, '0')}`;
    
    const newVersion = {
      id: `version-${Date.now()}`,
      version: nextVersionNumber,
      notes: clientNotes.trim(),
      status: 'In Progress',
      task: {
        id: `task-${Date.now()}`,
        name: 'Task_Name',
        description: '',
        status: 'In Progress',
        priority: 'High'
      }
    };
    
    setVersions(prev => ({
      ...prev,
      [currentDepartmentId]: [...(prev[currentDepartmentId] || []), newVersion]
    }));
    
    handleCloseAddVersionDialog();
  };



  const handleDepartmentChange = (event: any) => {
    const value = event.target.value;
    setSelectedDepartments(typeof value === 'string' ? value.split(',') : value);
    
    // Initialize department details for newly selected departments
    const newDepartmentDetails = { ...departmentDetails };
    value.forEach((dept: string) => {
      if (!newDepartmentDetails[dept]) {
        newDepartmentDetails[dept] = {
          bidDays: 1,
          etaDate: '',
          description: ''
        };
      }
    });
    
    // Remove details for unselected departments
    Object.keys(newDepartmentDetails).forEach(dept => {
      if (!value.includes(dept)) {
        delete newDepartmentDetails[dept];
      }
    });
    
    setDepartmentDetails(newDepartmentDetails);
  };

  const handleDepartmentDetailChange = (department: string, field: string, value: any) => {
    setDepartmentDetails(prev => ({
      ...prev,
      [department]: {
        ...prev[department],
        [field]: value
      }
    }));
  };

  const handleAddShot = () => {
    if (shotName.trim() && selectedDepartments.length > 0 && currentPackageId) {
      const newShot: Shot = {
        id: Date.now().toString(),
        name: shotName.trim(),
        packageId: currentPackageId,
        departments: selectedDepartments.map(dept => ({
          id: `${Date.now()}-${dept}`,
          name: dept,
          approvedBidDays: departmentDetails[dept]?.bidDays || 1,
          etaDate: departmentDetails[dept]?.etaDate || '',
          description: departmentDetails[dept]?.description || ''
        }))
      };
      
      setPackages(prevPackages => 
        prevPackages.map(pkg => 
          pkg.id === currentPackageId 
            ? { 
                ...pkg, 
                shots: [...pkg.shots, newShot],
                shotCount: pkg.shotCount + 1
              }
            : pkg
        )
      );
      
      handleCloseAddShotDialog();
    }
  };

  const removeDepartment = (departmentToRemove: string) => {
    const updatedDepartments = selectedDepartments.filter(dept => dept !== departmentToRemove);
    setSelectedDepartments(updatedDepartments);
    
    const updatedDetails = { ...departmentDetails };
    delete updatedDetails[departmentToRemove];
    setDepartmentDetails(updatedDetails);
  };



  return (
    <Container maxWidth="xl" sx={{ py: 4, px: 2 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{ mb: 3 }}
      >
        Back to Projects
      </Button>
      
      {/* Main Project Header - Horizontal Layout */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        backgroundColor: 'background.paper',
        borderRadius: 1,
        p: 4,
        boxShadow: 1,
        width: '100%'
      }}>
        {/* Left Section - Project Info */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              {project.name}
            </Typography>
            <Chip 
              label={project.type} 
              color="primary"
              size="medium"
            />
          </Box>
          <Typography variant="body1" color="text.secondary">
            {project.client}
          </Typography>
        </Box>
        
        {/* Center Section - Financial Metrics Card */}
        <Card sx={{ minWidth: '500px', p: 2 }}>
          <CardContent sx={{ display: 'flex', gap: 4, p: 0, '&:last-child': { pb: 0 } }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Budget
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                ₹10,37,500
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Actual Cost
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                ₹1,60,769.23
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Profit/Loss
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                ₹8,76,730.77
              </Typography>
            </Box>
          </CardContent>
        </Card>
        
        {/* Right Section - Add Package Button */}
        <Button 
          variant="contained" 
          color="primary"
          sx={{ px: 3, py: 1 }}
          onClick={() => setOpenAddPackageDialog(true)}
        >
          Add Package
        </Button>
      </Box>

      {/* Add Package Dialog */}
      <Dialog 
        open={openAddPackageDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            minHeight: '200px'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1
        }}>
          <Typography variant="h6" component="div">
            Add New Package
          </Typography>
          <IconButton 
            onClick={handleCloseDialog}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Package Name
          </Typography>
          <TextField
            fullWidth
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            placeholder="Enter package name"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f5f5f5',
                '& fieldset': {
                  border: 'none'
                }
              }
            }}
          />
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ 
              color: 'text.secondary',
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'text.secondary'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddPackage}
            variant="contained"
            disabled={!packageName.trim()}
            sx={{ px: 3 }}
          >
            Add Package
          </Button>
        </DialogActions>
       </Dialog>

       {/* Packages Section */}
       {packages.length > 0 && (
         <Box sx={{ mt: 3 }}>
           {packages.map((pkg) => (
             <Accordion key={pkg.id} sx={{ 
               mb: 3, 
               boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
               width: '100%',
               borderRadius: 3,
               border: '1px solid #e0e0e0',
               '&:before': { display: 'none' },
               '&.Mui-expanded': {
                 boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
               }
             }}>
               <AccordionSummary 
                   expandIcon={<ExpandMoreIcon sx={{ color: '#e91e63', fontSize: '2rem' }} />}
                   sx={{ 
                     backgroundColor: 'white',
                     borderRadius: '12px 12px 0 0',
                     minHeight: '80px',
                     '&:hover': { 
                       backgroundColor: '#f5f5f5',
                       transform: 'translateY(-2px)'
                     },
                     '&.Mui-expanded': {
                       backgroundColor: '#f5f5f5'
                     },
                     transition: 'all 0.3s ease-in-out'
                   }}
               >
                 <Box sx={{ 
                   display: 'flex', 
                   alignItems: 'center', 
                   justifyContent: 'space-between',
                   width: '100%',
                   mr: 2
                 }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                     <Box sx={{ 
                       display: 'flex', 
                       alignItems: 'center', 
                       justifyContent: 'center',
                       width: 50,
                       height: 50,
                       borderRadius: '50%',
                       background: 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)',
                       color: 'white',
                       fontSize: '1.5rem',
                       fontWeight: 'bold',
                       boxShadow: '0 4px 8px rgba(233, 30, 99, 0.3)'
                     }}>
                       📦
                     </Box>
                     <Box>
                       <Typography variant="h5" sx={{ 
                         fontWeight: 'bold', 
                         fontSize: '1.3rem',
                         color: '#ad1457',
                         mb: 0.5
                       }}>
                         {pkg.name}
                       </Typography>
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                         <Chip 
                           label={`${pkg.shotCount} shots`}
                           size="medium"
                           sx={{ 
                             backgroundColor: '#fce4ec',
                             color: '#ad1457',
                             fontWeight: 'bold',
                             fontSize: '0.8rem'
                           }}
                         />
                         <Chip 
                           label="In Progress"
                           size="medium"
                           color="warning"
                           sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}
                         />
                       </Box>
                     </Box>
                   </Box>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                     <Box sx={{ textAlign: 'right', mr: 2 }}>
                       <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium', whiteSpace: 'nowrap' }}>
                         Total Bid:
                       </Typography>
                       <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32', whiteSpace: 'nowrap' }}>
                         {pkg.totalBid}
                       </Typography>
                     </Box>
                     <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button size="small" variant="contained" sx={{ 
                          backgroundColor: '#e91e63',
                          '&:hover': { backgroundColor: '#ad1457' },
                          fontSize: '0.7rem',
                          minWidth: 'auto',
                          px: 1.5
                        }}>
                          Add Client Details
                        </Button>
                        <Button size="small" variant="contained" sx={{ 
                          backgroundColor: '#e91e63',
                          '&:hover': { backgroundColor: '#ad1457' },
                          fontSize: '0.7rem',
                          minWidth: 'auto',
                          px: 1.5
                        }}>
                          Add Bulk Client
                        </Button>
                        <Button size="small" variant="contained" sx={{ 
                          backgroundColor: '#e91e63',
                          '&:hover': { backgroundColor: '#ad1457' },
                          fontSize: '0.7rem',
                          minWidth: 'auto',
                          px: 1.5
                        }}>
                          Add Shot Details
                        </Button>
                        <Button size="small" variant="contained" sx={{ 
                          backgroundColor: '#e91e63',
                          '&:hover': { backgroundColor: '#ad1457' },
                          fontSize: '0.7rem',
                          minWidth: 'auto',
                          px: 1.5
                        }}>
                          Add Bulk Shot Details
                        </Button>
                        <Button 
                          size="small" 
                          variant="contained" 
                          onClick={() => handleOpenAddShotDialog(pkg.id)}
                          sx={{ 
                            backgroundColor: '#e91e63',
                            '&:hover': { backgroundColor: '#ad1457' },
                            fontSize: '0.7rem',
                            minWidth: 'auto',
                            px: 1.5
                          }}
                        >
                          Add Shot
                        </Button>
                        <Button size="small" variant="contained" sx={{ 
                          backgroundColor: '#e91e63',
                          '&:hover': { backgroundColor: '#ad1457' },
                          fontSize: '0.7rem',
                          minWidth: 'auto',
                          px: 1.5
                        }}>
                          Add Bulk Shots
                        </Button>
                      </Box>
                   </Box>
                 </Box>
               </AccordionSummary>
               <AccordionDetails>
                 {pkg.shots.length === 0 ? (
                   <Typography variant="body2" color="text.secondary">
                     No shots added yet. Click "Add Shot" to create your first shot.
                   </Typography>
                 ) : (
                   <Box sx={{ mt: 1 }}>
                     {pkg.shots.map((shot) => (
                       <Accordion key={shot.id} sx={{ 
                         mb: 2, 
                         ml: 2, 
                         width: '100%',
                         borderRadius: 2,
                         boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                         border: '1px solid #e0e0e0',
                         '&:before': { display: 'none' },
                         '&.Mui-expanded': {
                           boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                         }
                       }}>
                         <AccordionSummary 
                           expandIcon={<ExpandMoreIcon sx={{ color: '#1976d2' }} />}
                           sx={{ 
                             background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                             borderRadius: '8px 8px 0 0',
                             minHeight: '64px',
                             '&:hover': { 
                               background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                               transform: 'translateY(-1px)'
                             },
                             '&.Mui-expanded': {
                               background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
                             },
                             transition: 'all 0.2s ease-in-out'
                           }}
                         >
                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%' }}>
                             <Box sx={{ 
                               display: 'flex', 
                               alignItems: 'center', 
                               justifyContent: 'center',
                               width: 40,
                               height: 40,
                               borderRadius: '50%',
                               background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                               color: 'white',
                               fontSize: '1.2rem',
                               fontWeight: 'bold'
                             }}>
                               🎬
                             </Box>
                             <Box sx={{ flex: 1 }}>
                               <Typography variant="h6" sx={{ 
                                 fontWeight: 'bold', 
                                 fontSize: '1.1rem',
                                 color: '#1565c0',
                                 mb: 0.5
                               }}>
                                 {shot.name}
                               </Typography>
                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                 <Chip 
                                   label={`${shot.departments.length} departments`}
                                   size="small"
                                   sx={{ 
                                     backgroundColor: '#e3f2fd',
                                     color: '#1565c0',
                                     fontWeight: 'medium',
                                     fontSize: '0.75rem'
                                   }}
                                 />
                                 <Chip 
                                   label="Active"
                                   size="small"
                                   color="success"
                                   sx={{ fontWeight: 'medium', fontSize: '0.75rem' }}
                                 />
                               </Box>
                             </Box>
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                                 Progress:
                               </Typography>
                               <Box sx={{ 
                                 width: 60, 
                                 height: 6, 
                                 backgroundColor: '#e0e0e0', 
                                 borderRadius: 3,
                                 overflow: 'hidden'
                               }}>
                                 <Box sx={{ 
                                   width: '65%', 
                                   height: '100%', 
                                   backgroundColor: '#4caf50',
                                   borderRadius: 3
                                 }} />
                               </Box>
                               <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                                 65%
                               </Typography>
                             </Box>
                           </Box>
                         </AccordionSummary>
                         <AccordionDetails>
                           {shot.departments.map((dept) => (
                             <Accordion key={dept.id} sx={{ mb: 1, ml: 2, width: '100%' }}>
                               <AccordionSummary 
                                  expandIcon={<ExpandMoreIcon />}
                                  sx={{ 
                                    backgroundColor: '#f1f3f4',
                                    '&:hover': { backgroundColor: '#e8eaed' },
                                    width: '100%'
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', minHeight: '80px', px: 3, py: 2 }}>
                                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'nowrap', overflow: 'hidden', flex: 1 }}>
                                         <Chip 
                                            label={dept.name}
                                            size="medium"
                                            color={dept.name === 'Roto' ? 'error' : 
                                                   dept.name === 'Paint' ? 'success' : 
                                                   dept.name === 'Composite' ? 'primary' : 
                                                   dept.name === 'Matchmove' ? 'warning' : 'default'}
                                            sx={{ minWidth: '80px', fontWeight: 600, height: '30px', fontSize: '0.85rem' }}
                                          />
                                         <Typography variant="body2" sx={{ whiteSpace: 'nowrap', fontSize: '0.85rem', color: '#000000', fontWeight: 600, minWidth: '100px' }}>
                                           APPROVED BID: {dept.approvedBidDays || 0}d
                                         </Typography>
                                         <Typography variant="body2" sx={{ whiteSpace: 'nowrap', fontSize: '0.85rem', color: '#000000', fontWeight: 600, minWidth: '90px' }}>
                                           ACTUAL BID: {dept.actualBidDays || 0}d
                                         </Typography>
                                         <Typography variant="body2" sx={{ whiteSpace: 'nowrap', fontSize: '0.85rem', color: '#000000', fontWeight: 600, minWidth: '100px' }}>
                                           ETA: {dept.etaDate ? new Date(dept.etaDate).toLocaleDateString('en-GB') : '23/08/2025'}
                                         </Typography>
                                         <Typography variant="body2" sx={{ whiteSpace: 'nowrap', fontSize: '0.85rem', color: '#000000', fontWeight: 600, minWidth: '85px' }}>
                                           VERSION: v002
                                         </Typography>
                                         <Chip label="High" size="small" color="error" sx={{ minWidth: '60px', fontWeight: 600, height: '30px', fontSize: '0.8rem' }} />
                                         <Typography variant="body2" sx={{ whiteSpace: 'nowrap', fontSize: '0.85rem', color: '#000000', fontWeight: 600, minWidth: '65px' }}>
                                           STATUS:
                                         </Typography>
                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1.5 }}>
                                           <IconButton size="small" sx={{ backgroundColor: '#e3f2fd', color: '#1976d2', width: 28, height: 28 }}>
                                             <PersonIcon sx={{ fontSize: 16 }} />
                                           </IconButton>
                                           <IconButton size="small" sx={{ backgroundColor: '#f3e5f5', color: '#7b1fa2', width: 28, height: 28 }}>
                                             <InfoIcon sx={{ fontSize: 16 }} />
                                           </IconButton>
                                         </Box>
                                       </Box>
                                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0, ml: 'auto' }}>
                                         <Button size="small" variant="contained" color="primary" sx={{ fontSize: '0.75rem', px: 2, py: 1, minWidth: '80px', height: '32px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                           Raise Query
                                         </Button>
                                         <Button 
                                           size="small" 
                                           variant="contained" 
                                           color="primary" 
                                           sx={{ fontSize: '0.75rem', px: 2, py: 1, minWidth: '80px', height: '32px', fontWeight: 500, whiteSpace: 'nowrap' }}
                                           onClick={() => handleOpenAddVersionDialog(dept.id)}
                                         >
                                           Add Version
                                         </Button>
                                         <Button size="small" variant="contained" sx={{ backgroundColor: '#ff9800', '&:hover': { backgroundColor: '#f57c00' }, fontSize: '0.75rem', px: 1.5, py: 1, minWidth: '85px', height: '32px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                           Move to Archive
                                         </Button>
                                       </Box>
                                     </Box>
                                </AccordionSummary>
                               <AccordionDetails>
                                 {/* Version Cards */}
                                 {versions[dept.id] && versions[dept.id].length > 0 && (
                                   <Box sx={{ mt: 2 }}>
                                     {versions[dept.id].map((version) => (
                                       <React.Fragment key={version.id}>
                                         <Card sx={{ 
                                           mb: 2, 
                                           ml: 2, 
                                           boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                                           borderRadius: 2,
                                           border: '1px solid #e0e0e0'
                                         }}>
                                         <CardContent sx={{ py: 2 }}>
                                           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                               <Chip 
                                                 label={version.version}
                                                 size="small"
                                                 color="primary"
                                                 sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                                               />
                                               <Chip 
                                                 label={version.status}
                                                 size="small"
                                                 color="warning"
                                                 sx={{ fontWeight: 500, fontSize: '0.7rem' }}
                                               />
                                             </Box>
                                             <Button size="small" variant="outlined" sx={{ fontSize: '0.7rem', px: 1.5 }}>
                                               E001
                                             </Button>
                                           </Box>
                                           <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', lineHeight: 1.4, mb: 2 }}>
                                              {version.notes}
                                            </Typography>
                                          </CardContent>
                                        </Card>
                                        
                                        {/* Task Row for this version */}
                                        <Box sx={{ 
                                          display: 'flex', 
                                          alignItems: 'center', 
                                          justifyContent: 'space-between',
                                          p: 2,
                                          ml: 4,
                                          mb: 2,
                                          backgroundColor: '#f8f9fa',
                                          borderRadius: 1,
                                          border: '1px solid #e9ecef'
                                        }}>
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                                              Task: {version.task.name}
                                            </Typography>
                                            <Chip 
                                              label={version.version}
                                              size="small"
                                              color="error"
                                              sx={{ fontSize: '0.7rem', height: '20px' }}
                                            />
                                            <Chip 
                                              label={version.task.priority}
                                              size="small"
                                              color="error"
                                              sx={{ fontSize: '0.7rem', height: '20px' }}
                                            />
                                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                              Status: {version.task.status}
                                            </Typography>
                                          </Box>
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Button size="small" variant="outlined" sx={{ fontSize: '0.7rem', px: 1, py: 0.5, minWidth: 'auto' }}>
                                              Notes Query
                                            </Button>
                                            <Button size="small" variant="outlined" sx={{ fontSize: '0.7rem', px: 1, py: 0.5, minWidth: 'auto' }}>
                                              E001
                                            </Button>
                                            <IconButton size="small" sx={{ width: 24, height: 24 }}>
                                              <DeleteIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                          </Box>
                                        </Box>
                                      </React.Fragment>
                                     ))}
                                   </Box>
                                 )}
                                 
                                 {/* Add Task Button */}
                                 <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                   <Button
                                     size="small"
                                     variant="outlined"
                                     startIcon={<AddIcon />}
                                     onClick={() => handleOpenAddTaskDialog(dept.id, shot.id)}
                                     sx={{ 
                                       color: '#666',
                                       borderColor: '#ddd',
                                       '&:hover': { bgcolor: '#f5f5f5' },
                                       fontSize: '0.8rem',
                                       px: 3,
                                       py: 1
                                     }}
                                   >
                                     Add Task
                                   </Button>
                                 </Box>
                               </AccordionDetails>
                             </Accordion>
                           ))}
                         </AccordionDetails>
                       </Accordion>
                     ))}
                   </Box>
                 )}
               </AccordionDetails>
             </Accordion>
           ))}
         </Box>
       )}

       {/* Add Shot Dialog */}
       <Dialog 
         open={openAddShotDialog} 
         onClose={handleCloseAddShotDialog}
         maxWidth="md"
         fullWidth
         PaperProps={{
           sx: {
             borderRadius: 2,
             minHeight: '500px'
           }
         }}
       >
         <DialogTitle sx={{ 
           display: 'flex', 
           justifyContent: 'space-between', 
           alignItems: 'center',
           pb: 1
         }}>
           <Typography variant="h6" component="div">
             Add New Shot
           </Typography>
           <IconButton 
             onClick={handleCloseAddShotDialog}
             size="small"
             sx={{ color: 'text.secondary' }}
           >
             <CloseIcon />
           </IconButton>
         </DialogTitle>
         
         <DialogContent sx={{ pt: 2 }}>
           {/* Shot Name */}
           <Box sx={{ mb: 3 }}>
             <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
               Shot Name
             </Typography>
             <TextField
               fullWidth
               value={shotName}
               onChange={(e) => setShotName(e.target.value)}
               placeholder="Example"
               variant="outlined"
               sx={{
                 '& .MuiOutlinedInput-root': {
                   backgroundColor: '#f5f5f5',
                   '& fieldset': {
                     border: 'none'
                   }
                 }
               }}
             />
           </Box>

           {/* Department Selection */}
           <Box sx={{ mb: 3 }}>
             <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
               Select Departments
             </Typography>
             <FormControl fullWidth>
               <Select
                 multiple
                 value={selectedDepartments}
                 onChange={handleDepartmentChange}
                 input={<OutlinedInput />}
                 renderValue={(selected) => selected.join(', ')}
                 sx={{
                   backgroundColor: '#f5f5f5',
                   '& fieldset': {
                     border: 'none'
                   }
                 }}
               >
                 {AVAILABLE_DEPARTMENTS.map((department) => (
                   <MenuItem key={department} value={department}>
                     <Checkbox checked={selectedDepartments.indexOf(department) > -1} />
                     <ListItemText primary={department} />
                   </MenuItem>
                 ))}
               </Select>
             </FormControl>
           </Box>

           {/* Departments Selected Table */}
           {selectedDepartments.length > 0 && (
             <Box>
               <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                 Departments Selected:
               </Typography>
               <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
                 <Table>
                   <TableHead>
                     <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                       <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                       <TableCell sx={{ fontWeight: 'bold' }}>Approved Bid (days)</TableCell>
                       <TableCell sx={{ fontWeight: 'bold' }}>ETA Date</TableCell>
                       <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                       <TableCell sx={{ fontWeight: 'bold', width: '50px' }}>Action</TableCell>
                     </TableRow>
                   </TableHead>
                   <TableBody>
                     {selectedDepartments.map((department) => (
                       <TableRow key={department}>
                         <TableCell>{department}</TableCell>
                         <TableCell>
                           <TextField
                             type="number"
                             size="small"
                             value={departmentDetails[department]?.bidDays || 1}
                             onChange={(e) => handleDepartmentDetailChange(department, 'bidDays', parseInt(e.target.value) || 1)}
                             inputProps={{ min: 1 }}
                             sx={{ width: '80px' }}
                           />
                         </TableCell>
                         <TableCell>
                           <TextField
                             type="date"
                             size="small"
                             value={departmentDetails[department]?.etaDate || ''}
                             onChange={(e) => handleDepartmentDetailChange(department, 'etaDate', e.target.value)}
                             sx={{ width: '150px' }}
                             InputLabelProps={{
                               shrink: true,
                             }}
                           />
                         </TableCell>
                         <TableCell>
                           <TextField
                             size="small"
                             value={departmentDetails[department]?.description || ''}
                             onChange={(e) => handleDepartmentDetailChange(department, 'description', e.target.value)}
                             placeholder="Enter description"
                             sx={{ minWidth: '200px' }}
                           />
                         </TableCell>
                         <TableCell>
                           <IconButton 
                             size="small" 
                             onClick={() => removeDepartment(department)}
                             sx={{ color: 'error.main' }}
                           >
                             <DeleteIcon fontSize="small" />
                           </IconButton>
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </TableContainer>
             </Box>
           )}
         </DialogContent>
         
         <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
           <Button 
             onClick={handleCloseAddShotDialog}
             variant="outlined"
             sx={{ 
               color: 'text.secondary',
               borderColor: 'divider',
               '&:hover': {
                 borderColor: 'text.secondary'
               }
             }}
           >
             Cancel
           </Button>
           <Button 
             onClick={handleAddShot}
             variant="contained"
             disabled={!shotName.trim() || selectedDepartments.length === 0}
             sx={{ px: 3 }}
           >
             Add Shot
           </Button>
         </DialogActions>
       </Dialog>

       {/* Add Version Dialog */}
       <Dialog 
         open={openAddVersionDialog} 
         onClose={handleCloseAddVersionDialog}
         maxWidth="sm"
         fullWidth
         PaperProps={{
           sx: {
             borderRadius: 2,
             minHeight: '300px'
           }
         }}
       >
         <DialogTitle sx={{ 
           display: 'flex', 
           justifyContent: 'space-between', 
           alignItems: 'center',
           pb: 1
         }}>
           <Typography variant="h6" component="div">
             Add New Client Version
           </Typography>
           <IconButton 
             onClick={handleCloseAddVersionDialog}
             size="small"
             sx={{ color: 'text.secondary' }}
           >
             <CloseIcon />
           </IconButton>
         </DialogTitle>
         
         <DialogContent sx={{ pt: 2 }}>
           <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
             Client Notes / Feedback
           </Typography>
           <TextField
             fullWidth
             multiline
             rows={6}
             value={clientNotes}
             onChange={(e) => setClientNotes(e.target.value)}
             placeholder="Enter client notes or feedback..."
             variant="outlined"
             sx={{
               '& .MuiOutlinedInput-root': {
                 backgroundColor: '#f5f5f5',
                 '& fieldset': {
                   border: 'none'
                 }
               }
             }}
           />
         </DialogContent>
         
         <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
           <Button 
             onClick={handleCloseAddVersionDialog}
             variant="outlined"
             sx={{ 
               color: 'text.secondary',
               borderColor: 'divider',
               '&:hover': {
                 borderColor: 'text.secondary'
               }
             }}
           >
             Cancel
           </Button>
           <Button 
             onClick={handleAddVersion}
             variant="contained"
             disabled={!clientNotes.trim()}
             sx={{ px: 3 }}
           >
             Add Version
           </Button>
         </DialogActions>
       </Dialog>

       {/* Add Task Dialog */}
       <Dialog 
         open={openAddTaskDialog} 
         onClose={handleCloseAddTaskDialog}
         maxWidth="sm"
         fullWidth
         PaperProps={{
           sx: {
             borderRadius: 2,
             minHeight: '400px'
           }
         }}
       >
         <DialogTitle sx={{ 
           display: 'flex', 
           justifyContent: 'space-between', 
           alignItems: 'center',
           pb: 1
         }}>
           <Typography variant="h6" component="div">
             Add New Task
           </Typography>
           <IconButton 
             onClick={handleCloseAddTaskDialog}
             size="small"
             sx={{ color: 'text.secondary' }}
           >
             <CloseIcon />
           </IconButton>
         </DialogTitle>
         
         <DialogContent sx={{ pt: 2 }}>
           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
             {/* Task Name */}
             <Box>
               <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                 Task Name
               </Typography>
               <TextField
                 fullWidth
                 value={taskName}
                 onChange={(e) => setTaskName(e.target.value)}
                 placeholder="Enter task name..."
                 variant="outlined"
                 sx={{
                   '& .MuiOutlinedInput-root': {
                     backgroundColor: '#f5f5f5',
                     '& fieldset': {
                       border: 'none'
                     }
                   }
                 }}
               />
             </Box>

             {/* Description */}
             <Box>
               <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                 Description
               </Typography>
               <TextField
                 fullWidth
                 multiline
                 rows={4}
                 value={taskDescription}
                 onChange={(e) => setTaskDescription(e.target.value)}
                 placeholder="Enter task description..."
                 variant="outlined"
                 sx={{
                   '& .MuiOutlinedInput-root': {
                     backgroundColor: '#f5f5f5',
                     '& fieldset': {
                       border: 'none'
                     }
                   }
                 }}
               />
             </Box>

             {/* Bid Days and Due Date */}
             <Box sx={{ display: 'flex', gap: 2 }}>
               <Box sx={{ flex: 1 }}>
                 <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                   Bid (days)
                 </Typography>
                 <TextField
                   fullWidth
                   type="number"
                   value={bidDays}
                   onChange={(e) => setBidDays(e.target.value)}
                   placeholder="Enter bid days..."
                   variant="outlined"
                   sx={{
                     '& .MuiOutlinedInput-root': {
                       backgroundColor: '#f5f5f5',
                       '& fieldset': {
                         border: 'none'
                       }
                     }
                   }}
                 />
               </Box>
               <Box sx={{ flex: 1 }}>
                 <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                   Due Date
                 </Typography>
                 <TextField
                   fullWidth
                   type="date"
                   value={dueDate}
                   onChange={(e) => setDueDate(e.target.value)}
                   variant="outlined"
                   InputLabelProps={{
                     shrink: true,
                   }}
                   sx={{
                     '& .MuiOutlinedInput-root': {
                       backgroundColor: '#f5f5f5',
                       '& fieldset': {
                         border: 'none'
                       }
                     }
                   }}
                 />
               </Box>
             </Box>
           </Box>
         </DialogContent>
         
         <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
           <Button 
             onClick={handleCloseAddTaskDialog}
             variant="outlined"
             sx={{ 
               color: 'text.secondary',
               borderColor: 'divider',
               '&:hover': {
                 borderColor: 'text.secondary'
               }
             }}
           >
             Cancel
           </Button>
           <Button 
             onClick={handleAddTask}
             variant="contained"
             disabled={!taskName.trim() || !taskDescription.trim() || !bidDays || parseFloat(bidDays) <= 0}
             sx={{ px: 3 }}
           >
             Add Task
           </Button>
         </DialogActions>
       </Dialog>


     </Container>
     );
   };
 
 export default ProjectDetails;