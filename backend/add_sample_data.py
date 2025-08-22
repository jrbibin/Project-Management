from database import SessionLocal
from models import Shot, Package, Project, Sequence
from crud import create_shot, create_project, create_package, create_sequence
from schemas import ShotCreate, ProjectCreate, PackageCreate, SequenceCreate

def add_sample_data():
    db = SessionLocal()
    try:
        # Create a sample project if none exists
        project = db.query(Project).first()
        if not project:
            project_data = ProjectCreate(
                name="Sample VFX Project",
                code="SAMPLE_VFX",
                description="A sample project for testing",
                status="active"
            )
            project = create_project(db, project_data)
            print(f"Created project: {project.id} - {project.name}")
        
        # Create a sample sequence if none exists
        sequence = db.query(Sequence).filter(Sequence.project_id == project.id).first()
        if not sequence:
            sequence_data = SequenceCreate(
                name="Main Sequence",
                code="SEQ_001",
                description="Main sequence for the project",
                project_id=project.id
            )
            sequence = create_sequence(db, sequence_data)
            print(f"Created sequence: {sequence.id} - {sequence.name}")
        
        # Create a sample package if none exists
        pkg = db.query(Package).filter(Package.sequence_id == sequence.id).first()
        if not pkg:
            package_data = PackageCreate(
                name="Main Package",
                code="PKG_001",
                description="Main package for the sequence",
                sequence_id=sequence.id
            )
            pkg = create_package(db, package_data)
            print(f"Created package: {pkg.id} - {pkg.name}")
        
        # Create sample shots
        shots_to_create = [
            {"name": "SH001", "code": "SH_001", "description": "Opening shot"},
            {"name": "SH002", "code": "SH_002", "description": "Character introduction"},
            {"name": "SH003", "code": "SH_003", "description": "Action sequence"}
        ]
        
        for shot_info in shots_to_create:
            # Check if shot already exists
            existing_shot = db.query(Shot).filter(
                Shot.name == shot_info["name"],
                Shot.package_id == pkg.id
            ).first()
            
            if not existing_shot:
                shot_data = ShotCreate(
                    name=shot_info["name"],
                    code=shot_info["code"],
                    description=shot_info["description"],
                    package_id=pkg.id,
                    frame_start=1001,
                    frame_end=1100,
                    fps=24.0,
                    resolution_width=1920,
                    resolution_height=1080,
                    status="active"
                )
                shot = create_shot(db, shot_data)
                print(f"Created shot: {shot.id} - {shot.name}")
            else:
                print(f"Shot {shot_info['name']} already exists")
        
        print("Sample shots added successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    add_sample_data()