import os
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

class QuizQuestion(BaseModel):
    question: str = Field(description="The quiz question text")
    options: List[str] = Field(description="Four multiple choice options (A, B, C, D)")
    answer: str = Field(description="The correct answer matching one of the options")
    difficulty: str = Field(description="Easy, Medium, or Hard")
    explanation: str = Field(description="Short explanation for the correct answer")

class QuizOutput(BaseModel):
    quiz: List[QuizQuestion]
    related_topics: List[str]
    people: List[str]
    organizations: List[str]
    locations: List[str]

class LLMService:
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment")
        
        print(f"Initializing LLM with model: gemini-2.5-flash-lite")
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash-lite",
            google_api_key=api_key,
            temperature=0.7
        )
        self.parser = PydanticOutputParser(pydantic_object=QuizOutput)

    def generate_quiz(self, article_title: str, article_text: str):
        prompt_template = """
        You are a teaching assistant. Based on the Wikipedia article content below, generate a quiz with 5 to 10 questions.
        
        Article Title: {title}
        Article Content: {content}
        
        Format the output as a valid JSON object matching this structure:
        {{
          "quiz": [
            {{
              "question": "...",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "answer": "The correct option text exactly as in options",
              "difficulty": "easy/medium/hard",
              "explanation": "..."
            }}
          ],
          "related_topics": ["Topic 1", "Topic 2", "Topic 3"],
          "people": ["Person 1", "Person 2"],
          "organizations": ["Org 1", "Org 2"],
          "locations": ["Loc 1", "Loc 2"]
        }}
        
        Ensure every question is grounded in the provided text. 
        Avoid technical jargon unless explained in the text.
        The questions should cover different sections of the article.
        
        {format_instructions}
        """
        
        prompt = PromptTemplate(
            template=prompt_template,
            input_variables=["title", "content"],
            partial_variables={"format_instructions": self.parser.get_format_instructions()}
        )
        
        formatted_input = prompt.format(title=article_title, content=article_text[:4000])
        response = self.llm.invoke(formatted_input)
        
        try:
            content = response.content
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            
            return json.loads(content)
        except Exception as e:
            print(f"Error parsing LLM response: {e}")
            raise e
