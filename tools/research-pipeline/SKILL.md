---
name: research-pipeline
description: Deep research on any topic using YouTube search + NotebookLM analysis. Collects video URLs, feeds to NotebookLM for heavy processing, returns distilled knowledge at ~1500 tokens instead of 100K+.
allowed-tools: Bash(python *), Bash(notebooklm *)
---

# Research Pipeline

Token-efficient deep research. Chains YouTube search (zero tokens) into NotebookLM (Google's tokens) and reads back a distilled summary (~1500 Claude tokens for what would normally cost 100K-500K).

## Instructions

### Step 1: Get the topic
Take the research topic from `$ARGUMENTS`. If no arguments, ask the user what they need researched.

### Step 2: Search YouTube for URLs
Run the search script located in this skill's directory:
```bash
python "<this skill's base directory>/yt_search.py" <topic>
```
Parse the JSON output. Extract the `url` field from each result. Select the top 10 most relevant URLs.

### Step 3: Create a NotebookLM notebook
```bash
notebooklm create "Research: <topic>" --json
```
Extract the notebook ID from the JSON output.

### Step 4: Add YouTube URLs as sources
For each of the top 10 URLs:
```bash
notebooklm source add "<url>" --json
```
Continue even if individual sources fail. Log failures but don't stop.

### Step 5: Wait for source processing
```bash
notebooklm source list --json
```
All sources must show status `ready` before proceeding. If still processing, wait 15 seconds and check again. Max 10 checks.

### Step 6: Query NotebookLM for structured knowledge
```bash
notebooklm ask "Provide a comprehensive technical summary. Include: 1) Key concepts and how they work 2) Implementation patterns with code examples 3) Common pitfalls and how to avoid them 4) Best practices and recommendations. Be specific and actionable." --json
```

### Step 7: Return results
Present to the user or requesting agent:
- The distilled summary from NotebookLM
- Source count (how many videos were analyzed)
- Notebook ID (for follow-up questions later)

## Follow-up
The notebook persists. Ask follow-up questions anytime:
```bash
notebooklm ask "Elaborate on [specific point]" --json
```

## Token Economics
| Step | Token cost |
|------|-----------|
| YouTube search | 0 (runs locally via yt-dlp) |
| NotebookLM processing | 0 (Google's infrastructure) |
| Reading the summary | ~500-1500 tokens |
| **Total** | **~1500 tokens for deep research** |

## Usage
```
/research-pipeline TikTok content publishing API
/research-pipeline OAuth 2.0 PKCE flow implementation
/research-pipeline FastAPI WebSocket patterns
```
