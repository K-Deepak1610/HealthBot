from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import models
from app.medicine_database.db_service import medicine_db_manager
from typing import List

router = APIRouter()


@router.get("/medicines/{name}")
def get_medicine(name: str, db: Session = Depends(get_db)):
    """
    Look up a medicine by name. Checks local DB first, then queries OpenFDA.
    Returns a plain dict compatible with the frontend MedicineInfo interface.
    """
    # Try local database first (case-insensitive)
    medicine = db.query(models.MedicineInfo).filter(
        models.MedicineInfo.name.ilike(f"%{name}%")
    ).first()

    if medicine:
        return {
            "name": medicine.name,
            "purpose": medicine.purpose or "Information not available",
            "dosage": medicine.dosage or "Refer to doctor or pharmacist.",
            "side_effects": medicine.side_effects or "Consult medical literature.",
            "warnings": medicine.warnings or "Standard precautions apply.",
        }

    # Query OpenFDA API
    fda_info = medicine_db_manager.search_medicine(name)
    if fda_info:
        # 1. First, check if the EXACT name returned by FDA is already in our DB
        # to avoid IntegrityError (name is unique).
        existing_med = db.query(models.MedicineInfo).filter(
            models.MedicineInfo.name == fda_info["name"]
        ).first()

        if not existing_med:
            # Seed to local DB for future cache hits
            try:
                new_med = models.MedicineInfo(
                    name=fda_info["name"],
                    category=fda_info.get("category", ""),
                    purpose=fda_info.get("purpose", ""),
                    dosage=fda_info.get("dosage", ""),
                    side_effects=fda_info.get("side_effects", ""),
                    precautions=fda_info.get("precautions", ""),
                    warnings=fda_info.get("warnings", ""),
                )
                db.add(new_med)
                db.commit()
            except Exception:
                db.rollback()  # Safety net for race conditions

        return {
            "name": fda_info["name"],
            "purpose": fda_info.get("purpose", "Information not available"),
            "dosage": fda_info.get("dosage", "Refer to doctor or pharmacist."),
            "side_effects": fda_info.get("side_effects", "Consult medical literature."),
            "warnings": fda_info.get("warnings", "Standard precautions apply."),
        }

    raise HTTPException(status_code=404, detail=f"Medicine '{name}' not found in our database or FDA records.")


@router.get("/medicines")
def list_medicines(db: Session = Depends(get_db)) -> List[dict]:
    """List all locally cached medicines."""
    medicines = db.query(models.MedicineInfo).all()
    return [
        {
            "name": m.name,
            "purpose": m.purpose or "",
            "dosage": m.dosage or "",
            "side_effects": m.side_effects or "",
            "warnings": m.warnings or "",
        }
        for m in medicines
    ]
