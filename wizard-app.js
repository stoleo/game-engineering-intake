const STORE = "ge_intake_v2";
const state = loadState();

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORE)) || { answers: {}, files: [], step: 0 }; }
  catch { return { answers: {}, files: [], step: 0 }; }
}
function saveState() {
  localStorage.setItem(STORE, JSON.stringify(state));
  renderPreview();
  renderNav();
  updateMeter();
}
function renderNav() {
  const nav = document.getElementById("nav");
  if (!nav || typeof STEPS === "undefined") return;
  nav.innerHTML = STEPS.map((s, i) => {
    const done = stepFilled(s);
    return '<button class="' + (i === state.step ? "active" : "") + (done ? " done" : "") + '" onclick="go(' + i + ')"><span class="n">' + String(i).padStart(2, "0") + "</span>" + s.title + "</button>";
  }).join("");
}
function stepFilled(step) {
  if (!step.fields) return false;
  const crit = step.fields.filter(f => f[4]);
  if (!crit.length) return step.fields.some(f => (state.answers[f[0]] || "").trim());
  return crit.every(f => (state.answers[f[0]] || "").trim());
}
function go(i) {
  state.step = Math.max(0, Math.min(STEPS.length - 1, i));
  saveState();
  renderScreen();
}
function stepPrev() { go(state.step - 1); }
function stepNext() {
  if (state.step === STEPS.length - 1) return;
  go(state.step + 1);
}
function stepHint(id) {
  return ({
    identity: "Lock what the game is today.",
    intent: "Pillars must force cuts.",
    constraints: "These bound the 10/10.",
    machine: "Write verbs.",
    first: "Cold player, no designer.",
    repeat: "After novelty dies.",
    behaviour: "Only what you have seen.",
    problems: "Facts vs suspicions.",
    production: "Score the build, not the deck.",
    planning: "Effort sizes for this team."
  })[id] || "";
}
function esc(s) {
  return String(s || "").replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, """).replace(/'/g, "&#39;");
}
function renderField(f) {
  const id = f[0], label = f[1], type = f[2], hint = f[3], critical = f[4], tall = f[5];
  const val = state.answers[id] || "";
  let control = "";
  if (type === "select") {
    const opts = hint.split("|");
    control = '<select id="f_' + id + '"><option value=""></option>' + opts.map(o => "<option" + (val === o ? " selected" : "") + ">" + o + "</option>").join("") + "</select>";
  } else if (type === "textarea") {
    control = '<textarea id="f_' + id + '" class="' + (tall ? "tall" : "") + '">' + esc(val) + "</textarea>";
  } else {
    control = '<input type="text" id="f_' + id + '" value="' + esc(val) + '" />';
  }
  return '<div class="card"><label>' + label + (critical ? ' <span style="color:var(--gold)">*</span>' : "") + "</label>" +
    (hint && type !== "select" ? '<p class="hint">' + hint + "</p>" : "") +
    control +
    '<div class="field-actions"><button class="ghost" onclick="setUnknown(\'' + id + '\')">Unknown</button></div></div>';
}
function startScreen() {
  return (
    '<div class="kicker">What this is</div>' +
    "<h1>Turn a messy game into a plan you can ship</h1>" +
    '<p class="lede">This is not a review tool and it is not a feature brainstorm. It diagnoses the current build, scores the real machine against a 10/10 for <i>this</i> game, then gives a phased plan of changes that actually move the score.</p>' +
    '<div class="grid3">' +
      '<div class="tile"><div class="n">01</div><h3>What it does</h3><p>Locks what the game is today, scores each system against hard gates, names the bottleneck, and refuses tiny polish while a load-bearing part is weak.</p></div>' +
      '<div class="tile"><div class="n">02</div><h3>How it works</h3><p>You fill the intake. Unknown is allowed. Invented player evidence is not. The wizard builds a packet. You paste that packet into Grok and get the scored plan.</p></div>' +
      '<div class="tile"><div class="n">03</div><h3>What you get</h3><p>A scorecard, a 10/10 definition bounded by your constraints, a kill list of work not worth doing, and this-week actions with done-when tests.</p></div>' +
    "</div>" +
    '<div class="card"><div class="kicker">The path</div><div class="flow"><span>1. Current state</span><span>2. Score the machine</span><span>3. Define 10/10</span><span>4. Find the gap</span><span>5. Phase the bridge</span></div><p class="hint" style="margin:0">10/10 is the best coherent version of this game under your time, team, and platform. Not an infinite masterpiece.</p></div>' +
    '<div class="card"><div class="kicker">You can achieve</div><ul class="achieve"><li><b>An honest score.</b> Not vibes. Behaviour gates, so a 7 has to earn the 7.</li><li><b>The real bottleneck.</b> Overall is capped by the weakest load-bearing system, not an average.</li><li><b>Work that matters.</b> Changes that lift a score and a player metric, not 0.01% polish.</li><li><b>A sequence.</b> Phase 0 prove it, Phase 1 make the game, later phases keep people and sharpen it.</li></ul></div>' +
    '<div class="card"><p class="notthis"><b style="color:#e8edf4">Not this:</b> a compliment sheet, a backlog dump, or add-more-content. If a field is unknown, mark it Unknown and keep moving.</p></div>'
  );
}
function renderScreen() {
  const step = STEPS[state.step];
  const root = document.getElementById("screen");
  const next = document.getElementById("nextBtn");
  if (!step || !root) return;
  next.textContent = step.kind === "generate" ? "Done" : (step.id === "start" ? "Start intake" : "Next");
  if (step.kind === "start") {
    root.innerHTML = startScreen();
    return;
  }
  if (step.kind === "files") {
    root.innerHTML = '<h1>Files & notes</h1><p class="lede">Text notes, markdown, CSV, JSON. Paste PDF excerpts.</p><div class="drop" id="drop">Drop files or <label class="teal" style="display:inline-block;margin-left:8px">Browse<input type="file" multiple hidden id="fileInput"></label></div><div class="files" id="fileList"></div><div class="card" style="margin-top:16px"><label>Extra pasted notes</label><textarea class="tall" id="extraNotes">' + esc(state.answers.extraNotes || "") + "</textarea></div>";
    renderFiles();
    document.getElementById("extraNotes").oninput = function (e) { state.answers.extraNotes = e.target.value; saveState(); };
    document.getElementById("fileInput").onchange = function (e) { ingestFiles(e.target.files); };
    const drop = document.getElementById("drop");
    drop.ondragover = function (e) { e.preventDefault(); };
    drop.ondrop = function (e) { e.preventDefault(); ingestFiles(e.dataTransfer.files); };
    return;
  }
  if (step.kind === "generate") {
    const ready = readiness();
    const missing = ready.missing.map(function (m) { return '<span class="chip bad">' + m + "</span>"; }).join("") || '<span class="chip good">Critical fields present</span>';
    root.innerHTML = "<h1>Generate the analysis prompt</h1><div class=\"card\"><b>Readiness: " + ready.score + '%</b><p class="' + (ready.score >= 70 ? "ok" : "warn") + '">' + ready.note + '</p><div class="chips">' + missing + '</div></div><div class="card"><button class="gold" onclick="copyFull()">Copy full prompt</button> <button class="teal" onclick="copyIntake()">Copy intake only</button> <button class="ghost" onclick="downloadFull()">Download .md</button><p class="hint" id="copyStatus"></p></div><div class="card"><label>Packet preview</label><textarea class="tall" style="min-height:280px" readonly>' + esc(buildFullPacket()) + "</textarea></div>";
    return;
  }
  root.innerHTML = "<h1>" + step.title + '</h1><p class="lede">' + stepHint(step.id) + "</p>" + step.fields.map(renderField).join("");
  step.fields.forEach(function (f) {
    const el = document.getElementById("f_" + f[0]);
    if (!el) return;
    el.oninput = function () { state.answers[f[0]] = el.value; saveState(); };
  });
}
function setUnknown(id) {
  state.answers[id] = "Unknown";
  saveState();
  renderScreen();
}
function markSectionUnknown() {
  const step = STEPS[state.step];
  if (!step.fields) return;
  step.fields.forEach(function (f) {
    if (!(state.answers[f[0]] || "").trim()) state.answers[f[0]] = "Unknown";
  });
  saveState();
  renderScreen();
}
async function ingestFiles(list) {
  for (const file of [...list]) {
    const rec = { name: file.name, size: file.size, type: file.type, at: new Date().toISOString(), text: "", note: "" };
    if (file.type.startsWith("image/")) { rec.kind = "image"; rec.note = "Image attached locally."; }
    else if (/\.pdf$|\.docx$/i.test(file.name)) { rec.kind = "binary"; rec.note = "Paste excerpts instead."; }
    else {
      try {
        const text = await file.text();
        if (text.startsWith("%PDF") || text.startsWith("PK")) rec.kind = "binary";
        else { rec.kind = "text"; rec.text = text.slice(0, 80000); }
      } catch { rec.kind = "unread"; }
    }
    state.files.push(rec);
  }
  saveState();
  renderFiles();
}
function renderFiles() {
  const box = document.getElementById("fileList");
  if (!box) return;
  if (!state.files.length) { box.innerHTML = '<div class="hint">No files yet.</div>'; return; }
  box.innerHTML = state.files.map(function (f, i) {
    return '<div class="file"><b>' + esc(f.name) + '</b><span class="hint">' + (f.kind || "file") + '</span><div class="field-actions"><button class="danger" onclick="removeFile(' + i + ')">Remove</button></div></div>';
  }).join("");
}
function removeFile(i) { state.files.splice(i, 1); saveState(); renderFiles(); }
function ans(id, fallback) {
  const v = (state.answers[id] || "").trim();
  return v || fallback || "Unknown";
}
function buildIntake() {
  return [
    "# GAME INTAKE", "",
    "## 1. Identity",
    "- Game name: " + ans("name"),
    "- Pitch: " + ans("pitch"),
    "- Genre: " + ans("genre"),
    "- Comparables: " + ans("comps"),
    "- Platforms: " + ans("platforms"),
    "- Session: " + ans("session"),
    "- Build state: " + ans("buildState"),
    "- Version: " + ans("version"), "",
    "## 2. Intent",
    "- Player: " + ans("player"),
    "- Fantasy: " + ans("fantasy"),
    "- Pillar 1: " + ans("pillar1"),
    "- Pillar 2: " + ans("pillar2"),
    "- Pillar 3: " + ans("pillar3"),
    "- Worse at: " + ans("worseAt"),
    "- Goals: " + ans("goal1") + "; " + ans("goal2") + "; " + ans("goal3"),
    "- Done: " + ans("dod"), "",
    "## 3. Constraints",
    "- Team: " + ans("team"),
    "- Skills: " + ans("skills"),
    "- Time box: " + ans("timebox"),
    "- Locks: " + ans("locks"),
    "- Business: " + ans("biz"),
    "- Sacred cows: " + ans("cows"),
    "- Cuts: " + ans("cuts"),
    "- Legal: " + ans("legal"), "",
    "## 4. Machine",
    "- Core loop: " + ans("coreLoop"),
    "- Session loop: " + ans("sessionLoop"),
    "- Meta loop: " + ans("metaLoop"),
    "- Onboarding: " + ans("onboarding"),
    "- Time-to-fun: " + ans("ttf"),
    "- Progression: " + ans("progress"),
    "- Economy: " + ans("economy"),
    "- Fail: " + ans("fail"),
    "- Social: " + ans("social"), "",
    "## 5. First session",
    "- 0-1: " + ans("m01"),
    "- 1-5: " + ans("m15"),
    "- Rest: " + ans("restFirst"),
    "- Can do: " + ans("canDo"),
    "- Stuck: " + ans("stuck"),
    "- Bored: " + ans("bored"),
    "- Thinks: " + ans("thinks"), "",
    "## 6. Repeat",
    "- Session 2: " + ans("session2"),
    "- Week 1: " + ans("week1"),
    "- Week 4: " + ans("week4"),
    "- Repetitive first: " + ans("repeatFirst"),
    "- Ignored: " + ans("ignored"), "",
    "## 7. Behaviour",
    "- Observed: " + ans("observed"),
    "- Quotes: " + ans("quotes"),
    "- Drop-off: " + ans("dropoff"),
    "- Workarounds: " + ans("workarounds"),
    "- Praised: " + ans("praised"),
    "- Never mentioned: " + ans("neverMention"),
    "- Metrics: " + ans("metrics"),
    "- Footage: " + ans("footage"), "",
    "## 8. Problems",
    "- Agreed: " + ans("agreed"),
    "- Suspected: " + ans("suspected"),
    "- Tried: " + ans("tried"),
    "- Fights: " + ans("fights"), "",
    "## 9. Production",
    "- Playable: " + ans("playable"),
    "- Greybox: " + ans("greybox"),
    "- Deck only: " + ans("deckOnly"),
    "- Content gap: " + ans("contentGap"),
    "- Tech risk: " + ans("techRisk"), "",
    "## 10. Planning",
    "- Capacity: " + ans("capacity"),
    "- S: " + ans("sizeS") + " M: " + ans("sizeM") + " L: " + ans("sizeL") + " XL: " + ans("sizeXL"),
    "- Unanswered: " + ans("unanswered"), "",
    "## Extra notes",
    ans("extraNotes", "(none)"), ""
  ].join("\n");
}
let PART_B_CACHE = "";
async function loadPartB() {
  try {
    const res = await fetch("PROMPT.md");
    PART_B_CACHE = (await res.text()).trim();
  } catch { PART_B_CACHE = ""; }
}
function partB() { return PART_B_CACHE || "See PROMPT.md in this repo."; }
function buildFullPacket() {
  return "Use the Game Intake below as source material. Then follow the analysis prompt exactly.\n\n==================================================\nGAME INTAKE\n==================================================\n" + buildIntake() + "\n\n==================================================\nANALYSIS PROMPT\n==================================================\n" + partB() + "\n";
}
function readiness() {
  const need = [["name","Game name"],["pitch","Pitch"],["player","Player"],["fantasy","Fantasy"],["pillar1","Pillars"],["coreLoop","Core loop"],["m01","First minute"],["m15","Minutes 1-5"],["observed","Observed behaviour"],["playable","What is playable"]];
  const missing = need.filter(function (x) { return !(state.answers[x[0]] || "").trim(); }).map(function (x) { return x[1]; });
  const score = Math.round(((need.length - missing.length) / need.length) * 100);
  let note = "Thin packet. Expect Phase 0 and Low confidence.";
  if (score >= 70) note = "Enough to run a real diagnosis.";
  if (score >= 90) note = "Strong packet.";
  return { score: score, missing: missing, note: note };
}
function updateMeter() {
  const fields = STEPS.flatMap(function (s) { return s.fields || []; }).map(function (f) { return f[0]; });
  const filled = fields.filter(function (id) { return (state.answers[id] || "").trim(); }).length;
  const pct = fields.length ? Math.round(filled / fields.length * 100) : 0;
  const meter = document.getElementById("meter");
  if (meter) meter.style.width = pct + "%";
}
function renderPreview() {
  const live = document.getElementById("live");
  const chips = document.getElementById("chips");
  if (live) live.textContent = buildIntake();
  const r = readiness();
  if (chips) chips.innerHTML = '<span class="chip ' + (r.score >= 70 ? "good" : "bad") + '">Ready ' + r.score + "%</span>" + r.missing.slice(0, 4).map(function (m) { return '<span class="chip bad">' + m + "</span>"; }).join("");
}
function flash(msg) {
  const el = document.getElementById("copyStatus");
  if (el) el.textContent = msg;
}
async function copyFull() { await navigator.clipboard.writeText(buildFullPacket()); flash("Full prompt copied."); }
async function copyIntake() { await navigator.clipboard.writeText(buildIntake()); flash("Intake copied."); }
function downloadFull() {
  const name = (state.answers.name || "game").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([buildFullPacket()], { type: "text/markdown" }));
  a.download = name + "-game-engineering-packet.md";
  a.click();
}
function exportIntake() {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([buildIntake()], { type: "text/markdown" }));
  a.download = "game-intake.md";
  a.click();
}
function resetAll() {
  if (!confirm("Clear all answers and files?")) return;
  state.answers = {};
  state.files = [];
  state.step = 0;
  saveState();
  renderScreen();
}
function boot() {
  renderNav();
  renderScreen();
  renderPreview();
  updateMeter();
}
loadPartB().then(boot).catch(boot);
