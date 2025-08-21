from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, Float, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class TaskStatus(enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    PENDING_REVIEW = "pending_review"
    APPROVED = "approved"
    RETAKE = "retake"
    FINAL = "final"

class Priority(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    code = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(Text)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(String(50), default="active")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    sequences = relationship("Sequence", back_populates="project", cascade="all, delete-orphan")

class Sequence(Base):
    __tablename__ = "sequences"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50), nullable=False, index=True)
    description = Column(Text)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="sequences")
    packages = relationship("Package", back_populates="sequence", cascade="all, delete-orphan")

class Package(Base):
    __tablename__ = "packages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50), nullable=False, index=True)  # e.g., CS_010
    description = Column(Text)
    sequence_id = Column(Integer, ForeignKey("sequences.id"), nullable=False)
    frame_start = Column(Integer)
    frame_end = Column(Integer)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    sequence = relationship("Sequence", back_populates="packages")
    shots = relationship("Shot", back_populates="package", cascade="all, delete-orphan")

class Shot(Base):
    __tablename__ = "shots"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50), nullable=False, index=True)  # e.g., CS_010_0010
    description = Column(Text)
    package_id = Column(Integer, ForeignKey("packages.id"), nullable=False)
    frame_start = Column(Integer)
    frame_end = Column(Integer)
    frame_count = Column(Integer)
    fps = Column(Float, default=24.0)
    resolution_width = Column(Integer, default=1920)
    resolution_height = Column(Integer, default=1080)
    status = Column(String(50), default="active")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    package = relationship("Package", back_populates="shots")
    tasks = relationship("Task", back_populates="shot", cascade="all, delete-orphan")

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    code = Column(String(20), nullable=False, unique=True)
    color = Column(String(7), default="#3498db")  # Hex color
    order = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    tasks = relationship("Task", back_populates="department")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255))
    role = Column(String(50), default="artist")
    department_id = Column(Integer, ForeignKey("departments.id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    department = relationship("Department")
    assigned_tasks = relationship("Task", back_populates="assignee")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    shot_id = Column(Integer, ForeignKey("shots.id"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    assignee_id = Column(Integer, ForeignKey("users.id"))
    status = Column(Enum(TaskStatus), default=TaskStatus.NOT_STARTED)
    priority = Column(Enum(Priority), default=Priority.MEDIUM)
    estimated_hours = Column(Float)
    actual_hours = Column(Float, default=0.0)
    start_date = Column(DateTime)
    due_date = Column(DateTime)
    completed_date = Column(DateTime)
    current_version = Column(String(20), default="v001")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    shot = relationship("Shot", back_populates="tasks")
    department = relationship("Department", back_populates="tasks")
    assignee = relationship("User", back_populates="assigned_tasks")
    versions = relationship("Version", back_populates="task", cascade="all, delete-orphan")

class Version(Base):
    __tablename__ = "versions"
    
    id = Column(Integer, primary_key=True, index=True)
    version_number = Column(String(20), nullable=False)  # v001, v002, etc.
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    file_path = Column(String(500))
    thumbnail_path = Column(String(500))
    notes = Column(Text)
    status = Column(String(50), default="work_in_progress")
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    task = relationship("Task", back_populates="versions")
    creator = relationship("User")