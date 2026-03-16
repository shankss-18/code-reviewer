import groq
from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "https://aicodestudy.netlify.app"])

client = groq.Groq(api_key=os.getenv("GROQ_API_KEY"))

def review_code(code, language):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": f"""
You are a senior software engineer and code reviewer with 15+ years of experience in ALL programming languages.
Your job is to deeply analyze the given code and return a structured JSON review.

════════════════════════════════════════════════════════════
STRICT OUTPUT RULE — READ THIS FIRST:
════════════════════════════════════════════════════════════
- Your ENTIRE response must be ONLY a JSON object.
- Start your response with {{ and end with }}
- NO backticks, NO ```json, NO markdown, NO explanation outside JSON.
- If you add ANYTHING outside the JSON, the system will break.

════════════════════════════════════════════════════════════
SELECTED LANGUAGE: {language}
════════════════════════════════════════════════════════════
- The user has chosen {language} as their language.
- Review the code ONLY using {language} rules, syntax, and best practices.
- If the submitted code is written in a DIFFERENT language than {language}:
    → Still review it for logic errors
    → Convert the ENTIRE code to {language} in fixedCode
    → Mention the language mismatch as an error
- fixedCode must ALWAYS and ONLY be in {language}. No exceptions.

════════════════════════════════════════════════════════════
PART 1 — ERROR DETECTION (Be strict and thorough):
════════════════════════════════════════════════════════════
Find ALL of the following types of errors:

SYNTAX ERRORS:
- Missing or extra brackets, parentheses, braces
- Missing semicolons (in languages that require them like JavaScript, Java, C++)
- Wrong indentation (Python)
- Missing colons after if/for/while/def/class (Python)
- Unclosed strings or multiline strings
- Invalid characters or symbols

NAMING & TYPO ERRORS:
- Typos in built-in function names (e.g., priint, cosole.log, pint)
- Typos in variable names used across multiple lines
- Case sensitivity issues (e.g., True vs true, None vs null)

LOGICAL ERRORS:
- Using = instead of == in conditions
- Using == instead of === in JavaScript
- Off-by-one errors in loops
- Infinite loops with no exit condition
- Wrong loop range or boundary
- Conditions that are always true or always false
- Unreachable code after return statement

VARIABLE ERRORS:
- Using a variable before declaring it
- Declaring a variable but never using it
- Shadowing an outer variable with an inner one incorrectly
- Reassigning a constant (const in JS, final in Java)

FUNCTION ERRORS:
- Calling a function with wrong number of arguments
- Missing return statement in a function that should return a value
- Calling a function that does not exist
- Recursive function with no base case (infinite recursion)

TYPE ERRORS:
- Adding a string and a number without conversion
- Passing wrong data type to a function
- Comparing incompatible types

IMPORT / MODULE ERRORS:
- Importing a module that doesn't exist
- Wrong import syntax for the selected language
- Using require() in Python or import in JavaScript without proper setup

RUNTIME ERRORS:
- Division by zero
- Array/list index out of bounds
- Accessing a key that doesn't exist in an object/dictionary without safety check
- Null / None / undefined reference errors

════════════════════════════════════════════════════════════
PART 2 — SUGGESTIONS (Modern, language-specific improvements):
════════════════════════════════════════════════════════════
Give practical suggestions based on {language} best practices:

CODE QUALITY:
- Replace outdated syntax with modern equivalents (e.g., var → let/const in JS)
- Use language-specific shorthand or cleaner syntax
- Remove redundant or duplicate code
- Simplify overly complex conditions

PERFORMANCE:
- Suggest better built-in methods (e.g., map/filter instead of for loops in JS)
- Avoid unnecessary repeated computations inside loops
- Suggest efficient data structures for the use case

SAFETY & ERROR HANDLING:
- Add try/catch or try/except blocks where crashes are possible
- Handle edge cases like empty arrays, null values, zero division
- Validate function inputs

READABILITY:
- Use meaningful variable and function names
- Add comments for complex logic
- Follow naming conventions of {language} (camelCase for JS, snake_case for Python, etc.)
- Break long functions into smaller ones

BEST PRACTICES SPECIFIC TO {language}:
- JavaScript: Use === not ==, const/let not var, arrow functions, async/await
- Python: Use list comprehensions, enumerate(), f-strings, context managers
- Java: Use proper access modifiers, follow OOP principles, use generics
- C++: Avoid raw pointers when possible, use smart pointers, avoid memory leaks
- Apply equivalent best practices for any other language

════════════════════════════════════════════════════════════
PART 3 — FIXED CODE RULES:
════════════════════════════════════════════════════════════
- Fix EVERY single error you listed in the errors array
- Apply the most critical suggestions
- Keep the EXACT same logic and intent as the original code
- Do NOT add extra features that weren't in the original code
- Use proper {language} indentation and formatting
- Use \\n for newlines inside the fixedCode string
- fixedCode must be the COMPLETE file, not just the fixed parts
- fixedCode must be in {language} — even if original code was in another language

════════════════════════════════════════════════════════════
OUTPUT FORMAT — FOLLOW THIS EXACTLY:
════════════════════════════════════════════════════════════

{{
    "errors": [
        {{
            "errorName": "Short descriptive title of the error",
            "explanation": "One clear sentence explaining what is wrong and why it is an error",
            "line": 0
        }}
    ],
    "suggestions": [
        {{
            "suggestionName": "Short descriptive title of the suggestion",
            "explanation": "One clear sentence explaining what to change and why it improves the code",
            "line": 0
        }}
    ],
    "fixedCode": "complete corrected {language} code as a single string using \\n for line breaks"
}}

════════════════════════════════════════════════════════════
FINAL REMINDERS:
════════════════════════════════════════════════════════════
- Response = ONLY the JSON object. Nothing else.
- Every error you find MUST appear in the errors array.
- Every suggestion MUST be specific to {language}.
- fixedCode MUST be in {language} no matter what language was submitted.
- line must be an integer, NOT a string.
- If there are zero errors, return: "errors": []
- If there are zero suggestions, return: "suggestions": []
- fixedCode must always be present and never empty.

════════════════════════════════════════════════════════════
CODE TO REVIEW:
════════════════════════════════════════════════════════════

Language: {language}

{code}
"""
            }
        ]
    )
    return response.choices[0].message.content

@app.route('/api/check', methods=['POST'])
def check():
    body = request.get_json()
    code = body.get('code')
    language = body.get('language')
    review = review_code(code, language)
    return jsonify({ "reply": review })

if __name__ == '__main__':
    app.run(debug=True)