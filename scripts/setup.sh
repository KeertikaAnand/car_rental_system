#!/bin/bash 
python -m venv venv 
source venv/Scripts/activate 
pip install -r backend/requirements.txt 
python backend/app/database.py 
