# AI Wikipedia Quiz Generator

A full-stack application that scrapes Wikipedia articles and generates interactive quizzes using Google Gemini LLM via LangChain.

## Features

- **Tab 1: Generate Quiz** - Provide a Wikipedia URL, scrape content, and generate a 5-10 question quiz.
- **Tab 2: History** - View previously generated quizzes and their results.
- **Take Quiz Mode** - Interactive quiz interface with scoring and explanations.
- **Entity Extraction** - Automatically identifies key people, organizations, and locations.
- **Related Topics** - Suggests further reading based on article content.

## Tech Stack

- **Backend:** FastAPI (Python)
- **Database:** SQLite (SQLAlchemy, easy to switch to MySQL/Postgres)
- **LLM:** Google Gemini 1.5 Pro via LangChain
- **Scraper:** BeautifulSoup4
- **Frontend:** React + Vite
- **Styling:** Vanilla CSS (Glassmorphism design)

## Setup Instructions

### Backend Setup

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the `backend` folder and add your Google Gemini API Key:
   ```env
   GOOGLE_API_KEY=your_actual_api_key_here
   DATABASE_URL=sqlite:///./quiz.db
   ```
4. Run the FastAPI server:
   ```bash
   python -m app.main
   ```
   The backend will be available at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

## API Endpoints

- `POST /generate`: Body `{"url": "..."}` - Scrapes and generates a quiz.
- `GET /history`: Returns a list of all previously processed quizzes.
- `GET /quiz/{id}`: Returns full details of a specific quiz.

## Prompt Engineering

The system uses a structured prompt template in `backend/app/llm.py` that enforces:
- Grounding in article content to prevent hallucinations.
- Specific JSON output format for UI consumption.
- Difficulty level classification.
- Entity and related topic extraction.

---
Built with ❤️ by Antigravity
