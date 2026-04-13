// ─────────────────────────────────────────────
//  advisor.js  —  floating chat + Claude API
// ─────────────────────────────────────────────

let chatOpen = false;
let chatHistory = [];  // keeps the full conversation for multi-turn context

// ── System prompt sent to Claude ──────────────
//  Edit this to change the advisor's personality,
//  or inject real student/course data here later.
// ─────────────────────────────────────────────
function buildSystemPrompt() {
  const done    = STUDENT.completed.join(", ");
  const current = STUDENT.inProgress.join(", ");
  const coreLeft = STUDENT.csCoreRemaining.join(", ");
  const ways    = STUDENT.waysRemaining.join(", ");

  return `You are a friendly Stanford academic advisor AI helping ${STUDENT.name}, a ${STUDENT.year} majoring in ${STUDENT.major} (Class of ${STUDENT.classOf}).

Current academic status:
- Completed courses: ${done}
- In progress this quarter: ${current}
- CS core requirements remaining: ${coreLeft}
- WAY requirements remaining: ${ways}
- Units completed: ${STUDENT.unitsCompleted}

Guidelines:
- Keep responses SHORT — 2 to 4 sentences max.
- Be specific about Stanford course numbers when recommending.
- Always mention if a course has a prereq the student hasn't met yet.
- Occasionally suggest they drag a course into the planner on the right.
- You know about the following courses: ${COURSES.map(c => `${c.code} (${c.sub}, ${c.units}u, prereqs: ${c.prereqs.join(", ") || "none"})`).join("; ")}.`;
}

// ── Toggle chat open/closed ───────────────────
function toggleChat() {
  chatOpen = !chatOpen;
  document.getElementById("chat-window").classList.toggle("open", chatOpen);
  document.getElementById("advisor-badge").style.display = chatOpen ? "none" : "";
}

// ── Handle quick-reply chip click ─────────────
function sendQuick(el) {
  document.getElementById("chat-input").value = el.textContent.trim();
  document.getElementById("quick-replies").style.display = "none";
  sendMsg();
}

// ── Send a message ────────────────────────────
async function sendMsg() {
  const input = document.getElementById("chat-input");
  const text  = input.value.trim();
  if (!text) return;

  input.value = "";
  appendMsg(text, "user");
  chatHistory.push({ role: "user", content: text });

  const typingEl = appendMsg("Thinking…", "typing");

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: buildSystemPrompt(),
        messages: chatHistory,
      }),
    });

    const data  = await response.json();
    const reply = data.content?.[0]?.text || "Sorry, something went wrong.";

    typingEl.remove();
    appendMsg(reply, "advisor");
    chatHistory.push({ role: "assistant", content: reply });

  } catch (err) {
    typingEl.remove();
    appendMsg("Connection error — are you running this from a local server? (npx serve .)", "advisor");
    console.error("Advisor API error:", err);
  }
}

// ── Append a message bubble to the chat ───────
function appendMsg(text, type) {
  const msgs = document.getElementById("chat-msgs");
  const div  = document.createElement("div");
  div.className   = "cmsg " + type;
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}
