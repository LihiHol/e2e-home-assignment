from fastapi import APIRouter, HTTPException
from datetime import datetime
from bson import ObjectId
from app.db.mongo import items
from app.schemas.items import ItemIn, ItemOut
from app.utils.pagination import parse_pagination
from pymongo.errors import DuplicateKeyError

router = APIRouter(prefix="/items", tags=["items"])

def to_out(doc) -> ItemOut:
    return ItemOut(
        id=str(doc["_id"]),
        name=doc["name"],
        description=doc.get("description",""),
        price=float(doc.get("price",0)),
        created_at=doc["created_at"],
    )


@router.post("/", response_model=ItemOut, status_code=201)
def create_item(payload: ItemIn):
    doc = payload.model_dump()
    doc["created_at"] = datetime.utcnow()
    try:
        res = items.insert_one(doc)
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Item with this name already exists.")
    created = items.find_one({"_id": res.inserted_id})
    return to_out(created)


@router.get("/", response_model=list[ItemOut])
def list_items(q: str | None = None, page: int = 1, limit: int = 10):
    limit, skip = parse_pagination(limit, page)
    query = {}
    if q:
        query = {"$or": [
          {"name": {"$regex": q, "$options": "i"}},
          {"description": {"$regex": q, "$options": "i"}}
        ]}
    cursor = items.find(query).sort("created_at", -1).skip(skip).limit(limit)
    return [to_out(d) for d in cursor]
