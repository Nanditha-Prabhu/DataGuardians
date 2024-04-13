import os
from dotenv import load_dotenv
# os.getenv('MONGO_URL')
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import csv
import json

app = Flask(__name__)
CORS(app)
client = MongoClient(os.getenv('MONGO_URL'))
db = client['KSP_DATABASE']

@app.route('/upload', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    if file:
        csv_data = file.read().decode('utf-8')
        file_name = file.filename.split('.')[0]  # Extract file name without extension
        save_csv_to_mongodb(csv_data, file_name)
        return jsonify({'message': 'File uploaded successfully'})

def save_csv_to_mongodb(csv_data, collection_name):
    # Parse CSV data and convert it to JSON
    csv_rows = csv_data.split("\n")
    csv_reader = csv.DictReader(csv_rows)
    json_data = []
    for row in csv_reader:
        json_data.append(row)

    # Use file name as collection name
    collection = db[collection_name]
    
    # Save JSON data to MongoDB
    collection.insert_many(json_data)

if __name__ == '__main__':
    app.run(debug=True)

