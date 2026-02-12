from fastapi import HTTPException
from app.database import users_collection
from app.security import hash_password, verify_password, create_access_token

async def signup_user(email: str, password: str):
    existing_user = await users_collection.find_one({"email": email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pw = hash_password(password)

    await users_collection.insert_one({
        "email": email,
        "password": hashed_pw
    })

    return {"message": "User created successfully"}

async def login_user(email: str, password: str):
    user = await users_collection.find_one({"email": email})
    if not user or not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": email})
    return {"access_token": token, "token_type": "bearer"}
