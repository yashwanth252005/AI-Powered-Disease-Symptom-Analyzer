from pydantic import BaseModel, EmailStr
from typing import List

class SymptomRequest(BaseModel):
    symptoms: List[str]

class UserSignup(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
