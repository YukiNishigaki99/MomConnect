import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "motherconnect")

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]

# definition of collection
users_collection = db["users"]
posts_collection = db["posts"]