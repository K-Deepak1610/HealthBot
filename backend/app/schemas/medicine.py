from pydantic import BaseModel, Field
from typing import Optional, List

class MedicineSearchRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=100)
    category: Optional[str] = Field(None, max_length=50)
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=10, ge=1, le=50)

class MedicineResponse(BaseModel):
    id: str
    name: str = Field(...)
    generic_name: Optional[str] = None
    category: Optional[str] = None
    side_effects: List[str] = Field(default_factory=list)
    uses: List[str] = Field(default_factory=list)
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "med-001",
                "name": "Ibuprofen",
                "generic_name": "Ibuprofen",
                "category": "NSAID",
                "side_effects": ["Nausea", "Stomach pain"],
                "uses": ["Pain relief", "Fever reduction"]
            }
        }

class MedicineListResponse(BaseModel):
    total: int
    page: int
    limit: int
    items: List[MedicineResponse]
