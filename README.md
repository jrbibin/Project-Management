# Kitsu Project Management System

A comprehensive project management system for animation and VFX studios, built with React frontend and Python Flask backend.

## Features

- **Project Management**: Create and manage animation/VFX projects with detailed bid information
- **Shot Tracking**: Organize shots with frame ranges, completion tracking, and task management
- **Task Management**: Assign tasks to team members with status tracking and time estimation
- **Department Organization**: Color-coded departments (Modeling, Animation, Lighting, Compositing, etc.)
- **User Management**: Team member profiles and role assignments
- **Asset Management**: Track project assets and their associated tasks
- **Progress Visualization**: Real-time progress bars and completion percentages
- **Bid Management**: Track estimated vs actual time and costs

## Technology Stack

### Frontend
- **React**: Modern JavaScript framework for building user interfaces
- **CSS3**: Custom styling with responsive design
- **Fetch API**: For backend communication

### Backend
- **Python Flask**: Lightweight web framework
- **SQLite**: Database for data persistence
- **Flask-CORS**: Cross-origin resource sharing support

## Project Structure

```
Kitsu/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── App.js           # Main application component
│   │   ├── App.css          # Application styles
│   │   └── ...
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                 # Python Flask backend
│   ├── app.py              # Main Flask application
│   └── requirements.txt     # Python dependencies
└── README.md               # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Python 3.7+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Start the backend server:
   ```bash
   python app.py
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`

## Usage

1. **Create a Project**: Click "New Project" to create a new animation/VFX project with client details and bid information
2. **Add Team Members**: Use the "New User" button to add team members with their roles
3. **Create Shots**: Add shots to your project with frame ranges and descriptions
4. **Assign Tasks**: Create tasks for shots and assign them to team members
5. **Track Progress**: Monitor project progress through the dashboard with visual progress indicators
6. **View Shot Details**: Click on any shot to see detailed information, department progress, and task breakdown

## Key Components

### Project Dashboard
- Overview of all projects with completion status
- Shot grid with frame counts and progress indicators
- Clickable shot cards for detailed views

### Shot Details Modal
- Comprehensive shot information including frame range and duration
- Department-wise progress breakdown
- Detailed task list with assignees and time tracking
- Visual progress indicators

### Project Creation Form
- Client information (name, code)
- Project details (type, currency, exchange rate)
- Project scale (total shots, sequences)
- Bid details with automatic calculations

## API Endpoints

The backend provides RESTful API endpoints for:
- Projects: `/api/projects`
- Users: `/api/users`
- Tasks: `/api/tasks`
- Shots: `/api/shots`
- Assets: `/api/assets`
- Task Types: `/api/task-types`
- Departments: `/api/departments`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.