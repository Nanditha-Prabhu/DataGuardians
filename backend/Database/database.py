import csv
import codecs
import os
from bson import ObjectId
from dotenv import load_dotenv
import io
from flask_cors import CORS  # Import CORS from Flask-CORS

from flask import Flask, request, jsonify, send_file
from pymongo import MongoClient

from Anonymizer import get_anonymizer

app = Flask(__name__)
CORS(app)

client = MongoClient(os.getenv('MONGO_URL'))
db = client['KSP_DATABASE'] 
destinationdb= client['KSP_ANONYMIZED_DATABASE']


# Route to upload file
@app.route('/collections')
def get_collections():
    collections = destinationdb.list_collection_names()
    return jsonify(collections)

@app.route('/download/<collection_name>')
def download_csv(collection_name):
    print("Hello")
    collection = destinationdb[collection_name]
    documents = collection.find()

    # Prepare CSV data
    csv_data = io.StringIO()
    csv_writer = csv.DictWriter(csv_data, fieldnames=documents[0].keys())
    csv_writer.writeheader()
    for doc in documents:
        csv_writer.writerow(doc)

    csv_data.seek(0)

    return send_file(csv_data,
                     mimetype='text/csv',
                     attachment_filename=f'{collection_name}.csv',
                     as_attachment=True)


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


# Route to delete file
@app.get("/delete-file")
def delete_file():
    return {'status': 'Not Implemented Yet'}


# Route to display file and anonymize
@app.route("/display-anonymized-data", methods = ['POST'])
def display_anonymized_data():
    data = request.json
    try:
        column_name = data['column_name']
        file_name = data['file_name']
        print(column_name)
        print(file_name)
        collection = db[file_name]
        document = collection.find_one()
        # Get all keys in the document
        keys = document.keys()   # key name TDB 
        keys = list(keys)
        arr=[]
        for i in keys:
            if i!= column_name:
                arr.append(i)
        print(arr)
        requested_data = collection.find({}, {'_id': False})
        print(requested_data)


        # Anonymize the retrieved data
        anonymizer = get_anonymizer()
        
        anonymized_data = list()
        for data in requested_data:
            anonymized_doc = anonymizer(input_data=data, keys_to_skip=arr)
            anonymized_data.append(anonymized_doc)

 
        # destination_collection = destinationdb[file_name]
        
        # # Insert anonymized data into destination collection
        # destination_collection.insert_many(anonymized_data)
        client.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

    # Debug Msg
    print(anonymized_data)
    
    return jsonify({
        'status': 'retrived and anonymized successfully', 
        'data': anonymized_data
    })

# Connect to MongoDB


# Route to fetch file names (collection names)
@app.route('/fileNames', methods=['GET'])
def get_file_names():
    collection_names = db.list_collection_names()
    print(collection_names)
    return jsonify(collection_names)

# Route to fetch anonymizable keys for a given file
@app.route('/anonymizableKeys', methods=['GET'])
def get_anonymizable_keys():
    file_name = request.args.get('fileName')
    collection = db[file_name]  # Access the collection with the given file name
    document = collection.find_one()
    if document:
        anonymizable_keys = list(document.keys())  # Assuming all keys are anonymizable
        return jsonify(anonymizable_keys)
    else:
        return jsonify([])


if __name__ == "__main__":
    app.run(debug=True)
