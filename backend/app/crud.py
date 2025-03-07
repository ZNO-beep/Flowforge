from sqlalchemy.orm import Session

from . import models, schemas

def get_task(db: Session, task_id: int):
    return db.query(models.Task).filter(models.Task.id == task_id).first()

def get_tasks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Task).offset(skip).limit(limit).all()

def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task: schemas.TaskCreate):
    db_task = get_task(db, task_id)
    if db_task:
        for key, value in task.dict().items():
            setattr(db_task, key, value)
        db.commit()
        db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int):
    db_task = get_task(db, task_id)
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task

def get_department(db: Session, department_id: int):
    return db.query(models.Department).filter(models.Department.id == department_id).first()

def get_departments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Department).offset(skip).limit(limit).all()

def create_department(db: Session, department: schemas.DepartmentCreate):
    db_department = models.Department(**department.dict())
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department

def update_department(db: Session, department_id: int, department: schemas.DepartmentCreate):
    db_department = get_department(db, department_id)
    if db_department:
        for key, value in department.dict().items():
            setattr(db_department, key, value)
        db.commit()
        db.refresh(db_department)
    return db_department

def delete_department(db: Session, department_id: int):
    db_department = get_department(db, department_id)
    if db_department:
        db.delete(db_department)
        db.commit()
    return db_department

def get_role(db: Session, role_id: int):
    return db.query(models.Role).filter(models.Role.id == role_id).first()

def get_roles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Role).offset(skip).limit(limit).all()

def get_roles_by_department(db: Session, department_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Role).filter(models.Role.department_id == department_id).offset(skip).limit(limit).all()

def create_role(db: Session, role: schemas.RoleCreate):
    db_role = models.Role(**role.dict())
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

def update_role(db: Session, role_id: int, role: schemas.RoleCreate):
    db_role = get_role(db, role_id)
    if db_role:
        for key, value in role.dict().items():
            setattr(db_role, key, value)
        db.commit()
        db.refresh(db_role)
    return db_role

def delete_role(db: Session, role_id: int):
    db_role = get_role(db, role_id)
    if db_role:
        db.delete(db_role)
        db.commit()
    return db_role

def get_function(db: Session, function_id: int):
    return db.query(models.Function).filter(models.Function.id == function_id).first()

def get_functions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Function).offset(skip).limit(limit).all()

def get_functions_by_role(db: Session, role_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Function).filter(models.Function.role_id == role_id).offset(skip).limit(limit).all()

def create_function(db: Session, function: schemas.FunctionCreate):
    db_function = models.Function(**function.dict())
    db.add(db_function)
    db.commit()
    db.refresh(db_function)
    return db_function

def update_function(db: Session, function_id: int, function: schemas.FunctionCreate):
    db_function = get_function(db, function_id)
    if db_function:
        for key, value in function.dict().items():
            setattr(db_function, key, value)
        db.commit()
        db.refresh(db_function)
    return db_function

def delete_function(db: Session, function_id: int):
    db_function = get_function(db, function_id)
    if db_function:
        db.delete(db_function)
        db.commit()
    return db_function 