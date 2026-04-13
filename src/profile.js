//  profile.js  —  reads PROFILE (set by data.js)
//  and populates the student banner, requirements
//  checklist, and advisor greeting.
// ─────────────────────────────────────────────
 
// ── CS REQUIREMENTS DATA ──────────────────────
// Mirrors cs-requirements.json inline so no extra fetch is needed.
// Update here if requirements change.
const CS_REQUIREMENTS = {
  math_foundation: {
    label: "Math Foundation",
    courses: [
      { code:"MATH 19",  title:"Calculus I",                  alts:["MATH 21"] },
      { code:"MATH 20",  title:"Calculus II",                 alts:["MATH 21"] },
      { code:"MATH 51",  title:"Linear Algebra & Diff Calc",  alts:[] },
      { code:"MATH 52",  title:"Integral Calculus",           alts:[] },
      { code:"MATH 53",  title:"ODE",                         alts:[] },
      { code:"CS 103",   title:"Math Foundations of CS",      alts:["MATH 109"] },
    ]
  },
  cs_core: {
    label: "CS Core",
    courses: [
      { code:"CS 106B",  title:"Programming Abstractions",      alts:[] },
      { code:"CS 107",   title:"Computer Organization",         alts:["CS 107E"] },
      { code:"CS 109",   title:"Probability for CS",            alts:[] },
      { code:"CS 110",   title:"Principles of Computer Systems",alts:["CS 111"] },
      { code:"CS 161",   title:"Algorithms",                    alts:[] },
      { code:"CS 221",   title:"Artificial Intelligence",       alts:[] },
    ]
  },
  science: {
    label: "Science",
    courses: [
      { code:"PHYS 41",  title:"Mechanics",           alts:["PHYS 21","PHYS 61"] },
      { code:"PHYS 43",  title:"Electricity & Magnetism", alts:["PHYS 23","PHYS 63"] },
      { code:"ENGR 40M", title:"Intro to Electronics", alts:[] },
    ]
  },
  writing: {
    label: "Writing in the Major (WIM)",
    note: "One required",
    courses: [
      { code:"CS 181W",  title:"Ethics & Public Policy (WIM)", alts:[] },
      { code:"CS 182W",  title:"Ethics of AI (WIM)",           alts:[] },
      { code:"CS 191W",  title:"Senior Project (WIM)",         alts:[] },
      { code:"CS 194W",  title:"Software Project (WIM)",       alts:[] },
    ]
  },
  capstone: {
    label: "Senior Capstone",
    note: "One required",
    courses: [
      { code:"CS 191",   title:"Senior Project",         alts:[] },
      { code:"CS 191W",  title:"Senior Project (WIM)",   alts:[] },
      { code:"CS 194",   title:"Software Project",       alts:[] },
      { code:"CS 194W",  title:"Software Project (WIM)", alts:[] },
      { code:"CS 194H",  title:"UI Design Project",      alts:[] },
    ]
  }
};
 
const TRACK_REQUIREMENTS = {
  AI:     { label:"AI Track depth (21u min)", electives:["CS 229","CS 231N","CS 224N","CS 228","CS 234","CS 224W","CS 238","CS 231A","CS 224U","CS 224S"] },
  Systems:{ label:"Systems Track depth (21u min)", electives:["CS 140","CS 143","CS 144","CS 145","CS 149","CS 155","CS 166","CS 190"] },
  Theory: { label:"Theory Track depth (21u min)", electives:["CS 154","CS 168","CS 255","CS 261","CS 265","CS 166"] },
  HCI:    { label:"HCI Track depth (21u min)", electives:["CS 147","CS 147L","CS 193P","CS 193A","CS 247","CS 247B","CS 247G","CS 278","CS 194H"] },
  Unspecialized: { label:"CS depth (21u min, any CS 100+)", electives:[] },
};
 
// ── YEAR LABEL ────────────────────────────────
function yearLabel(classYear) {
  const n = parseInt(classYear);
  const curr = new Date().getFullYear();
  const diff = n - curr;
  if (diff >= 3) return "Freshman";
  if (diff === 2) return "Sophomore";
  if (diff === 1) return "Junior";
  return "Senior";
}
 
// ── TAKEN HELPERS ─────────────────────────────
function isTaken(code, alts = []) {
  if (PROFILE.taken.has(code)) return true;
  return alts.some(a => PROFILE.taken.has(a));
}
 
// ── BANNER ────────────────────────────────────
function populateBanner() {
  const p = PROFILE;
  const name = `${p.firstName} ${p.lastName}`.trim();
  const yr   = yearLabel(p.year);
 
  document.getElementById("topnav-student").textContent =
    `${name} · ${p.major} · Class of ${p.year}`;
  document.getElementById("banner-name").textContent = name;
  document.getElementById("banner-meta").textContent =
    `${p.major === "CS" ? "Computer Science" : p.major} · ${yr} · ${p.units || "?"} units completed`;
 
  // Compute CS core progress
  const coreTotal = CS_REQUIREMENTS.cs_core.courses.length;
  const coreDone  = CS_REQUIREMENTS.cs_core.courses.filter(c => isTaken(c.code, c.alts)).length;
 
  const tags = document.getElementById("banner-tags");
  tags.innerHTML = "";
 
  function addTag(cls, text) {
    const s = document.createElement("span");
    s.className = `tag ${cls}`;
    s.textContent = text;
    tags.appendChild(s);
  }
 
  addTag("cs",  `CS Core: ${coreDone}/${coreTotal} done`);
  addTag("way", `Track: ${p.track || "—"}`);
 
  // show completed courses as tags
  Array.from(p.taken).slice(0, 5).forEach(code => addTag("done", `${code} ✓`));
}
 
