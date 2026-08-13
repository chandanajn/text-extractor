from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from database.session import get_db
from models.ocr import OCRRecord
from models.user import User
from routers.deps import get_current_active_admin, get_current_active_user

router = APIRouter()


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)
):
    # Personal stats
    total_uploads = (
        db.query(OCRRecord).filter(OCRRecord.user_id == current_user.id).count()
    )

    # Today's uploads
    today = func.current_date()
    today_uploads = (
        db.query(OCRRecord)
        .filter(
            OCRRecord.user_id == current_user.id,
            func.date(OCRRecord.created_at) == today,
        )
        .count()
    )

    # Average confidence
    avg_conf_result = (
        db.query(func.avg(OCRRecord.confidence))
        .filter(OCRRecord.user_id == current_user.id)
        .scalar()
    )
    avg_confidence = float(avg_conf_result) if avg_conf_result else 0.0

    # Successful OCRs (confidence > 50)
    successful_ocr = (
        db.query(OCRRecord)
        .filter(OCRRecord.user_id == current_user.id, OCRRecord.confidence > 50)
        .count()
    )

    # Language distribution
    lang_dist = (
        db.query(OCRRecord.language, func.count(OCRRecord.id))
        .filter(OCRRecord.user_id == current_user.id)
        .group_by(OCRRecord.language)
        .all()
    )

    return {
        "total_uploads": total_uploads,
        "today_uploads": today_uploads,
        "average_confidence": avg_confidence,
        "successful_ocr": successful_ocr,
        "failed_ocr": total_uploads - successful_ocr,
        "language_distribution": [
            {"language": lang, "count": count} for lang, count in lang_dist
        ],
    }


@router.get("/admin/stats")
def get_admin_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin),
):
    total_users = db.query(User).count()
    total_uploads = db.query(OCRRecord).count()
    avg_conf_result = db.query(func.avg(OCRRecord.confidence)).scalar()
    avg_confidence = float(avg_conf_result) if avg_conf_result else 0.0

    return {
        "total_users": total_users,
        "total_uploads": total_uploads,
        "average_system_confidence": avg_confidence,
    }
