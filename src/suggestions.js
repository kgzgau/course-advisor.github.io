// ─────────────────────────────────────────────
//  suggestions.js  —  renders the suggestion bank
//  from DEFAULT_SUGGESTIONS in data.js
// ─────────────────────────────────────────────

function renderSuggestions() {
  const bank = document.getElementById("suggestion-bank");
  if (!bank) return;

  bank.innerHTML = "";

  DEFAULT_SUGGESTIONS.forEach(code => {
    const course = getCourse(code);
    if (!course) return;

    const met = prereqsMet(code);

    // replace everything from `const pill = ...` to `bank.appendChild(pill)`
    const pill = buildCoursePill(course); // gets correct class + data + trash icon
    pill.classList.add("sug-pill");       // keep sug-pill for suggestion-bank styling

    const prereqWarning = !met && course.prereqs.length > 0
      ? `<span class="sug-warn" title="Prereqs: ${course.prereqs.join(', ')}">⚠</span>`
      : "";
    if (prereqWarning) pill.insertAdjacentHTML("beforeend", prereqWarning);

    bank.appendChild(pill);
      });
}

// Run on page load (data.js must be loaded first)
document.addEventListener("DOMContentLoaded", renderSuggestions);
