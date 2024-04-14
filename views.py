from flask import Flask, request, jsonify, render_template, redirect, url_for
from app import app, db
from models import Application
from flask_expects_json import expects_json
from pymongo import MongoClient
from gridfs import GridFS
from werkzeug.utils import secure_filename
import os
from config import Config
from pymongo.errors import ConnectionFailure
import openai
from PyPDF2 import PdfReader
from docx import Document

openai.api_key = os.getenv("OPENAI_API_KEY")

client = MongoClient(Config.MONGO_URI)
db = client.get_default_database()  # Use the default database from the URI
fs = GridFS(db)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# JSON Schema for job data validation
job_schema = {
    'type': 'object',
    'properties': {
        'application_number': {'type': 'string', 'minLength': 1},
        'company': {'type': 'string', 'minLength': 1},
        'Job_title': {'type': 'string', 'minLength': 1},
        'description': {'type': 'string', 'minLength': 1},
        'status': {'type': 'string', 'minLength': 1},
        'resume': {'type': 'string', 'minLength': 1},
        'cover_letter': {'type': 'string'}
    },
    'required': ['Job_title']
}

RESUME_PATH = 'uploads/Resume-2024.pdf'
COVER_LETTER_TEMPLATE_PATH = 'uploads/coverletter_template.pdf'

def extract_text_from_pdf(file_path):
    try:
        with open(file_path, "rb") as f:
            pdf_reader = PdfReader(f)
            text = " ".join(page.extract_text() for page in pdf_reader.pages if page.extract_text())
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

# Function to extract text from DOCX files
def extract_text_from_docx(file_path):
    try:
        doc = Document(file_path)
        text = "\n".join(paragraph.text for paragraph in doc.paragraphs if paragraph.text)
        return text
    except Exception as e:
        print(f"Error extracting text from DOCX: {e}")
        return ""

def generate_cover_letter(resume_text, cover_letter_template_text, job_description):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You:"},
                {"role": "user", "content": f"Resume:\n{resume_text}\n\nCover Letter Template:\n{cover_letter_template_text}\n\nJob Description:\n{job_description}\n\nGenerate a cover letter:"}
            ],
            max_tokens=2500
        )
        generated_cover_letter = response.choices[0].message['content']
        return generated_cover_letter.strip()
    except Exception as e:
        print(f"Error generating cover letter: {e}")
        return ""

    
@app.route('/button_clicked', methods=['POST'])
def button_clicked():
    if request.method == 'POST':
        resume_text = extract_text_from_pdf(RESUME_PATH) if RESUME_PATH.endswith('.pdf') else extract_text_from_docx(RESUME_PATH)
        cover_letter_template_text = extract_text_from_pdf(COVER_LETTER_TEMPLATE_PATH) if COVER_LETTER_TEMPLATE_PATH.endswith('.pdf') else extract_text_from_docx(COVER_LETTER_TEMPLATE_PATH)
        applications = list(db.Application.find())
        application_id = request.form['application_id']
        job_description = applications[int(application_id)-1]['description']
        cover_letter = generate_cover_letter(resume_text, cover_letter_template_text, job_description)
        # return jsonify({"cover_letter": cover_letter})
        return render_template('cover_letter.html', cover_letter=cover_letter)
    # return redirect('/') 

# @app.route('/button_clicked', methods=['POST'])
# def button_clicked():

@app.route('/resume_clicked', methods=['POST'])
def resume_clicked():
    return render_template('resume.html')
    # if request.method == 'POST':
    #     resume_text = extract_text_from_pdf(RESUME_PATH) if RESUME_PATH.endswith('.pdf') else extract_text_from_docx(RESUME_PATH)
    #     cover_letter_template_text = extract_text_from_pdf(COVER_LETTER_TEMPLATE_PATH) if COVER_LETTER_TEMPLATE_PATH.endswith('.pdf') else extract_text_from_docx(COVER_LETTER_TEMPLATE_PATH)
    #     applications = list(db.Application.find())
    #     application_id = request.form['application_id']
    #     job_description = applications[int(application_id)-1]['description']
    #     cover_letter = generate_cover_letter(resume_text, cover_letter_template_text, job_description)
    #     # return jsonify({"cover_letter": cover_letter})
    #     return render_template('cover_letter.html', cover_letter=cover_letter)
    # return redirect('/') 


