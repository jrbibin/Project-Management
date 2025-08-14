# Git Workflow Guide for Kitsu Project

## Repository Structure

This repository contains the complete Kitsu Project Management System with proper version control setup.

## Current Status
- ✅ Git repository initialized
- ✅ Comprehensive .gitignore file created
- ✅ Initial commit completed
- ✅ All project files tracked

## Basic Git Commands

### Daily Workflow
```bash
# Check current status
git status

# Add changes to staging
git add .
# Or add specific files
git add filename.js

# Commit changes
git commit -m "Descriptive commit message"

# View commit history
git log --oneline
```

### Branching Strategy

#### Feature Development
```bash
# Create and switch to a new feature branch
git checkout -b feature/shot-filtering

# Work on your feature...
# Add and commit changes
git add .
git commit -m "Add shot filtering functionality"

# Switch back to master
git checkout master

# Merge feature branch
git merge feature/shot-filtering

# Delete feature branch (optional)
git branch -d feature/shot-filtering
```

#### Bug Fixes
```bash
# Create a hotfix branch
git checkout -b hotfix/fix-task-assignment

# Fix the bug and commit
git add .
git commit -m "Fix task assignment bug in project dashboard"

# Merge back to master
git checkout master
git merge hotfix/fix-task-assignment
```

## Commit Message Guidelines

### Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples
```bash
git commit -m "feat(shots): add shot details modal with department breakdown"
git commit -m "fix(tasks): resolve task assignment validation issue"
git commit -m "docs: update README with setup instructions"
git commit -m "style(css): improve shot card hover effects"
```

## Best Practices

### 1. Commit Frequently
- Make small, focused commits
- Commit related changes together
- Don't commit broken code

### 2. Write Clear Messages
- Use present tense ("Add feature" not "Added feature")
- Keep first line under 50 characters
- Explain what and why, not how

### 3. Use Branches
- Create branches for new features
- Keep master branch stable
- Test before merging

### 4. Review Before Committing
```bash
# Check what will be committed
git diff --staged

# Check current changes
git diff
```

## Useful Commands

### Viewing Changes
```bash
# Show changes in working directory
git diff

# Show changes in staging area
git diff --staged

# Show commit history with details
git log --graph --oneline --decorate
```

### Undoing Changes
```bash
# Unstage a file
git reset HEAD filename.js

# Discard changes in working directory
git checkout -- filename.js

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### Remote Repository (when ready)
```bash
# Add remote repository
git remote add origin https://github.com/username/kitsu-project.git

# Push to remote
git push -u origin master

# Pull from remote
git pull origin master
```

## Project-Specific Guidelines

### Frontend Changes
- Test in browser before committing
- Check for console errors
- Ensure responsive design works

### Backend Changes
- Test API endpoints
- Verify database operations
- Check error handling

### Documentation
- Update README.md for new features
- Document API changes
- Add code comments for complex logic

## Ignored Files

The following are automatically ignored by Git:
- `node_modules/`
- `build/` and `dist/`
- `.env` files
- Python `__pycache__/`
- IDE files (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`, `Thumbs.db`)
- Log files
- Database files

## Next Steps

1. **Set up remote repository** (GitHub, GitLab, etc.)
2. **Configure CI/CD** for automated testing
3. **Set up branch protection** rules
4. **Add collaborators** and define roles
5. **Create issue templates** for bug reports and features

---

**Remember**: Version control is about collaboration and history. Make meaningful commits that tell the story of your project's development.