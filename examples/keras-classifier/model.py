import io
import json
import os
import shutil
from functools import cache
from pathlib import Path

os.environ.setdefault("KERAS_BACKEND", "jax")

import numpy as np
from keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
from keras.utils import get_file
from PIL import Image

SIZE = 224
HERE = Path(__file__).parent
WEIGHTS = HERE / "mobilenet_v2.h5"
LABELS = HERE / "imagenet_labels.json"
WEIGHTS_URL = (
    "https://storage.googleapis.com/tensorflow/keras-applications/mobilenet_v2/"
    "mobilenet_v2_weights_tf_dim_ordering_tf_kernels_1.0_224.h5"
)
LABELS_URL = "https://storage.googleapis.com/download.tensorflow.org/data/imagenet_class_index.json"


@cache
def net():
    model = MobileNetV2(weights=None)
    model.load_weights(WEIGHTS)
    return model


@cache
def labels() -> list[str]:
    index = json.loads(LABELS.read_text())
    return [index[str(i)][1].replace("_", " ") for i in range(len(index))]


def classify(data: bytes, top: int = 3) -> list[dict]:
    image = Image.open(io.BytesIO(data)).convert("RGB").resize((SIZE, SIZE))
    batch = preprocess_input(np.asarray(image, dtype="float32")[None])
    scores = net().predict(batch, verbose=0)[0]
    best = np.argsort(scores)[::-1][:top]
    return [{"label": labels()[i], "score": round(float(scores[i]), 4)} for i in best]


def download() -> None:
    shutil.copy(get_file(origin=WEIGHTS_URL), WEIGHTS)
    shutil.copy(get_file(origin=LABELS_URL), LABELS)
    blank = io.BytesIO()
    Image.new("RGB", (SIZE, SIZE), "white").save(blank, "PNG")
    print(classify(blank.getvalue()))


if __name__ == "__main__":
    download()
