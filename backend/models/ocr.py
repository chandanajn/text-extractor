from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.sql import func

from database.session import Base


class OCRRecord(Base):
    __tablename__ = "ocr_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    filename = Column(String, index=True)
    stored_filename = Column(String)
    image_path = Column(String)
    language = Column(String)
    confidence = Column(Float)
    processing_time = Column(Float)
    text = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
