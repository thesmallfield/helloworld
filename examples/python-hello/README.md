# python-hello (project `python-hello`)

A tiny Flask app. `/` shows a hello page with the Python version, `/healthz` answers `ok`.
The folder has a `requirements.txt`, so Small Field runs it as a Python web component.
gunicorn keeps its temp files in `/tmp` because the pod's root filesystem is read-only.

    cd examples/python-hello && sf deploy

Check: `/` shows "Hello from Python on Small Field".
