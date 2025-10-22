# app/db/repositories/workers_repository.py
from typing import Any, Dict, Iterable, Optional, List
from bson import ObjectId
from pymongo.collection import Collection
from pymongo.errors import DuplicateKeyError

from app.db.mongo import workers


class WorkersRepository:
    """
    Repository layer for MongoDB workers collection.
    Handles all CRUD operations directly on the database.
    """

    def __init__(self, collection: Collection = workers) -> None:
        self.collection = collection

    # ----------------- CRUD OPERATIONS ----------------- #

    def list(self, query: Dict[str, Any], skip: int, limit: int) -> Iterable[Dict[str, Any]]:
        return self.collection.find(query).sort("created_at", -1).skip(skip).limit(limit)

    def get(self, _id: ObjectId) -> Optional[Dict[str, Any]]:
        return self.collection.find_one({"_id": _id})

    def insert(self, doc: Dict[str, Any]) -> ObjectId:
        result = self.collection.insert_one(doc)
        return result.inserted_id

    def replace(self, _id: ObjectId, doc: Dict[str, Any]) -> int:
        res = self.collection.replace_one({"_id": _id}, {**doc, "_id": _id})
        return res.matched_count

    def update(self, _id: ObjectId, partial: Dict[str, Any]) -> int:
        res = self.collection.update_one({"_id": _id}, {"$set": partial})
        return res.matched_count

    def delete(self, _id: ObjectId) -> int:
        res = self.collection.delete_one({"_id": _id})
        return res.deleted_count

    # ----------------- Aggregations ----------------- #

    def jobs_counts_by_job(self) -> Dict[str, int]:
        """
        Aggregate counts by 'job' field.
        Returns dict like: {'manager': 3, 'technician': 5, 'clerk': 2, 'other': 1}
        """
        pipeline = [
            {
                "$group": {
                    "_id": {"$ifNull": ["$job", "other"]},
                    "count": {"$sum": 1}
                }
            }
        ]
        results: List[Dict[str, Any]] = list(self.collection.aggregate(pipeline))

        counts: Dict[str, int] = {"manager": 0, "technician": 0, "clerk": 0, "other": 0}
        for r in results:
            key = (r["_id"] or "other")
            key = key.lower() if isinstance(key, str) else "other"
            if key in counts:
                counts[key] = r["count"]
            else:
                counts["other"] += r["count"]
        return counts

    # ----------------- EXCEPTIONS ----------------- #
    DuplicateKeyError = DuplicateKeyError
