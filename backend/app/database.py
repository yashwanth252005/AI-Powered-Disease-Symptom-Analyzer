from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URL = "mongodb+srv://222yashwanthes:wVSvWPYTMvAvdzLN@cluster0.3vdgekv.mongodb.net/?appName=Cluster0"

client = AsyncIOMotorClient(MONGO_URL)

db = client["ai_health_db"]
users_collection = db["users"]
