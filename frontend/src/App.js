import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'http://127.0.0.1:5000/api';

function App() {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [shots, setShots] = useState([]);
  const [breakdowns, setBreakdowns] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [playlists, setPlaylists] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedShot, setSelectedShot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showAnnotationTool, setShowAnnotationTool] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
    fetchTasks();
    fetchAssets();
    fetchShots();
    fetchBreakdowns();
    fetchReviews();
    fetchTimesheets();
    fetchSchedules();
    fetchMilestones();
    fetchNotifications();
    fetchStatistics('studio');
    fetchPlaylists();
    fetchAnnotations();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchTasks(selectedProject.id);
      fetchAssets(selectedProject.id);
      fetchShots(selectedProject.id);
      fetchBreakdowns(selectedProject.id);
      fetchSchedules(selectedProject.id);
      fetchMilestones(selectedProject.id);
      fetchStatistics('project', selectedProject.id);
      fetchPlaylists();
      fetchAnnotations();
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedUser) {
      fetchTimesheets(selectedUser.id);
      fetchNotifications(selectedUser.id);
      fetchStatistics('user', selectedUser.id);
    }
  }, [selectedUser]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE}/projects`);
      const data = await response.json();
      setProjects(data);
      
      // Fetch additional project-related data
      await Promise.all([
        fetchDepartments(),
        fetchTaskTypes(),
        fetchTaskStatuses(),
        fetchConcepts()
      ]);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/departments');
       const data = await response.json();
       setDepartments(data);
     } catch (error) {
       console.error('Error fetching departments:', error);
     }
   };
 
   const fetchTaskTypes = async () => {
     try {
       const response = await fetch('http://localhost:5000/api/task-types');
       const data = await response.json();
       setTaskTypes(data);
     } catch (error) {
       console.error('Error fetching task types:', error);
     }
   };
 
   const fetchTaskStatuses = async () => {
     try {
       const response = await fetch('http://localhost:5000/api/task-statuses');
       const data = await response.json();
       setTaskStatuses(data);
     } catch (error) {
       console.error('Error fetching task statuses:', error);
     }
   };
 
   const fetchConcepts = async () => {
     try {
       const response = await fetch('http://localhost:5000/api/concepts');
       const data = await response.json();
       setConcepts(data);
     } catch (error) {
       console.error('Error fetching concepts:', error);
     }
   };
 
   const fetchPlaylists = async () => {
     try {
       const response = await fetch('http://localhost:5000/api/playlists');
       const data = await response.json();
       setPlaylists(data);
     } catch (error) {
       console.error('Error fetching playlists:', error);
     }
   };
 
   const fetchAnnotations = async () => {
     try {
       const response = await fetch('http://localhost:5000/api/annotations');
       const data = await response.json();
       setAnnotations(data);
     } catch (error) {
       console.error('Error fetching annotations:', error);
     }
   };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTasks = async (projectId = null) => {
    try {
      const url = projectId ? `${API_BASE}/tasks?project_id=${projectId}` : `${API_BASE}/tasks`;
      const response = await fetch(url);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchAssets = async (projectId = null) => {
    try {
      const url = projectId ? `${API_BASE}/assets?project_id=${projectId}` : `${API_BASE}/assets`;
      const response = await fetch(url);
      const data = await response.json();
      setAssets(data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const fetchShots = async (projectId = null) => {
    try {
      const url = projectId ? `${API_BASE}/shots?project_id=${projectId}` : `${API_BASE}/shots`;
      const response = await fetch(url);
      const data = await response.json();
      setShots(data);
    } catch (error) {
      console.error('Error fetching shots:', error);
    }
  };

  const fetchBreakdowns = async (projectId = null) => {
    try {
      const url = projectId ? `${API_BASE}/breakdowns?project_id=${projectId}` : `${API_BASE}/breakdowns`;
      const response = await fetch(url);
      const data = await response.json();
      setBreakdowns(data);
    } catch (error) {
      console.error('Error fetching breakdowns:', error);
    }
  };

  const fetchReviews = async (taskId = null) => {
    try {
      const url = taskId ? `${API_BASE}/reviews?task_id=${taskId}` : `${API_BASE}/reviews`;
      const response = await fetch(url);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchTimesheets = async (userId = null, projectId = null) => {
    try {
      let url = `${API_BASE}/timesheets`;
      const params = [];
      if (userId) params.push(`user_id=${userId}`);
      if (projectId) params.push(`project_id=${projectId}`);
      if (params.length > 0) url += `?${params.join('&')}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setTimesheets(data);
    } catch (error) {
      console.error('Error fetching timesheets:', error);
    }
  };

  const fetchSchedules = async (projectId = null) => {
    try {
      const url = projectId ? `${API_BASE}/schedules?project_id=${projectId}` : `${API_BASE}/schedules`;
      const response = await fetch(url);
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const fetchMilestones = async (projectId = null) => {
    try {
      const url = projectId ? `${API_BASE}/milestones?project_id=${projectId}` : `${API_BASE}/milestones`;
      const response = await fetch(url);
      const data = await response.json();
      setMilestones(data);
    } catch (error) {
      console.error('Error fetching milestones:', error);
    }
  };

  const fetchNotifications = async (userId = null) => {
    try {
      const url = userId ? `${API_BASE}/notifications?user_id=${userId}` : `${API_BASE}/notifications`;
      const response = await fetch(url);
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchStatistics = async (type, id = null) => {
    try {
      let url;
      if (type === 'project' && id) {
        url = `${API_BASE}/statistics/project/${id}`;
      } else if (type === 'user' && id) {
        url = `${API_BASE}/statistics/user/${id}`;
      } else if (type === 'studio') {
        url = `${API_BASE}/statistics/studio`;
      }
      
      if (url) {
        const response = await fetch(url);
        const data = await response.json();
        setStatistics(prev => ({ ...prev, [type]: data }));
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const createProject = async (projectData) => {
    try {
      const response = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      const newProject = await response.json();
      setProjects([...projects, newProject]);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const createTask = async (taskData) => {
    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...taskData, project_id: selectedProject.id }),
      });
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const createUser = async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const newUser = await response.json();
      setUsers([...users, newUser]);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const createAsset = async (assetData) => {
    try {
      const response = await fetch(`${API_BASE}/assets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...assetData, project_id: selectedProject?.id || assetData.project_id }),
      });
      const newAsset = await response.json();
      setAssets([...assets, newAsset]);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating asset:', error);
    }
  };

  const createShot = async (shotData) => {
    try {
      const response = await fetch(`${API_BASE}/shots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...shotData, project_id: selectedProject?.id || shotData.project_id }),
      });
      const newShot = await response.json();
      setShots([...shots, newShot]);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating shot:', error);
    }
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    fetchTasks(project.id);
    fetchAssets(project.id);
    fetchShots(project.id);
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const renderProjects = () => {
    if (selectedProject) {
      return renderProjectDashboard();
    }

    return (
      <div className="content-section">
        <div className="section-header">
          <h2>Projects Overview</h2>
          <div className="project-controls">
            <button className="btn btn-primary" onClick={() => openModal('project')}>
              + New Project
            </button>
            <button className="btn btn-secondary" onClick={() => fetchStatistics('studio')}>
              Refresh Stats
            </button>
          </div>
        </div>
        
        {/* Studio Statistics */}
        {statistics.studio && (
          <div className="studio-overview">
            <div className="stats-cards">
              <div className="stat-card">
                <h3>{statistics.studio.total_projects}</h3>
                <p>Total Projects</p>
              </div>
              <div className="stat-card">
                <h3>{statistics.studio.active_projects}</h3>
                <p>Active Projects</p>
              </div>
              <div className="stat-card">
                <h3>{statistics.studio.total_tasks}</h3>
                <p>Total Tasks</p>
              </div>
              <div className="stat-card">
                <h3>{Math.round(statistics.studio.total_hours_logged)}h</h3>
                <p>Hours Logged</p>
              </div>
            </div>
          </div>
        )}

        <div className="projects-grid">
          {projects.map(project => {
            const projectTasks = tasks.filter(t => t.project_id === project.id);
            const completedTasks = projectTasks.filter(t => t.status === 'done').length;
            const totalTasks = projectTasks.length;
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            return (
              <div 
                key={project.id} 
                className={`project-card enhanced ${selectedProject?.id === project.id ? 'selected' : ''}`}
                onClick={() => handleProjectSelect(project)}
              >
                <div className="project-header">
                  <h3>{project.name}</h3>
                  <span className={`status status-${project.status}`}>{project.status}</span>
                </div>
                <p className="project-description">{project.description}</p>
                
                <div className="project-stats">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: `${progress}%`}}></div>
                    <span className="progress-text">{progress}% Complete</span>
                  </div>
                  <div className="project-metrics">
                    <span>{totalTasks} tasks</span>
                    <span>{assets.filter(a => a.project_id === project.id).length} assets</span>
                    <span>{shots.filter(s => s.project_id === project.id).length} shots</span>
                  </div>
                </div>
                
                <div className="project-dates">
                  <small>Created: {new Date(project.created_at).toLocaleDateString()}</small>
                  {project.updated_at !== project.created_at && (
                    <small>Updated: {new Date(project.updated_at).toLocaleDateString()}</small>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderProjectDashboard = () => {
    const projectTasks = tasks.filter(t => t.project_id === selectedProject.id);
    const projectAssets = assets.filter(a => a.project_id === selectedProject.id);
    const projectShots = shots.filter(s => s.project_id === selectedProject.id);
    const projectMilestones = milestones.filter(m => m.project_id === selectedProject.id);
    const projectTimesheets = timesheets.filter(t => t.project_id === selectedProject.id);
    
    const completedTasks = projectTasks.filter(t => t.status === 'done').length;
    const inProgressTasks = projectTasks.filter(t => t.status === 'wip').length;
    const pendingTasks = projectTasks.filter(t => t.status === 'todo').length;
    const totalHours = projectTimesheets.reduce((sum, t) => sum + parseFloat(t.duration || 0), 0);
    
    // Financial calculations
    const budget = selectedProject.budget || 100000; // Default budget
    const actualCost = totalHours * 75 + (projectAssets.length * 500) + (projectShots.length * 200); // Estimated costs
    const profit = budget - actualCost;
    const profitMargin = budget > 0 ? ((profit / budget) * 100).toFixed(1) : 0;
    
    // Timeline calculations
    const projectStartDate = new Date(selectedProject.created_at);
    const projectEndDate = projectMilestones.length > 0 
      ? new Date(Math.max(...projectMilestones.map(m => new Date(m.due_date))))
      : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days from now if no milestones
    const totalDays = Math.ceil((projectEndDate - projectStartDate) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.ceil((new Date() - projectStartDate) / (1000 * 60 * 60 * 24));
    const timeProgress = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));
    
    const upcomingMilestones = projectMilestones
      .filter(m => new Date(m.due_date) > new Date())
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
      .slice(0, 3);
    
    const recentActivity = [
      ...projectTasks.slice(-5).map(t => ({...t, type: 'task', action: 'created'})),
      ...reviews.filter(r => projectTasks.some(t => t.id === r.task_id)).slice(-3).map(r => ({...r, type: 'review', action: 'submitted'}))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8);
    
    // Group shots by sequence
    const sequences = projectShots.reduce((acc, shot) => {
      const seqName = shot.sequence || 'Opening Sequence';
      if (!acc[seqName]) {
        acc[seqName] = [];
      }
      acc[seqName].push(shot);
      return acc;
    }, {});

    return (
      <div className="project-dashboard">
        <div className="dashboard-header">
          <div className="project-info">
            <button className="btn btn-secondary" onClick={() => setSelectedProject(null)}>
              ← Back to Projects
            </button>
            <h2>{selectedProject.name}</h2>
            <span className={`status status-${selectedProject.status}`}>{selectedProject.status}</span>
          </div>
          <div className="dashboard-actions">
            <button className="btn btn-primary" onClick={() => openModal('task')}>
              + New Task
            </button>
            <button className="btn btn-secondary" onClick={() => openModal('milestone')}>
              + Milestone
            </button>
            <button className="btn btn-secondary" onClick={() => fetchStatistics('project', selectedProject.id)}>
              Refresh Stats
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Financial Overview */}
          <div className="dashboard-section financial-overview">
            <h3>Financial Overview</h3>
            <div className="financial-stats">
              <div className="financial-card budget">
                <div className="financial-amount">${budget.toLocaleString()}</div>
                <div className="financial-label">Budget</div>
              </div>
              <div className="financial-card actual-cost">
                <div className="financial-amount">${actualCost.toLocaleString()}</div>
                <div className="financial-label">Actual Cost</div>
              </div>
              <div className={`financial-card profit ${profit >= 0 ? 'positive' : 'negative'}`}>
                <div className="financial-amount">${Math.abs(profit).toLocaleString()}</div>
                <div className="financial-label">{profit >= 0 ? 'Profit' : 'Loss'}</div>
                <div className="profit-margin">{profitMargin}% margin</div>
              </div>
            </div>
          </div>

          {/* Timeline Overview */}
          <div className="dashboard-section timeline-overview">
            <h3>Timeline</h3>
            <div className="timeline-stats">
              <div className="timeline-info">
                <div className="timeline-dates">
                  <span className="start-date">Start: {projectStartDate.toLocaleDateString()}</span>
                  <span className="end-date">End: {projectEndDate.toLocaleDateString()}</span>
                </div>
                <div className="timeline-progress">
                  <div className="progress-bar timeline">
                    <div className="progress-fill" style={{width: `${timeProgress}%`}}></div>
                  </div>
                  <span className="timeline-text">{Math.round(timeProgress)}% of timeline elapsed</span>
                </div>
                <div className="timeline-details">
                  <span>Days elapsed: {daysElapsed}</span>
                  <span>Total duration: {totalDays} days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bid Details */}
          <div className="dashboard-section bid-section">
            <h3>Bid Details</h3>
            <div className="bid-overview">
              <div className="bid-summary">
                <div className="bid-item">
                  <span className="bid-label">Client</span>
                  <span className="bid-value">{selectedProject.client_name} ({selectedProject.client_code})</span>
                </div>
                <div className="bid-item">
                  <span className="bid-label">Project Type</span>
                  <span className="bid-value">{selectedProject.project_type}</span>
                </div>
                <div className="bid-item">
                  <span className="bid-label">Currency</span>
                  <span className="bid-value">{selectedProject.currency}</span>
                </div>
                <div className="bid-item">
                  <span className="bid-label">Exchange Rate</span>
                  <span className="bid-value">{selectedProject.exchange_rate}</span>
                </div>
              </div>
              
              {selectedProject.bid_details && (
                <div className="bid-breakdown">
                  <h4>Department Breakdown</h4>
                  <div className="bid-departments">
                    <div className="bid-dept">
                      <span className="dept-name">Modeling</span>
                      <span className="dept-days">{selectedProject.bid_details.modeling_days}d</span>
                    </div>
                    <div className="bid-dept">
                      <span className="dept-name">Animation</span>
                      <span className="dept-days">{selectedProject.bid_details.animation_days}d</span>
                    </div>
                    <div className="bid-dept">
                      <span className="dept-name">Lighting</span>
                      <span className="dept-days">{selectedProject.bid_details.lighting_days}d</span>
                    </div>
                    <div className="bid-dept">
                      <span className="dept-name">Compositing</span>
                      <span className="dept-days">{selectedProject.bid_details.compositing_days}d</span>
                    </div>
                  </div>
                  
                  <div className="bid-totals">
                    <div className="bid-total">
                      <span className="total-label">Total Bid Days</span>
                      <span className="total-value">{selectedProject.bid_details.total_bid_days}d</span>
                    </div>
                    <div className="bid-total">
                      <span className="total-label">Day Rate</span>
                      <span className="total-value">${selectedProject.bid_details.day_rate_usd}</span>
                    </div>
                    <div className="bid-total highlight">
                      <span className="total-label">Total Bid Amount</span>
                      <span className="total-value">${selectedProject.bid_details.total_bid_amount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Project Statistics */}
          <div className="dashboard-section">
            <h3>Project Overview</h3>
            <div className="project-stats-grid">
              <div className="stat-card primary">
                <h4>{projectTasks.length}</h4>
                <p>Total Tasks</p>
                <div className="stat-breakdown">
                  <span className="completed">{completedTasks} completed</span>
                  <span className="in-progress">{inProgressTasks} in progress</span>
                  <span className="pending">{pendingTasks} pending</span>
                </div>
              </div>
              <div className="stat-card secondary">
                <h4>{projectAssets.length}</h4>
                <p>Assets</p>
                <div className="asset-types">
                  {['character', 'prop', 'environment', 'vehicle', 'fx'].map(type => {
                    const count = projectAssets.filter(a => a.asset_type === type).length;
                    return count > 0 ? <span key={type}>{count} {type}s</span> : null;
                  })}
                </div>
              </div>
              <div className="stat-card tertiary">
                <h4>{projectShots.length}</h4>
                <p>Shots</p>
                <div className="shot-info">
                  <span>Total frames: {projectShots.reduce((sum, s) => sum + (s.frame_out - s.frame_in + 1), 0)}</span>
                </div>
              </div>
              <div className="stat-card quaternary">
                <h4>{Math.round(totalHours)}h</h4>
                <p>Hours Logged</p>
                <div className="time-info">
                  <span>Avg per task: {projectTasks.length > 0 ? Math.round(totalHours / projectTasks.length) : 0}h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="dashboard-section">
            <h3>Progress Tracking</h3>
            <div className="progress-section">
              <div className="overall-progress">
                <h4>Overall Completion</h4>
                <div className="progress-bar large">
                  <div 
                    className="progress-fill" 
                    style={{width: `${projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0}%`}}
                  ></div>
                  <span className="progress-text">
                    {projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0}% Complete
                  </span>
                </div>
              </div>
              
              <div className="department-progress">
                <h4>Department Progress</h4>
                {departments.map(dept => {
                  const deptTasks = projectTasks.filter(t => {
                    const taskType = taskTypes.find(tt => tt.name === t.task_type);
                    return taskType && taskType.department === dept.name;
                  });
                  const deptCompleted = deptTasks.filter(t => t.status === 'done').length;
                  const deptProgress = deptTasks.length > 0 ? Math.round((deptCompleted / deptTasks.length) * 100) : 0;
                  
                  if (deptTasks.length === 0) return null;
                  
                  return (
                    <div key={dept.id} className="dept-progress">
                      <div className="dept-header">
                        <span className="dept-name" style={{color: dept.color}}>{dept.name}</span>
                        <span className="dept-stats">{deptCompleted}/{deptTasks.length} tasks</span>
                      </div>
                      <div className="progress-bar small">
                        <div 
                          className="progress-fill" 
                          style={{width: `${deptProgress}%`, backgroundColor: dept.color}}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sequences & Shots */}
          <div className="dashboard-section sequences-section">
            <h3>Sequences & Shots</h3>
            <div className="sequences-container">
              {Object.entries(sequences).map(([sequenceName, sequenceShots]) => {
                const sequenceTasks = projectTasks.filter(t => 
                  sequenceShots.some(shot => shot.id === t.entity_id && t.entity_type === 'Shot')
                );
                const sequenceProgress = sequenceTasks.length > 0 
                  ? Math.round((sequenceTasks.filter(t => t.status === 'done').length / sequenceTasks.length) * 100)
                  : 0;
                
                return (
                  <div key={sequenceName} className="sequence-block">
                    <div className="sequence-header">
                      <h4>{sequenceName}</h4>
                      <div className="sequence-stats">
                        <span className="shot-count">{sequenceShots.length} shots</span>
                        <span className="task-count">{sequenceTasks.length} tasks</span>
                        <div className="sequence-progress">
                          <div className="progress-bar mini">
                            <div className="progress-fill" style={{width: `${sequenceProgress}%`}}></div>
                          </div>
                          <span>{sequenceProgress}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="shots-grid">
                      {sequenceShots.map(shot => {
                        const shotTasks = projectTasks.filter(t => t.entity_id === shot.id && t.entity_type === 'Shot');
                        const shotProgress = shotTasks.length > 0 
                          ? Math.round((shotTasks.filter(t => t.status === 'done').length / shotTasks.length) * 100)
                          : 0;
                        
                        const frameCount = shot.frame_out - shot.frame_in + 1;
                        const completedTasks = shotTasks.filter(t => t.status === 'done').length;
                        const wipTasks = shotTasks.filter(t => t.status === 'wip').length;
                        
                        return (
                          <div key={shot.id} className="shot-card clickable" onClick={() => setSelectedShot(shot)}>
                            <div className="shot-header">
                              <h5>{shot.name}</h5>
                              <span className="frame-range">{shot.frame_in}-{shot.frame_out}</span>
                            </div>
                            
                            <div className="shot-details">
                              <div className="shot-info-row">
                                <span className="info-label">Frames:</span>
                                <span className="info-value">{frameCount}</span>
                              </div>
                              <div className="shot-info-row">
                                <span className="info-label">Tasks:</span>
                                <span className="info-value">{shotTasks.length}</span>
                              </div>
                              <div className="shot-info-row">
                                <span className="info-label">Status:</span>
                                <span className="info-value">
                                  {completedTasks}/{shotTasks.length} done
                                  {wipTasks > 0 && ` (${wipTasks} in progress)`}
                                </span>
                              </div>
                            </div>
                            
                            <div className="shot-progress">
                              <div className="progress-bar">
                                <div className="progress-fill" style={{width: `${shotProgress}%`}}></div>
                              </div>
                              <span className="progress-text">{shotProgress}% Complete</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team & Assignments */}
          <div className="dashboard-section">
            <h3>Team & Assignments</h3>
            <div className="team-overview">
              {users.map(user => {
                const userTasks = projectTasks.filter(t => t.assignee_id === user.id);
                const userHours = projectTimesheets
                  .filter(t => t.user_id === user.id)
                  .reduce((sum, t) => sum + parseFloat(t.duration || 0), 0);
                
                if (userTasks.length === 0) return null;
                
                return (
                  <div key={user.id} className="team-member">
                    <div className="member-info">
                      <h5>{user.name}</h5>
                      <span className="member-role">{user.role}</span>
                    </div>
                    <div className="member-stats">
                      <span>{userTasks.length} tasks</span>
                      <span>{Math.round(userHours)}h logged</span>
                      <span>{userTasks.filter(t => t.status === 'done').length} completed</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Milestones */}
          {upcomingMilestones.length > 0 && (
            <div className="dashboard-section">
              <h3>Upcoming Milestones</h3>
              <div className="milestones-list">
                {upcomingMilestones.map(milestone => (
                  <div key={milestone.id} className="milestone-item">
                    <div className="milestone-info">
                      <h5>{milestone.name}</h5>
                      <p>{milestone.description}</p>
                    </div>
                    <div className="milestone-date">
                      <span className={`due-date ${new Date(milestone.due_date) < new Date(Date.now() + 7*24*60*60*1000) ? 'urgent' : ''}`}>
                        Due: {new Date(milestone.due_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="dashboard-section">
            <h3>Recent Activity</h3>
            <div className="activity-feed">
              {recentActivity.map((item, index) => {
                const user = users.find(u => u.id === (item.assignee_id || item.reviewer_id));
                return (
                  <div key={`${item.type}-${item.id}-${index}`} className="activity-item">
                    <div className="activity-icon">
                      {item.type === 'task' ? '📋' : '👁️'}
                    </div>
                    <div className="activity-content">
                      <p>
                        <strong>{user?.name || 'Unknown'}</strong> {item.action} {item.type} 
                        <strong>{item.name || item.title}</strong>
                      </p>
                      <small>{new Date(item.created_at).toLocaleString()}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Shot Details Modal */}
          {selectedShot && (
            <div className="modal-overlay" onClick={() => setSelectedShot(null)}>
              <div className="modal-content shot-details-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Shot Details: {selectedShot.name}</h3>
                  <button className="close-btn" onClick={() => setSelectedShot(null)}>×</button>
                </div>
                <div className="modal-body">
                  {(() => {
                    const shotTasks = tasks.filter(task => task.entity_id === selectedShot.id && task.entity_type === 'Shot');
                    const completedTasks = shotTasks.filter(t => t.status === 'done');
                    const wipTasks = shotTasks.filter(t => t.status === 'wip');
                    const todoTasks = shotTasks.filter(t => t.status === 'todo');
                    const frameCount = selectedShot.frame_out - selectedShot.frame_in + 1;
                    const totalBidDays = shotTasks.reduce((sum, task) => sum + (parseFloat(task.bid_days) || 0), 0);
                    const totalActualDays = shotTasks.reduce((sum, task) => sum + (parseFloat(task.actual_days) || 0), 0);
                    const completionPercentage = shotTasks.length > 0 ? Math.round((completedTasks.length / shotTasks.length) * 100) : 0;
                    
                    // Group tasks by department
                    const tasksByDepartment = {};
                    shotTasks.forEach(task => {
                      const taskType = taskTypes.find(tt => tt.name === task.task_type);
                      const department = departments.find(d => d.name === taskType?.department);
                      const deptName = department?.name || 'Other';
                      
                      if (!tasksByDepartment[deptName]) {
                        tasksByDepartment[deptName] = {
                          department: department,
                          tasks: [],
                          completed: 0,
                          total: 0
                        };
                      }
                      
                      tasksByDepartment[deptName].tasks.push(task);
                      tasksByDepartment[deptName].total++;
                      if (task.status === 'done') {
                        tasksByDepartment[deptName].completed++;
                      }
                    });
                    
                    return (
                      <>
                        {/* Shot Overview */}
                        <div className="shot-overview">
                          <div className="overview-grid">
                            <div className="overview-item">
                              <h5>Frame Range</h5>
                              <p>{selectedShot.frame_in} - {selectedShot.frame_out}</p>
                            </div>
                            <div className="overview-item">
                              <h5>Duration</h5>
                              <p>{frameCount} frames</p>
                            </div>
                            <div className="overview-item">
                              <h5>Completion</h5>
                              <p>{completionPercentage}%</p>
                            </div>
                            <div className="overview-item">
                              <h5>Total Tasks</h5>
                              <p>{shotTasks.length}</p>
                            </div>
                          </div>
                          
                          <div className="overview-grid">
                            <div className="overview-item">
                              <h5>Completed</h5>
                              <p className="status-done">{completedTasks.length}</p>
                            </div>
                            <div className="overview-item">
                              <h5>In Progress</h5>
                              <p className="status-wip">{wipTasks.length}</p>
                            </div>
                            <div className="overview-item">
                              <h5>To Do</h5>
                              <p className="status-todo">{todoTasks.length}</p>
                            </div>
                            <div className="overview-item">
                              <h5>Bid vs Actual</h5>
                              <p>{totalBidDays}d / {totalActualDays}d</p>
                            </div>
                          </div>
                          
                          {selectedShot.description && (
                            <div className="shot-description">
                              <h5>Description</h5>
                              <p>{selectedShot.description}</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Department Breakdown */}
                        <div className="department-breakdown">
                          <h4>Department Progress</h4>
                          <div className="departments-grid">
                            {Object.entries(tasksByDepartment).map(([deptName, deptData]) => {
                              const deptProgress = deptData.total > 0 ? Math.round((deptData.completed / deptData.total) * 100) : 0;
                              return (
                                <div key={deptName} className="department-card">
                                  <div className="dept-header">
                                    <h6 style={{color: deptData.department?.color}}>{deptName}</h6>
                                    <span>{deptData.completed}/{deptData.total}</span>
                                  </div>
                                  <div className="progress-bar small">
                                    <div 
                                      className="progress-fill" 
                                      style={{width: `${deptProgress}%`, backgroundColor: deptData.department?.color}}
                                    ></div>
                                  </div>
                                  <span className="progress-text">{deptProgress}%</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        {/* Detailed Tasks */}
                        <div className="shot-tasks-section">
                          <h4>Task Details</h4>
                          <div className="tasks-list">
                            {shotTasks.map(task => {
                              const department = departments.find(d => d.name === taskTypes.find(tt => tt.name === task.task_type)?.department);
                              const assignee = users.find(u => u.id === task.assignee_id);
                              
                              return (
                                <div key={task.id} className="task-item detailed">
                                  <div className="task-header">
                                    <h5 style={{color: department?.color}}>{task.task_type}</h5>
                                    <span className={`status status-${task.status}`}>{task.status.toUpperCase()}</span>
                                  </div>
                                  <div className="task-details">
                                    <div className="task-info-grid">
                                      <div className="task-info-item">
                                        <strong>Assignee:</strong> {assignee?.name || 'Unassigned'}
                                      </div>
                                      {task.bid_days && (
                                        <div className="task-info-item">
                                          <strong>Bid Days:</strong> {task.bid_days}
                                        </div>
                                      )}
                                      {task.actual_days && (
                                        <div className="task-info-item">
                                          <strong>Actual Days:</strong> {task.actual_days}
                                        </div>
                                      )}
                                      {task.due_date && (
                                        <div className="task-info-item">
                                          <strong>Due Date:</strong> {new Date(task.due_date).toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>
                                    {task.description && (
                                      <div className="task-description">
                                        <strong>Description:</strong> {task.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                            {shotTasks.length === 0 && (
                              <p className="no-tasks">No tasks assigned to this shot yet.</p>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTasks = () => (
    <div className="content-section">
      <div className="section-header">
        <h2>Tasks {selectedProject && `- ${selectedProject.name}`}</h2>
        {selectedProject && (
          <button className="btn btn-primary" onClick={() => openModal('task')}>
            + New Task
          </button>
        )}
      </div>
      {!selectedProject ? (
        <p className="no-selection">Select a project to view tasks</p>
      ) : (
        <div className="tasks-list">
          {tasks.map(task => (
            <div key={task.id} className="task-item">
              <div className="task-info">
                <h4>{task.name}</h4>
                <p>{task.description}</p>
                <div className="task-meta">
                  <span className={`status status-${task.status}`}>{task.status}</span>
                  <span className={`priority priority-${task.priority}`}>{task.priority}</span>
                  {task.due_date && <span className="due-date">Due: {new Date(task.due_date).toLocaleDateString()}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="content-section">
      <div className="section-header">
        <h2>Team Members</h2>
        <button className="btn btn-primary" onClick={() => openModal('user')}>
          + Add User
        </button>
      </div>
      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <h4>{user.name}</h4>
              <p>{user.email}</p>
              <span className="role">{user.role} - {user.department}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAssets = () => (
    <div className="content-section">
      <div className="section-header">
        <h2>Assets {selectedProject && `- ${selectedProject.name}`}</h2>
        {selectedProject && (
          <button className="btn btn-primary" onClick={() => openModal('asset')}>
            + New Asset
          </button>
        )}
      </div>
      {!selectedProject ? (
        <p className="no-selection">Select a project to view assets</p>
      ) : (
        <div className="assets-grid">
          {assets.map(asset => (
            <div key={asset.id} className="asset-card">
              <h4>{asset.name}</h4>
              <p>Type: {asset.type}</p>
              <span className={`status status-${asset.status}`}>{asset.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderShots = () => (
    <div className="content-section">
      <div className="section-header">
        <h2>Shots {selectedProject && `- ${selectedProject.name}`}</h2>
        {selectedProject && (
          <button className="btn btn-primary" onClick={() => openModal('shot')}>
            + New Shot
          </button>
        )}
      </div>
      {!selectedProject ? (
        <p className="no-selection">Select a project to view shots</p>
      ) : (
        <div className="shots-list">
          {shots.map(shot => (
            <div key={shot.id} className="shot-item">
              <h4>{shot.name}</h4>
              <p>Sequence: {shot.sequence}</p>
              <p>Frames: {shot.frame_in} - {shot.frame_out}</p>
              <span className={`status status-${shot.status}`}>{shot.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      // Calculate bid totals for projects
      if (modalType === 'project') {
        const modelingDays = parseFloat(data.modeling_days) || 0;
        const animationDays = parseFloat(data.animation_days) || 0;
        const lightingDays = parseFloat(data.lighting_days) || 0;
        const compositingDays = parseFloat(data.compositing_days) || 0;
        const dayRate = parseFloat(data.day_rate_usd) || 0;
        
        const totalBidDays = modelingDays + animationDays + lightingDays + compositingDays;
        const totalBidAmount = totalBidDays * dayRate;
        
        data.bid_details = {
          modeling_days: modelingDays,
          animation_days: animationDays,
          lighting_days: lightingDays,
          compositing_days: compositingDays,
          total_bid_days: totalBidDays,
          day_rate_usd: dayRate,
          total_bid_amount: totalBidAmount
        };
      }
      
      switch (modalType) {
        case 'project':
          createProject(data);
          break;
        case 'task':
          createTask(data);
          break;
        case 'user':
          createUser(data);
          break;
        case 'asset':
          createAsset(data);
          break;
        case 'shot':
          createShot(data);
          break;
        case 'breakdown':
          createBreakdown(data);
          break;
        case 'review':
          createReview(data);
          break;
        case 'timesheet':
          createTimesheet(data);
          break;
        case 'schedule':
          createSchedule(data);
          break;
        case 'milestone':
          createMilestone(data);
          break;
        default:
          break;
      }
    };

    return (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Create New {modalType.charAt(0).toUpperCase() + modalType.slice(1)}</h3>
            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
          </div>
          <form onSubmit={handleSubmit}>
            {modalType === 'project' && (
              <>
                <input name="name" placeholder="Project Name" required />
                <textarea name="description" placeholder="Project Description" />
                
                {/* Client Information */}
                <div className="form-section">
                  <h4>Client Information</h4>
                  <input name="client_name" placeholder="Client Name" required />
                  <input name="client_code" placeholder="Client Code (e.g., NFLX, DSNY)" required />
                </div>
                
                {/* Project Details */}
                <div className="form-section">
                  <h4>Project Details</h4>
                  <select name="project_type" required>
                    <option value="">Select Project Type</option>
                    <option value="feature_film">Feature Film</option>
                    <option value="tv_series">TV Series</option>
                    <option value="commercial">Commercial</option>
                    <option value="music_video">Music Video</option>
                    <option value="short_film">Short Film</option>
                  </select>
                  
                  <select name="currency">
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                  </select>
                  
                  <input name="exchange_rate" type="number" step="0.01" placeholder="Exchange Rate" defaultValue="1.00" />
                </div>
                
                {/* Project Scale */}
                <div className="form-section">
                  <h4>Project Scale</h4>
                  <input name="total_shots" type="number" placeholder="Total Shots" />
                  <input name="total_sequences" type="number" placeholder="Total Sequences" />
                </div>
                
                {/* Bid Details */}
                <div className="form-section">
                  <h4>Bid Details</h4>
                  <input name="modeling_days" type="number" step="0.5" placeholder="Modeling Days" />
                  <input name="animation_days" type="number" step="0.5" placeholder="Animation Days" />
                  <input name="lighting_days" type="number" step="0.5" placeholder="Lighting Days" />
                  <input name="compositing_days" type="number" step="0.5" placeholder="Compositing Days" />
                  <input name="day_rate_usd" type="number" placeholder="Day Rate (USD)" />
                </div>
                
                <select name="status">
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </>
            )}
            {modalType === 'task' && (
              <>
                <input name="name" placeholder="Task Name" required />
                <textarea name="description" placeholder="Description" />
                <select name="status">
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
                <select name="priority">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <input name="due_date" type="date" />
              </>
            )}
            {modalType === 'user' && (
              <>
                <input name="name" placeholder="Full Name" required />
                <input name="email" type="email" placeholder="Email" required />
                <select name="role">
                  <option value="artist">Artist</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="producer">Producer</option>
                  <option value="director">Director</option>
                </select>
                <input name="department" placeholder="Department" />
              </>
            )}
            {modalType === 'asset' && (
              <>
                {!selectedProject && (
                  <select name="project_id" required>
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                )}
                <input name="name" placeholder="Asset Name" required />
                <textarea name="description" placeholder="Asset Description" />
                <select name="asset_type" required>
                  <option value="character">Character</option>
                  <option value="prop">Prop</option>
                  <option value="environment">Environment</option>
                  <option value="vehicle">Vehicle</option>
                  <option value="fx">FX</option>
                </select>
                <select name="status">
                  <option value="todo">To Do</option>
                  <option value="wip">Work in Progress</option>
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                </select>
              </>
            )}
            {modalType === 'shot' && (
              <>
                {!selectedProject && (
                  <select name="project_id" required>
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                )}
                <input name="name" placeholder="Shot Name (e.g., SH010)" required />
                <textarea name="description" placeholder="Shot Description" />
                <input name="frame_in" type="number" placeholder="Frame In" />
                <input name="frame_out" type="number" placeholder="Frame Out" />
                <select name="status">
                  <option value="todo">To Do</option>
                  <option value="wip">Work in Progress</option>
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                </select>
              </>
            )}
            {modalType === 'breakdown' && (
              <>
                {!selectedProject && (
                  <select name="project_id" required>
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                )}
                <select name="shot_id" required>
                  <option value="">Select Shot</option>
                  {shots.filter(shot => !selectedProject || shot.project_id === selectedProject.id).map(shot => (
                    <option key={shot.id} value={shot.id}>{shot.name}</option>
                  ))}
                </select>
                <select name="asset_id" required>
                  <option value="">Select Asset</option>
                  {assets.filter(asset => !selectedProject || asset.project_id === selectedProject.id).map(asset => (
                    <option key={asset.id} value={asset.id}>{asset.name}</option>
                  ))}
                </select>
                <input name="nb_occurences" type="number" placeholder="Number of Occurrences" min="1" defaultValue="1" required />
                <textarea name="description" placeholder="Breakdown Description" />
              </>
            )}
            {modalType === 'review' && (
              <>
                <select name="task_id" required>
                  <option value="">Select Task</option>
                  {tasks.filter(task => !selectedProject || task.project_id === selectedProject.id).map(task => (
                    <option key={task.id} value={task.id}>{task.name}</option>
                  ))}
                </select>
                <select name="reviewer_id" required>
                  <option value="">Select Reviewer</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
                <select name="status" required>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="changes_requested">Changes Requested</option>
                </select>
                <textarea name="comment" placeholder="Review Comments" required />
                <input name="preview_file" placeholder="Preview File Path (optional)" />
              </>
            )}
            {modalType === 'timesheet' && (
              <>
                <select name="user_id" required>
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
                {!selectedProject && (
                  <select name="project_id" required>
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                )}
                <select name="task_id" required>
                  <option value="">Select Task</option>
                  {tasks.filter(task => !selectedProject || task.project_id === selectedProject.id).map(task => (
                    <option key={task.id} value={task.id}>{task.name}</option>
                  ))}
                </select>
                <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                <input name="duration" type="number" step="0.5" placeholder="Hours worked" required />
                <textarea name="description" placeholder="Work description" />
              </>
            )}
            {modalType === 'schedule' && (
              <>
                {!selectedProject && (
                  <select name="project_id" required>
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                )}
                <select name="task_id">
                  <option value="">General Schedule (No specific task)</option>
                  {tasks.filter(task => !selectedProject || task.project_id === selectedProject.id).map(task => (
                    <option key={task.id} value={task.id}>{task.name}</option>
                  ))}
                </select>
                <select name="user_id">
                  <option value="">No specific user</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
                <input name="start_date" type="date" required />
                <input name="end_date" type="date" required />
                <input name="estimated_hours" type="number" step="0.5" placeholder="Estimated hours" />
              </>
            )}
            {modalType === 'milestone' && (
              <>
                {!selectedProject && (
                  <select name="project_id" required>
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                )}
                <input name="name" placeholder="Milestone Name" required />
                <textarea name="description" placeholder="Milestone Description" />
                <input name="due_date" type="date" required />
              </>
            )}
            {modalType === 'playlist' && (
              <>
                <input name="name" placeholder="Playlist Name" required />
                <textarea name="description" placeholder="Description" />
                {!selectedProject && (
                  <select name="project_id" required>
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                )}
                <div className="checkbox-group">
                  <label>
                    <input type="checkbox" name="for_client" />
                    Client Review Playlist
                  </label>
                </div>
                <div className="checkbox-group">
                  <label>
                    <input type="checkbox" name="is_for_entity" />
                    Entity-specific Playlist
                  </label>
                </div>
                <select name="playlist_type">
                  <option value="shot">Shot Playlist</option>
                  <option value="asset">Asset Playlist</option>
                  <option value="sequence">Sequence Playlist</option>
                </select>
              </>
            )}
            {modalType === 'annotation' && (
              <>
                <select name="playlist_id" required>
                  <option value="">Select Playlist</option>
                  {playlists.map(playlist => (
                    <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
                  ))}
                </select>
                <input name="frame" type="number" placeholder="Frame Number" min="0" required />
                <select name="annotation_type" required>
                  <option value="">Select Type</option>
                  <option value="note">Note</option>
                  <option value="drawing">Drawing</option>
                  <option value="arrow">Arrow</option>
                  <option value="text">Text</option>
                </select>
                <textarea name="text" placeholder="Annotation text..." required />
                <input name="x" type="number" placeholder="X Position" step="0.01" />
                <input name="y" type="number" placeholder="Y Position" step="0.01" />
                <input name="color" type="color" defaultValue="#ff0000" />
              </>
            )}
            <div className="modal-actions">
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎬 Kitsu 2.0</h1>
        <p>VFX Project Management Studio</p>
      </header>
      
      <nav className="main-nav">
          <button 
            className={activeTab === 'projects' ? 'active' : ''}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button 
            className={activeTab === 'tasks' ? 'active' : ''}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
          <button 
            className={activeTab === 'assets' ? 'active' : ''}
            onClick={() => setActiveTab('assets')}
          >
            Assets
          </button>
          <button 
            className={activeTab === 'shots' ? 'active' : ''}
            onClick={() => setActiveTab('shots')}
          >
            Shots
          </button>
          <button 
            className={activeTab === 'breakdowns' ? 'active' : ''}
            onClick={() => setActiveTab('breakdowns')}
          >
            Breakdowns
          </button>
          <button 
            className={activeTab === 'reviews' ? 'active' : ''}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
          <button 
            className={activeTab === 'timesheets' ? 'active' : ''}
            onClick={() => setActiveTab('timesheets')}
          >
            Timesheets
          </button>
          <button 
            className={activeTab === 'schedule' ? 'active' : ''}
            onClick={() => setActiveTab('schedule')}
          >
            Schedule
          </button>
          <button 
            className={activeTab === 'statistics' ? 'active' : ''}
            onClick={() => setActiveTab('statistics')}
          >
            Statistics
          </button>
          <button 
            className={activeTab === 'team' ? 'active' : ''}
            onClick={() => setActiveTab('team')}
          >
            Team
          </button>
          <button 
            className={activeTab === 'playlists' ? 'active' : ''}
            onClick={() => setActiveTab('playlists')}
          >
            Playlists
          </button>
          <button 
            className={activeTab === 'annotations' ? 'active' : ''}
            onClick={() => setActiveTab('annotations')}
          >
            Annotations
          </button>
        </nav>

      <main className="main-content">
        {activeTab === 'projects' && renderProjects()}
          {activeTab === 'tasks' && renderTasks()}
          {activeTab === 'assets' && renderAssets()}
          {activeTab === 'shots' && renderShots()}
          {activeTab === 'breakdowns' && renderBreakdowns()}
          {activeTab === 'reviews' && renderReviews()}
          {activeTab === 'timesheets' && renderTimesheets()}
          {activeTab === 'schedule' && renderSchedule()}
          {activeTab === 'statistics' && renderStatistics()}
          {activeTab === 'team' && renderUsers()}
          {activeTab === 'playlists' && renderPlaylists()}
          {activeTab === 'annotations' && renderAnnotations()}
      </main>

      {renderModal()}
    </div>
  );

  // Render functions for new modules
  const renderBreakdowns = () => (
    <div className="breakdowns-section">
      <div className="section-header">
        <h2>Asset Breakdowns</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setModalType('breakdown');
            setShowModal(true);
          }}
        >
          Add Breakdown
        </button>
      </div>
      
      <div className="breakdowns-grid">
        {breakdowns.map(breakdown => {
          const shot = shots.find(s => s.id === breakdown.shot_id);
          const asset = assets.find(a => a.id === breakdown.asset_id);
          return (
            <div key={breakdown.id} className="breakdown-card">
              <h3>Shot: {shot?.name || 'Unknown'}</h3>
              <p><strong>Asset:</strong> {asset?.name || 'Unknown'}</p>
              <p><strong>Occurrences:</strong> {breakdown.nb_occurences}</p>
              <p><strong>Description:</strong> {breakdown.description}</p>
              <div className="breakdown-actions">
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteBreakdown(breakdown.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="reviews-section">
      <div className="section-header">
        <h2>Reviews & Feedback</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setModalType('review');
            setShowModal(true);
          }}
        >
          Add Review
        </button>
      </div>
      
      <div className="reviews-list">
        {reviews.map(review => {
          const task = tasks.find(t => t.id === review.task_id);
          const reviewer = users.find(u => u.id === review.reviewer_id);
          return (
            <div key={review.id} className={`review-card status-${review.status}`}>
              <div className="review-header">
                <h3>Task: {task?.title || 'Unknown'}</h3>
                <span className={`status-badge status-${review.status}`}>
                  {review.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <p><strong>Reviewer:</strong> {reviewer?.name || 'Unknown'}</p>
              <p><strong>Comment:</strong> {review.comment}</p>
              <p><strong>Date:</strong> {new Date(review.created_at).toLocaleDateString()}</p>
              {review.preview_file && (
                <p><strong>Preview:</strong> {review.preview_file}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTimesheets = () => (
    <div className="timesheets-section">
      <div className="section-header">
        <h2>Time Tracking</h2>
        <div className="timesheet-controls">
          <select 
            onChange={(e) => {
              const userId = e.target.value;
              setSelectedUser(users.find(u => u.id === userId));
            }}
            value={selectedUser?.id || ''}
          >
            <option value="">All Users</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setModalType('timesheet');
              setShowModal(true);
            }}
          >
            Log Time
          </button>
        </div>
      </div>
      
      <div className="timesheets-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Task</th>
              <th>Duration (hrs)</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {timesheets.map(timesheet => {
              const user = users.find(u => u.id === timesheet.user_id);
              const task = tasks.find(t => t.id === timesheet.task_id);
              return (
                <tr key={timesheet.id}>
                  <td>{timesheet.date}</td>
                  <td>{user?.name || 'Unknown'}</td>
                  <td>{task?.title || 'Unknown'}</td>
                  <td>{timesheet.duration}</td>
                  <td>{timesheet.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="schedule-section">
      <div className="section-header">
        <h2>Production Schedule</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setModalType('schedule');
            setShowModal(true);
          }}
        >
          Add Schedule
        </button>
      </div>
      
      <div className="schedule-content">
        <div className="milestones-section">
          <h3>Milestones</h3>
          <div className="milestones-grid">
            {milestones.map(milestone => (
              <div key={milestone.id} className={`milestone-card status-${milestone.status}`}>
                <h4>{milestone.name}</h4>
                <p>{milestone.description}</p>
                <p><strong>Due:</strong> {new Date(milestone.due_date).toLocaleDateString()}</p>
                <span className={`status-badge status-${milestone.status}`}>
                  {milestone.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="schedules-section">
          <h3>Task Schedules</h3>
          <div className="schedules-list">
            {schedules.map(schedule => {
              const task = tasks.find(t => t.id === schedule.task_id);
              const user = users.find(u => u.id === schedule.user_id);
              return (
                <div key={schedule.id} className="schedule-item">
                  <h4>{task?.title || 'General Schedule'}</h4>
                  {user && <p><strong>Assigned to:</strong> {user.name}</p>}
                  <p><strong>Duration:</strong> {new Date(schedule.start_date).toLocaleDateString()} - {new Date(schedule.end_date).toLocaleDateString()}</p>
                  <p><strong>Estimated:</strong> {schedule.estimated_hours}h | <strong>Actual:</strong> {schedule.actual_hours}h</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlaylists = () => (
    <div className="playlists-section">
      <div className="section-header">
        <h2>Review Playlists</h2>
        <div className="playlist-controls">
          <button 
            className="btn btn-primary"
            onClick={() => {
              setModalType('playlist');
              setShowModal(true);
            }}
          >
            Create Playlist
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowAnnotationTool(!showAnnotationTool)}
          >
            {showAnnotationTool ? 'Hide' : 'Show'} Annotation Tools
          </button>
        </div>
      </div>
      
      <div className="playlists-grid">
        {playlists.map(playlist => {
          const project = projects.find(p => p.id === playlist.project_id);
          return (
            <div key={playlist.id} className={`playlist-card ${selectedPlaylist?.id === playlist.id ? 'selected' : ''}`}>
              <div className="playlist-header">
                <h3>{playlist.name}</h3>
                <div className="playlist-actions">
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => setSelectedPlaylist(playlist)}
                  >
                    Open Review Room
                  </button>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => {
                      // Export playlist functionality
                      const csvData = playlist.shots?.map(shot => ({
                        shot: shot.name,
                        sequence: shot.sequence,
                        status: shot.status,
                        frame_in: shot.frame_in,
                        frame_out: shot.frame_out
                      }));
                      console.log('Exporting playlist:', csvData);
                    }}
                  >
                    Export CSV
                  </button>
                </div>
              </div>
              <p><strong>Project:</strong> {project?.name || 'Unknown'}</p>
              <p><strong>Created:</strong> {new Date(playlist.created_at).toLocaleDateString()}</p>
              <p><strong>Shots:</strong> {playlist.shots?.length || 0}</p>
              <p><strong>Status:</strong> {playlist.for_client ? 'Client Review' : 'Internal Review'}</p>
              
              {selectedPlaylist?.id === playlist.id && (
                <div className="review-room">
                  <div className="video-player">
                    <div className="player-controls">
                      <button 
                        className={`btn btn-sm ${isPlaying ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? 'Pause' : 'Play'}
                      </button>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={currentFrame} 
                        onChange={(e) => setCurrentFrame(e.target.value)}
                        className="frame-scrubber"
                      />
                      <span className="frame-counter">Frame: {currentFrame}</span>
                      <select 
                        value={playbackSpeed} 
                        onChange={(e) => setPlaybackSpeed(e.target.value)}
                        className="speed-control"
                      >
                        <option value="0.25">0.25x</option>
                        <option value="0.5">0.5x</option>
                        <option value="1">1x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2">2x</option>
                      </select>
                    </div>
                    
                    {showAnnotationTool && (
                      <div className="annotation-tools">
                        <button className="btn btn-sm btn-info">Draw</button>
                        <button className="btn btn-sm btn-info">Text</button>
                        <button className="btn btn-sm btn-info">Arrow</button>
                        <button className="btn btn-sm btn-warning">Clear</button>
                        <input type="color" className="color-picker" defaultValue="#ff0000" />
                      </div>
                    )}
                  </div>
                  
                  <div className="review-comments">
                    <h4>Comments & Feedback</h4>
                    <div className="comments-list">
                      {annotations
                        .filter(ann => ann.playlist_id === playlist.id)
                        .map(annotation => {
                          const user = users.find(u => u.id === annotation.user_id);
                          return (
                            <div key={annotation.id} className="comment-item">
                              <div className="comment-header">
                                <strong>{user?.name || 'Unknown'}</strong>
                                <span className="comment-time">
                                  Frame {annotation.frame} - {new Date(annotation.created_at).toLocaleString()}
                                </span>
                              </div>
                              <p>{annotation.text}</p>
                              {annotation.drawing_data && (
                                <div className="annotation-preview">Drawing annotation</div>
                              )}
                            </div>
                          );
                        })
                      }
                    </div>
                    
                    <div className="add-comment">
                      <textarea 
                        placeholder="Add your feedback..."
                        className="comment-input"
                      />
                      <div className="comment-actions">
                        <button className="btn btn-sm btn-success">Add Comment</button>
                        <button className="btn btn-sm btn-success">Approve</button>
                        <button className="btn btn-sm btn-danger">Request Changes</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderAnnotations = () => (
    <div className="annotations-section">
      <div className="section-header">
        <h2>Frame Annotations</h2>
        <div className="annotation-filters">
          <select onChange={(e) => {
            const playlistId = e.target.value;
            setSelectedPlaylist(playlists.find(p => p.id === playlistId));
          }}>
            <option value="">All Playlists</option>
            {playlists.map(playlist => (
              <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
            ))}
          </select>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setModalType('annotation');
              setShowModal(true);
            }}
          >
            Add Annotation
          </button>
        </div>
      </div>
      
      <div className="annotations-grid">
        {annotations.map(annotation => {
          const playlist = playlists.find(p => p.id === annotation.playlist_id);
          const user = users.find(u => u.id === annotation.user_id);
          return (
            <div key={annotation.id} className="annotation-card">
              <div className="annotation-header">
                <h4>Frame {annotation.frame}</h4>
                <span className="annotation-type">{annotation.annotation_type}</span>
              </div>
              <p><strong>Playlist:</strong> {playlist?.name || 'Unknown'}</p>
              <p><strong>Author:</strong> {user?.name || 'Unknown'}</p>
              <p><strong>Text:</strong> {annotation.text}</p>
              <p><strong>Created:</strong> {new Date(annotation.created_at).toLocaleString()}</p>
              
              {annotation.drawing_data && (
                <div className="drawing-preview">
                  <p><strong>Drawing Data:</strong> Available</p>
                </div>
              )}
              
              <div className="annotation-actions">
                <button className="btn btn-sm btn-secondary">Edit</button>
                <button className="btn btn-sm btn-danger">Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStatistics = () => (
    <div className="statistics-section">
      <div className="section-header">
        <h2>Production Statistics</h2>
      </div>
      
      <div className="stats-grid">
        {statistics.studio && (
          <div className="stat-card studio-stats">
            <h3>Studio Overview</h3>
            <div className="stat-item">
              <span className="stat-value">{statistics.studio.total_projects}</span>
              <span className="stat-label">Total Projects</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{statistics.studio.active_projects}</span>
              <span className="stat-label">Active Projects</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{statistics.studio.total_users}</span>
              <span className="stat-label">Team Members</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{statistics.studio.total_tasks}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{Math.round(statistics.studio.total_hours_logged)}h</span>
              <span className="stat-label">Hours Logged</span>
            </div>
          </div>
        )}
        
        {statistics.project && selectedProject && (
          <div className="stat-card project-stats">
            <h3>{selectedProject.name} Statistics</h3>
            <div className="stat-item">
              <span className="stat-value">{statistics.project.total_tasks}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{statistics.project.completed_tasks}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{statistics.project.in_progress_tasks}</span>
              <span className="stat-label">In Progress</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{Math.round(statistics.project.completion_percentage)}%</span>
              <span className="stat-label">Completion</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{Math.round(statistics.project.total_hours_logged)}h</span>
              <span className="stat-label">Hours Logged</span>
            </div>
          </div>
        )}
        
        {statistics.user && selectedUser && (
          <div className="stat-card user-stats">
            <h3>{selectedUser.name} Statistics</h3>
            <div className="stat-item">
              <span className="stat-value">{statistics.user.total_tasks}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{statistics.user.completed_tasks}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{Math.round(statistics.user.completion_percentage)}%</span>
              <span className="stat-label">Completion Rate</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{Math.round(statistics.user.total_hours_logged)}h</span>
              <span className="stat-label">Hours Logged</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Helper functions for new modules
  const deleteBreakdown = async (breakdownId) => {
    try {
      await fetch(`${API_BASE}/breakdowns/${breakdownId}`, {
        method: 'DELETE'
      });
      fetchBreakdowns(selectedProject?.id);
    } catch (error) {
      console.error('Error deleting breakdown:', error);
    }
  };

  const createBreakdown = async (breakdownData) => {
    try {
      const response = await fetch(`${API_BASE}/breakdowns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...breakdownData, project_id: selectedProject?.id || breakdownData.project_id }),
      });
      const newBreakdown = await response.json();
      setBreakdowns([...breakdowns, newBreakdown]);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating breakdown:', error);
    }
  };

  const createReview = async (reviewData) => {
    try {
      const response = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      const newReview = await response.json();
      setReviews([...reviews, newReview]);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating review:', error);
    }
  };

  const createTimesheet = async (timesheetData) => {
    try {
      const response = await fetch(`${API_BASE}/timesheets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...timesheetData, project_id: selectedProject?.id || timesheetData.project_id }),
      });
      const newTimesheet = await response.json();
      setTimesheets([...timesheets, newTimesheet]);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating timesheet:', error);
    }
  };

  const createSchedule = async (scheduleData) => {
    try {
      const response = await fetch(`${API_BASE}/schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...scheduleData, project_id: selectedProject?.id || scheduleData.project_id }),
      });
      const newSchedule = await response.json();
      setSchedules([...schedules, newSchedule]);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  const createMilestone = async (milestoneData) => {
    try {
      const response = await fetch(`${API_BASE}/milestones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...milestoneData, project_id: selectedProject?.id || milestoneData.project_id }),
      });
      const newMilestone = await response.json();
      setMilestones([...milestones, newMilestone]);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating milestone:', error);
    }
  };
}

export default App;
