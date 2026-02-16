# CareerOS

**CareerOS** is an AI-powered job application tracking and resume building platform. It helps you manage your job search, track applications, and tailor your resume for specific job descriptions using generative AI.

## Features

-   **Job Tracker**: Kanban-style board to track applications (Applied, Interviewing, Offer, Rejected).
-   **AI Resume Builder**: Create and edit LaTeX resumes with a live preview.
-   **AI Tailoring**: Automatically tailor your resume content to match a specific Job Description using Google's Gemini AI.
-   **Networking**: Manage professional contacts and companies.

## Prerequisites

-   **Node.js** (v18 or higher)
-   **Python** (v3.10 or higher)
-   **Google Gemini API Key** (Required for AI features)

## Setup Instructions

### 1. Functionality Check
Ensure you have the necessary system dependencies.
If you are on Linux, install `pdflatex` and common packages for resume compilation:
```bash
sudo apt-get install texlive-latex-base texlive-fonts-recommended texlive-fonts-extra texlive-latex-extra
```

### 2. Start the Application
We have provided a helper script to start both the Backend (Python/FastAPI) and Frontend (React/Vite) servers with one command.

Run the following in your terminal:
```bash
./start_server.sh
```

This will:
1.  Install backend dependencies (if needed).
2.  Start the Backend server on `http://localhost:8081`.
3.  Start the Frontend server on `http://localhost:5173`.

### 3. Configure API Key
Once the application is running:
1.  Open your browser to [http://localhost:5173](http://localhost:5173).
2.  Go to the **Settings** page (Sidebar > Settings).
3.  Enter your **Gemini API Key**.
4.  Click **Save**.

*Note: You can get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).*

## Usage

-   **Dashboard**: Overview of your application status.
-   **Job Tracker**: Add new jobs, drag and drop to change status, and view details.
-   **Resume Builder**:
    -   Write your resume in LaTeX (or use the template).
    -   Click **Compile** to see the PDF preview.
    -   Paste a Job Description in the **AI Chat** and click **Send** to tailor your resume.
    -   Click **Download PDF** to save your resume.

## Troubleshooting

-   **Backend not starting?** Check `backend.log` for errors.
-   **AI Tailoring error 403?** Ensure your Gemini API key is valid and the "Generative Language API" is enabled in your Google Cloud Console project.

## Development

-   **Backend**: `backend/app/` (FastAPI)
-   **Frontend**: `frontend-react/src/` (React + TypeScript + Tailwind)
