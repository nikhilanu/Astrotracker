from app import db


class Application:
    def __init__(self, application_number, company, Job_title, description, status, resume, cover_letter):
        self.application_number = application_number
        self.company = company
        self.Job_title = Job_title
        self.description = description
        self.status = status
        self.resume = resume
        self.cover_letter = cover_letter

    def to_dict(self):
        return {
            "application_number": self.application_number,
            "company":self.company,
            "Job_title": self.Job_title,
            "description": self.description,
            "status": self.status,
            "resume": self.resume,
            "cover_letter": self.cover_letter
        }





