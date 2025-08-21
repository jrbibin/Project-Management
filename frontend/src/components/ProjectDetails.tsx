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
  Delete as DeleteIcon
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
  const [openAddPackageDialog, setOpenAddPackageDialog] = useState(false);
  const [packageName, setPackageName] = useState('');
  const [packages, setPackages] = useState<Package[]>([]);
  const [currentPackageId, setCurrentPackageId] = useState<string>('');
  
  // Add Shot Dialog States
  const [openAddShotDialog, setOpenAddShotDialog] = useState(false);
  const [shotName, setShotName] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [departmentDetails, setDepartmentDetails] = useState<{[key: string]: {bidDays: number, etaDate: string, description: string}}>({});

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
        p: 3,
        boxShadow: 1
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
        <Card sx={{ minWidth: '400px', p: 2 }}>
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
             <Accordion key={pkg.id} sx={{ mb: 1, boxShadow: 1 }}>
               <AccordionSummary 
                 expandIcon={<ExpandMoreIcon />}
                 sx={{ 
                   backgroundColor: 'background.paper',
                   '&:hover': { backgroundColor: 'action.hover' }
                 }}
               >
                 <Box sx={{ 
                   display: 'flex', 
                   alignItems: 'center', 
                   justifyContent: 'space-between',
                   width: '100%',
                   mr: 2
                 }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                     <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                       {pkg.name}
                     </Typography>
                     <Typography variant="body2" color="text.secondary">
                       {pkg.shotCount} shots
                     </Typography>
                   </Box>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                     <Typography variant="body2" color="text.secondary">
                       Total Bid:
                     </Typography>
                     <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                       {pkg.totalBid}
                     </Typography>
                     <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                       <Button size="small" variant="contained" color="primary">
                         Add Client Details
                       </Button>
                       <Button size="small" variant="contained" color="primary">
                         Add Bulk Client
                       </Button>
                       <Button size="small" variant="contained" color="primary">
                         Add Shot Details
                       </Button>
                       <Button size="small" variant="contained" color="primary">
                         Add Bulk Shot Details
                       </Button>
                       <Button 
                         size="small" 
                         variant="contained" 
                         color="primary"
                         onClick={() => handleOpenAddShotDialog(pkg.id)}
                       >
                         Add Shot
                       </Button>
                       <Button size="small" variant="contained" color="primary">
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
                   <TableContainer component={Paper} sx={{ mt: 2 }}>
                     <Table size="small">
                       <TableHead>
                         <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                           <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Shot</TableCell>
                           <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Department</TableCell>
                           <TableCell sx={{ fontWeight: 'bold', width: '12%' }}>Approved Bid</TableCell>
                           <TableCell sx={{ fontWeight: 'bold', width: '12%' }}>Actual Bid</TableCell>
                           <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>ETA</TableCell>
                           <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Version</TableCell>
                           <TableCell sx={{ fontWeight: 'bold', width: '8%' }}>Priority</TableCell>
                           <TableCell sx={{ fontWeight: 'bold', width: '8%' }}>Status</TableCell>
                           <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Actions</TableCell>
                         </TableRow>
                       </TableHead>
                       <TableBody>
                         {pkg.shots.map((shot) => 
                           shot.departments.map((dept, deptIndex) => (
                             <TableRow key={`${shot.id}-${dept.id}`}>
                               {deptIndex === 0 && (
                                 <TableCell 
                                   rowSpan={shot.departments.length}
                                   sx={{ 
                                     verticalAlign: 'top',
                                     borderRight: '1px solid #e0e0e0',
                                     fontWeight: 'medium'
                                   }}
                                 >
                                   {shot.name}
                                 </TableCell>
                               )}
                               <TableCell>
                                 <Chip 
                                   label={dept.name}
                                   size="small"
                                   color={dept.name === 'Roto' ? 'error' : 
                                          dept.name === 'Paint' ? 'success' : 
                                          dept.name === 'Composite' ? 'primary' : 
                                          dept.name === 'Matchmove' ? 'warning' : 'default'}
                                 />
                               </TableCell>
                               <TableCell>{dept.approvedBidDays}d</TableCell>
                               <TableCell>-</TableCell>
                               <TableCell>
                                 {dept.etaDate ? new Date(dept.etaDate).toLocaleDateString('en-GB') : '-'}
                               </TableCell>
                               <TableCell>v001</TableCell>
                               <TableCell>
                                 <Chip label="High" size="small" color="error" />
                               </TableCell>
                               <TableCell>-</TableCell>
                               <TableCell>
                                 <Box sx={{ display: 'flex', gap: 0.5 }}>
                                   <Button size="small" variant="contained" color="primary">
                                     Notes Query
                                   </Button>
                                   <Button size="small" variant="contained" color="primary">
                                     Add Version
                                   </Button>
                                   <IconButton size="small" color="default">
                                     <Typography variant="caption">📁</Typography>
                                   </IconButton>
                                 </Box>
                               </TableCell>
                             </TableRow>
                           ))
                         )}
                       </TableBody>
                     </Table>
                   </TableContainer>
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
     </Container>
   );
};

export default ProjectDetails;