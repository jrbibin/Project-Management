# ETRA Project Management System

A modern VFX production pipeline management system built with FastAPI backend and React TypeScript frontend.

## 🚀 Features

- **Project Management** - Create and manage VFX projects
- **Sequence & Package Organization** - Structure your production workflow
- **Shot Management** - Track individual shots and their progress
- **Task Assignment** - Assign and monitor work across departments
- **User & Department Management** - Handle team organization
- **Modern UI** - Clean Material-UI interface with dark/light theme support
- **Real-time Updates** - Live data synchronization between frontend and backend

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **SQLite** - Database (easily configurable for PostgreSQL)

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Component library
- **React Query** - Data fetching and caching
- **React Router** - Navigation
- **Axios** - HTTP client

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## 🚀 Quick Start

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the FastAPI server:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

   The API will be available at `http://localhost:8000`
   API documentation at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
etra-pipeline/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── models.py            # Database models
│   ├── schemas.py           # Pydantic schemas
│   ├── crud.py              # Database operations
│   ├── database.py          # Database configuration
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── App.tsx          # Main application component
│   │   └── index.tsx        # Application entry point
│   ├── public/              # Static assets
│   ├── package.json         # Node.js dependencies
│   └── tsconfig.json        # TypeScript configuration
└── README.md
```

## 🔧 Configuration

### Backend Configuration

Create a `.env` file in the backend directory:

```env
DATABASE_URL=sqlite:///./etra_pipeline.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend Configuration

The frontend is configured to connect to the backend at `http://localhost:8000`. You can modify this in `src/App.tsx` if needed.

## 📊 API Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check
- `POST /api/projects` - Create project
- `GET /api/projects` - List projects
- `POST /api/sequences` - Create sequence
- `GET /api/sequences` - List sequences
- `POST /api/packages` - Create package
- `GET /api/packages` - List packages
- `POST /api/shots` - Create shot
- `GET /api/shots` - List shots
- `POST /api/tasks` - Create task
- `GET /api/tasks` - List tasks
- `GET /api/departments` - List departments
- `GET /api/users` - List users

Full API documentation is available at `http://localhost:8000/docs` when the backend is running.

## 🧪 Development

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Building for Production

```bash
# Frontend build
cd frontend
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please create an issue in the repository.