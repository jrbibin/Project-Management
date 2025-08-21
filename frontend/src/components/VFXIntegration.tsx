import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Container,
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Movie as NukeIcon,
  ThreeDRotation as MayaIcon,
  Brush as SilhouetteIcon,
  Image as PhotoshopIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  GetApp as ImportIcon,
  ExpandMore as ExpandMoreIcon,
  Folder as FolderIcon,
  VideoFile as VideoFileIcon,
  Schedule as ScheduleIcon,
  AspectRatio as AspectRatioIcon,
  Layers as LayersIcon,
  Person as PersonIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import axios from 'axios';

// Types for VFX data
interface FrameRange {
  start_frame: number;
  end_frame: number;
  frame_rate: number;
  duration: number;
}

interface Resolution {
  width: number;
  height: number;
  pixel_aspect?: number;
}

interface FileReference {
  file_path: string;
  file_name: string;
  exists: boolean;
  file_size?: number;
  modified_date?: string;
}

interface LayerInfo {
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  opacity?: number;
  blend_mode?: string;
}

interface ShotData {
  id?: string;
  shot_name: string;
  project_name: string;
  software_type: 'nuke' | 'maya' | 'silhouette' | 'photoshop';
  software_version: string;
  source_file: FileReference;
  reference_files: FileReference[];
  frame_range: FrameRange;
  resolution: Resolution;
  layers: LayerInfo[];
  artist: string;
  department: string;
  created_date: string;
  extracted_date: string;
  custom_data?: any;
}

interface VFXStats {
  total_shots: number;
  by_software: Record<string, number>;
  by_department: Record<string, number>;
  recent_imports: number;
}

