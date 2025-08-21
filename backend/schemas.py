from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class TaskStatusEnum(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    PENDING_REVIEW = "pending_review"
    APPROVED = "approved"
    RETAKE = "retake"
    FINAL = "final"

class PriorityEnum(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

# Project schemas
class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    code: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: str = "active"

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Sequence schemas
class SequenceBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    code: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None
    project_id: int

class SequenceCreate(SequenceBase):
    pass

class SequenceResponse(SequenceBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Package schemas
class PackageBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    code: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None
    sequence_id: int
    frame_start: Optional[int] = None
    frame_end: Optional[int] = None

class PackageCreate(PackageBase):
    pass

class PackageResponse(PackageBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Shot schemas
class ShotBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    code: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None
    package_id: int
    frame_start: Optional[int] = None
    frame_end: Optional[int] = None
    frame_count: Optional[int] = None
    fps: float = 24.0
    resolution_width: int = 1920
    resolution_height: int = 1080
    status: str = "active"

class ShotCreate(ShotBase):
    pass

class ShotResponse(ShotBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Department schemas
class DepartmentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    code: str = Field(..., min_length=1, max_length=20)
    color: str = "#3498db"
    order: int = 0

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# User schemas
class UserBase(BaseModel):
    username: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., max_length=255)
    full_name: Optional[str] = None
    role: str = "artist"
    department_id: Optional[int] = None
    is_active: bool = True

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Task schemas
class TaskBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    shot_id: int
    department_id: int
    assignee_id: Optional[int] = None
    status: TaskStatusEnum = TaskStatusEnum.NOT_STARTED
    priority: PriorityEnum = PriorityEnum.MEDIUM
    estimated_hours: Optional[float] = None
    actual_hours: float = 0.0
    start_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    completed_date: Optional[datetime] = None
    current_version: str = "v001"

class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Version schemas
class VersionBase(BaseModel):
    version_number: str = Field(..., min_length=1, max_length=20)
    task_id: int
    file_path: Optional[str] = None
    thumbnail_path: Optional[str] = None
    notes: Optional[str] = None
    status: str = "work_in_progress"
    created_by: Optional[int] = None

class VersionCreate(VersionBase):
    pass

class VersionResponse(VersionBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True