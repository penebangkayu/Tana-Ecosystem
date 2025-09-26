from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# Izinkan CORS supaya frontend bisa fetch
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Ambil summary semua pair dari Indodax public API
@app.get("/indodax-summaries")
def get_summaries():
    url = "https://indodax.com/api/summaries"
    resp = requests.get(url)
    return resp.json()  # langsung kirim JSON ke frontend

# Ambil order book untuk pair tertentu
@app.get("/indodax-orderbook/{pair}")
def get_orderbook(pair: str):
    url = f"https://indodax.com/api/{pair}/depth"
    resp = requests.get(url)
    return resp.json()
