#!/bin/bash 
source venv/Scripts/activate 
uvicorn backend.app.main:app --reload 
start http://localhost:8000/docs 
