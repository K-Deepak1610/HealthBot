from pydantic import BaseModel, Field
from typing import List

class SymptomAssessmentRequest(BaseModel):
    symptoms: List[str] = Field(..., min_length=1, max_length=10)
    duration_days: int = Field(default=1, ge=0)
    severity: int = Field(default=5, ge=1, le=10, description="1 to 10 scale of severity")
    age: int = Field(..., ge=0, le=120)
    gender: str = Field(..., pattern="^(male|female|other)$")

class ConditionProbability(BaseModel):
    condition: str
    probability_score: float = Field(..., ge=0, le=1)
    description: str

class SymptomAssessmentResponse(BaseModel):
    id: str
    possible_conditions: List[ConditionProbability]
    recommendation: str
    requires_emergency: bool = False

    class Config:
        json_schema_extra = {
            "example": {
                "id": "sym-999",
                "possible_conditions": [
                    {
                        "condition": "Common Cold",
                        "probability_score": 0.85,
                        "description": "A viral infection of your nose and throat."
                    }
                ],
                "recommendation": "Rest, drink fluids, and monitor for fever.",
                "requires_emergency": False
            }
        }
