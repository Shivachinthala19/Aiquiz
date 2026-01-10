import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

with open('model_dump.txt', 'w') as f:
    f.write("DUMP_START\n")
    try:
        for m in genai.list_models():
            f.write(f"{m.name}\n")
    except Exception as e:
        f.write(f"ERROR:{e}\n")
    f.write("DUMP_END\n")
print("Done writing dump")
