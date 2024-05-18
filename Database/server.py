# Core python packages
import csv
import codecs
import logging
import os

# 3rd party python packages
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

# Created python packages
from Anonymizer import get_anonymizer


load_dotenv()


logging.basicConfig(
    level=logging.INFO,
    format="[ %(levelname)s ] %(message)s "
)
app = Flask(__name__)
CORS(app)


@app.get("/")
def index():
    return "Server Working Good"


@app.post("/upload")
def upload_file():
    file = request.files
    csv_file = file['file']
    try:
        # Use CSV DictReader to convert data into list of dict
        # Here, codecs is used to iteratively decode byte file to utf-8 file
        dict_reader = csv.DictReader(codecs.iterdecode(csv_file, 'utf-8'))

        # Store data in mongodb
        client = MongoClient(os.getenv('MONGO_URL'))
        db = client['KSP-DataGuardians']
        collection = db[csv_file.filename[:-4]]  # Here, collection name is considered as file_name 
        collection.insert_many(list(dict_reader))
        client.close()

        logging.info("Stored Successfully")
    except Exception as e:
        logging.info(f"Error: {e}")
        return jsonify({'status': f'error: {e}'})
    finally:
        client.close()

    return jsonify({'status': 'Successfully stored'})


@app.post("/display-anonymized-data")
def display_anonymized_data():
    data = request.json
    try:
        client = MongoClient(os.getenv('MONGO_URL'))
        db = client['KSP-DataGuardians']
        collection = db[data['file_name']] # key name TDB 
        requested_data = collection.find({}, {'_id': False})

        keys_to_skip = [key for key in data['column_name'] if key not in data['anonymize_columns']]

        # Anonymize the retrieved data
        anonymizer = get_anonymizer()
        anonymized_data = list()
        for data in requested_data:
            anonymized_data.append(
                anonymizer(
                    input_data=data,
                    keys_to_skip=keys_to_skip, # Data will be taken from frontend
                )
            )
        client.close()
        print(anonymized_data)
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


# functions to get attributes from databases
@app.get("/fileNames")
def get_file_names():
    try:
        client = MongoClient(os.getenv("MONGO_URL"))
        db = client["KSP-DataGuardians"]
        fileNames = db.list_collection_names()
        logging.info(fileNames)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()
    return fileNames


# In this route, the names are not suitable for the purpose
# Handle, few things
@app.get("/columnNames")
def get_anonymizable_keys():
    file_name = request.args.get('fileName')
    try:
        client = MongoClient(os.getenv("MONGO_URL"))
        db = client["KSP-DataGuardians"]
        collection = db[file_name]
        doc = collection.find_one({}, {"_id": False})
        client.close()
        if doc:
            anonymizable_keys = list(doc.keys())  # Assuming all keys are anonymizable
            return jsonify(anonymizable_keys)
    except Exception as e:
        return jsonify({'status': f"Error: {e}"})
    return jsonify([])


if __name__ == "__main__":
    app.run()