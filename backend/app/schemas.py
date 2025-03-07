from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# Department schemas
class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class Department(DepartmentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class DepartmentWithRoles(Department):
    roles: List["Role"] = []

# Role schemas
class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None
    department_id: int

class RoleCreate(RoleBase):
    pass

class Role(RoleBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class RoleWithFunctions(Role):
    functions: List["Function"] = []

# Function schemas
class FunctionBase(BaseModel):
    name: str
    description: Optional[str] = None
    role_id: int

class FunctionCreate(FunctionBase):
    pass

class Function(FunctionBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# Update forward references
DepartmentWithRoles.update_forward_refs()
RoleWithFunctions.update_forward_refs() 