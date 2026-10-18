import requests

def secure_fetch(endpoint: str):
    # True Negative trap: default TLS certificate verification is active
    return requests.get(endpoint)

def insecure_fetch(endpoint: str):
    # True Positive: verify=False disables TLS certificate validation (RPM-SAST-TLS-08)
    return requests.get(endpoint, verify=False)
