from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from . import crud, schemas, database

# Create router for organization structure
org_router = APIRouter(prefix="/api/organization", tags=["organization"])

# Department routes
@org_router.get("/departments/", response_model=List[schemas.Department])
def read_departments(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    departments = crud.get_departments(db, skip=skip, limit=limit)
    return departments

@org_router.post("/departments/", response_model=schemas.Department)
def create_department(department: schemas.DepartmentCreate, db: Session = Depends(database.get_db)):
    return crud.create_department(db=db, department=department)

@org_router.get("/departments/{department_id}", response_model=schemas.DepartmentWithRoles)
def read_department(department_id: int, db: Session = Depends(database.get_db)):
    db_department = crud.get_department(db, department_id=department_id)
    if db_department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    return db_department

@org_router.put("/departments/{department_id}", response_model=schemas.Department)
def update_department(department_id: int, department: schemas.DepartmentCreate, db: Session = Depends(database.get_db)):
    db_department = crud.update_department(db, department_id=department_id, department=department)
    if db_department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    return db_department

@org_router.delete("/departments/{department_id}", response_model=schemas.Department)
def delete_department(department_id: int, db: Session = Depends(database.get_db)):
    db_department = crud.delete_department(db, department_id=department_id)
    if db_department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    return db_department

# Role routes
@org_router.get("/roles/", response_model=List[schemas.Role])
def read_roles(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    roles = crud.get_roles(db, skip=skip, limit=limit)
    return roles

@org_router.get("/departments/{department_id}/roles/", response_model=List[schemas.Role])
def read_roles_by_department(department_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    roles = crud.get_roles_by_department(db, department_id=department_id, skip=skip, limit=limit)
    return roles

@org_router.post("/roles/", response_model=schemas.Role)
def create_role(role: schemas.RoleCreate, db: Session = Depends(database.get_db)):
    return crud.create_role(db=db, role=role)

@org_router.get("/roles/{role_id}", response_model=schemas.RoleWithFunctions)
def read_role(role_id: int, db: Session = Depends(database.get_db)):
    db_role = crud.get_role(db, role_id=role_id)
    if db_role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    return db_role

@org_router.put("/roles/{role_id}", response_model=schemas.Role)
def update_role(role_id: int, role: schemas.RoleCreate, db: Session = Depends(database.get_db)):
    db_role = crud.update_role(db, role_id=role_id, role=role)
    if db_role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    return db_role

@org_router.delete("/roles/{role_id}", response_model=schemas.Role)
def delete_role(role_id: int, db: Session = Depends(database.get_db)):
    db_role = crud.delete_role(db, role_id=role_id)
    if db_role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    return db_role

# Function routes
@org_router.get("/functions/", response_model=List[schemas.Function])
def read_functions(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    functions = crud.get_functions(db, skip=skip, limit=limit)
    return functions

@org_router.get("/roles/{role_id}/functions/", response_model=List[schemas.Function])
def read_functions_by_role(role_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    functions = crud.get_functions_by_role(db, role_id=role_id, skip=skip, limit=limit)
    return functions

@org_router.post("/functions/", response_model=schemas.Function)
def create_function(function: schemas.FunctionCreate, db: Session = Depends(database.get_db)):
    return crud.create_function(db=db, function=function)

@org_router.get("/functions/{function_id}", response_model=schemas.Function)
def read_function(function_id: int, db: Session = Depends(database.get_db)):
    db_function = crud.get_function(db, function_id=function_id)
    if db_function is None:
        raise HTTPException(status_code=404, detail="Function not found")
    return db_function

@org_router.put("/functions/{function_id}", response_model=schemas.Function)
def update_function(function_id: int, function: schemas.FunctionCreate, db: Session = Depends(database.get_db)):
    db_function = crud.update_function(db, function_id=function_id, function=function)
    if db_function is None:
        raise HTTPException(status_code=404, detail="Function not found")
    return db_function

@org_router.delete("/functions/{function_id}", response_model=schemas.Function)
def delete_function(function_id: int, db: Session = Depends(database.get_db)):
    db_function = crud.delete_function(db, function_id=function_id)
    if db_function is None:
        raise HTTPException(status_code=404, detail="Function not found")
    return db_function 