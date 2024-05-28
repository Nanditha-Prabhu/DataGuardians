import os
import csv
import codecs
from typing import Dict, List

from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

from Anonymizer import get_anonymizer
from schemas import (
    AnonymizeDataResponse,
    AnonymizeDataRequest,
    SearchRequest
) 


app = FastAPI()
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "https://data-guardians.vercel.app/"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def index():
    return {"API Test": "Hello World!!"}


@app.post("/upload")
def upload_file(file: UploadFile, user: str):
    if user == "ADMIN":
        csv_file = file.file
        try:
            # Use CSV DictReader to convert data into list of dict
            # Here, codecs is used to iteratively decode byte file to utf-8 file
            dict_reader = csv.DictReader(codecs.iterdecode(csv_file, 'utf-8'))

            # Store data in mongodb
            client = MongoClient(os.getenv('MONGODB_URL'))
            db = client[os.getenv("DATABASE_NAME")]
            collection = db[file.filename[:-4]]  # Here, collection name is considered as file_name 
            collection.insert_many(list(dict_reader))
            client.close()

            print("Stored Successfully")
        except Exception as e:
            print(f"Error: {e}")
            return {'status': f'error: {e}'}
        finally:
            client.close()

        return {'status': 'Successfully stored'}
    elif user == "USER":
        return {'status': 'user not allowed to do this action'}


@app.post("/anonymize-data")
def display_anonymized_data(data: AnonymizeDataRequest, user: str) -> AnonymizeDataResponse:
    try:
        client = MongoClient(os.getenv('MONGODB_URL'))
        db = client[os.getenv('DATABASE_NAME')]
        collection = db[data.file_name] # key name TDB 
        requested_data = collection.find({}, {'_id': False}).skip(0).limit(100)

        # Anonymize the retrieved data
        anonymized_data = anonymize_data(
            data=requested_data, 
            anonymize_columns=data.anonymize_columns, 
            column_name=data.column_name,
            user=user
        )

        client.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

    return AnonymizeDataResponse(
        status="retrived and anonymized successfully!!" + ("some columns are not allowed to deanonymize as you are a user" if user == "USER" else ""),
        data=anonymized_data,
    )


# functions to get attributes from databases
@app.get("/fileNames")
def get_file_names():
    fileNames = list()
    try:
        client = MongoClient(os.getenv("MONGODB_URL"))
        db = client[os.getenv("DATABASE_NAME")]
        fileNames = db.list_collection_names()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()
    return fileNames


# In this route, the names are not suitable for the purpose
# Handle, few things
@app.get("/columnNames")
def get_anonymizable_keys(fileName: str):
    try:
        client = MongoClient(os.getenv("MONGODB_URL"))
        db = client[os.getenv("DATABASE_NAME")]
        collection = db[fileName]
        doc = collection.find_one({}, {"_id": False})
        client.close()
        if doc:
            anonymizable_keys = list(doc.keys())  # Assuming all keys are anonymizable
            return anonymizable_keys
    except Exception as e:
        return {'status': f"Error: {e}"}
    return []


# Full text search routes
@app.post("/search")  # <domain>/results?search_query=<user-text>&search_index=<index>&file_name=<filename>
def search(search_req: SearchRequest, user: str):
    try:
        pipeline = lambda search_index, text: [
            {
                "$search": {
                    "index": search_index,  # specify your search index name
                    "text": {
                        "query": text,
                        "path": {
                            "wildcard": "*"
                        }
                    }
                }
            },
            {
                "$limit": search_req.limit
            }
        ]
        client = MongoClient(os.getenv("MONGODB_URL"))
        db = client[os.getenv("DATABASE_NAME")]
        collection = db[search_req.file_name]
        docs = collection.aggregate(pipeline(search_req.search_index, search_req.search_query))
        if docs:
            docs = [{k: v for k, v in doc.items() if k != '_id'} for doc in docs]
            anonymized_data = anonymize_data(
                data=docs,
                anonymize_columns=search_req.anonymize_columns,
                column_name=search_req.column_name,
                user=user
            )
            return {"Status": "Search Successful", "data": anonymized_data}
        client.close()
    except Exception as e:
        return {'status': f"Error: {e}"}
    return []



def anonymize_data(data: List[Dict[str, str]], anonymize_columns, column_name, user) -> List[Dict[str, str]]:
    anonymized_data = list()
    keys_to_skip = [key for key in column_name if key not in anonymize_columns]

    if user == "USER":
        deanonymization_not_allowed_list = ["first fame", "last name" , "victimname", "dob", "presentaddress", "address", "dateofbirth", "city", "state", "pincode"]
        for col in deanonymization_not_allowed_list:
            if col.lower() not in keys_to_skip:
                keys_to_skip.append(col)

    # Anonymize the retrieved data
    anonymizer = get_anonymizer()
    anonymized_data = list()
    for _data in data:
        anonymized_data.append(
            anonymizer(
                input_data=_data,
                keys_to_skip=keys_to_skip, # Data will be taken from frontend
            )
        )

    return anonymized_data
