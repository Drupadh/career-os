import google.generativeai as genai
import json
import os

class AITailor:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        # Using gemini-2.0-flash for speed and cost effectiveness, or pro if needed. 
        # flash is usually good for JSON tasks.
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    def tailor_resume(self, resume_latex: str, job_description: str) -> dict:
        prompt = f"""
        You are an EXPERT resume writer specializing in ATS-optimized, single-page resumes using the Jake Ryan LaTeX template.
        
        **INPUTS:**
        1. CURRENT RESUME (LaTeX format)
        2. USER INPUT (either a Job Description OR a direct instruction like "make it one page", "remove X")
        
        **YOUR MISSION:**
        Modify the resume to either:
        A) **Tailor it for a Job Description** - Optimize for ATS scoring and keyword matching
        B) **Follow a Direct Instruction** - Execute exactly what the user asks
        
        ---
        
        **CRITICAL FORMATTING RULES (JAKE RYAN STYLE):**
        
        1. **Experience/Education Structure:**
           ```latex
           \\resumeSubheading{{COMPANY/SCHOOL NAME}}{{Location}}{{Job Title/Degree}}{{Dates}}
           ```
           - **COMPANY/SCHOOL NAME** goes FIRST (bold) - NOT the title!
           - Example: `\\resumeSubheading{{Accenture}}{{Bengaluru, India}}{{Advanced Associate Software Engineer}}{{Aug 2022 -- May 2023}}`
        
        2. **Bullet Points:**
           - Start with strong action verbs: "Managed", "Designed", "Implemented", "Automated"
           - Include quantifiable results: "95% uptime", "200+ users", "30% reduction"
           - Keep concise (1-2 lines max per bullet)
           - Use technical keywords relevant to the role
        
        3. **One-Page Optimization (if requested):**
           - Remove older/less relevant experience first
           - Condense bullet points (merge similar ones)
           - Reduce `\\vspace` aggressively: `\\vspace{{-7pt}}` or `\\vspace{{-5pt}}`
           - Keep only 3-4 bullets per role
           - Prioritize most relevant content

        4. **ATS Optimization:**
           - Mirror keywords from job description naturally in bullets
           - Use industry-standard terms (e.g., "Active Directory" not "AD")
           - Include certifications and tools mentioned in JD
           - Quantify achievements wherever possible
        
        5. **Professional Summary:**
           - If tailoring: Rewrite to mirror the job posting's requirements
           - Keep to 2-3 lines maximum
           - Lead with role title + certifications + years of experience
           - Example: "Network & Security Analyst with CCNA and Security+ certifications..."
        
        6. **Technical Skills:**
           - Reorder skills to match JD priorities
           - Format: `\\textbf{{Category}}{{: Item1, Item2, Item3}}`
           - Categories: Networking, Security, Systems, Tools/Languages
        
        ---
        
        **INSTRUCTION HANDLING:**
        
        - **"Make it one page"** → Aggressively condense, remove least relevant content, reduce spacing
        - **"Remove X but keep Y"** → Delete X sections/roles entirely, emphasize Y
        - **"Add certification Z"** → Add to Certifications section with proper formatting
        - **"Tailor for [job]"** → Treat as JD tailoring, optimize keywords
        
        ---
        
        **OUTPUT REQUIREMENTS:**
        
        Return a JSON object with:
        1. `latex_code`: The COMPLETE, compile-ready LaTeX document (including preamble)
        2. `explanation`: A natural, 1-sentence summary of what you changed
        
        Example explanation:
        - "I've removed your older Accenture role and condensed your DePaul bullets to fit everything on one page."
        - "I've tailored your summary and experience bullets to match the Network Engineer keywords from the job posting."
        
        **DO NOT:**
        - Return markdown code blocks
        - Fabricate experience
        - Strip the LaTeX preamble/documentclass
        - Use generic/weak language
        
        ---
        
        **CURRENT RESUME:**
        ```latex
        {resume_latex}
        ```
        
        **USER INPUT:**
        {job_description}
        
        **OUTPUT (JSON only):**
        """

        try:
            response = self.model.generate_content(prompt)
            text = response.text.replace("```json", "").replace("```", "").strip()
            import json
            data = json.loads(text)
            return data
        except Exception as e:
            print(f"Error tailoring resume: {e}")
            # Robust fallback
            return {
                "latex_code": resume_latex,  # Return original if parsing fails
                "explanation": "I encountered an error processing your request. Please try rephrasing your instruction."
            }

    def convert_json_to_latex(self, resume_json: dict, latex_template: str) -> str:
        prompt = f"""
        You are an expert LaTeX typesetter. I have a resume in JSON format and a specific LaTeX template.
        Your task is to transfer the content from the JSON into the LaTeX template, maintaining the exact formatting and structure of the template.

        INSTRUCTIONS:
        1. Use the "Jake Ryan" template structure provided below.
        2. Replace the placeholder data with data from the JSON.
        3. **MAPPING RULES** (Critical):
           - `\\resumeSubheading{{Arg1}}{{Arg2}}{{Arg3}}{{Arg4}}`
           - **Arg1 (Bold)**: Company Name (or School Name for Education).
           - **Arg2 (Regular)**: Location.
           - **Arg3 (Italic)**: Job Title (or Degree for Education).
           - **Arg4 (Italic)**: Dates.
           - Example: `\\resumeSubheading{{Google}}{{Mountain View, CA}}{{Software Engineer}}{{Jan 2020 -- Present}}`
        4. Create `\\resumeSubheading` blocks for each entry in Experience and Education.
        5. Use `\\resumeProjectHeading{{Arg1}}{{Arg2}}` for Projects.
           - Arg1: Project Name | Tech Stack
           - Arg2: Dates
        6. **CERTIFICATIONS** (Intelligent, Minimal Format):
           - Analyze the certifications in the JSON
           - Format inline, separated by PIPE character: " | " (space-pipe-space)
           - Use \\href to create clickable links, but display ONLY the cert name (hide URL)
           - Keep it clean and minimal - NO underlines, NO visible URLs
           - EXACT template:
           ```latex
           \\section{{Certifications}}
             \\resumeSubHeadingListStart
               \\small{{\\item{{
                 \\href{{<url>}}{{CCNA}} (Cisco) | \\href{{<url>}}{{Security+}} (CompTIA) | \\href{{<url>}}{{SC-900}} (Microsoft)
               }}}}
             \\resumeSubHeadingListEnd
           ```
           - CRITICAL: Use " | " (pipe) as separator, NOT dashes or other characters
           - Cert names are plain text (not bold, not underlined) but clickable
           - If no URL: just plain text `CCNA (Cisco)`
           - Keep minimal spacing, all on one line
        7. **HANDLE ALL SECTIONS**: If the JSON contains additional sections like:
           - Certifications (with or without URLs)
           - Awards
           - Publications
           - Volunteer Work
           - Languages
           - Licenses
           Create appropriate sections in LaTeX using the same format as other sections. For certifications/awards, use bullet points or simple lists.
        8. **PRESERVE HYPERLINKS**: If any field in the JSON contains URLs (email, LinkedIn, GitHub, certification links), convert them to LaTeX hyperlinks: `\\href{{URL}}{{\\underline{{Text}}}}`
        9. Escape special LaTeX characters (e.g., &, $, %, #, _, {{, }}) in the content to prevent compilation errors.
        10. If a section is empty in JSON, omit it in LaTeX.
        11. Return ONLY the full, compile-ready LaTeX code. No markdown.

        RESUME JSON:
        {json.dumps(resume_json, indent=2)}

        LATEX TEMPLATE:
        {latex_template}

        OUTPUT:
        Return only the raw LaTeX code.
        """
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text.replace("```latex", "").replace("```", "").strip()
            # Basic cleanup if Gemini adds markdown
            if text.startswith("json"): text = text[4:]
            return text
        except Exception as e:
            print(f"Error converting to latex: {e}")
            raise e

