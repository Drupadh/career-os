import google.generativeai as genai
import json
import os
from fastapi import UploadFile
from pypdf import PdfReader
from docx import Document
import io

class ResumeParser:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    async def parse_file(self, file: UploadFile) -> dict:
        content = await file.read()
        filename = file.filename.lower()
        text = ""

        try:
            if filename.endswith('.pdf'):
                reader = PdfReader(io.BytesIO(content))
                for page in reader.pages:
                    text += page.extract_text() + "\n"
            elif filename.endswith('.docx'):
                doc = Document(io.BytesIO(content))
                for para in doc.paragraphs:
                    text += para.text + "\n"
            else:
                raise ValueError("Unsupported file format. Please upload PDF or DOCX.")

            return self._extract_json_from_text(text)
        except Exception as e:
            print(f"Error parsing file: {e}")
            raise e

    def _extract_json_from_text(self, text: str) -> dict:
        prompt = f"""
        You are an expert resume parser. Extract the following information from the resume text below and return it as a VALID JSON object.

        SCHEMA:
        {{
            "personal_info": {{
                "name": "Full Name",
                "email": "Email",
                "phone": "Phone",
                "linkedin": "LinkedIn URL",
                "github": "GitHub URL (optional)"
            }},
            "summary": "Professional Summary",
            "education": [
                {{
                    "school": "School Name",
                    "location": "Location",
                    "degree": "Degree",
                    "dates": "Start - End Date"
                }}
            ],
            "experience": [
                {{
                    "title": "Job Title",
                    "company": "Company Name",
                    "location": "Location",
                    "dates": "Start - End Date",
                    "bullets": ["Responsibility 1", "Responsibility 2"]
                }}
            ],
            "projects": [
                {{
                    "name": "Project Name",
                    "technologies": "Tech Stack",
                    "dates": "Date",
                    "bullets": ["Description"]
                }}
            ],
            "skills": {{
                "languages": "List of languages",
                "frameworks": "List of frameworks",
                "tools": "List of tools"
            }}
        }}

        RESUME TEXT:
        {text[:10000]}  # Truncate to avoid token limits if necessary, though Gemini handles large context well.

        OUTPUT GUIDELINES:
        - Return ONLY valid JSON.
        - Do not include markdown code blocks.
        - If a field is missing, use an empty string or empty list/dict as appropriate.
        """

        try:
            response = self.model.generate_content(prompt)
            clean_text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_text)
        except Exception as e:
            print(f"Error extracting JSON from text: {e}")
            raise e
