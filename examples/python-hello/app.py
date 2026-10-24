import platform

from flask import Flask

app = Flask(__name__)

PAGE = """<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Python on Small Field</title></head>
<body>
<h1>Hello from Python on Small Field</h1>
<p>Running Python {version}.</p>
</body>
</html>
"""


@app.get("/")
def home():
    return PAGE.format(version=platform.python_version())


@app.get("/healthz")
def healthz():
    return "ok"
