from pathlib import Path

from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.responses import HTMLResponse, PlainTextResponse
from PIL import Image

import model

api = FastAPI()
model.net()
page = Path(__file__).with_name("index.html").read_text()
MAX_BYTES = 10 * 1024 * 1024


@api.get("/healthz", response_class=PlainTextResponse)
def healthz():
    return "ok"


@api.get("/", response_class=HTMLResponse)
def index():
    return page


@api.post("/classify")
def classify(image: UploadFile):
    data = image.file.read(MAX_BYTES + 1)
    if len(data) > MAX_BYTES:
        raise HTTPException(413, "Pick an image under 10 MB.")
    try:
        return {"predictions": model.classify(data)}
    except (OSError, Image.DecompressionBombError):
        raise HTTPException(400, "That file is not an image.")
