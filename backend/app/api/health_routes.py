from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.symptom_analyzer.advisor_service import symptom_advisor
from app.ocr_module.ocr_service import ocr_manager
from app.models import models
from app.auth.deps import get_optional_user
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()


class SymptomQuery(BaseModel):
    query: str


@router.post("/analyze-symptoms")
async def analyze_symptoms(
    data: SymptomQuery, 
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_optional_user)
):
    user_id = current_user.id if current_user else 1
    result = await symptom_advisor.get_guidance(data.query)

    new_check = models.SymptomCheck(user_id=user_id, query=data.query, analysis=result["analysis"])
    db.add(new_check)
    db.commit()

    return result


@router.post("/upload-prescription")
async def upload_prescription(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_optional_user)
):
    user_id = current_user.id if current_user else 1
    try:
        contents = await file.read()
        text = ocr_manager.extract_text(contents)
        analysis = await ocr_manager.analyze_with_ai(text)

        new_prescription = models.Prescription(
            user_id=user_id,
            image_url="placeholder_url",
            extracted_text=text,
            identified_medicines=analysis,
        )
        db.add(new_prescription)
        db.commit()

        return {"text": text, "analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history")
def get_user_history(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_optional_user)
):
    """
    Returns paginated health history for the current user or guest (user_id=1).
    Response shape: { items: [...], total: N }
    """
    user_id = current_user.id if current_user else 1
    offset = (page - 1) * limit

    history_items = []

    symptoms = db.query(models.SymptomCheck).filter(
        models.SymptomCheck.user_id == user_id,
        models.SymptomCheck.is_deleted == False,
    ).all()

    prescriptions = db.query(models.Prescription).filter(
        models.Prescription.user_id == user_id,
        models.Prescription.is_deleted == False,
    ).all()

    for s in symptoms:
        is_emergency = any(
            k in (s.query or "").lower() or k in (s.analysis or "").lower()
            for k in ["emergency", "chest pain", "attention", "doctor", "serious"]
        )
        history_items.append({
            "id": f"sym_{s.id}",
            "created_at": s.created_at.isoformat() if s.created_at else None,
            "message_preview": s.query[:60] if s.query else "Symptom Analysis",
            "response_preview": (s.analysis or "")[:120],
            "is_emergency": is_emergency,
            "type": "symptom",
        })

    for p in prescriptions:
        history_items.append({
            "id": f"rx_{p.id}",
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "message_preview": "Prescription Upload",
            "response_preview": (p.identified_medicines or "")[:120],
            "is_emergency": False,
            "type": "prescription",
        })

    # Sort newest first
    history_items.sort(key=lambda x: x["created_at"] or "", reverse=True)
    total = len(history_items)
    paginated = history_items[offset: offset + limit]

    return {"items": paginated, "total": total}
