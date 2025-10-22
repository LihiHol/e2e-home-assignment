from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.workers import router as workers_router
from app.db.mongo import ensure_indexes

app = FastAPI(title="IronBrain E2E")

@app.on_event("startup")
def on_startup():
    ensure_indexes()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(workers_router)
