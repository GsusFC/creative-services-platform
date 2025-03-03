#!/usr/bin/env python3
"""
Simple web scraping tool using Playwright
"""

import sys
import json
import asyncio
from playwright.async_api import async_playwright

async def scrape_page(url, selector=None):
    """
    Scrape content from a webpage
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            
            # Take a screenshot for verification
            await page.screenshot(path="screenshot.png")
            
            if selector:
                # Wait for the selector to be available
                await page.wait_for_selector(selector, timeout=5000)
                elements = await page.query_selector_all(selector)
                
                results = []
                for element in elements:
                    text = await element.inner_text()
                    results.append(text.strip())
                
                await browser.close()
                return {
                    "url": url,
                    "selector": selector,
                    "results": results
                }
            else:
                # Get the entire page content
                content = await page.content()
                title = await page.title()
                
                await browser.close()
                return {
                    "url": url,
                    "title": title,
                    "content_length": len(content)
                }
        except Exception as e:
            await browser.close()
            return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scrape.py 'url' 'optional_selector'")
        sys.exit(1)
    
    url = sys.argv[1]
    selector = sys.argv[2] if len(sys.argv) > 2 else None
    
    result = asyncio.run(scrape_page(url, selector))
    print(json.dumps(result, indent=2))
