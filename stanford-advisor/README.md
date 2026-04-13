# Stanford Course Advisor

A course planning tool for Stanford students with a drag-and-drop quarter planner
and a Claude-powered AI advisor chat.

## Project structure

```
stanford-advisor/
├── index.html          # Main page + all HTML
├── src/
│   ├── styles.css      # All CSS
│   ├── data.js         # Mock course catalog + student profile  ← edit this
│   ├── suggestions.js  # Renders suggestion pills
│   ├── planner.js      # Drag-and-drop logic + tab switching
│   └── advisor.js      # Claude API chat logic
└── README.md
```

## Running locally

```bash
# From the stanford-advisor/ folder:
npx serve .
# then open http://localhost:3000
```

The chat requires a local server (not file://) because browsers block
direct API calls from local files. `npx serve .` fixes that.

## The most important files to edit

### src/data.js
This is where all your course data lives. Right now it's hardcoded mock data.
When you get access to the ExploreCourses API, replace COURSES with real data:

```python
# Python snippet to export courses to JSON
from explorecourses import CourseConnection
connect = CourseConnection()
courses = connect.get_courses_by_department("CS", year="2025-2026")
# serialize to JSON and load in data.js
```

Also update the STUDENT object to reflect a real student's profile.

### src/advisor.js → buildSystemPrompt()
The system prompt is what tells Claude about the student and the course catalog.
When you have real data, inject it here dynamically instead of hardcoding it.

## Next steps

1. **Connect ExploreCourses API** — replace COURSES in data.js with real data
2. **Add student auth** — connect to a real student profile (or let them enter courses manually)
3. **Add requirement rules** — scrape Stanford Bulletin for major/WAY rules and
   track them in the Requirements tab
4. **Move to VS Code extension** — the advisor.js API call is the same code
   you'd use in a VS Code Webview panel
5. **Add prereq validation** — highlight pills red when dropped into a quarter
   where prereqs haven't been met yet
