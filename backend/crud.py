from sqlalchemy.orm import Session
from typing import List, Optional
from models import Project, Sequence, Package, Shot, Task, Department, User, Version
from schemas import (
    ProjectCreate, SequenceCreate, PackageCreate, ShotCreate, 
    TaskCreate, DepartmentCreate, UserCreate, VersionCreate
)

# Project CRUD operations
def create_project(db: Session, project: ProjectCreate):
    db_project = Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Project).offset(skip).limit(limit).all()

def get_project(db: Session, project_id: int):
    return db.query(Project).filter(Project.id == project_id).first()

# Sequence CRUD operations
def create_sequence(db: Session, sequence: SequenceCreate):
    db_sequence = Sequence(**sequence.dict())
    db.add(db_sequence)
    db.commit()
    db.refresh(db_sequence)
    return db_sequence

def get_sequences(db: Session, project_id: Optional[int] = None, skip: int = 0, limit: int = 100):
    query = db.query(Sequence)
    if project_id:
        query = query.filter(Sequence.project_id == project_id)
    return query.offset(skip).limit(limit).all()

# Package CRUD operations
def create_package(db: Session, package: PackageCreate):
    db_package = Package(**package.dict())
    db.add(db_package)
    db.commit()
    db.refresh(db_package)
    return db_package

def get_packages(db: Session, sequence_id: Optional[int] = None, skip: int = 0, limit: int = 100):
    query = db.query(Package)
    if sequence_id:
        query = query.filter(Package.sequence_id == sequence_id)
    return query.offset(skip).limit(limit).all()

# Shot CRUD operations
def create_shot(db: Session, shot: ShotCreate):
    db_shot = Shot(**shot.dict())
    db.add(db_shot)
    db.commit()
    db.refresh(db_shot)
    return db_shot

def get_shots(db: Session, package_id: Optional[int] = None, skip: int = 0, limit: int = 100):
    query = db.query(Shot)
    if package_id:
        query = query.filter(Shot.package_id == package_id)
    return query.offset(skip).limit(limit).all()

# Task CRUD operations
def create_task(db: Session, task: TaskCreate):
    db_task = Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_tasks(db: Session, shot_id: Optional[int] = None, skip: int = 0, limit: int = 100):
    query = db.query(Task)
    if shot_id:
        query = query.filter(Task.shot_id == shot_id)
    return query.offset(skip).limit(limit).all()

# Department CRUD operations
def create_department(db: Session, department: DepartmentCreate):
    db_department = Department(**department.dict())
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department

def get_departments(db: Session):
    return db.query(Department).order_by(Department.order).all()

# User CRUD operations
def create_user(db: Session, user: UserCreate):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).filter(User.is_active == True).offset(skip).limit(limit).all()

# Version CRUD operations
def create_version(db: Session, version: VersionCreate):
    db_version = Version(**version.dict())
    db.add(db_version)
    db.commit()
    db.refresh(db_version)
    return db_version

def get_versions(db: Session, task_id: int):
    return db.query(Version).filter(Version.task_id == task_id).order_by(Version.created_at.desc()).all()

# Initialize default departments
def init_default_departments(db: Session):
    default_departments = [
        {"name": "Roto", "code": "ROTO", "color": "#e74c3c", "order": 1},
        {"name": "Paint", "code": "PAINT", "color": "#f39c12", "order": 2},
        {"name": "Matchmove", "code": "MM", "color": "#9b59b6", "order": 3},
        {"name": "Comp", "code": "COMP", "color": "#3498db", "order": 4},
        {"name": "FX", "code": "FX", "color": "#1abc9c", "order": 5},
        {"name": "Lighting", "code": "LGT", "color": "#f1c40f", "order": 6},
        {"name": "Animation", "code": "ANIM", "color": "#2ecc71", "order": 7},
    ]
    
    for dept_data in default_departments:
        existing = db.query(Department).filter(Department.code == dept_data["code"]).first()
        if not existing:
            department = Department(**dept_data)
            db.add(department)
    
    db.commit()