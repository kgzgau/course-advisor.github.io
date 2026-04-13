let dragging = null;
let undoStack = [];
 
// ── INITIAL COURSE DATA ────────────────────────
const INITIAL_COURSES = {
  "slots-autumn25": [
    { code: "CS 107",  title: "CS 107",   sub: "Computer Organization",  units: 5, type: "cs"   },
    { code: "MATH 51", title: "MATH 51",  sub: "Linear Algebra",         units: 5, type: "math" },
    { code: "PWR 1FY", title: "PWR 1FY",  sub: "Writing & Rhetoric",     units: 3, type: "hum"  },
  ],
  "slots-winter26": [
    { code: "CS 109",    title: "CS 109",    sub: "Probability for CS",    units: 5, type: "cs"   },
    { code: "MATH 52",   title: "MATH 52",   sub: "Integral Calculus",     units: 5, type: "math" },
    { code: "THINK 35",  title: "THINK 35",  sub: "Well-Being · WAY-SMA",  units: 3, type: "hum"  },
  ],
  "slots-spring26": [
    { code: "CS 161", title: "CS 161", sub: "Algorithms", units: 3, type: "cs" },
  ],
  "slots-autumn26": [],
};
 
// ── QUARTER METADATA ───────────────────────────
const QUARTER_STATUS = {
  "slots-autumn25": "completed",
  "slots-winter26": "in progress",
  "slots-spring26": "planning",
  "slots-autumn26": "planning",
};
 
// ── TAB SWITCHING ──────────────────────────────
function switchTab(view, el) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  el.classList.add("active");
 
  document.getElementById("view-quarters").classList.add("hidden");
  document.getElementById("view-4yr").classList.add("hidden");
  document.getElementById("view-reqs").classList.add("hidden");
 
  if (view === "quarters") document.getElementById("view-quarters").classList.remove("hidden");
  if (view === "4yr")      document.getElementById("view-4yr").classList.remove("hidden");
  if (view === "reqs")     document.getElementById("view-reqs").classList.remove("hidden");
}
 
// ── COURSE PILL BUILDER ────────────────────────
function buildCoursePill(data) {
  const pill = document.createElement("div");
  pill.className = `course-pill ${data.type}`;
  pill.draggable = true;
 
  pill.dataset.code  = data.code;
  pill.dataset.title = data.title;
  pill.dataset.sub   = data.sub;
  pill.dataset.units = data.units;
  pill.dataset.type  = data.type;
 
  pill.ondragstart = (e) => dragStart(e, pill);
 
  pill.innerHTML = `
    <div>
      <div class="pill-title">${data.title}</div>
      <div class="pill-sub">${data.sub}</div>
    </div>
    <span class="pill-units">${data.units}u</span>
  `;
 
  const trash = document.createElement("span");
  trash.className = "pill-trash";
  trash.innerHTML = "×";
  trash.title = "Remove";
  trash.onclick = (e) => {
    e.stopPropagation();
    deleteCourse(pill);
  };
 
  pill.appendChild(trash);
  return pill;
}
 
// ── RENDER INITIAL PILLS ───────────────────────
function renderInitialCourses() {
  Object.entries(INITIAL_COURSES).forEach(([slotId, courses]) => {
    const container = document.getElementById(slotId);
    if (!container) return;
    // Insert each pill before the first empty-slot so order matches data array
    courses.forEach(data => {
      const pill = buildCoursePill(data);
      const firstEmpty = container.querySelector(".empty-slot");
      firstEmpty ? container.insertBefore(pill, firstEmpty) : container.appendChild(pill);
    });
  });
}
 
// ── CORE DELETE ────────────────────────────────
function deleteCourse(el) {
  if (!el) return;
 
  // Record position for precise undo
  const parent = el.parentElement;
  const siblings = Array.from(parent.children);
  const index = siblings.indexOf(el);
 
  undoStack.push({
    html:     el.outerHTML,
    parentId: parent.id || null,
    index,
  });
 
  el.remove();
  updateUnitCounts();
}
 
// ── UNDO ───────────────────────────────────────
function undoDelete() {
  const last = undoStack.pop();
  if (!last) return;
 
  const temp = document.createElement("div");
  temp.innerHTML = last.html;
  const restored = temp.firstElementChild;
  if (!restored) return;
 
  // Re-attach drag handler (lost when serialised to HTML)
  restored.ondragstart = (e) => dragStart(e, restored);
 
  // Re-attach trash icon handler
  const trash = restored.querySelector(".pill-trash");
  if (trash) {
    trash.onclick = (e) => {
      e.stopPropagation();
      deleteCourse(restored);
    };
  }
 
  const parent = document.getElementById(last.parentId);
  if (parent) {
    const siblings = Array.from(parent.children);
    const refNode  = siblings[last.index] || null;
    parent.insertBefore(restored, refNode);
  }
 
  updateUnitCounts();
}
 
// Ctrl/Cmd+Z
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
    e.preventDefault();
    undoDelete();
  }
});
 
// ── DRAG HANDLERS ─────────────────────────────
function dragStart(e, el) {
  dragging = el;
  el.classList.add("dragging");
  document.body.classList.add("is-dragging");
  e.dataTransfer.effectAllowed = "move";
}
 
function dragOver(e) {
  e.preventDefault();
}
 
function drop(e, slotId) {
  e.preventDefault();
  e.stopPropagation();
  if (!dragging) return;
 
  const container = document.getElementById(slotId);
  if (!container) return;
 
  const empties = container.querySelectorAll(".empty-slot");
  if (empties.length > 0) {
    container.insertBefore(dragging, empties[0]);
  } else {
    container.appendChild(dragging);
  }
 
  dragging.classList.remove("dragging");
  dragging = null;
  document.body.classList.remove("is-dragging");
 
  updateUnitCounts();
}
 
// ── TRASH DROP ZONE ────────────────────────────
function handleTrashDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  const target = dragging;
  dragging = null;
  document.body.classList.remove("is-dragging");
  deleteCourse(target);
}
 
// ── UNIT COUNTS ────────────────────────────────
function updateUnitCounts() {
  Object.entries(QUARTER_STATUS).forEach(([slotId, status]) => {
    const slots = document.getElementById(slotId);
    const unitId = "units-" + slotId.replace("slots-", "");
    const label  = document.getElementById(unitId);
    if (!slots || !label) return;
 
    let total = 0;
    slots.querySelectorAll(".course-pill").forEach(p => {
      total += Number(p.dataset.units || 0);
    });
 
    label.textContent = total ? `${total}u · ${status}` : status;
    label.classList.remove("warn", "over");
    if      (total > 22) label.classList.add("over");
    else if (total > 20) label.classList.add("warn");
  });
}
 
// ── CLEANUP ON DRAGEND ─────────────────────────
document.addEventListener("dragend", () => {
  if (dragging) {
    dragging.classList.remove("dragging");
    dragging = null;
  }
  document.body.classList.remove("is-dragging");
});
 
// ── INIT ───────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderInitialCourses();
  updateUnitCounts();
});
 