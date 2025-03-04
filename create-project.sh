#!/bin/bash

# Check if project name is provided
if [ -z "$1" ]; then
    echo "Please provide a project name"
    echo "Usage: ./create-project.sh <project-name>"
    exit 1
fi

PROJECT_NAME=$1
TEMPLATE_DIR="$HOME/Documents/templates/fastapi-react-template"

# Create project directory
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Copy template files
cp -r "$TEMPLATE_DIR"/* .
cp "$TEMPLATE_DIR"/.gitignore .

# Initialize git repository
git init

# Create virtual environment for backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..

# Update project name in package.json
sed -i '' "s/flowforge-frontend/$PROJECT_NAME/g" frontend/package.json

echo "Project $PROJECT_NAME created successfully!"
echo "To start development:"
echo "1. Backend: cd backend && source venv/bin/activate && python -m uvicorn app.main:app --reload"
echo "2. Frontend: cd frontend && npm start" 