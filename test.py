from pymongo import MongoClient

# Connection details
source_client = MongoClient('mongodb+srv://satwikroopa:Roopa70263@fruitdb.8sxipgz.mongodb.net/?retryWrites=true&w=majority&appName=FruitDb')
destination_client = MongoClient('mongodb+srv://satwikroopa:Roopa70263@fruitdb.8sxipgz.mongodb.net/?retryWrites=true&w=majority&appName=FruitDb')

# Source and destination databases
source_db = source_client['KSP_DATABASE']
destination_db = destination_client['KSP-DataGuardians']

# Get a list of all collections in the source database
collections = source_db.list_collection_names()

for collection_name in collections:
    # Get the source collection
    source_collection = source_db[collection_name]
    
    # Get the destination collection
    destination_collection = destination_db[collection_name]

    # Copy all documents from source collection to destination collection
    documents = source_collection.find()
    destination_collection.insert_many(documents)

    print(f"Transferred {source_collection.count_documents({})} documents from collection '{collection_name}'")

print("All collections have been transferred.")
