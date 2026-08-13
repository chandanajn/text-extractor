from datetime import datetime

from pydantic import BaseModel


class OCRRecordBase(BaseModel):
    filename: str
    language: str | None = "eng"
    confidence: float | None = None
    processing_time: float | None = None
    text: str | None = None


class OCRRecordCreate(OCRRecordBase):
    stored_filename: str
    image_path: str
    user_id: int


class OCRRecord(OCRRecordBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime | None = None

    model_config = {"from_attributes": True}


class PaginatedOCRResponse(BaseModel):
    total: int
    page: int
    limit: int
    data: list[OCRRecord]
