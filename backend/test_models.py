import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("Error: GOOGLE_API_KEY not found in .env")
else:
    genai.configure(api_key=api_key)
    print("Listing ALL available models...")
    try:
        models = genai.list_models()
        for m in models:
            print(f"Name: {m.name}")
            print(f"DisplayName: {m.display_name}")
            print(f"SupportedMethods: {m.supported_generation_methods}")
            print("-" * 20)
    except Exception as e:
        print(f"Error listing models: {e}")
