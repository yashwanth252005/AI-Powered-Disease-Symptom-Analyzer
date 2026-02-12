from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from app.schemas import SymptomRequest, UserSignup, UserLogin
from app.auth import signup_user, login_user
from app.predictor import predict_disease
from app.security import SECRET_KEY, ALGORITHM
from datetime import datetime, timezone
from app.database import db
from fastapi.middleware.cors import CORSMiddleware
from app.predictor import symptom_list



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


security = HTTPBearer()

@app.post("/signup")
async def signup(user: UserSignup):
    return await signup_user(user.email, user.password)

@app.post("/login")
async def login(user: UserLogin):
    return await login_user(user.email, user.password)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(
            credentials.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return payload.get("sub")
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@app.post("/predict")
async def predict(request: SymptomRequest, user_email: str = Depends(verify_token)):
    result = predict_disease(request.symptoms)

    prediction_data = {
    "user_email": user_email,
    "symptoms": request.symptoms,
    "top_prediction": result["top_prediction"],
    "confidence": result["confidence"],
    "risk_level": result["risk_level"],
    "health_score": result["health_score"],
    "top_3_predictions": result["top_3_predictions"],
    "created_at": datetime.now(timezone.utc)
    }

    await db["predictions"].insert_one(prediction_data)

    return {
        "prediction": result,
        "disclaimer": "This result is for educational purposes only and does not replace professional medical diagnosis."
    }

@app.get("/symptoms")
async def get_symptoms():
    return {"symptoms": symptom_list}


@app.get("/history")
async def get_history(user_email: str = Depends(verify_token)):
    predictions = db["predictions"].find({"user_email": user_email})

    results = []
    async for prediction in predictions:
        prediction["_id"] = str(prediction["_id"])
        results.append(prediction)

    return {"history": results}

