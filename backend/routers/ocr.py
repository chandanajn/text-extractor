import os
import uuid

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    UploadFile,
    status,
)
from fastapi.responses import StreamingResponse
from sqlalchemy import asc, desc, or_
from sqlalchemy.orm import Session

from database.session import get_db
from models.ocr import OCRRecord
from models.user import User
from ocr.engine import process_ocr
from pdf.generator import generate_ocr_pdf
from routers.deps import get_current_active_user
from schemas.ocr import OCRRecord as OCRRecordSchema
from schemas.ocr import PaginatedOCRResponse

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post(
    "/upload", response_model=OCRRecordSchema, status_code=status.HTTP_201_CREATED
)
async def upload_image(
    file: UploadFile = File(...),
    language: str = Form("eng"),
    mode: str = Form("auto"),
    apply_preprocessing: bool = Form(True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    if file.content_type not in [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/bmp",
        "image/tiff",
    ]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file type."
        )

    try:
        contents = await file.read()
    except Exception:  # nosec B110
        raise HTTPException(status_code=500, detail="Error reading file")

    # Process with OCR
    ocr_result = process_ocr(contents, language, mode, apply_preprocessing)

    # Save the file to disk
    ext = os.path.splitext(file.filename)[1]  # type: ignore
    stored_filename = f"{uuid.uuid4()}{ext}"
    image_path = os.path.join(UPLOAD_DIR, stored_filename)

    with open(image_path, "wb") as f:
        f.write(contents)

    # Save to database
    db_record = OCRRecord(
        user_id=current_user.id,
        filename=file.filename,
        stored_filename=stored_filename,
        image_path=image_path,
        language=language,
        confidence=ocr_result["confidence"],
        processing_time=ocr_result["processing_time"],
        text=ocr_result["text"] or "[No text extracted]",
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)

    return db_record


@router.get("/history", response_model=PaginatedOCRResponse)
def get_ocr_history(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    sort: str = Query("latest"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    skip = (page - 1) * limit

    query = db.query(OCRRecord).filter(OCRRecord.user_id == current_user.id)

    if sort == "latest":
        query = query.order_by(desc(OCRRecord.created_at))
    elif sort == "oldest":
        query = query.order_by(asc(OCRRecord.created_at))
    elif sort == "highest_confidence":
        query = query.order_by(desc(OCRRecord.confidence))
    elif sort == "lowest_confidence":
        query = query.order_by(asc(OCRRecord.confidence))

    total = query.count()
    records = query.offset(skip).limit(limit).all()

    return {"total": total, "page": page, "limit": limit, "data": records}


@router.get("/search", response_model=PaginatedOCRResponse)
def search_ocr(
    q: str | None = Query(None),
    language: str | None = Query(None),
    from_date: str | None = Query(None),
    to_date: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    skip = (page - 1) * limit

    query = db.query(OCRRecord).filter(OCRRecord.user_id == current_user.id)

    if q:
        search_filter = or_(
            OCRRecord.filename.ilike(f"%{q}%"), OCRRecord.text.ilike(f"%{q}%")
        )
        query = query.filter(search_filter)

    if language:
        query = query.filter(OCRRecord.language == language)

    if from_date:
        query = query.filter(OCRRecord.created_at >= from_date)
    if to_date:
        query = query.filter(OCRRecord.created_at <= to_date)

    query = query.order_by(desc(OCRRecord.created_at))

    total = query.count()
    records = query.offset(skip).limit(limit).all()

    return {"total": total, "page": page, "limit": limit, "data": records}


@router.get("/{id}", response_model=OCRRecordSchema)
def get_ocr_record(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    record = (
        db.query(OCRRecord)
        .filter(OCRRecord.id == id, OCRRecord.user_id == current_user.id)
        .first()
    )
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record


@router.get("/{id}/pdf")
def get_ocr_pdf(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    record = (
        db.query(OCRRecord)
        .filter(OCRRecord.id == id, OCRRecord.user_id == current_user.id)
        .first()
    )
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    pdf_buffer = generate_ocr_pdf(record)

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=ocr_result_{id}.pdf"},
    )


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ocr_record(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    record = (
        db.query(OCRRecord)
        .filter(OCRRecord.id == id, OCRRecord.user_id == current_user.id)
        .first()
    )
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    # Optionally delete file from disk
    try:
        if os.path.exists(record.image_path):
            os.remove(record.image_path)
    except Exception:  # nosec B110
        pass

    db.delete(record)
    db.commit()


@router.delete("/history/clear", status_code=status.HTTP_204_NO_CONTENT)
def clear_ocr_history(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)
):
    records = db.query(OCRRecord).filter(OCRRecord.user_id == current_user.id).all()

    for record in records:
        try:
            if os.path.exists(record.image_path):
                os.remove(record.image_path)
        except Exception:  # nosec B110
            pass
        db.delete(record)

    db.commit()
