import pickle

MODEL_PATH = "disease_rf_model.pkl"
ENCODER_PATH = "label_encoder.pkl"

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

with open(ENCODER_PATH, "rb") as f:
    label_encoder = pickle.load(f)

def get_model():
    return model

def get_label_encoder():
    return label_encoder
