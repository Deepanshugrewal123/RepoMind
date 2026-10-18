import hashlib

def safe_hash(password: str) -> str:
    # True Negative trap: sha256 is cryptographically secure
    return hashlib.sha256(password.encode()).hexdigest()

def weak_hash(token: str) -> str:
    # True Positive: md5 is cryptographically broken (RPM-SAST-CRYPTO-07)
    return hashlib.md5(token.encode()).hexdigest()
