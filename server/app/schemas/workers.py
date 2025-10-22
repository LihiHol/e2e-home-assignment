from pydantic import BaseModel, Field, AliasChoices
from datetime import datetime
from typing import Optional

# class WorkerIn(BaseModel):
#     workerId: int = Field(..., ge=1)
#     name: str
#     job: str
#     phone: Optional[str] = None
#     address: Optional[str] = None
#     password: Optional[str] = None


class WorkerIn(BaseModel):
    workerId: int = Field(..., ge=1)
    name: str
    job: str
    phone: Optional[str] = None
    address: Optional[str] = Field(
        default=None, validation_alias=AliasChoices("address", "adress"))
    password: Optional[str] = None


class WorkerUpdate(BaseModel):
    name: Optional[str] = None
    job: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    password: Optional[str] = None


class WorkerOut(BaseModel):
    id: str
    workerId: int
    name: str
    job: str
    phone: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

class ChartOut(BaseModel):
    managers_number: int
    technicians_number: int
    clerks_number:int
 