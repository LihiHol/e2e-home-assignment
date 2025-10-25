from fastapi import APIRouter
from app.schemas.workers import WorkerIn, WorkerOut, WorkerUpdate, ChartOut
from app.services.workers_service import WorkersService
from app.utils.pagination import parse_pagination

router = APIRouter(prefix="/workers", tags=["workers"])
svc = WorkersService()


@router.post("/", response_model=WorkerOut, status_code=201)
def create_worker(payload: WorkerIn):
    return svc.create(payload)


# @router.get("/", response_model=list[WorkerOut])
# def list_workers(q: str | None = None, page: int = 1, limit: int = 10):
#     limit, skip = parse_pagination(limit, page)
#     return svc.list(q, skip, limit)

@router.get("/", response_model=list[WorkerOut])
def list_workers(q: str | None = None, filter: str | None = None, page: int = 1, limit: int = 10):
    limit, skip = parse_pagination(limit, page)
    return svc.list(q, filter, skip, limit)

@router.get("/chart", response_model=ChartOut)
def chart_number_of_jobs():
    return svc.jobs_chart()


@router.get("/{id}", response_model=WorkerOut)
def get_worker(id: str):
    return svc.get(id)


@router.put("/{id}", response_model=WorkerOut)
def replace_worker(id: str, payload: WorkerIn):
    return svc.replace(id, payload)


@router.patch("/{id}", response_model=WorkerOut)
def update_worker(id: str, payload: WorkerUpdate):
    return svc.update(id, payload)


@router.delete("/{id}", status_code=204)
def delete_worker(id: str):
    svc.delete(id)
    return
