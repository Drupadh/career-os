from fastapi import APIRouter, HTTPException, BackgroundTasks, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel
from app.schemas.resume import ResumeData
from app.services.resume.generator import ResumeGenerator
import os
import uuid

router = APIRouter()
generator = ResumeGenerator()

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "generated_resumes")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def cleanup_file(path: str):
    if os.path.exists(path):
        os.remove(path)

@router.post("/generate")
def generate_resume(data: ResumeData, background_tasks: BackgroundTasks):
    try:
        filename = f"resume_{uuid.uuid4()}.docx"
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        # Convert Pydantic model to dict
        resume_dict = data.dict()
        
        generator.generate(resume_dict, filepath)
        
        if not os.path.exists(filepath):
            raise HTTPException(status_code=500, detail="Failed to generate resume file")
            
        # Schedule file deletion after sending (optional, to keep server clean)
        # background_tasks.add_task(cleanup_file, filepath)
        
        return FileResponse(filepath, filename=f"{data.name.replace(' ', '_')}_Resume.docx", media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save")
async def save_resume_data(data: ResumeData):
    try:
        # Save to a JSON file (simple persistence for this user)
        filepath = os.path.join(OUTPUT_DIR, "current_resume.json")
        with open(filepath, "w") as f:
            f.write(data.json())
        return {"message": "Resume saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/load")
async def load_resume_data():
    try:
        filepath = os.path.join(OUTPUT_DIR, "current_resume.json")
        if not os.path.exists(filepath):
             # Return default/empty structure if no save exists
            return {
                "personal_info": {"name": "Your Name", "email": "email@example.com", "phone": "123-456-7890", "linkedin": "linkedin.com/in/you", "github": "github.com/you"},
                "education": [],
                "experience": [],
                "projects": [],
                "skills": []
            }
            
        with open(filepath, "r") as f:
            return FileResponse(filepath, media_type="application/json")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.post("/tailor")
def tailor_resume(request: dict):
    # Expects {'resume_text': str, 'job_description': str, 'api_key': str}
    try:
        api_key = request.get('api_key')
        resume_text = request.get('resume_text')
        job_description = request.get('job_description')

        if not api_key:
             # Fallback to env var or error
             # For now, require it from client for privacy/demo purposes
             pass

        if not resume_text or not job_description:
            raise HTTPException(status_code=400, detail="Missing Resume Data or Job Description")

        # Temporary: use server-side key if client doesn't provide one (for testing)
        # In prod, user should provide key
        if not api_key:
             # Try to get from settings or env
             # For this demo, we might need to handle this. 
             # Let's assume the frontend sends it or we use a default if configured.
             # raising error for now if missing
             if not os.getenv("GEMINI_API_KEY"):
                raise HTTPException(status_code=400, detail="Missing API Key")
             api_key = os.getenv("GEMINI_API_KEY")

        from app.services.resume.ai_tailor import AITailor
        tailor = AITailor(api_key)
        # tailor_resume now returns a dict with latex_code and explanation
        result = tailor.tailor_resume(resume_text, job_description)
        
        return {
            "tailored_resume": result.get("latex_code", ""),
            "message": result.get("explanation", "I've tailored your resume.")
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        # Check if it's a Google API error
        error_str = str(e)
        if "403" in error_str and "Generative Language API" in error_str:
             raise HTTPException(
                status_code=403, 
                detail="Google Generative Language API is disabled. Please enable it in your Google Cloud Console."
            )
        if "429" in error_str:
             raise HTTPException(
                status_code=429,
                detail="Too many requests. Please try again later."
            )
        if "400" in error_str:
             raise HTTPException(status_code=400, detail=f"Bad Request: {error_str}")

        print(f"Tailor Error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {error_str}")

@router.post("/import")
async def import_resume(file: UploadFile, api_key: str, format: str = "json"):
    try:
        from app.services.resume.parser import ResumeParser
        parser = ResumeParser(api_key)
        parsed_data = await parser.parse_file(file)
        
        if format == "latex":
             # Load Jake Ryan template
            template_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "templates", "jake_ryan.tex")
            if not os.path.exists(template_path):
                 # Fallback if template is missing (should verify this path)
                 raise HTTPException(status_code=500, detail="Template file not found")
            
            with open(template_path, "r") as f:
                template_content = f.read()

            from app.services.resume.ai_tailor import AITailor
            tailor = AITailor(api_key)
            latex_code = tailor.convert_json_to_latex(parsed_data, template_content)
            return {"latex": latex_code, "json": parsed_data}

        return parsed_data
    except Exception as e:
        print(f"Import Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class CompileRequest(BaseModel):
    latex_code: str

@router.post("/compile")
async def compile_latex(request: CompileRequest):
    try:
        # Create a unique job ID
        job_id = str(uuid.uuid4())
        job_dir = os.path.join(OUTPUT_DIR, job_id)
        os.makedirs(job_dir, exist_ok=True)
        
        tex_file = os.path.join(job_dir, "resume.tex")
        pdf_file = os.path.join(job_dir, "resume.pdf")
        
        # Write LaTeX code to file
        with open(tex_file, "w") as f:
            f.write(request.latex_code)
            
        # Run pdflatex
        # -interaction=nonstopmode prevents hanging on errors
        # -output-directory ensures output goes to the right place
        try:
            import subprocess
            process = subprocess.run(
                ["pdflatex", "-interaction=nonstopmode", "-output-directory", job_dir, tex_file],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=30 # Timeout after 30 seconds
            )
            
            if process.returncode != 0:
                # Capture log if available
                log_file = os.path.join(job_dir, "resume.log")
                error_log = "PDF compilation failed.\n"
                if os.path.exists(log_file):
                    with open(log_file, "r", errors='ignore') as f:
                        # Get last 20 lines of log
                        lines = f.readlines()
                        error_log += "".join(lines[-20:])
                else:
                    error_log += process.stdout.decode('utf-8', errors='ignore')
                    
                raise Exception(error_log)
                
        except FileNotFoundError:
             raise HTTPException(status_code=500, detail="pdflatex command not found. Please install TeX Live (sudo apt-get install texlive-latex-base).")
        except subprocess.TimeoutExpired:
             raise HTTPException(status_code=500, detail="Compilation timed out.")

        if not os.path.exists(pdf_file):
             raise HTTPException(status_code=500, detail="PDF file was not generated.")

        return FileResponse(pdf_file, filename="resume.pdf", media_type="application/pdf")
        
    except HTTPException as he:
        raise he
    except Exception as e:
        # Clean up on error (optional)
        # shutil.rmtree(job_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=str(e))
