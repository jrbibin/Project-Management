from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
from datetime import datetime, timedelta
import json

app = Flask(__name__)
CORS(app)

# In-memory storage (replace with database in production)
projects = []
tasks = []
users = []
assets = []
shots = []
breakdowns = []
reviews = []
timesheets = []
schedules = []
notifications = []
statistics = []
milestones = []
playlists = []
annotations = []
departments = []
task_types = []
task_statuses = []
concepts = []

# Initialize default data
def initialize_default_data():
    # Default departments
    default_departments = [
        {'id': str(uuid.uuid4()), 'name': 'Animation', 'color': '#FF6B6B'},
        {'id': str(uuid.uuid4()), 'name': 'Modeling', 'color': '#4ECDC4'},
        {'id': str(uuid.uuid4()), 'name': 'Texturing', 'color': '#45B7D1'},
        {'id': str(uuid.uuid4()), 'name': 'Lighting', 'color': '#96CEB4'},
        {'id': str(uuid.uuid4()), 'name': 'Compositing', 'color': '#FFEAA7'},
        {'id': str(uuid.uuid4()), 'name': 'FX', 'color': '#DDA0DD'}
    ]
    departments.extend(default_departments)
    
    # Default task types
    default_task_types = [
        {'id': str(uuid.uuid4()), 'name': 'Concept', 'short_name': 'conc', 'color': '#8E44AD', 'department': 'Animation'},
        {'id': str(uuid.uuid4()), 'name': 'Modeling', 'short_name': 'mdl', 'color': '#3498DB', 'department': 'Modeling'},
        {'id': str(uuid.uuid4()), 'name': 'Shading', 'short_name': 'shd', 'color': '#E67E22', 'department': 'Texturing'},
        {'id': str(uuid.uuid4()), 'name': 'Rigging', 'short_name': 'rig', 'color': '#E74C3C', 'department': 'Animation'},
        {'id': str(uuid.uuid4()), 'name': 'Animation', 'short_name': 'anim', 'color': '#2ECC71', 'department': 'Animation'},
        {'id': str(uuid.uuid4()), 'name': 'FX', 'short_name': 'fx', 'color': '#9B59B6', 'department': 'FX'},
        {'id': str(uuid.uuid4()), 'name': 'Lighting', 'short_name': 'lgt', 'color': '#F39C12', 'department': 'Lighting'},
        {'id': str(uuid.uuid4()), 'name': 'Compositing', 'short_name': 'comp', 'color': '#1ABC9C', 'department': 'Compositing'}
    ]
    task_types.extend(default_task_types)
    
    # Default task statuses
    default_task_statuses = [
        {'id': str(uuid.uuid4()), 'name': 'Todo', 'short_name': 'todo', 'color': '#95A5A6', 'is_done': False},
        {'id': str(uuid.uuid4()), 'name': 'Work In Progress', 'short_name': 'wip', 'color': '#3498DB', 'is_done': False},
        {'id': str(uuid.uuid4()), 'name': 'Waiting For Approval', 'short_name': 'wfa', 'color': '#F39C12', 'is_done': False},
        {'id': str(uuid.uuid4()), 'name': 'Retake', 'short_name': 'rtk', 'color': '#E74C3C', 'is_done': False},
        {'id': str(uuid.uuid4()), 'name': 'Done', 'short_name': 'done', 'color': '#27AE60', 'is_done': True}
    ]
    task_statuses.extend(default_task_statuses)
    
    # Sample projects
    sample_projects = [
        {
            'id': 'proj-001',
            'name': 'Cyberpunk Cityscape',
            'description': 'A futuristic cityscape with neon lights and flying vehicles for our latest commercial project.',
            'status': 'active',
            'budget': 150000,
            'client_name': 'Starlight Pictures',
            'client_code': 'SLP',
            'project_type': 'Film',
            'currency': 'USD',
            'exchange_rate': 83.0,
            'total_shots': 45,
            'total_sequences': 8,
            'bid_details': {
                'modeling_days': 120,
                'animation_days': 180,
                'lighting_days': 90,
                'compositing_days': 150,
                'total_bid_days': 540,
                'day_rate_usd': 500,
                'total_bid_amount': 270000
            },
            'created_at': (datetime.now() - timedelta(days=30)).isoformat(),
            'updated_at': datetime.now().isoformat()
        },
        {
            'id': 'proj-002', 
            'name': 'Fantasy Forest Adventure',
            'description': 'Magical forest environment with mystical creatures and enchanted elements.',
            'status': 'active',
            'budget': 200000,
            'client_name': 'Nova Features',
            'client_code': 'NVF',
            'project_type': 'Episode',
            'currency': 'GBP',
            'exchange_rate': 105.0,
            'total_shots': 32,
            'total_sequences': 6,
            'bid_details': {
                'modeling_days': 80,
                'animation_days': 120,
                'lighting_days': 60,
                'compositing_days': 100,
                'total_bid_days': 360,
                'day_rate_usd': 500,
                'total_bid_amount': 180000
            },
            'created_at': (datetime.now() - timedelta(days=45)).isoformat(),
            'updated_at': datetime.now().isoformat()
        },
        {
            'id': 'proj-003',
            'name': 'Space Station Alpha',
            'description': 'Sci-fi space station interior and exterior shots with zero gravity effects.',
            'status': 'on-hold',
            'budget': 300000,
            'client_name': 'Cosmic Studios',
            'client_code': 'CST',
            'project_type': 'Commercial',
            'currency': 'EUR',
            'exchange_rate': 90.0,
            'total_shots': 28,
            'total_sequences': 5,
            'bid_details': {
                'modeling_days': 100,
                'animation_days': 140,
                'lighting_days': 80,
                'compositing_days': 120,
                'total_bid_days': 440,
                'day_rate_usd': 500,
                'total_bid_amount': 220000
            },
            'created_at': (datetime.now() - timedelta(days=60)).isoformat(),
            'updated_at': datetime.now().isoformat()
        }
    ]
    projects.extend(sample_projects)
    
    # Sample users
    sample_users = [
        {
            'id': 'user-001',
            'name': 'Alice Johnson',
            'email': 'alice@studio.com',
            'role': 'Lead Animator',
            'department': 'Animation',
            'created_at': datetime.now().isoformat()
        },
        {
            'id': 'user-002',
            'name': 'Bob Smith',
            'email': 'bob@studio.com', 
            'role': 'Senior Modeler',
            'department': 'Modeling',
            'created_at': datetime.now().isoformat()
        },
        {
            'id': 'user-003',
            'name': 'Carol Davis',
            'email': 'carol@studio.com',
            'role': 'Lighting Artist',
            'department': 'Lighting',
            'created_at': datetime.now().isoformat()
        }
    ]
    users.extend(sample_users)
    
    # Sample assets
    sample_assets = [
        {
            'id': 'asset-001',
            'name': 'Cyberpunk Car',
            'asset_type': 'vehicle',
            'project_id': 'proj-001',
            'description': 'Futuristic hover car with neon underglow',
            'status': 'modeling',
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        },
        {
            'id': 'asset-002',
            'name': 'Neon Sign',
            'asset_type': 'prop',
            'project_id': 'proj-001',
            'description': 'Animated neon sign for cityscape',
            'status': 'texturing',
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        },
        {
            'id': 'asset-003',
            'name': 'Elf Character',
            'asset_type': 'character',
            'project_id': 'proj-002',
            'description': 'Main elf character with magical abilities',
            'status': 'rigging',
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
    ]
    assets.extend(sample_assets)
    
    # Sample shots
    sample_shots = [
        {
            'id': 'shot-001',
            'name': 'SH010',
            'sequence': 'Opening Sequence',
            'project_id': 'proj-001',
            'frame_in': 1001,
            'frame_out': 1120,
            'status': 'layout',
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        },
        {
            'id': 'shot-002',
            'name': 'SH020',
            'sequence': 'Opening Sequence', 
            'project_id': 'proj-001',
            'frame_in': 1121,
            'frame_out': 1200,
            'status': 'animation',
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        },
        {
            'id': 'shot-003',
            'name': 'SH030',
            'sequence': 'Chase Sequence',
            'project_id': 'proj-001',
            'frame_in': 2001,
            'frame_out': 2150,
            'status': 'lighting',
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
    ]
    shots.extend(sample_shots)
    
    # Sample tasks
    sample_tasks = [
        {
            'id': 'task-001',
            'name': 'Model Cyberpunk Car',
            'description': 'Create base mesh for hover car',
            'project_id': 'proj-001',
            'entity_id': 'asset-001',
            'entity_type': 'Asset',
            'task_type': 'Modeling',
            'assignee_id': 'user-002',
            'status': 'wip',
            'priority': 'high',
            'bid_days': 8,
            'actual_days': 5,
            'due_date': (datetime.now() + timedelta(days=7)).isoformat(),
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        },
        {
            'id': 'task-002',
            'name': 'Animate SH010',
            'description': 'Character animation for opening shot',
            'project_id': 'proj-001',
            'entity_id': 'shot-001',
            'entity_type': 'Shot',
            'task_type': 'Animation',
            'assignee_id': 'user-001',
            'status': 'done',
            'priority': 'medium',
            'bid_days': 12,
            'actual_days': 10,
            'due_date': (datetime.now() + timedelta(days=14)).isoformat(),
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        },
        {
            'id': 'task-003',
            'name': 'Light SH030',
            'description': 'Lighting setup for chase sequence',
            'project_id': 'proj-001',
            'entity_id': 'shot-003',
            'entity_type': 'Shot',
            'task_type': 'Lighting',
            'assignee_id': 'user-003',
            'status': 'todo',
            'priority': 'medium',
            'bid_days': 6,
            'actual_days': 0,
            'due_date': (datetime.now() + timedelta(days=21)).isoformat(),
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        },
        {
            'id': 'task-004',
            'name': 'Composite SH010',
            'description': 'Final composite for opening shot',
            'project_id': 'proj-001',
            'entity_id': 'shot-001',
            'entity_type': 'Shot',
            'task_type': 'Compositing',
            'assignee_id': 'user-004',
            'status': 'wip',
            'priority': 'high',
            'bid_days': 10,
            'actual_days': 7,
            'due_date': (datetime.now() + timedelta(days=10)).isoformat(),
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        },
        {
            'id': 'task-005',
            'name': 'Roto SH020',
            'description': 'Rotoscoping for character isolation',
            'project_id': 'proj-001',
            'entity_id': 'shot-002',
            'entity_type': 'Shot',
            'task_type': 'Roto',
            'assignee_id': 'user-005',
            'status': 'done',
            'priority': 'medium',
            'bid_days': 4,
            'actual_days': 4,
            'due_date': (datetime.now() + timedelta(days=5)).isoformat(),
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
    ]
    tasks.extend(sample_tasks)
    
    # Sample milestones
    sample_milestones = [
        {
            'id': 'milestone-001',
            'name': 'Pre-production Complete',
            'description': 'All concept art and pre-viz completed',
            'project_id': 'proj-001',
            'due_date': (datetime.now() + timedelta(days=30)).isoformat(),
            'created_at': datetime.now().isoformat()
        },
        {
            'id': 'milestone-002',
            'name': 'Animation Lock',
            'description': 'All animation work finalized',
            'project_id': 'proj-001',
            'due_date': (datetime.now() + timedelta(days=60)).isoformat(),
            'created_at': datetime.now().isoformat()
        }
    ]
    milestones.extend(sample_milestones)

# Initialize default data on startup
initialize_default_data()

@app.route('/')
def index():
    return jsonify({'message': 'Welcome to Kitsu 2.0 - VFX Project Management'})

# Projects API
@app.route('/api/projects', methods=['GET', 'POST'])
def handle_projects():
    if request.method == 'GET':
        return jsonify(projects)
    
    elif request.method == 'POST':
        data = request.get_json()
        project = {
            'id': str(uuid.uuid4()),
            'name': data.get('name'),
            'description': data.get('description', ''),
            'status': data.get('status', 'active'),
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        projects.append(project)
        return jsonify(project), 201

@app.route('/api/projects/<project_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_project(project_id):
    project = next((p for p in projects if p['id'] == project_id), None)
    
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    if request.method == 'GET':
        return jsonify(project)
    
    elif request.method == 'PUT':
        data = request.get_json()
        project.update({
            'name': data.get('name', project['name']),
            'description': data.get('description', project['description']),
            'status': data.get('status', project['status']),
            'updated_at': datetime.now().isoformat()
        })
        return jsonify(project)
    
    elif request.method == 'DELETE':
        projects.remove(project)
        return '', 204

# Tasks API
@app.route('/api/tasks', methods=['GET', 'POST'])
def handle_tasks():
    if request.method == 'GET':
        project_id = request.args.get('project_id')
        if project_id:
            filtered_tasks = [t for t in tasks if t['project_id'] == project_id]
            return jsonify(filtered_tasks)
        return jsonify(tasks)
    
    elif request.method == 'POST':
        data = request.get_json()
        task = {
            'id': str(uuid.uuid4()),
            'name': data.get('name'),
            'description': data.get('description', ''),
            'project_id': data.get('project_id'),
            'assignee_id': data.get('assignee_id'),
            'status': data.get('status', 'todo'),
            'priority': data.get('priority', 'medium'),
            'due_date': data.get('due_date'),
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        tasks.append(task)
        return jsonify(task), 201

@app.route('/api/tasks/<task_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_task(task_id):
    task = next((t for t in tasks if t['id'] == task_id), None)
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    if request.method == 'GET':
        return jsonify(task)
    
    elif request.method == 'PUT':
        data = request.get_json()
        task.update({
            'name': data.get('name', task['name']),
            'description': data.get('description', task['description']),
            'status': data.get('status', task['status']),
            'priority': data.get('priority', task['priority']),
            'assignee_id': data.get('assignee_id', task['assignee_id']),
            'due_date': data.get('due_date', task['due_date']),
            'updated_at': datetime.now().isoformat()
        })
        return jsonify(task)
    
    elif request.method == 'DELETE':
        tasks.remove(task)
        return '', 204

# Users API
@app.route('/api/users', methods=['GET', 'POST'])
def handle_users():
    if request.method == 'GET':
        return jsonify(users)
    
    elif request.method == 'POST':
        data = request.get_json()
        user = {
            'id': str(uuid.uuid4()),
            'name': data.get('name'),
            'email': data.get('email'),
            'role': data.get('role', 'artist'),
            'department': data.get('department', ''),
            'created_at': datetime.now().isoformat()
        }
        users.append(user)
        return jsonify(user), 201

# Assets API
@app.route('/api/assets', methods=['GET', 'POST'])
def handle_assets():
    if request.method == 'GET':
        project_id = request.args.get('project_id')
        if project_id:
            filtered_assets = [a for a in assets if a['project_id'] == project_id]
            return jsonify(filtered_assets)
        return jsonify(assets)
    
    elif request.method == 'POST':
        data = request.get_json()
        asset = {
            'id': str(uuid.uuid4()),
            'name': data.get('name'),
            'type': data.get('type', 'prop'),
            'project_id': data.get('project_id'),
            'description': data.get('description', ''),
            'status': data.get('status', 'modeling'),
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        assets.append(asset)
        return jsonify(asset), 201

# Shots API
@app.route('/api/shots', methods=['GET', 'POST'])
def handle_shots():
    if request.method == 'GET':
        project_id = request.args.get('project_id')
        if project_id:
            filtered_shots = [s for s in shots if s['project_id'] == project_id]
            return jsonify(filtered_shots)
        return jsonify(shots)
    
    elif request.method == 'POST':
        data = request.get_json()
        shot = {
            'id': str(uuid.uuid4()),
            'name': data.get('name'),
            'sequence': data.get('sequence', ''),
            'project_id': data.get('project_id'),
            'frame_in': data.get('frame_in', 1),
            'frame_out': data.get('frame_out', 100),
            'status': data.get('status', 'layout'),
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        shots.append(shot)
        return jsonify(shot), 201

# ============ BREAKDOWNS API ============
@app.route('/api/breakdowns', methods=['GET'])
def get_breakdowns():
    project_id = request.args.get('project_id')
    if project_id:
        return jsonify([b for b in breakdowns if b['project_id'] == project_id])
    return jsonify(breakdowns)

@app.route('/api/breakdowns', methods=['POST'])
def create_breakdown():
    data = request.json
    breakdown = {
        'id': str(uuid.uuid4()),
        'shot_id': data['shot_id'],
        'asset_id': data['asset_id'],
        'project_id': data['project_id'],
        'nb_occurences': data.get('nb_occurences', 1),
        'description': data.get('description', ''),
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat()
    }
    breakdowns.append(breakdown)
    return jsonify(breakdown), 201

@app.route('/api/breakdowns/<breakdown_id>', methods=['DELETE'])
def delete_breakdown(breakdown_id):
    global breakdowns
    breakdowns = [b for b in breakdowns if b['id'] != breakdown_id]
    return '', 204

# ============ REVIEWS API ============
@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    task_id = request.args.get('task_id')
    if task_id:
        return jsonify([r for r in reviews if r['task_id'] == task_id])
    return jsonify(reviews)

@app.route('/api/reviews', methods=['POST'])
def create_review():
    data = request.json
    review = {
        'id': str(uuid.uuid4()),
        'task_id': data['task_id'],
        'reviewer_id': data['reviewer_id'],
        'status': data['status'],  # approved, changes_requested, pending
        'comment': data.get('comment', ''),
        'annotations': data.get('annotations', []),
        'preview_file': data.get('preview_file', ''),
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat()
    }
    reviews.append(review)
    return jsonify(review), 201

@app.route('/api/reviews/<review_id>', methods=['PUT'])
def update_review(review_id):
    data = request.json
    for review in reviews:
        if review['id'] == review_id:
            review.update(data)
            review['updated_at'] = datetime.now().isoformat()
            return jsonify(review)
    return jsonify({'error': 'Review not found'}), 404

# ============ TIMESHEETS API ============
@app.route('/api/timesheets', methods=['GET'])
def get_timesheets():
    user_id = request.args.get('user_id')
    project_id = request.args.get('project_id')
    date = request.args.get('date')
    
    filtered_timesheets = timesheets
    if user_id:
        filtered_timesheets = [t for t in filtered_timesheets if t['user_id'] == user_id]
    if project_id:
        filtered_timesheets = [t for t in filtered_timesheets if t['project_id'] == project_id]
    if date:
        filtered_timesheets = [t for t in filtered_timesheets if t['date'] == date]
    
    return jsonify(filtered_timesheets)

@app.route('/api/timesheets', methods=['POST'])
def create_timesheet():
    data = request.json
    timesheet = {
        'id': str(uuid.uuid4()),
        'user_id': data['user_id'],
        'task_id': data['task_id'],
        'project_id': data['project_id'],
        'date': data['date'],
        'duration': data['duration'],  # in hours
        'description': data.get('description', ''),
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat()
    }
    timesheets.append(timesheet)
    return jsonify(timesheet), 201

@app.route('/api/timesheets/<timesheet_id>', methods=['PUT'])
def update_timesheet(timesheet_id):
    data = request.json
    for timesheet in timesheets:
        if timesheet['id'] == timesheet_id:
            timesheet.update(data)
            timesheet['updated_at'] = datetime.now().isoformat()
            return jsonify(timesheet)
    return jsonify({'error': 'Timesheet not found'}), 404

@app.route('/api/timesheets/<timesheet_id>', methods=['DELETE'])
def delete_timesheet(timesheet_id):
    global timesheets
    timesheets = [t for t in timesheets if t['id'] != timesheet_id]
    return '', 204

# ============ SCHEDULES API ============
@app.route('/api/schedules', methods=['GET'])
def get_schedules():
    project_id = request.args.get('project_id')
    if project_id:
        return jsonify([s for s in schedules if s['project_id'] == project_id])
    return jsonify(schedules)

@app.route('/api/schedules', methods=['POST'])
def create_schedule():
    data = request.json
    schedule = {
        'id': str(uuid.uuid4()),
        'project_id': data['project_id'],
        'task_id': data.get('task_id'),
        'user_id': data.get('user_id'),
        'start_date': data['start_date'],
        'end_date': data['end_date'],
        'estimated_hours': data.get('estimated_hours', 0),
        'actual_hours': data.get('actual_hours', 0),
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat()
    }
    schedules.append(schedule)
    return jsonify(schedule), 201

@app.route('/api/schedules/<schedule_id>', methods=['PUT'])
def update_schedule(schedule_id):
    data = request.json
    for schedule in schedules:
        if schedule['id'] == schedule_id:
            schedule.update(data)
            schedule['updated_at'] = datetime.now().isoformat()
            return jsonify(schedule)
    return jsonify({'error': 'Schedule not found'}), 404

# ============ MILESTONES API ============
@app.route('/api/milestones', methods=['GET'])
def get_milestones():
    project_id = request.args.get('project_id')
    if project_id:
        return jsonify([m for m in milestones if m['project_id'] == project_id])
    return jsonify(milestones)

@app.route('/api/milestones', methods=['POST'])
def create_milestone():
    data = request.json
    milestone = {
        'id': str(uuid.uuid4()),
        'project_id': data['project_id'],
        'name': data['name'],
        'description': data.get('description', ''),
        'due_date': data['due_date'],
        'status': data.get('status', 'pending'),  # pending, completed, overdue
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat()
    }
    milestones.append(milestone)
    return jsonify(milestone), 201

@app.route('/api/milestones/<milestone_id>', methods=['PUT'])
def update_milestone(milestone_id):
    data = request.json
    for milestone in milestones:
        if milestone['id'] == milestone_id:
            milestone.update(data)
            milestone['updated_at'] = datetime.now().isoformat()
            return jsonify(milestone)
    return jsonify({'error': 'Milestone not found'}), 404

# ============ NOTIFICATIONS API ============
@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    user_id = request.args.get('user_id')
    if user_id:
        return jsonify([n for n in notifications if n['user_id'] == user_id])
    return jsonify(notifications)

@app.route('/api/notifications', methods=['POST'])
def create_notification():
    data = request.json
    notification = {
        'id': str(uuid.uuid4()),
        'user_id': data['user_id'],
        'type': data['type'],  # task_assigned, review_requested, deadline_approaching, etc.
        'title': data['title'],
        'message': data['message'],
        'read': False,
        'created_at': datetime.now().isoformat()
    }
    notifications.append(notification)
    return jsonify(notification), 201

@app.route('/api/notifications/<notification_id>/read', methods=['PUT'])
def mark_notification_read(notification_id):
    for notification in notifications:
        if notification['id'] == notification_id:
            notification['read'] = True
            return jsonify(notification)
    return jsonify({'error': 'Notification not found'}), 404

# ============ PLAYLISTS API ============
@app.route('/api/playlists', methods=['GET', 'POST'])
def handle_playlists():
    if request.method == 'GET':
        project_id = request.args.get('project_id')
        if project_id:
            filtered_playlists = [p for p in playlists if p['project_id'] == project_id]
            return jsonify(filtered_playlists)
        return jsonify(playlists)
    
    elif request.method == 'POST':
        data = request.get_json()
        playlist = {
            'id': str(uuid.uuid4()),
            'name': data.get('name'),
            'description': data.get('description', ''),
            'project_id': data.get('project_id'),
            'for_client': data.get('for_client', False),
            'is_for_entity': data.get('is_for_entity', False),
            'playlist_type': data.get('playlist_type', 'shot'),
            'shots': [],
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        playlists.append(playlist)
        return jsonify(playlist), 201

@app.route('/api/playlists/<playlist_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_playlist(playlist_id):
    playlist = next((p for p in playlists if p['id'] == playlist_id), None)
    
    if not playlist:
        return jsonify({'error': 'Playlist not found'}), 404
    
    if request.method == 'GET':
        return jsonify(playlist)
    
    elif request.method == 'PUT':
        data = request.get_json()
        playlist.update({
            'name': data.get('name', playlist['name']),
            'description': data.get('description', playlist['description']),
            'for_client': data.get('for_client', playlist['for_client']),
            'updated_at': datetime.now().isoformat()
        })
        return jsonify(playlist)
    
    elif request.method == 'DELETE':
        playlists.remove(playlist)
        return '', 204

# ============ ANNOTATIONS API ============
@app.route('/api/annotations', methods=['GET', 'POST'])
def handle_annotations():
    if request.method == 'GET':
        playlist_id = request.args.get('playlist_id')
        if playlist_id:
            filtered_annotations = [a for a in annotations if a['playlist_id'] == playlist_id]
            return jsonify(filtered_annotations)
        return jsonify(annotations)
    
    elif request.method == 'POST':
        data = request.get_json()
        annotation = {
            'id': str(uuid.uuid4()),
            'playlist_id': data.get('playlist_id'),
            'user_id': data.get('user_id'),
            'frame': data.get('frame', 0),
            'annotation_type': data.get('annotation_type', 'note'),
            'text': data.get('text', ''),
            'x': data.get('x', 0),
            'y': data.get('y', 0),
            'color': data.get('color', '#ff0000'),
            'drawing_data': data.get('drawing_data'),
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        annotations.append(annotation)
        return jsonify(annotation), 201

@app.route('/api/annotations/<annotation_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_annotation(annotation_id):
    annotation = next((a for a in annotations if a['id'] == annotation_id), None)
    
    if not annotation:
        return jsonify({'error': 'Annotation not found'}), 404
    
    if request.method == 'GET':
        return jsonify(annotation)
    
    elif request.method == 'PUT':
        data = request.get_json()
        annotation.update({
            'text': data.get('text', annotation['text']),
            'x': data.get('x', annotation['x']),
            'y': data.get('y', annotation['y']),
            'color': data.get('color', annotation['color']),
            'updated_at': datetime.now().isoformat()
        })
        return jsonify(annotation)
    
    elif request.method == 'DELETE':
        annotations.remove(annotation)
        return '', 204

# ============ DEPARTMENTS API ============
@app.route('/api/departments', methods=['GET', 'POST'])
def handle_departments():
    if request.method == 'GET':
        return jsonify(departments)
    
    elif request.method == 'POST':
        data = request.get_json()
        department = {
            'id': str(uuid.uuid4()),
            'name': data.get('name'),
            'color': data.get('color', '#3498DB'),
            'created_at': datetime.now().isoformat()
        }
        departments.append(department)
        return jsonify(department), 201

# ============ TASK TYPES API ============
@app.route('/api/task-types', methods=['GET', 'POST'])
def handle_task_types():
    if request.method == 'GET':
        return jsonify(task_types)
    
    elif request.method == 'POST':
        data = request.get_json()
        task_type = {
            'id': str(uuid.uuid4()),
            'name': data.get('name'),
            'short_name': data.get('short_name', data.get('name', '').lower()[:4]),
            'color': data.get('color', '#3498DB'),
            'created_at': datetime.now().isoformat()
        }
        task_types.append(task_type)
        return jsonify(task_type), 201

# ============ TASK STATUSES API ============
@app.route('/api/task-statuses', methods=['GET', 'POST'])
def handle_task_statuses():
    if request.method == 'GET':
        return jsonify(task_statuses)
    
    elif request.method == 'POST':
        data = request.get_json()
        task_status = {
            'id': str(uuid.uuid4()),
            'name': data.get('name'),
            'short_name': data.get('short_name', data.get('name', '').lower()[:4]),
            'color': data.get('color', '#3498DB'),
            'is_done': data.get('is_done', False),
            'created_at': datetime.now().isoformat()
        }
        task_statuses.append(task_status)
        return jsonify(task_status), 201

# ============ CONCEPTS API ============
@app.route('/api/concepts', methods=['GET', 'POST'])
def handle_concepts():
    if request.method == 'GET':
        project_id = request.args.get('project_id')
        if project_id:
            filtered_concepts = [c for c in concepts if c['project_id'] == project_id]
            return jsonify(filtered_concepts)
        return jsonify(concepts)
    
    elif request.method == 'POST':
        data = request.get_json()
        concept = {
            'id': str(uuid.uuid4()),
            'name': data.get('name'),
            'description': data.get('description', ''),
            'project_id': data.get('project_id'),
            'entity_type': data.get('entity_type', 'asset'),
            'entity_id': data.get('entity_id'),
            'preview_file_id': data.get('preview_file_id'),
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        concepts.append(concept)
        return jsonify(concept), 201

@app.route('/api/concepts/<concept_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_concept(concept_id):
    concept = next((c for c in concepts if c['id'] == concept_id), None)
    
    if not concept:
        return jsonify({'error': 'Concept not found'}), 404
    
    if request.method == 'GET':
        return jsonify(concept)
    
    elif request.method == 'PUT':
        data = request.get_json()
        concept.update({
            'name': data.get('name', concept['name']),
            'description': data.get('description', concept['description']),
            'updated_at': datetime.now().isoformat()
        })
        return jsonify(concept)
    
    elif request.method == 'DELETE':
        concepts.remove(concept)
        return '', 204

# ============ STATISTICS API ============
@app.route('/api/statistics/project/<project_id>', methods=['GET'])
def get_project_statistics(project_id):
    project_tasks = [t for t in tasks if t['project_id'] == project_id]
    project_timesheets = [t for t in timesheets if t['project_id'] == project_id]
    
    total_tasks = len(project_tasks)
    completed_tasks = len([t for t in project_tasks if t['status'] == 'done'])
    in_progress_tasks = len([t for t in project_tasks if t['status'] == 'wip'])
    pending_tasks = len([t for t in project_tasks if t['status'] == 'todo'])
    
    total_hours = sum(float(t['duration']) for t in project_timesheets)
    
    stats = {
        'project_id': project_id,
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'in_progress_tasks': in_progress_tasks,
        'pending_tasks': pending_tasks,
        'completion_percentage': (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
        'total_hours_logged': total_hours,
        'generated_at': datetime.now().isoformat()
    }
    
    return jsonify(stats)

@app.route('/api/statistics/user/<user_id>', methods=['GET'])
def get_user_statistics(user_id):
    user_tasks = [t for t in tasks if t['assignee_id'] == user_id]
    user_timesheets = [t for t in timesheets if t['user_id'] == user_id]
    
    total_tasks = len(user_tasks)
    completed_tasks = len([t for t in user_tasks if t['status'] == 'done'])
    total_hours = sum(float(t['duration']) for t in user_timesheets)
    
    stats = {
        'user_id': user_id,
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'completion_percentage': (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
        'total_hours_logged': total_hours,
        'generated_at': datetime.now().isoformat()
    }
    
    return jsonify(stats)

@app.route('/api/statistics/studio', methods=['GET'])
def get_studio_statistics():
    total_projects = len(projects)
    active_projects = len([p for p in projects if p['status'] == 'active'])
    total_users = len(users)
    total_tasks = len(tasks)
    total_hours = sum(float(t['duration']) for t in timesheets)
    
    stats = {
        'total_projects': total_projects,
        'active_projects': active_projects,
        'total_users': total_users,
        'total_tasks': total_tasks,
        'total_hours_logged': total_hours,
        'generated_at': datetime.now().isoformat()
    }
    
    return jsonify(stats)

if __name__ == '__main__':
    app.run(debug=True)