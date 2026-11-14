from pydantic import BaseModel, Field
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: str
    role: str
    profile_info: Optional[str] = None

class UserInDB(UserCreate):
    id: str = Field(..., alias="_id")