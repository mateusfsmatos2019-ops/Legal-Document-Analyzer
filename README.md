# Legal Document Analyzer

Modern single-page application for legal document analysis with bilingual support in English and Portuguese.

## Features
- Multiple document upload with drag and drop
- PDF, DOCX, and TXT extraction
- Clause, risk, summary, and timeline analysis
- Translation workspace for English and Portuguese
- Optional OpenAI / Claude enhancement with offline fallback rules

## Running locally
Because the app uses browser APIs and ES modules, serve the repository with any static server, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Testing
Run the focused analysis tests with:

```bash
npm test
```