#     if request.method == 'POST':
#         resume_text = extract_text_from_pdf(RESUME_PATH) if RESUME_PATH.endswith('.pdf') else extract_text_from_docx(resume_path)
#         cover_letter_template_text = extract_text_from_pdf(COVER_LETTER_TEMPLATE_PATH) if COVER_LETTER_TEMPLATE_PATH.endswith('.pdf') else extract_text_from_docx(cover_letter_template_path)
#         applications = list(db.Application.find())
#         application_id = request.form['application_id']
#         job_description = applications[int(application_id)]['description']
#         cover_letter = generate_cover_letter(resume_text, cover_letter_template_text, job_description)
     
#     return jsonify({"cover_letter": cover_letter})
    # return render_template("index.html",cover_letter=cover_letter)
   

@app.route('/', methods=['POST'])
@expects_json(job_schema)
def add_job():
    try:
        data = request.json
        # Assuming you have a model class called Job to represent job applications
        data['resume'] = data.get('resume', None)
        data['cover_letter'] = data.get('cover_letter', None)
        # Generate application_number by counting documents
        try:
            current_count = db.Application.count_documents({})
            data['application_number'] = current_count + 1  # Starts from 1 and increments
        except Exception as e:
            return jsonify({"error": "Failed to generate application number", "details": str(e)}), 500

        job = Application(**data)
        
        # Insert the new job application into the database
        job_id = db.Application.insert_one(data).inserted_id
        # return redirect(url_for('get_all_application'))
        return jsonify({"success": True, "message": "Job application submitted successfully", "job_id": str(job_id), "application_number": data['application_number']}), 201
    except Exception as e:
        return jsonify({"error": "Failed to submit job application", "details": str(e)}), 500



@app.route('/', methods=['GET'])
def get_all_application():
    try:
        applications = list(db.Application.find())
        # return jsonify({"success": True, "applications": applications}), 200
        return render_template('index.html', applications=applications)
    except Exception as e:
        app.logger.error(f"Failed to fetch applications: {e}")
        return jsonify({"error": "Failed to fetch applications", "details": str(e)}), 500
    except ConnectionFailure:
        print("Server not available")
        return "Database connection failed", 503
    

from flask import jsonify, request
from pymongo.errors import PyMongoError

@app.route('/update_job/<application_number>', methods=['POST'])
def update_job(application_number):
    try:
        application_number = int(application_number)  # Ensure it's a string
        data = request.json
        print("Data to update:", data)
        print("Application number:", application_number)

        # Find the application by application_number and update it
        result = db.Application.update_one(
            {'application_number': application_number},
            {'$set': data}
        )
        
        print("Matched Count:", result.matched_count)
        print("Modified Count:", result.modified_count)

        if result.modified_count > 0:
            return jsonify({"success": True, "message": "Application updated successfully"}), 200
        else:
            return jsonify({"success": False, "message": "No changes made"}), 400
    except PyMongoError as e:
        print("MongoDB Error:", e)
        return jsonify({"error": "Failed to update application due to MongoDB error", "details": str(e)}), 500
    except Exception as e:
        print("General Error:", e)
        return jsonify({"error": "Failed to update application", "details": str(e)}), 500
    
@app.route('/api/job_status_summary', methods=['GET'])
def job_status_summary():
    try:
        # Aggregating applications by status and counting each status
        pipeline = [
            {"$group": {"_id": "$status", "count": {"$sum": 1}}}
        ]
        result = db.Application.aggregate(pipeline)
        summary = [{"status": item['_id'], "count": item['count']} for item in result]
        return jsonify(summary)
    except Exception as e:
        app.logger.error(f"Failed to fetch job status summary: {e}")
        return jsonify({"error": "Failed to fetch job status summary", "details": str(e)}), 500
    except ConnectionFailure:
        print("Server not available")
        return "Database connection failed", 503