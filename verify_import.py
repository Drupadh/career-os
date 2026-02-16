import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.services.resume.ai_tailor import AITailor

# Mock data
dummy_json = {
    "personal_info": {"name": "Test User", "email": "test@example.com", "phone": "123-456-7890"},
    "education": [{"school": "Test Univ", "degree": "BS CS", "dates": "2020-2024", "location": "City"}],
    "experience": [],
    "projects": [],
    "skills": {"languages": "Python", "frameworks": "FastAPI", "tools": "Git"}
}

# Verify template path
template_path = os.path.join(os.getcwd(), 'backend/app/templates/jake_ryan.tex')
if not os.path.exists(template_path):
    print(f"ERROR: Template not found at {template_path}")
    sys.exit(1)

with open(template_path, 'r') as f:
    template_content = f.read()

print("Template found. Length:", len(template_content))

# Test Conversion (requires API key)
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # Try to load from .env if possible, or just skip the actual API call if we can't find it
    print("WARNING: GEMINI_API_KEY not set. Skipping API call.")
else:
    try:
        tailor = AITailor(api_key)
        print("Tailor initialized. Converting...")
        latex = tailor.convert_json_to_latex(dummy_json, template_content)
        print("Conversion successful!")
        print("Preview:", latex[:500])
        
        # Check mapping
        # Expecting \resumeSubheading{Test Univ}{City}{BS CS}{2020-2024}
        if "{Test Univ}{City}{BS CS}" in latex:
             print("SUCCESS: Mapping appears correct (School/Company first).")
        else:
             print("WARNING: Mapping might be incorrect. check preview.")
             
    except Exception as e:
        print(f"ERROR calling Gemini: {e}")
