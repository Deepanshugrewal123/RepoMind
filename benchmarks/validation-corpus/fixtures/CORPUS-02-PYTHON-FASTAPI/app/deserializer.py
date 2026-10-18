import pickle
import json

def safe_deserialize(json_payload: str):
    # True Negative trap: json.loads is safe against object injection
    return json.loads(json_payload)

def unsafe_deserialize(raw_bytes: bytes):
    # True Positive: pickle.loads allows arbitrary remote code execution (RPM-SAST-DESER-05)
    return pickle.loads(raw_bytes)
