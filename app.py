from flask import Flask, render_template
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from flask import Flask, request, jsonify
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from config import Config

app = Flask(__name__, template_folder = 'templates')
app.config.from_object(Config)

# MongoDB setup
client = MongoClient(app.config["MONGO_URI"])
db = client.get_default_database()

from views import *

if __name__ == "__main__":
    app.run(debug=True)

# app = Flask(__name__)

# client = MongoClient("mongodb+srv://srikup20:Test123@astrotracker.m19dhfc.mongodb.net/AstroTracker?retryWrites=true&w=majority&appName=AstroTracker")
# db = client['astrotracker']
# collection = db['job_applications']

# @app.route('/add-application', methods=['POST'])
# def add_application():
#     data = request.json
#     print(data)
#     try:
#         result = collection.insert_one(data)
#         return jsonify({'message': 'Application added!', 'id': str(result.inserted_id)})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# @app.route('/')
# def index():
#     # mongo_uri = "mongodb+srv://nikhilanu:Aapr18697@cluster0.ald0aye.mongodb.net/astrotracker?retryWrites=true&w=majority&appName=Cluster0"
#     try:
#         # client = MongoClient(mongo_uri)
#         db = client.get_default_database()  # Get the default database
#         applications = list(db.job_applications.find())  # Retrieve all documents
#         return render_template('index.html', applications=applications)
#     except ConnectionFailure:
#         print("Server not available")
#         return "Database connection failed", 503
#     except Exception as e:
#         print(f"An error occurred: {e}")
#         return f"An error occurred: {e}", 500

# if __name__ == '__main__':
#     app.run(debug=True)


