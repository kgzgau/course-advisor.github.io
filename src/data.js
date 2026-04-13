// ─────────────────────────────────────────────
//  data.js  —  course catalogue + profile + prereqs
// ─────────────────────────────────────────────
 
// ── LOAD PROFILE FROM ONBOARDING ─────────────
const _raw = sessionStorage.getItem("ob_profile");
const PROFILE = _raw ? JSON.parse(_raw) : {
  firstName:  "Alex",
  lastName:   "Chen",
  major:      "CS",
  year:       "2028",
  units:      "45",
  track:      "AI",
  takenCodes: ["CS 106B", "CS 107", "MATH 51", "CS 109", "MATH 52", "THINK 35", "PWR 1FY"]
};
 
// Normalise takenCodes to a Set for O(1) lookup
PROFILE.taken = new Set(PROFILE.takenCodes || []);
 
// ── FULL COURSE CATALOGUE ─────────────────────
// Add more entries here as needed. Each course the planner
// needs to know about must be registered here.
const COURSE_CATALOGUE = [
  // ── Math ──
  { code:"MATH 19",  title:"MATH 19",  sub:"Calculus I",                  units:3,  type:"math", prereqs:[] },
  { code:"MATH 20",  title:"MATH 20",  sub:"Calculus II",                  units:3,  type:"math", prereqs:["MATH 19"] },
  { code:"MATH 21",  title:"MATH 21",  sub:"Calculus I+II (accel.)",       units:5,  type:"math", prereqs:[] },
  { code:"MATH 51",  title:"MATH 51",  sub:"Linear Algebra & Diff Calc",   units:5,  type:"math", prereqs:["MATH 20","MATH 21"] },
  { code:"MATH 52",  title:"MATH 52",  sub:"Integral Calculus",            units:5,  type:"math", prereqs:["MATH 51"] },
  { code:"MATH 53",  title:"MATH 53",  sub:"Ordinary Diff. Equations",     units:5,  type:"math", prereqs:["MATH 52"] },
  { code:"MATH 109", title:"MATH 109", sub:"Introduction to Proofs",       units:3,  type:"math", prereqs:["MATH 51"] },
  { code:"STATS 110",title:"STATS 110",sub:"Statistical Methods",          units:4,  type:"math", prereqs:["MATH 52"] },
 
  // ── CS Core ──
  { code:"CS 103",   title:"CS 103",   sub:"Math Foundations of CS",       units:5,  type:"cs",   prereqs:["MATH 51"] },
  { code:"CS 106A",  title:"CS 106A",  sub:"Programming Methodology",      units:5,  type:"cs",   prereqs:[] },
  { code:"CS 106B",  title:"CS 106B",  sub:"Programming Abstractions",     units:5,  type:"cs",   prereqs:["CS 106A"] },
  { code:"CS 107",   title:"CS 107",   sub:"Computer Organization",        units:5,  type:"cs",   prereqs:["CS 106B"] },
  { code:"CS 107E",  title:"CS 107E",  sub:"Computer Org. (RPi)",          units:5,  type:"cs",   prereqs:["CS 106B"] },
  { code:"CS 109",   title:"CS 109",   sub:"Probability for CS",           units:5,  type:"cs",   prereqs:["CS 106B","MATH 51"] },
  { code:"CS 110",   title:"CS 110",   sub:"Principles of Computer Systems",units:5, type:"cs",   prereqs:["CS 107"] },
  { code:"CS 111",   title:"CS 111",   sub:"OS Principles",                units:5,  type:"cs",   prereqs:["CS 107"] },
  { code:"CS 161",   title:"CS 161",   sub:"Algorithms",                   units:3,  type:"cs",   prereqs:["CS 109","CS 103"] },
  { code:"CS 221",   title:"CS 221",   sub:"Artificial Intelligence",      units:4,  type:"cs",   prereqs:["CS 161","MATH 51"] },
 
  // ── Systems track ──
  { code:"CS 140",   title:"CS 140",   sub:"Operating Systems",            units:4,  type:"cs",   prereqs:["CS 110"] },
  { code:"CS 140E",  title:"CS 140E",  sub:"OS Principles (embedded)",     units:4,  type:"cs",   prereqs:["CS 107E"] },
  { code:"CS 143",   title:"CS 143",   sub:"Compilers",                    units:4,  type:"cs",   prereqs:["CS 103","CS 107"] },
  { code:"CS 144",   title:"CS 144",   sub:"Computer Networking",          units:4,  type:"cs",   prereqs:["CS 110"] },
  { code:"CS 145",   title:"CS 145",   sub:"Databases",                    units:4,  type:"cs",   prereqs:["CS 110"] },
  { code:"CS 149",   title:"CS 149",   sub:"Parallel Computing",           units:4,  type:"cs",   prereqs:["CS 107","CS 110"] },
  { code:"CS 155",   title:"CS 155",   sub:"Security",                     units:4,  type:"cs",   prereqs:["CS 110"] },
  { code:"CS 166",   title:"CS 166",   sub:"Data Structures",              units:4,  type:"cs",   prereqs:["CS 161"] },
  { code:"CS 190",   title:"CS 190",   sub:"Software Design Studio",       units:4,  type:"cs",   prereqs:["CS 110"] },
 
  // ── AI track ──
  { code:"CS 224N",  title:"CS 224N",  sub:"NLP with Deep Learning",       units:4,  type:"cs",   prereqs:["CS 221"] },
  { code:"CS 224S",  title:"CS 224S",  sub:"Spoken Language Processing",   units:3,  type:"cs",   prereqs:["CS 221"] },
  { code:"CS 224U",  title:"CS 224U",  sub:"Natural Language Understanding",units:4, type:"cs",   prereqs:["CS 221"] },
  { code:"CS 224W",  title:"CS 224W",  sub:"ML with Graphs",               units:4,  type:"cs",   prereqs:["CS 221"] },
  { code:"CS 228",   title:"CS 228",   sub:"Probabilistic Graphical Models",units:3, type:"cs",   prereqs:["CS 109","CS 221"] },
  { code:"CS 229",   title:"CS 229",   sub:"Machine Learning",             units:4,  type:"cs",   prereqs:["CS 109","MATH 51"] },
  { code:"CS 231A",  title:"CS 231A",  sub:"Computer Vision: 3D",          units:3,  type:"cs",   prereqs:["CS 229"] },
  { code:"CS 231N",  title:"CS 231N",  sub:"Deep Learning for Vision",     units:4,  type:"cs",   prereqs:["CS 229"] },
  { code:"CS 234",   title:"CS 234",   sub:"Reinforcement Learning",       units:4,  type:"cs",   prereqs:["CS 229"] },
  { code:"CS 238",   title:"CS 238",   sub:"Decision Making Under Uncert.", units:3, type:"cs",   prereqs:["CS 228"] },
 
  // ── Theory track ──
  { code:"CS 154",   title:"CS 154",   sub:"Automata & Complexity",        units:4,  type:"cs",   prereqs:["CS 103"] },
  { code:"CS 168",   title:"CS 168",   sub:"Modern Algorithmic Toolbox",   units:4,  type:"cs",   prereqs:["CS 161","CS 109"] },
  { code:"CS 255",   title:"CS 255",   sub:"Intro to Cryptography",        units:4,  type:"cs",   prereqs:["CS 154"] },
  { code:"CS 261",   title:"CS 261",   sub:"Optimization & Alg. Paradigms",units:4,  type:"cs",   prereqs:["CS 161"] },
  { code:"CS 265",   title:"CS 265",   sub:"Randomized Algorithms",        units:4,  type:"cs",   prereqs:["CS 161","CS 109"] },
 
  // ── HCI track ──
  { code:"CS 147",   title:"CS 147",   sub:"HCI Design",                   units:4,  type:"cs",   prereqs:["CS 106B"] },
  { code:"CS 147L",  title:"CS 147L",  sub:"HCI Design Lab",               units:2,  type:"cs",   prereqs:["CS 147"] },
  { code:"CS 193A",  title:"CS 193A",  sub:"Android Development",          units:3,  type:"cs",   prereqs:["CS 106B"] },
  { code:"CS 193P",  title:"CS 193P",  sub:"iOS Development",              units:3,  type:"cs",   prereqs:["CS 106B"] },
  { code:"CS 194H",  title:"CS 194H",  sub:"UI Design Project",            units:4,  type:"cs",   prereqs:["CS 147"] },
  { code:"CS 247",   title:"CS 247",   sub:"HCI Design Studio",            units:4,  type:"cs",   prereqs:["CS 147"] },
  { code:"CS 247B",  title:"CS 247B",  sub:"Design for Behavior Change",   units:4,  type:"cs",   prereqs:["CS 147"] },
  { code:"CS 247G",  title:"CS 247G",  sub:"Intro to Game Design",         units:4,  type:"cs",   prereqs:["CS 147"] },
  { code:"CS 278",   title:"CS 278",   sub:"Social Computing",             units:4,  type:"cs",   prereqs:["CS 147"] },
 
  // ── Capstone ──
  { code:"CS 191",   title:"CS 191",   sub:"Senior Project",               units:3,  type:"cs",   prereqs:["CS 161"] },
  { code:"CS 191W",  title:"CS 191W",  sub:"Senior Project (WIM)",         units:4,  type:"cs",   prereqs:["CS 161"] },
  { code:"CS 194",   title:"CS 194",   sub:"Software Project",             units:4,  type:"cs",   prereqs:["CS 110"] },
  { code:"CS 194W",  title:"CS 194W",  sub:"Software Project (WIM)",       units:4,  type:"cs",   prereqs:["CS 110"] },
 
  // ── Writing / WAYs ──
  { code:"CS 181W",  title:"CS 181W",  sub:"Ethics & Public Policy (WIM)", units:5,  type:"hum",  prereqs:["CS 106B"] },
  { code:"CS 182W",  title:"CS 182W",  sub:"Ethics of AI (WIM)",           units:5,  type:"hum",  prereqs:["CS 221"] },
  { code:"PWR 1FY",  title:"PWR 1FY",  sub:"Writing & Rhetoric",           units:3,  type:"hum",  prereqs:[] },
  { code:"PWR 2",    title:"PWR 2",    sub:"Writing 2",                    units:3,  type:"hum",  prereqs:["PWR 1FY"] },
  { code:"THINK 35", title:"THINK 35", sub:"Well-Being · WAY-SMA",        units:3,  type:"hum",  prereqs:[] },
  { code:"ENGR 40M", title:"ENGR 40M", sub:"Intro to Electronics",         units:4,  type:"cs",   prereqs:[] },
  { code:"PHYS 41",  title:"PHYS 41",  sub:"Mechanics",                    units:4,  type:"math", prereqs:["MATH 20"] },
  { code:"PHYS 43",  title:"PHYS 43",  sub:"Electricity & Magnetism",      units:4,  type:"math", prereqs:["PHYS 41"] },
];
 
