from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os

from . import models, schemas, database, scraper, llm

# Create DB tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="AI Wiki Quiz API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "AI Wiki Quiz API is running"}

wiki_scraper = scraper.WikipediaScraper()
llm_service = llm.LLMService()

@app.post("/generate", response_model=schemas.QuizResponse)
async def generate_quiz(request: schemas.QuizCreate, db: Session = Depends(database.get_db)):
    existing = db.query(models.QuizSession).filter(models.QuizSession.url == request.url).first()
    if existing:
        return {
            "id": existing.id,
            "url": existing.url,
            "title": existing.title,
            "summary": existing.summary,
            "sections": existing.sections,
            "key_entities": existing.key_entities,
            "quiz": existing.quiz_data,
            "related_topics": existing.related_topics,
            "created_at": existing.created_at
        }

    try:
        scraped_data = wiki_scraper.scrape(request.url)
        generated_data = llm_service.generate_quiz(
            scraped_data['title'], 
            scraped_data['full_text']
        )
        
        new_quiz = models.QuizSession(
            url=request.url,
            title=scraped_data['title'],
            summary=scraped_data['summary'],
            sections=scraped_data['sections'],
            key_entities={
                "people": generated_data.get('people', []),
                "organizations": generated_data.get('organizations', []),
                "locations": generated_data.get('locations', [])
            },
            quiz_data=generated_data.get('quiz', []),
            related_topics=generated_data.get('related_topics', []),
            raw_html=scraped_data['raw_html']
        )
        
        db.add(new_quiz)
        db.commit()
        db.refresh(new_quiz)
        
        return {
            "id": new_quiz.id,
            "url": new_quiz.url,
            "title": new_quiz.title,
            "summary": new_quiz.summary,
            "sections": new_quiz.sections,
            "key_entities": new_quiz.key_entities,
            "quiz": new_quiz.quiz_data,
            "related_topics": new_quiz.related_topics,
            "created_at": new_quiz.created_at
        }
        
    except Exception as e:
        print(f"Error in generation flow: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history", response_model=List[schemas.QuizHistoryItem])
async def get_history(db: Session = Depends(database.get_db)):
    return db.query(models.QuizSession).order_by(models.QuizSession.created_at.desc()).all()

@app.get("/quiz/{quiz_id}", response_model=schemas.QuizResponse)
async def get_quiz_details(quiz_id: int, db: Session = Depends(database.get_db)):
    quiz = db.query(models.QuizSession).filter(models.QuizSession.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
        
    return {
        "id": quiz.id,
        "url": quiz.url,
        "title": quiz.title,
        "summary": quiz.summary,
        "sections": quiz.sections,
        "key_entities": quiz.key_entities,
        "quiz": quiz.quiz_data,
        "related_topics": quiz.related_topics,
        "created_at": quiz.created_at
    }

@app.delete("/quiz/{quiz_id}")
async def delete_quiz(quiz_id: int, db: Session = Depends(database.get_db)):
    quiz = db.query(models.QuizSession).filter(models.QuizSession.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    db.delete(quiz)
    db.commit()
    return {"message": "Quiz deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
