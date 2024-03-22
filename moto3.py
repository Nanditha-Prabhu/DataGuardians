from flask import Flask, jsonify, request
import boto3

app = Flask(__name__)

# Define AWS credentials and S3 bucket name
AWS_ACCESS_KEY_ID = ''
AWS_SECRET_ACCESS_KEY = ''
S3_BUCKET_NAME = ''

# Initialize Boto3 S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

@app.route('/list-objects', methods=['GET'])
def list_objects_in_bucket():
    """
    List all objects in the S3 bucket.
    """
    response = s3_client.list_objects_v2(Bucket=S3_BUCKET_NAME)
    if 'Contents' in response:
        objects = [obj['Key'] for obj in response['Contents']]
        return jsonify(objects)
    else:
        return jsonify([])

@app.route('/download-file', methods=['GET'])
def download_file_from_s3():
    """
    Download 'AccidentReports.csv' from the S3 bucket.
    """
    file_name = 'AccidentReports.csv'
    local_file_path = '/path/to/download/location/' + file_name
    s3_client.download_file(S3_BUCKET_NAME, file_name, local_file_path)
    return jsonify({"message": f"File '{file_name}' downloaded successfully."})

@app.route('/upload-file', methods=['POST'])
def upload_file_to_s3():
    """
    Upload a file to the S3 bucket.
    """
    file = request.files['file']
    file_name = 'NewData.csv'
    file_path = f"/tmp/{file_name}"
    file.save(file_path)
    s3_client.upload_file(file_path, S3_BUCKET_NAME, file_name)
    return jsonify({"message": f"File '{file_name}' uploaded successfully."})

@app.route('/update-file', methods=['POST'])
def update_file_in_s3():
    """
    Update 'AccidentReports.csv' in the S3 bucket.
    """
    file = request.files['file']
    file_name = 'AccidentReports.csv'
    file_path = f"/tmp/{file_name}"
    file.save(file_path)
    s3_client.upload_file(file_path, S3_BUCKET_NAME, file_name)
    return jsonify({"message": f"File '{file_name}' updated successfully."})

if __name__ == "__main__":
    app.run(debug=True)
