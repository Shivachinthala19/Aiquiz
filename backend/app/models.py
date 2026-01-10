from sqlalchemy import Column, Integer, String, JSON, Text, DateTime
from .database import Base
import datetime

class QuizSession(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    title = Column(String)
    summary = Column(Text)
    sections = Column(JSON) # List of section names
    key_entities = Column(JSON) # {people: [], organizations: [], locations: []}
    quiz_data = Column(JSON) # List of question objects
    related_topics = Column(JSON) # List of strings
    raw_html = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
