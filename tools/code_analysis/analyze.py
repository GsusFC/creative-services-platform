#!/usr/bin/env python3
"""
Simple code analysis tool
"""

import sys
import os
import json
import re

def analyze_file(file_path):
    """
    Analyze a code file and extract key information
    """
    if not os.path.exists(file_path):
        return {"error": f"File not found: {file_path}"}
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        file_extension = os.path.splitext(file_path)[1].lower()
        
        result = {
            "file_path": file_path,
            "size_bytes": os.path.getsize(file_path),
            "line_count": content.count('\n') + 1,
            "language": get_language_from_extension(file_extension),
        }
        
        # Extract imports/dependencies
        if file_extension in ['.py', '.js', '.ts', '.tsx', '.jsx']:
            result["imports"] = extract_imports(content, file_extension)
        
        # Extract functions/classes
        if file_extension in ['.py', '.js', '.ts', '.tsx', '.jsx']:
            result["functions"] = extract_functions(content, file_extension)
            result["classes"] = extract_classes(content, file_extension)
        
        return result
    except Exception as e:
        return {"error": str(e)}

def get_language_from_extension(extension):
    """
    Determine programming language from file extension
    """
    extension_map = {
        '.py': 'Python',
        '.js': 'JavaScript',
        '.ts': 'TypeScript',
        '.jsx': 'React JSX',
        '.tsx': 'React TSX',
        '.html': 'HTML',
        '.css': 'CSS',
        '.scss': 'SCSS',
        '.json': 'JSON',
        '.md': 'Markdown',
        '.java': 'Java',
        '.rb': 'Ruby',
        '.go': 'Go',
        '.rs': 'Rust',
        '.php': 'PHP',
        '.c': 'C',
        '.cpp': 'C++',
        '.cs': 'C#',
    }
    return extension_map.get(extension, 'Unknown')

def extract_imports(content, extension):
    """
    Extract import statements from code
    """
    imports = []
    
    if extension == '.py':
        # Python imports
        import_patterns = [
            r'import\s+([\w\.]+)',
            r'from\s+([\w\.]+)\s+import\s+(.+)'
        ]
        for pattern in import_patterns:
            for match in re.finditer(pattern, content):
                imports.append(match.group(0).strip())
    
    elif extension in ['.js', '.ts', '.jsx', '.tsx']:
        # JavaScript/TypeScript imports
        import_patterns = [
            r'import\s+.*?from\s+[\'"](.+?)[\'"]',
            r'require\([\'"](.+?)[\'"]\)'
        ]
        for pattern in import_patterns:
            for match in re.finditer(pattern, content):
                imports.append(match.group(0).strip())
    
    return imports

def extract_functions(content, extension):
    """
    Extract function definitions from code
    """
    functions = []
    
    if extension == '.py':
        # Python functions
        for match in re.finditer(r'def\s+(\w+)\s*\(', content):
            functions.append(match.group(0) + '...)')
    
    elif extension in ['.js', '.ts', '.jsx', '.tsx']:
        # JavaScript/TypeScript functions
        function_patterns = [
            r'function\s+(\w+)\s*\(',
            r'const\s+(\w+)\s*=\s*\([^)]*\)\s*=>',
            r'(\w+)\s*:\s*function\s*\('
        ]
        for pattern in function_patterns:
            for match in re.finditer(pattern, content):
                functions.append(match.group(0) + '...)')
    
    return functions

def extract_classes(content, extension):
    """
    Extract class definitions from code
    """
    classes = []
    
    if extension == '.py':
        # Python classes
        for match in re.finditer(r'class\s+(\w+)', content):
            classes.append(match.group(0))
    
    elif extension in ['.js', '.ts', '.jsx', '.tsx']:
        # JavaScript/TypeScript classes
        for match in re.finditer(r'class\s+(\w+)', content):
            classes.append(match.group(0))
    
    return classes

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python analyze.py 'file_path'")
        sys.exit(1)
    
    file_path = sys.argv[1]
    result = analyze_file(file_path)
    print(json.dumps(result, indent=2))
