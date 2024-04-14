import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Connect to MongoDB
client = MongoClient(os.getenv('MONGO_URL'))
db = client['KSP_ANONYMIZED_DATABASE']  # Change this to your database name
collection = db['names']  # Change this to your collection name

# Provided data
data = [
    {"First Name": "John", "Last Name": "Smith", "Middle Name": "Doe"},
    {"First Name": "Jane", "Last Name": "Brown", "Middle Name": "<PERSON>"},
    {"First Name": "Michael", "Last Name": "Johnson", "Middle Name": "<PERSON>"},
    {"First Name": "Emily", "Last Name": "Wilson", "Middle Name": "<PERSON>"},
    {"First Name": "David", "Last Name": "Taylor", "Middle Name": "<PERSON>"},
    {"First Name": "Sarah", "Last Name": "Miller", "Middle Name": "<PERSON>"},
    {"First Name": "Daniel", "Last Name": "Davis", "Middle Name": "<PERSON>"},
    {"First Name": "Olivia", "Last Name": "Anderson", "Middle Name": "Rose"},
    {"First Name": "William", "Last Name": "Martinez", "Middle Name": "<PERSON>"},
    {"First Name": "Sophia", "Last Name": "Garcia", "Middle Name": "<PERSON>"}
]

# Insert data into MongoDB collection
collection.insert_many(data)

# Close connection
client.close()
