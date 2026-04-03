from app.core.database import SessionLocal
from app.models import models

def seed_data():
    db = SessionLocal()
    # Check if data already exists
    if db.query(models.MedicineInfo).first():
        db.close()
        return

    medicines = [
        models.MedicineInfo(
            name="Paracetamol",
            purpose="Pain reliever and fever reducer.",
            dosage="500mg to 1000mg every 4 to 6 hours. Not exceeding 4000mg in 24 hours.",
            side_effects="Rare: allergic reaction, rash, nausea.",
            precautions="Avoid alcohol. Use caution with liver conditions.",
            warnings="Overdose can cause severe liver damage."
        ),
        models.MedicineInfo(
            name="Amoxicillin",
            purpose="Antibiotic used for bacterial infections.",
            dosage="250mg to 500mg three times a day, usually for 7 to 10 days.",
            side_effects="Nausea, vomiting, diarrhea, skin rash.",
            precautions="Complete the full course even if feeling better.",
            warnings="Do not use if allergic to penicillin."
        ),
        models.MedicineInfo(
            name="Metformin",
            purpose="First-line medication for type 2 diabetes.",
            dosage="Usually starts at 500mg once or twice daily with meals.",
            side_effects="Nausea, abdominal pain, diarrhea, metallic taste.",
            precautions="Take with food to minimize stomach upset.",
            warnings="Risk of lactic acidosis in case of severe kidney issues."
        )
    ]
    
    db.add_all(medicines)
    db.commit()
    db.close()
