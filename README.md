# Devin-like Capabilities for Windsurf

This project has been enhanced with Devin-like capabilities using the configuration from [devin.cursorrules](https://github.com/grapeot/devin.cursorrules).

## Features

- **Planning and Execution**: The AI assistant can now plan, execute, and learn from actions to solve complex programming tasks.
- **Extended Toolset**: Includes web search, web scraping, and code analysis capabilities.
- **Self-Evolution**: The AI can update its understanding based on feedback and lessons learned.

## Available Tools

### Web Search
Search the web for information:
```
python tools/web_search/search.py "your search query" [num_results]
```

### Web Scraping
Extract data from websites:
```
python tools/web_scraping/scrape.py "url" "optional_css_selector"
```

### Code Analysis
Analyze code files to extract key information:
```
python tools/code_analysis/analyze.py "file_path"
```

## Requirements

To use the web scraping tool, you'll need to install Playwright:
```
pip install playwright
playwright install
```

For other tools:
```
pip install requests beautifulsoup4
```

## Configuration Files

- `.windsurfrules`: Contains instructions for the Windsurf AI assistant
- `scratchpad.md`: A working area for planning, tracking progress, and documenting lessons learned

## Usage

Simply continue using Windsurf as normal. The AI assistant now has enhanced capabilities to help with your development tasks.
