🚀 CVMorph — AI-Powered Resume Morphing Engine

CVMorph is an intelligent resume tailoring platform built to eliminate the “one-resume-fits-all” problem.

It leverages a dual-AI inference engine (Google Gemini + Groq) to transform a single master resume into highly targeted, ATS-optimized versions—aligned with specific job descriptions—without ever fabricating experience.

🌟 Why CVMorph?

Most candidates lose opportunities not because of lack of skill, but because their resumes don’t align with ATS filters.

CVMorph solves that by:

Structuring messy resumes into machine-readable data
Aligning keywords with job descriptions
Enhancing clarity and impact of bullet points
Maintaining 100% factual integrity (no hallucinations)
✨ Key Features
🧠 Dual-AI Inference Engine
Parses PDF, DOCX, and TXT resumes into structured JSON
Extracts metrics and improves phrasing
Dynamically aligns resume with job descriptions
🚫 Zero Hallucination Policy
Strict prompt constraints
No fake skills, roles, or achievements
Only reframes and enhances existing data
📄 ATS-Optimized Resume Export
Clean, standardized PDF generation using Puppeteer
LaTeX-inspired formatting for maximum readability
🗂️ Master Resume Versioning
ResumeBase: single source of truth
ResumeVersion: unlimited tailored versions
Track resumes per job application
🎨 Modern UI/UX
Glassmorphic design
Smooth animations with Framer Motion
Fully responsive dashboard
🛠️ Tech Stack
Frontend
Framework: Next.js 16 (App Router), React 19
Styling: Tailwind CSS v4
Animations: Framer Motion
UI & Icons: Lucide React, Custom Components
HTTP Client: Axios
Backend
Runtime: Node.js, Express.js
Database: PostgreSQL + Prisma ORM
Authentication: JWT, bcryptjs
AI Layer
Google Gemini SDK
Groq SDK
Fallback architecture for high availability
File Handling
multer — File uploads
pdfjs-dist — PDF parsing
mammoth — DOCX parsing
puppeteer — PDF generation
📐 Architecture Overview
Client (Next.js)
      ↓
API Layer (Express.js)
      ↓
Database (PostgreSQL + Prisma)
      ↓
AI Processing Layer (Gemini ↔ Groq fallback)
Flow Breakdown:
Client Layer
Handles UI, authentication, and resume editing
API Layer
Secure endpoints
File uploads & validation
AI request orchestration
Data Layer
Users
ResumeBase (original resume)
ResumeVersion (tailored outputs)
AI Layer
Converts unstructured text → structured JSON
Applies semantic transformations
🧠 AI Processing Workflow
Upload Resume
User uploads PDF/DOCX/TXT
Text Extraction
Parsed using pdfjs-dist / mammoth
Structuring
AI converts raw text into strict JSON schema
Resume Morphing
Combines JSON + Job Description
Rewrites bullets and optimizes keyword density
PDF Generation
Puppeteer renders ATS-friendly resume
🚀 Getting Started
✅ Prerequisites
Node.js (v18+)
PostgreSQL running locally or remotely
API Keys:
Google Gemini
Groq
🔧 Backend Setup
cd backend
npm install

# Setup environment variables
cp .env.example .env

Update .env with:

DATABASE_URL=
JWT_SECRET=
GROQ_API_KEY=
GEMINI_API_KEY=
# Initialize database
npm run prisma:generate
npm run prisma:push

# Start backend server (port 5000)
npm run dev
💻 Frontend Setup
cd frontend
npm install

# Start frontend (port 3000)
npm run dev
📁 Project Structure
CVMorph/
│
├── frontend/        # Next.js App
├── backend/         # Express API
├── prisma/          # Database schema
├── public/          # Static assets
└── README.md
🔐 Security & Design Principles
JWT-based authentication
Encrypted passwords with bcrypt
Schema-constrained AI outputs
Strict separation of concerns
Scalable and modular architecture
🎯 Use Cases
Job-specific resume customization
ATS optimization
Recruiter-ready resume generation
Resume analytics and tracking (future scope)
🛣️ Future Improvements
🔍 ATS score visualization dashboard
📊 Resume performance tracking
🤖 Auto job scraping + matching
🧩 Chrome extension for quick tailoring
🌐 Multi-language resume support
🛡️ License

This project is licensed under the MIT License.

👨‍💻 Author

Built with intent to solve real hiring inefficiencies and improve candidate success rates.
