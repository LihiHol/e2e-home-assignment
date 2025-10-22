from pymongo import MongoClient, ASCENDING, errors
from app.config import settings

client = MongoClient(settings.MONGO_URL, uuidRepresentation="standard")
db = client[settings.DB_NAME]

# collections
workers = db["workers"]

def ensure_indexes() -> None:
    try:
        client.admin.command("ping")

        # unique workerId
        workers.create_index(
            [("workerId", ASCENDING)],
            name="idx_workers_workerId_unique",
            unique=True
        )

        workers.create_index(
            [("created_at", ASCENDING)],
            name="idx_workers_created_at"
        )

        print("Mongo indexes ensured for workers")

    except errors.PyMongoError as e:
        print(f"Mongo ensure_indexes failed: {e}")
        raise