// ── REQUIREMENTS CHECKLIST ────────────────────
function populateRequirements() {
  const container = document.getElementById("reqs-checklist");
  if (!container) return;
  container.innerHTML = "";
 
  function makeSection(label, courses, note, oneOfMode) {
    const wrap = document.createElement("div");
    wrap.style.cssText = "background:#fff;border:0.5px solid #e0dfd8;border-radius:10px;padding:18px 20px;margin-bottom:14px";
 
    const head = document.createElement("div");
    head.style.cssText = "display:flex;align-items:baseline;gap:10px;margin-bottom:12px";
 
    const title = document.createElement("div");
    title.style.cssText = "font-size:13px;font-weight:600;color:#1a1714;letter-spacing:0.01em";
    title.textContent = label;
    head.appendChild(title);
 
    if (note) {
      const n = document.createElement("div");
      n.style.cssText = "font-size:11px;color:#9a9590";
      n.textContent = note;
      head.appendChild(n);
    }
    wrap.appendChild(head);
 
    const grid = document.createElement("div");
    grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:7px";
 
    let anyDone = false;
    courses.forEach(c => {
      const done = isTaken(c.code, c.alts || []);
      if (done) anyDone = true;
 
      const row = document.createElement("div");
      row.style.cssText = `display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:7px;background:${done ? "#f0faf3" : "#fafaf8"};border:1px solid ${done ? "#b8e6c4" : "#eae8e2"}`;
 
      const check = document.createElement("span");
      check.style.cssText = `width:16px;height:16px;border-radius:50%;border:1.5px solid ${done ? "#2e6b3e" : "#ccc"};background:${done ? "#2e6b3e" : "transparent"};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:9px;color:#fff`;
      check.textContent = done ? "✓" : "";
      row.appendChild(check);
 
      const info = document.createElement("div");
      const codeEl = document.createElement("div");
      codeEl.style.cssText = `font-size:12px;font-weight:500;color:${done ? "#2e6b3e" : "#1a1714"}`;
      codeEl.textContent = c.code;
      const titleEl = document.createElement("div");
      titleEl.style.cssText = "font-size:11px;color:#9a9590;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";
      titleEl.textContent = c.title;
      info.appendChild(codeEl);
      info.appendChild(titleEl);
      row.appendChild(info);
 
      if (c.alts && c.alts.length) {
        const alt = document.createElement("div");
        alt.style.cssText = "font-size:10px;color:#b0ada8;margin-left:auto;white-space:nowrap";
        alt.textContent = `or ${c.alts[0]}`;
        row.appendChild(alt);
      }
 
      grid.appendChild(row);
 
      // In oneOfMode, if this is done, grey the rest
      if (oneOfMode && anyDone && !done) {
        row.style.opacity = "0.4";
      }
    });
 
    wrap.appendChild(grid);
    container.appendChild(wrap);
  }
 
  // Core sections
  makeSection("Math Foundation", CS_REQUIREMENTS.math_foundation.courses);
  makeSection("CS Core",         CS_REQUIREMENTS.cs_core.courses);
  makeSection("Science",         CS_REQUIREMENTS.science.courses);
  makeSection("Writing in the Major (WIM)", CS_REQUIREMENTS.writing.courses,  "one required", true);
  makeSection("Senior Capstone", CS_REQUIREMENTS.capstone.courses, "one required", true);
 
  // Track depth
  const track = TRACK_REQUIREMENTS[PROFILE.track] || TRACK_REQUIREMENTS.Unspecialized;
  if (track.electives.length > 0) {
    const elCourses = track.electives.map(code => {
      const c = getCourse(code);
      return { code, title: c ? c.sub : "", alts: [] };
    });
 
    // Count units done toward track
    let trackUnits = 0;
    track.electives.forEach(code => {
      if (PROFILE.taken.has(code)) {
        const c = getCourse(code);
        if (c) trackUnits += c.units;
      }
    });
 
    makeSection(
      track.label,
      elCourses,
      `${trackUnits}u completed of 21u required`
    );
  }
}
 
// ── ADVISOR GREETING ──────────────────────────
function setAdvisorGreeting() {
  const el = document.getElementById("advisor-greeting");
  if (!el) return;
  const name = PROFILE.firstName || "there";
  const taken = Array.from(PROFILE.taken);
  const recentCourses = taken.slice(-3).join(", ") || "no courses yet";
  const track = PROFILE.track || "your chosen track";
  el.textContent = `Hi ${name}! You've completed ${taken.length} course${taken.length !== 1 ? "s" : ""} so far (most recently: ${recentCourses}). I'll help you build your ${track} track plan. What are you thinking for next quarter?`;
}
 
// ── INIT ──────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  populateBanner();
  populateRequirements();
  setAdvisorGreeting();
});