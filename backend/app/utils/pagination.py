from typing import TypeVar, Generic, List, Type
from pydantic import BaseModel, Field
from sqlalchemy.orm import Query

T = TypeVar("T")

class PageSchema(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    limit: int
    pages: int

def paginate(query: Query, page: int, limit: int) -> dict:
    """
    Paginate a SQLAlchemy query.
    Returns a dict compatible with PageSchema.
    """
    total = query.count()
    pages = (total + limit - 1) // limit if limit > 0 else 0
    
    items = query.offset((page - 1) * limit).limit(limit).all()
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages
    }
