from datetime import datetime
from typing import Dict, Any, List, Optional
from bson import ObjectId
from fastapi import HTTPException
from pymongo.errors import DuplicateKeyError

from app.db.repositories.workers_repository import WorkersRepository
from app.schemas.workers import WorkerIn, WorkerOut, WorkerUpdate, ChartOut


class WorkersService:
    def __init__(self, repo: WorkersRepository | None = None) -> None:
        self.repo = repo or WorkersRepository()

    # ---- Mapping ----
    @staticmethod
    def to_out(doc: Dict[str, Any]) -> WorkerOut:
        return WorkerOut(
            id=str(doc["_id"]),
            workerId=int(doc["workerId"]),
            name=doc["name"],
            job=doc["job"],
            phone=doc.get("phone"),
            address=doc.get("address"),
            created_at=doc["created_at"],
            updated_at=doc.get("updated_at"),
        )

    # ---- Use-cases ----
    def create(self, payload: WorkerIn) -> WorkerOut:
        doc = payload.model_dump()
        doc["created_at"] = datetime.utcnow()
        try:
            inserted_id = self.repo.insert(doc)
        except DuplicateKeyError:
            raise HTTPException(
                status_code=400, detail="Worker with this workerId already exists.")
        created = self.repo.get(inserted_id)
        if not created:
            raise HTTPException(
                status_code=500, detail="Failed to fetch created worker")
        return self.to_out(created)

    # def list(self, q: Optional[str], skip: int, limit: int) -> List[WorkerOut]:
    #     query: Dict[str, Any] = {}
    #     if q:
    #         query = {"$or": [
    #             {"name": {"$regex": q, "$options": "i"}},
    #             {"job": {"$regex": q, "$options": "i"}},
    #             {"phone": {"$regex": q, "$options": "i"}},
    #             {"address": {"$regex": q, "$options": "i"}},
    #         ]}
    #     docs = self.repo.list(query, skip, limit)
    #     return [self.to_out(d) for d in docs]
    # services/workers_service.py


    def list(self, q: Optional[str], filter: Optional[str], skip: int, limit: int) -> List[WorkerOut]:
        query: Dict[str, Any] = {}
        if q:
            query["$or"] = [
                {"name": {"$regex": q, "$options": "i"}},
                {"job": {"$regex": q, "$options": "i"}},
                {"phone": {"$regex": q, "$options": "i"}},
                {"address": {"$regex": q, "$options": "i"}},
            ]
        if filter and filter != "all":
            query["job"] = filter
        docs = self.repo.list(query, skip, limit)
        return [self.to_out(d) for d in docs]


    def get(self, id_str: str) -> WorkerOut:
        try:
            _id = ObjectId(id_str)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid worker id")
        doc = self.repo.get(_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Worker not found")
        return self.to_out(doc)

    def replace(self, id_str: str, payload: WorkerIn) -> WorkerOut:
        try:
            _id = ObjectId(id_str)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid worker id")

        existing = self.repo.get(_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Worker not found")

        doc = payload.model_dump()
        doc["created_at"] = existing["created_at"]
        doc["updated_at"] = datetime.utcnow()

        matched = self.repo.replace(_id, doc)
        if matched == 0:
            raise HTTPException(status_code=404, detail="Worker not found")
        updated = self.repo.get(_id)
        if not updated:
            raise HTTPException(
                status_code=500, detail="Failed to fetch updated worker")
        return self.to_out(updated)

    def update(self, id_str: str, payload: WorkerUpdate) -> WorkerOut:
        try:
            _id = ObjectId(id_str)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid worker id")

        partial = {k: v for k, v in payload.model_dump().items()
                   if v is not None}
        if not partial:
            doc = self.repo.get(_id)
            if not doc:
                raise HTTPException(status_code=404, detail="Worker not found")
            return self.to_out(doc)

        partial["updated_at"] = datetime.utcnow()
        matched = self.repo.update(_id, partial)
        if matched == 0:
            raise HTTPException(status_code=404, detail="Worker not found")

        updated = self.repo.get(_id)
        if not updated:
            raise HTTPException(
                status_code=500, detail="Failed to fetch updated worker")
        return self.to_out(updated)

    def delete(self, id_str: str) -> None:
        try:
            _id = ObjectId(id_str)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid worker id")
        deleted = self.repo.delete(_id)
        if deleted == 0:
            raise HTTPException(status_code=404, detail="Worker not found")

    # ---- Aggregation Use-case ----
    def jobs_chart(self) -> ChartOut:
        """
        Aggregate counts by job and map to ChartOut
        """
        counts = self.repo.jobs_counts_by_job()
        return ChartOut(
            managers_number=counts.get("manager", 0),
            technicians_number=counts.get("technician", 0),
            clerks_number=counts.get("clerk", 0),
            others_number=counts.get("other", 0),
        )
