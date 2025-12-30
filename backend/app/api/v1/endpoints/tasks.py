from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.db.session import get_db
from app.models.task import Task
from app.models.user import User
from app.schemas import TaskCreate, TaskOut
from app.api.deps import get_current_user, get_current_active_admin

router = APIRouter()

@router.post("/", response_model=TaskOut)
async def create_task(
    task_in: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_task = Task(
        title=task_in.title,
        description=task_in.description,
        owner_id=current_user.id
    )
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    return db_task

@router.get("/", response_model=List[TaskOut])
async def read_tasks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Admins can see all tasks, users only their own
    if current_user.role == "admin":
        result = await db.execute(select(Task))
    else:
        result = await db.execute(select(Task).where(Task.owner_id == current_user.id))
    return result.scalars().all()

@router.put("/{id}", response_model=TaskOut)
async def update_task(
    id: int,
    task_in: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Task).where(Task.id == id))
    db_task = result.scalars().first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Check ownership
    if db_task.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db_task.title = task_in.title
    db_task.description = task_in.description
    await db.commit()
    await db.refresh(db_task)
    return db_task

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_admin), # Admin only delete as per requirement
):
    result = await db.execute(select(Task).where(Task.id == id))
    db_task = result.scalars().first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    await db.delete(db_task)
    await db.commit()
    return None
