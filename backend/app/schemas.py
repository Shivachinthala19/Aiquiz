from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime

class QuizQuestionSchema(BaseModel):
    question: str
    options: List[str]
    answer: str
    difficulty: str
    explanation: str

class QuizBase(BaseModel):
    url: str

class QuizCreate(QuizBase):
    pass

class QuizResponse(BaseModel):
    id: int
    url: str
    title: str
    summary: str
    sections: List[str]
    key_entities: Dict[str, List[str]]
    quiz: List[QuizQuestionSchema]
    related_topics: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

class QuizHistoryItem(BaseModel):
    id: int
    url: str
    title: str
    created_at: datetime

    class Config:
        from_attributes = True
