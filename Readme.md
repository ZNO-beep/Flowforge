# Modern Full-Stack Template

A modern full-stack starter template with FastAPI backend and React frontend, featuring Tailwind CSS and ShadcnUI components.

## Stack Features

### Backend (FastAPI)
- FastAPI for high-performance API development
- SQLAlchemy for ORM
- Pydantic for data validation
- Pydantic AI for extracting structured data from unstructerd text
- SQLite database (easily configurable to other databases)
- Alembic for database migrations
- CORS configuration ready
- Modular structure with routes, models, and schemas

### Frontend (React)
- Modern React with hooks
- React Router for navigation
- Tailwind CSS for styling
- ShadcnUI components
- Lucide icons
- Axios for API calls
- ESLint configuration
- Responsive design

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI application
│   │   ├── database.py      # Database configuration
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── crud.py         # Database operations
│   │   └── routers.py      # API routes
│   ├── requirements.txt
│   └── run.py
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/     # React components
    │   │   └── ui/        # ShadcnUI components
    │   ├── pages/         # Page components
    │   ├── api/          # API integration
    │   ├── lib/          # Utilities
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── tailwind.config.js
```

## Getting Started

### Backend Setup
1. Create and activate a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the server:
   ```bash
   python -m uvicorn app.main:app --reload
   ```

The API will be available at http://localhost:8000
- API documentation: http://localhost:8000/docs
- Alternative API docs: http://localhost:8000/redoc

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

The application will be available at http://localhost:3000

## Development Guidelines

### Backend
- Add new routes in `app/routers.py`
- Define data models in `app/models.py`
- Create data schemas in `app/schemas.py`
- Add database operations in `app/crud.py`

### Frontend
- Add new components in `src/components/`
- Add new pages in `src/pages/`
- Configure API endpoints in `src/api/`
- Style components using Tailwind CSS classes
- Use ShadcnUI components from `components/ui/`

## ESLint Configuration
The project includes strict ESLint rules to maintain code quality:
- Maximum function length: 15 lines
- Maximum line length: 100 characters
- Maximum complexity: 5
- Maximum depth: 2
- Maximum nested callbacks: 2

## Customization

### Backend
- Change database in `app/database.py`
- Modify CORS settings in `app/main.py`
- Add new dependencies to `requirements.txt`

### Frontend
- Modify theme in `tailwind.config.js`
- Add new dependencies with `npm install`
- Configure ESLint rules in `package.json`

## License
MIT