// ── LOOKUP HELPERS ────────────────────────────
const _catalogueMap = {};
COURSE_CATALOGUE.forEach(c => { _catalogueMap[c.code] = c; });
 
function getCourse(code) {
  return _catalogueMap[code] || null;
}
 
// prereqs met = every prereq is in PROFILE.taken
function prereqsMet(code) {
  const course = getCourse(code);
  if (!course) return false;
  return course.prereqs.every(p => PROFILE.taken.has(p));
}
 
// ── TRACK → SUGGESTION POOL ───────────────────
const TRACK_POOLS = {
  AI:           ["CS 229","CS 221","CS 231N","CS 224N","CS 228","CS 234","CS 224W","CS 238","CS 231A","CS 224U"],
  Systems:      ["CS 110","CS 140","CS 144","CS 145","CS 143","CS 149","CS 155","CS 190","CS 166","CS 111"],
  Theory:       ["CS 154","CS 161","CS 168","CS 261","CS 265","CS 255","CS 166"],
  HCI:          ["CS 147","CS 193P","CS 193A","CS 247","CS 278","CS 247B","CS 247G","CS 194H","CS 147L"],
  Unspecialized:["CS 110","CS 147","CS 154","CS 229","CS 145","CS 144","CS 143","CS 190","CS 166","CS 155"],
};
 
// Also always include CS core if not done
const CS_CORE_ORDER = ["CS 103","CS 107","CS 109","CS 110","CS 161","CS 221"];
 
// ── BUILD DEFAULT_SUGGESTIONS ─────────────────
// Priority: CS core not yet taken → track electives with prereqs met → rest of track
function buildSuggestions() {
  const taken = PROFILE.taken;
  const track  = PROFILE.track || "Unspecialized";
  const pool   = TRACK_POOLS[track] || TRACK_POOLS.Unspecialized;
 
  const seen = new Set();
  const result = [];
 
  function tryAdd(code) {
    if (seen.has(code)) return;
    if (taken.has(code)) return;
    seen.add(code);
    result.push(code);
  }
 
  // 1. Core courses not yet completed (in curriculum order)
  CS_CORE_ORDER.forEach(tryAdd);
 
  // 2. Track electives where prereqs ARE met
  pool.filter(c => prereqsMet(c)).forEach(tryAdd);
 
  // 3. Track electives where prereqs are NOT yet met (shown with warning)
  pool.filter(c => !prereqsMet(c)).forEach(tryAdd);
 
  return result.slice(0, 10); // cap at 10
}
 
const DEFAULT_SUGGESTIONS = buildSuggestions();