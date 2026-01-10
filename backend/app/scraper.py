import requests
from bs4 import BeautifulSoup
import re

class WikipediaScraper:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

    def scrape(self, url: str):
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract Title
            title = soup.find('h1', id='firstHeading').text.strip()
            
            # Extract Summary (usually the paragraphs before the first heading)
            content_div = soup.find('div', class_='mw-parser-output')
            summary = ""
            paragraphs = content_div.find_all('p', recursive=False)
            for p in paragraphs:
                if p.text.strip():
                    summary += p.text.strip() + "\n"
                    if len(summary) > 500: # Limit summary size
                        break
            
            # Extract Sections
            sections = []
            for h2 in soup.find_all('h2'):
                span = h2.find('span', class_='mw-headline')
                if span:
                    sections.append(span.text.strip())
            
            # Extract Full Text for LLM
            # We want to keep it structured but clean
            full_text = ""
            for element in content_div.find_all(['p', 'h2', 'h3'], recursive=False):
                if element.name == 'p':
                    full_text += element.text.strip() + "\n"
                else:
                    full_text += f"\nSection: {element.text.strip()}\n"
            
            # Minor entity extraction (bold terms)
            entities = []
            for p in paragraphs[:3]:
                for b in p.find_all('b'):
                    entities.append(b.text.strip())
            
            return {
                "title": title,
                "summary": summary[:1000],
                "sections": sections,
                "full_text": full_text[:4000], 
                "entities": list(set(entities)),
                "raw_html": response.text
            }
        except Exception as e:
            print(f"Scraping error: {e}")
            raise e

if __name__ == "__main__":
    scraper = WikipediaScraper()
    data = scraper.scrape("https://en.wikipedia.org/wiki/Alan_Turing")
    print(data['title'])
    print(data['sections'])
