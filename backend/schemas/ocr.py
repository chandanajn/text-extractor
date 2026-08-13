from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class OCRRecordBase(BaseModel):
    filename: str
    language: Optional[str] = "eng"
    confidence: Optional[float] = None
    processing_time: Optional[float] = None
    text: Optional[str] = None

class OCRRecordCreate(OCRRecordBase):
    stored_filename: str
    image_path: str
    user_id: int

class OCRRecord(OCRRecordBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

class PaginatedOCRResponse(BaseModel):
    total: int
    page: int
    limit: int
    data: list[OCRRecord]
