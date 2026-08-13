from datetime import datetime

from pydantic import BaseModel


# Shared properties
class UserBase(BaseModel):
    email: str
    name: str | None = None
    role: str | None = "user"


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str


# Properties to receive via API on update
class UserUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    password: str | None = None


class UserInDBBase(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime | None = None

    model_config = {"from_attributes": True}


# Additional properties to return via API
class User(UserInDBBase):
    pass


# Additional properties stored in DB
class UserInDB(UserInDBBase):
    password: str
