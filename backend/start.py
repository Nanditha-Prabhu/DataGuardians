import subprocess


subprocess.run(
    args="uvicorn app:app --host 0.0.0.0 --port 7860", 
    shell=True
)