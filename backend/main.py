from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn
from datetime import datetime

from database import get_db, engine
from models import Base
from schemas import (
    ProjectCreate, ProjectResponse,
    SequenceCreate, SequenceResponse,
    PackageCreate, PackageResponse,
    ShotCreate, ShotResponse,
    TaskCreate, TaskResponse,
    DepartmentResponse,
    UserResponse
)
from crud import (
    create_project, get_projects,
    create_sequence, get_sequences,
    create_package, get_packages,
    create_shot, get_shots,
    create_task, get_tasks,
    get_departments, get_users
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ETRA Project Management API",
    description="Modern VFX Production Pipeline Management System",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Root endpoint
@app.get("/")
async def root():
    return {"message": "ETRA Project Management API v2.0", "status": "running"}

# Projects endpoints
@app.post("/api/projects", response_model=ProjectResponse)
async def create_project_endpoint(project: ProjectCreate, db: Session = Depends(get_db)):
    return create_project(db, project)

@app.get("/api/projects", response_model=List[ProjectResponse])
async def get_projects_endpoint(db: Session = Depends(get_db)):
    return get_projects(db)

# Sequences endpoints
@app.post("/api/sequences", response_model=SequenceResponse)
async def create_sequence_endpoint(sequence: SequenceCreate, db: Session = Depends(get_db)):
    return create_sequence(db, sequence)

@app.get("/api/sequences", response_model=List[SequenceResponse])
async def get_sequences_endpoint(project_id: Optional[int] = None, db: Session = Depends(get_db)):
    return get_sequences(db, project_id)

# Packages endpoints
@app.post("/api/packages", response_model=PackageResponse)
async def create_package_endpoint(package: PackageCreate, db: Session = Depends(get_db)):
    return create_package(db, package)

@app.get("/api/packages", response_model=List[PackageResponse])
async def get_packages_endpoint(sequence_id: Optional[int] = None, db: Session = Depends(get_db)):
    return get_packages(db, sequence_id)

# Shots endpoints
@app.post("/api/shots", response_model=ShotResponse)
async def create_shot_endpoint(shot: ShotCreate, db: Session = Depends(get_db)):
    return create_shot(db, shot)

@app.get("/api/shots", response_model=List[ShotResponse])
async def get_shots_endpoint(package_id: Optional[int] = None, db: Session = Depends(get_db)):
    return get_shots(db, package_id)

# Tasks endpoints
@app.post("/api/tasks", response_model=TaskResponse)
async def create_task_endpoint(task: TaskCreate, db: Session = Depends(get_db)):
    return create_task(db, task)

@app.get("/api/tasks", response_model=List[TaskResponse])
async def get_tasks_endpoint(shot_id: Optional[int] = None, db: Session = Depends(get_db)):
    return get_tasks(db, shot_id)

# Departments endpoints
@app.get("/api/departments", response_model=List[DepartmentResponse])
async def get_departments_endpoint(db: Session = Depends(get_db)):
    return get_departments(db)

# Users endpoints
@app.get("/api/users", response_model=List[UserResponse])
async def get_users_endpoint(db: Session = Depends(get_db)):
    return get_users(db)

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)