const VFXIntegration: React.FC = () => {
  const [shots, setShots] = useState<ShotData[]>([]);
  const [stats, setStats] = useState<VFXStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedShot, setSelectedShot] = useState<ShotData | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filterSoftware, setFilterSoftware] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  // Software icons mapping
  const getSoftwareIcon = (software: string) => {
    switch (software) {
      case 'nuke': return <NukeIcon />;
      case 'maya': return <MayaIcon />;
      case 'silhouette': return <SilhouetteIcon />;
      case 'photoshop': return <PhotoshopIcon />;
      default: return <VideoFileIcon />;
    }
  };

  // Software colors
  const getSoftwareColor = (software: string) => {
    switch (software) {
      case 'nuke': return '#FF6B35';
      case 'maya': return '#0696D7';
      case 'silhouette': return '#8E44AD';
      case 'photoshop': return '#31A8FF';
      default: return '#757575';
    }
  };

  // Load VFX data
  const loadVFXData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch shots data
      const shotsResponse = await axios.get('http://localhost:8001/vfx/shots');
      setShots(shotsResponse.data.shots || []);
      
      // Fetch statistics
      const statsResponse = await axios.get('http://localhost:8001/vfx/stats');
      setStats(statsResponse.data);
      
    } catch (err: any) {
      console.error('Error loading VFX data:', err);
      setError('Failed to load VFX data. Make sure the VFX API server is running on port 8001.');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadVFXData();
  }, []);

  // Filter shots based on selected filters
  const filteredShots = shots.filter(shot => {
    const softwareMatch = filterSoftware === 'all' || shot.software_type === filterSoftware;
    const projectMatch = filterProject === 'all' || shot.project_name === filterProject;
    return softwareMatch && projectMatch;
  });

  // Get unique projects for filter
  const uniqueProjects = Array.from(new Set(shots.map(shot => shot.project_name)));

  // Handle shot details view
  const handleViewDetails = (shot: ShotData) => {
    setSelectedShot(shot);
    setDetailsOpen(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  // Render statistics cards
  const renderStatsCards = () => {
    if (!stats) return null;

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Shots
              </Typography>
              <Typography variant="h4" component="div">
                {stats.total_shots}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        
        {Object.entries(stats.by_software).map(([software, count]) => (
          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }} key={software}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  {getSoftwareIcon(software)}
                  <Typography color="textSecondary" gutterBottom>
                    {software.charAt(0).toUpperCase() + software.slice(1)}
                  </Typography>
                </Box>
                <Typography variant="h4" component="div">
                  {count}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    );
  };

  // Render shot details dialog
  const renderShotDetails = () => {
    if (!selectedShot) return null;

    return (
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            {getSoftwareIcon(selectedShot.software_type)}
            <Typography variant="h6">
              {selectedShot.shot_name}
            </Typography>
            <Chip
              label={selectedShot.software_type}
              size="small"
              style={{ backgroundColor: getSoftwareColor(selectedShot.software_type), color: 'white' }}
            />
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {/* Basic Information */}
            <Box sx={{ flex: '1 1 400px', minWidth: '300px' }}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon><FolderIcon /></ListItemIcon>
                  <ListItemText
                    primary="Project"
                    secondary={selectedShot.project_name}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PersonIcon /></ListItemIcon>
                  <ListItemText
                    primary="Artist"
                    secondary={selectedShot.artist}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><DateRangeIcon /></ListItemIcon>
                  <ListItemText
                    primary="Extracted"
                    secondary={formatDate(selectedShot.extracted_date)}
                  />
                </ListItem>
              </List>
            </Box>
            
            {/* Technical Information */}
            <Box sx={{ flex: '1 1 400px', minWidth: '300px' }}>
              <Typography variant="h6" gutterBottom>
                Technical Details
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon><ScheduleIcon /></ListItemIcon>
                  <ListItemText
                    primary="Frame Range"
                    secondary={`${selectedShot.frame_range.start_frame}-${selectedShot.frame_range.end_frame} (${selectedShot.frame_range.duration} frames)`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><AspectRatioIcon /></ListItemIcon>
                  <ListItemText
                    primary="Resolution"
                    secondary={`${selectedShot.resolution.width}x${selectedShot.resolution.height}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><LayersIcon /></ListItemIcon>
                  <ListItemText
                    primary="Layers"
                    secondary={`${selectedShot.layers.length} layers/nodes`}
                  />
                </ListItem>
              </List>
            </Box>
            
            {/* Source File */}
            <Box sx={{ width: '100%' }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Source File</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="textSecondary">
                    Path: {selectedShot.source_file.file_path}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Exists: {selectedShot.source_file.exists ? '✅ Yes' : '❌ No'}
                  </Typography>
                  {selectedShot.source_file.file_size && (
                    <Typography variant="body2" color="textSecondary">
                      Size: {(selectedShot.source_file.file_size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            </Box>
            
            {/* Reference Files */}
            {selectedShot.reference_files.length > 0 && (
              <Box sx={{ width: '100%' }}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">
                      Reference Files ({selectedShot.reference_files.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {selectedShot.reference_files.map((file, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <VideoFileIcon color={file.exists ? 'primary' : 'error'} />
                          </ListItemIcon>
                          <ListItemText
                            primary={file.file_name}
                            secondary={file.file_path}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}
            
            {/* Layers */}
            {selectedShot.layers.length > 0 && (
              <Box sx={{ width: '100%' }}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">
                      Layers/Nodes ({selectedShot.layers.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Visible</TableCell>
                            <TableCell>Locked</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedShot.layers.slice(0, 10).map((layer, index) => (
                            <TableRow key={index}>
                              <TableCell>{layer.name}</TableCell>
                              <TableCell>{layer.type}</TableCell>
                              <TableCell>{layer.visible ? '✅' : '❌'}</TableCell>
                              <TableCell>{layer.locked ? '🔒' : '🔓'}</TableCell>
                            </TableRow>
                          ))}
                          {selectedShot.layers.length > 10 && (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
                                <Typography variant="body2" color="textSecondary">
                                  ... and {selectedShot.layers.length - 10} more layers
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            VFX Integration
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadVFXData}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Statistics */}
        {renderStatsCards()}

        {/* Filters */}
        <Box display="flex" gap={2} mb={3}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Software</InputLabel>
            <Select
              value={filterSoftware}
              label="Software"
              onChange={(e) => setFilterSoftware(e.target.value)}
            >
              <MenuItem value="all">All Software</MenuItem>
              <MenuItem value="nuke">Nuke</MenuItem>
              <MenuItem value="maya">Maya</MenuItem>
              <MenuItem value="silhouette">Silhouette</MenuItem>
              <MenuItem value="photoshop">Photoshop</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Project</InputLabel>
            <Select
              value={filterProject}
              label="Project"
              onChange={(e) => setFilterProject(e.target.value)}
            >
              <MenuItem value="all">All Projects</MenuItem>
              {uniqueProjects.map(project => (
                <MenuItem key={project} value={project}>{project}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Shots Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Software</TableCell>
                <TableCell>Shot Name</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Artist</TableCell>
                <TableCell>Frame Range</TableCell>
                <TableCell>Resolution</TableCell>
                <TableCell>Layers</TableCell>
                <TableCell>Extracted</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredShots.map((shot, index) => (
                <TableRow key={shot.id || index} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getSoftwareIcon(shot.software_type)}
                      <Chip
                        label={shot.software_type}
                        size="small"
                        style={{ backgroundColor: getSoftwareColor(shot.software_type), color: 'white' }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {shot.shot_name}
                    </Typography>
                  </TableCell>
                  <TableCell>{shot.project_name}</TableCell>
                  <TableCell>{shot.artist}</TableCell>
                  <TableCell>
                    {shot.frame_range.start_frame}-{shot.frame_range.end_frame}
                    <Typography variant="caption" display="block" color="textSecondary">
                      ({shot.frame_range.duration} frames)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {shot.resolution.width}×{shot.resolution.height}
                  </TableCell>
                  <TableCell>{shot.layers.length}</TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {formatDate(shot.extracted_date)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(shot)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filteredShots.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No VFX shots found. Import data from Nuke, Maya, Silhouette, or Photoshop.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Shot Details Dialog */}
        {renderShotDetails()}
      </Box>
    </Container>
  );
};

export default VFXIntegration;