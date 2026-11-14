from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .database import client, users_collection
from models import UserCreate
from bson import ObjectId
from pydantic import BaseModel
from typing import Optional, List
from database import db

# Pydantic model for comments
class CommentCreate(BaseModel):
    text: str
    author: str

app = FastAPI(title="MotherConnect API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to MotherConnect API"}

@app.get("/health")
async def health_check():
    try:
        await client.admin.command("ping")
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

# get posts from database
@app.get("/posts/")
async def get_posts():
    posts = []
    cursor = posts_collection.find().sort("_id", -1)
    async for document in cursor:
        document["id"] = str(document["_id"])
        del document["_id"]
        # Ensure comments field exists
        if "comments" not in document:
            document["comments"] = []
        posts.append(document)
    return posts

# Add a comment to a specific post
@app.post("/posts/{post_id}/comments")
async def add_comment(post_id: str, comment: CommentCreate):
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid post ID")
    
    comment_dict = {
        "author": comment.author,
        "text": comment.text
    }
    
    result = await posts_collection.update_one(
        {"_id": ObjectId(post_id)},
        {"$push": {"comments": comment_dict}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
        
    return {"message": "Comment added successfully"}

# endpoint for user registration
@app.post("/users/")
async def create_user(user: UserCreate):
    # すでに同じメールアドレスが登録されていないか確認
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user.dict()
    result = await users_collection.insert_one(user_dict)
    
    return {
        "id": str(result.inserted_id),
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "profile_info": user.profile_info
    }

# endpoint for getting user lists (test)
@app.get("/users/")
async def get_users():
    users = []
    async for user in users_collection.find():
        users.append({
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "profile_info": user.get("profile_info")
        })
    return users




# リクエストデータの型定義
class FacebookLoginRequest(BaseModel):
    name: str
    email: str
    facebook_id: str

# Facebookログイン・ユーザー登録用エンドポイント
@app.post("/auth/facebook")
async def facebook_login(data: FacebookLoginRequest):
    # 1. メールアドレスで既存ユーザーを検索
    existing_user = await users_collection.find_one({"email": data.email})
    
    if existing_user:
        return {
            "message": "Login successful",
            "user": {
                "id": str(existing_user["_id"]),
                "name": existing_user["name"],
                "email": existing_user["email"],
                "role": existing_user.get("role", "requester")
            }
        }
    
    # 2. 未登録の場合は新規作成（デフォルトは requester として登録）
    new_user = {
        "name": data.name,
        "email": data.email,
        "facebook_id": data.facebook_id,
        "role": "requester",
        "profile_info": ""
    }
    result = await users_collection.insert_one(new_user)
    
    return {
        "message": "User registered and logged in successfully",
        "user": {
            "id": str(result.inserted_id),
            "name": new_user["name"],
            "email": new_user["email"],
            "role": new_user["role"]
        }
    }

class CreatePost(BaseModel):
    type: str
    title: str
    category: str
    area: str
    description: Optional[str] = ""
    author: str

# get 'post' collection from MongoDB
posts_collection = db["posts"]

# api for creating new post
@app.post("/posts/")
async def create_post(post: CreatePost):
    post_dict = post.dict()
    result = await posts_collection.insert_one(post_dict)
    return {
        "message": "Post created successfully",
        "id": str(result.inserted_id)
    }