import google.generativeai as genai
import json
import os

class AITailor:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        # Using gemini-2.0-flash for speed and cost effectiveness, or pro if needed. 
        # flash is usually good for JSON tasks.
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    def tailor_resume(self, resume_latex: str, job_description: str) -> str:
        prompt = f"""
        You are an expert resume writer and LaTeX pro. I will provide you with a current resume (in LaTeX format) and a Job Description.
        Your task is to tailor the resume to better match the Job Description.

        GUIDELINES:
        1. Analyze the Job Description for key skills, keywords, and requirements.
        2. Rewrite the "Summary" (if present) or add one to highlight relevant experience.
        3. Edit bullet points in "Experience" or "Projects" to emphasize relevant achievements. Do NOT fabricate experience, but you can rephrase existing ones to match JD keywords.
        4. Update "Skills" section to prioritize those found in the JD.
        5. Return the FULL, COMPILE-READY LaTeX code. Do not return markdown. Do not return JSON. Just the raw LaTeX string.

        INPUT RESUME (LaTeX):
        {resume_latex}

        JOB DESCRIPTION:
        {job_description}

        OUTPUT FORMAT:
        Return only the raw LaTeX code. No ```latex block markers.
        """

        try:
            response = self.model.generate_content(prompt)
            # Clean response if it contains markdown code blocks
            text = response.text.replace("```latex", "").replace("```", "").strip()
            return text
        except Exception as e:
            print(f"Error tailoring resume: {e}")
            raise e
