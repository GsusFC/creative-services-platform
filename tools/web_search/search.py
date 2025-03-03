#!/usr/bin/env python3
"""
Simple web search tool using DuckDuckGo
"""

import sys
import requests
from bs4 import BeautifulSoup
import json

def search_duckduckgo(query, num_results=5):
    """
    Search DuckDuckGo and return results
    """
    url = f"https://duckduckgo.com/html/?q={query}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")
        
        results = []
        for result in soup.select(".result__body")[:num_results]:
            title_elem = result.select_one(".result__title")
            link_elem = result.select_one(".result__url")
            snippet_elem = result.select_one(".result__snippet")
            
            if title_elem and link_elem:
                title = title_elem.get_text().strip()
                link = link_elem.get_text().strip()
                snippet = snippet_elem.get_text().strip() if snippet_elem else ""
                
                results.append({
                    "title": title,
                    "url": link,
                    "snippet": snippet
                })
        
        return results
    except Exception as e:
        return [{"error": str(e)}]

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python search.py 'your search query'")
        sys.exit(1)
    
    query = sys.argv[1]
    num_results = int(sys.argv[2]) if len(sys.argv) > 2 else 5
    
    results = search_duckduckgo(query, num_results)
    print(json.dumps(results, indent=2))
