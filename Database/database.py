import csv
import codecs
import os

from flask import Flask, request, jsonify
from pymongo import MongoClient

from Anonymizer import get_anonymizer


app = Flask(__name__)


# Route to upload file
@app.post("/upload-file")
def upload_file():
    file = request.files
    csv_file = file['file']
    try:
        # Use CSV DictReader to convert data into list of dict
        dict_reader = csv.DictReader(codecs.iterdecode(csv_file, 'utf-8'))
        
        # Store data in mongodb
        client = MongoClient(os.getenv('MONGO_URL'))
        db = client['KSP-DataGuardians']
        collection = db[csv_file.filename[:-4]]  # Here, collection name is considered as file_name 
        collection.insert_many(list(dict_reader))
        client.close()
        
        # Debug Msg
        print("Stored Successfully")
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'status': f'error: {e}'})
    finally:
        client.close()

    return jsonify({'status': 'Successfully stored'})


# Route to delete file
@app.get("/delete-file")
def delete_file():
    return {'status': 'Not Implemented Yet'}


# Route to display file and anonymize
@app.get("/display-anonymized-data")
def display_anonymized_data():
    data = request.json
    try:
        client = MongoClient(os.getenv('MONGO_URL'))
        db = client['KSP-DataGuardians']
        collection = db[data['file_name']]   # key name TDB 
        requested_data = collection.find({}, {'_id': False})

        # Anonymize the retrieved data
        anonymizer = get_anonymizer()
        anonymized_data = list()
        for data in requested_data:
            anonymized_data.append(
                anonymizer(
                    input_data=data,
                    keys_to_skip=None, # Data will be taken from frontend
                )
            )
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


if __name__ == "__main__":
    app.run(debug=True)
