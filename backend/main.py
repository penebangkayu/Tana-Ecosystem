from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# CORS supaya frontend bisa fetch
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Summary semua pair
@app.get("/indodax-summaries")
def get_summaries():
    url = "https://indodax.com/api/summaries"
    res = requests.get(url)
    return res.json() if res.status_code == 200 else {"error": res.status_code}

# Order book untuk pair tertentu
@app.get("/indodax-orderbook/{pair}")
def get_orderbook(pair: str):
    url = f"https://indodax.com/api/orderbook/{pair}"
    res = requests.get(url)
    return res.json() if res.status_code == 200 else {"error": res.status_code}
