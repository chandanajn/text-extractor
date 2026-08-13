from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.session import get_db
from models.user import User
from routers.deps import get_current_active_admin, get_current_active_user
from schemas.user import User as UserSchema
from schemas.user import UserUpdate
from security.password import get_password_hash

router = APIRouter()


@router.get("/me", response_model=UserSchema)
def read_user_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@router.put("/profile", response_model=UserSchema)
def update_user_me(
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    if user_in.email is not None and user_in.email != current_user.email:
        user = db.query(User).filter(User.email == user_in.email).first()
        if user:
            raise HTTPException(
                status_code=400,
                detail="The user with this email already exists in the system.",
            )
        current_user.email = user_in.email  # type: ignore
    if user_in.name is not None:
        current_user.name = user_in.name  # type: ignore
    if user_in.password is not None:
        current_user.password = get_password_hash(user_in.password)  # type: ignore

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.delete("/account", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    db.delete(current_user)
    db.commit()


@router.get("/", response_model=list[UserSchema])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
):
    users = db.query(User).offset(skip).limit(limit).all()
    return users
