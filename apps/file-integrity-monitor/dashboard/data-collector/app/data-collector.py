#   Copyright (c) 2026 WSO2 LLC. (https://www.wso2.com).

#  WSO2 LLC. licenses this file to you under the Apache License,
#  Version 2.0 (the "License"); you may not use this file except
#  in compliance with the License.
#  You may obtain a copy of the License at

#  http://www.apache.org/licenses/LICENSE-2.0

#  Unless required by applicable law or agreed to in writing,
#  software distributed under the License is distributed on an
#  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
#  KIND, either express or implied.  See the License for the
#  specific language governing permissions and limitations
#  under the License. 


import boto3
import json
import time
import os
import mysql.connector
from mysql.connector import Error


# Load environment variables

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")


# Validate required configs

required_envs = [
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    S3_BUCKET_NAME,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
]

if not all(required_envs):
    raise RuntimeError("Missing one or more required environment variables")



# Initialize S3 client

def initialize_s3_client():
    return boto3.client(
        "s3",
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION,
    )



# Create LOCAL DB connection 

def create_connection():
    try:
        connection = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            port=3306,
            autocommit=True,
        )
        print("✅ Connected to LOCAL MySQL DB")
        return connection
    except Error as e:
        print(f" Database connection error: {e}")
        return None



# Process a single JSON file

def process_json_file(file_path, cursor):
    try:
        with open(file_path, "r") as f:
            data = json.load(f)

        insert_query = """
            INSERT INTO centralised_fim_db
            (machine_identifier, conclusion, timestamp, readable_text_cmd, data_changed)
            VALUES (%s, %s, %s, %s, %s)
        """

        cursor.execute(
            insert_query,
            (
                data["machine_identifier"],
                data["conclusion"],
                data["human_readable_timestamp"],
                data["readable_text_cmd"],
                data["diff"],
            ),
        )

        print(f" Inserted: {data['machine_identifier']}")
        return True

    except KeyError:
        print(f" Invalid JSON structure: {file_path}")
        return False
    except json.JSONDecodeError as e:
        print(f" JSON decode error {file_path}: {e}")
        return False
    except Error as e:
        print(f" DB error {file_path}: {e}")
        return False



# Fetch files from S3

def fetch_and_process_files(s3_client, bucket_name, local_directory):
    connection = create_connection()
    if not connection:
        return

    cursor = connection.cursor()
    paginator = s3_client.get_paginator("list_objects_v2")

    for page in paginator.paginate(Bucket=bucket_name):
        for obj in page.get("Contents", []):
            file_name = obj["Key"]
            try:
                local_file_path = os.path.join(local_directory, file_name)
                print(f" Downloading {file_name}")
                s3_client.download_file(bucket_name, file_name, local_file_path)

                success = process_json_file(local_file_path, cursor)
                if success:
                    s3_client.delete_object(Bucket=bucket_name, Key=file_name)
                    os.remove(local_file_path)
                    print(f" Removed {file_name}")
                else:
                    print(f" Retained {file_name}")
            except Exception as e:
                print(f" Error processing {file_name}: {e}")
                continue

    finally:
        cursor.close()
        connection.close()


# Main loop

def main():
    s3_client = initialize_s3_client()
    local_directory = "/app/centralised_bak"
    os.makedirs(local_directory, exist_ok=True)

    print(" S3 → LOCAL DB service started")

    while True:
        fetch_and_process_files(s3_client, S3_BUCKET_NAME, local_directory)
        time.sleep(300)  # 5 minutes



# Entry point

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(" Service stopped")
