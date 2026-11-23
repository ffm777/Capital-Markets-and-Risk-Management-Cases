/* Case study engine: renders window.CASE, checks answers with fixed rules, reports anonymous progress. */
(function () {
  "use strict";
  var D = window.CASE, cfg = window.CASE_CONFIG || {}, hooks = window.CaseHooks || {};
  var KEY = "case-" + D.id, N = D.tasks.length;
  var dec = function (s) { return parseFloat(atob(s)); };
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* ---------- session ----------
     The lecturer opens and closes sessions on the dashboard (database node /control/<case>).
     Open session: progress is counted under its code and survives across lectures.
     Closed session: the case still works, but nothing is counted.
     No session ever opened: progress is counted under today's date (old behaviour).
     A ?run=CODE parameter overrides all of this. */
  var q = new URLSearchParams(location.search);
  var today = new Date(), pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var clean = function (r) { return String(r || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 20); };
  var run = null, tracking = false;
  var mem = null;
  function load() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return mem; } }
  function save() { mem = S; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
  function fresh() {
    var id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : "x" + Date.now() + Math.random().toString(36).slice(2, 10);
    return { sid: id, run: run, stage: -1, att: {}, vals: {}, pred: {}, mc: {}, open: {}, t0: 0, t1: 0 };
  }
  var S = null;

  function track(step) {
    if (!cfg.firebaseUrl || !tracking) return;
    S.sent = S.sent || {}; S.sent[step] = 1; save();
    var url = cfg.firebaseUrl.replace(/\/+$/, "") + "/progress/" + D.id + "/" + run + "/" + S.sid + "/s" + step + ".json";
    try { fetch(url, { method: "PUT", body: JSON.stringify({ ".sv": "timestamp" }), keepalive: true }).catch(function () { }); } catch (e) { }
  }
  function getControl(cb) {
    if (q.get("run") || !cfg.firebaseUrl) return cb(null);
    var base = cfg.firebaseUrl.replace(/\/+$/, "") + "/control/" + D.id + "/", done = false;
    var finish = function (c) { if (!done) { done = true; cb(c); } };
    setTimeout(function () { finish(null); }, 3000);
    Promise.all(["run", "open"].map(function (k) {
      return fetch(base + k + ".json", { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : null; });
    })).then(function (v) { finish(v[0] ? { run: v[0], open: v[1] === true } : null); }).catch(function () { finish(null); });
  }
  function startSession(c) {
    var stored = load();
    if (q.get("run")) { run = clean(q.get("run")) || "default"; tracking = true; }
    else if (c && c.open) { run = clean(c.run); tracking = true; }
    else if (c) { run = (stored && stored.run) || "closed"; tracking = false; }
    else { run = today.getFullYear() + "-" + pad(today.getMonth() + 1) + "-" + pad(today.getDate()); tracking = true; }
    S = stored;
    if (!S || (tracking && S.run !== run) || q.get("reset")) { S = fresh(); save(); }
    // steps solved while the session was closed are reported once it is open again
    if (tracking && S.stage >= 0) for (var k = 0; k <= Math.min(S.stage, N); k++) if (!(S.sent || {})[k]) track(k);
  }

  /* ---------- checking ---------- */
  function parseNum(str, big) {
    var s = String(str == null ? "" : str).trim().replace(/[%€$\s'’]/g, "");
    s = s.replace(/^[−–]/, "-");
    if (!s) return NaN;
    if (big && /^-?\d{1,3}([.,]\d{3})+$/.test(s)) s = s.replace(/[.,]/g, "");
    else s = s.replace(",", ".");
    return /^-?\d*\.?\d+$/.test(s) ? parseFloat(s) : NaN;
  }
  function near(a, b, tol) { return Math.abs(a - b) <= tol + 1e-9; }
  function judge(f, raw, att) {
    var v = parseNum(raw, f.big), a = dec(f.ans);
    if (isNaN(v)) return { ok: false, hint: "Enter a number for “" + f.plain + "”." };
    if (near(v, a, f.tol)) return { ok: true };
    if (f.kind === "pct" && near(v * 100, a, f.tol)) return { ok: false, hint: "Enter the value in percent: type 12.5 for 12.5%, not 0.125." };
    if (f.kind === "ratio" && near(v / 100, a, f.tol)) return { ok: false, hint: "This is a plain number, not a percentage: type 0.25, not 25." };
    for (var i = 0; i < (f.mis || []).length; i++) {
      var mv = dec(f.mis[i].v);
      if (near(v, mv, f.tol) || (f.kind === "pct" && near(v * 100, mv, f.tol))) return { ok: false, hint: f.mis[i].h };
    }
    var hs = f.hints || [], h = hs[Math.min(att - 1, hs.length - 1)] || "Check your calculation.";
    if (att >= 2) h += " Your value is too " + (v > a ? "high" : "low") + ".";
    return { ok: false, hint: h };
  }
  function fmt(f) {
    var a = dec(f.ans);
    var s = f.big ? Math.abs(a).toLocaleString("en-US") : String(a);
    return (f.big && a < 0 ? "−" : "") + (f.pre || "") + s + (f.unit ? (f.unit === "%" ? "%" : " " + f.unit) : "");
  }

  /* ---------- rendering ---------- */
  function fieldHtml(t, f, solved) {
    var val = solved ? String(dec(f.ans)) : ((S.vals[t.id] || {})[f.key] || "");
    return '<div class="field"><label for="f-' + f.key + '">' + f.label + '</label><div class="row">' +
      (f.pre ? '<span class="unit">' + f.pre + '</span>' : '') +
      '<input id="f-' + f.key + '" inputmode="decimal" autocomplete="off" value="' + esc(val) + '"' + (solved ? ' class="ok" disabled' : '') + '>' +
      (f.unit ? '<span class="unit">' + f.unit + '</span>' : '') +
      '<span class="mark' + (solved ? ' ok">correct' : '">') + '</span></div><div class="hintbox"></div></div>';
  }
  function choiceHtml(name, c, picked, disabled, marks) {
    var h = '<fieldset class="choice"><legend>' + c.q + '</legend>';
    c.options.forEach(function (o, i) {
      var cls = marks && picked === i ? (marks === "ok" ? ' class="ok"' : ' class="bad"') : '';
      h += '<label' + cls + '><input type="radio" name="' + name + '" value="' + i + '"' + (picked === i ? ' checked' : '') + (disabled ? ' disabled' : '') + '><span>' + o.t + '</span></label>';
    });
    return h + '<div class="hintbox"></div></fieldset>';
  }
  function taskHtml(t, idx) {
    var solved = S.stage > idx, att = S.att[t.id] || 0;
    var h = '<section class="task" id="task"><div class="num">Task ' + (idx + 1) + ' of ' + N + '</div><h2>' + t.title + '</h2>';
    if (t.mail) h += '<blockquote class="mail"><span class="from">' + t.mail.from + '</span>' + t.mail.text + '</blockquote>';
    h += '<div class="body">' + t.body + '</div>';
    if (t.predict) {
      var p = S.pred[t.id];
      h += '<div id="pred">' + choiceHtml("pred", t.predict, p, solved) + '</div>';
      if (solved) h += '<div class="reveal">' + t.predict.reveal + '</div>';
    }
    if (t.fields) h += '<div class="fields">' + t.fields.map(function (f) { return fieldHtml(t, f, solved); }).join("") + '</div>';
    if (t.mc) h += '<div id="mc">' + choiceHtml("mc", t.mc, solved ? dec(t.mc.ans) : S.mc[t.id], solved, solved ? "ok" : null) + '</div>';
    if (!solved) {
      h += '<div class="actions"><button class="btn" id="check">Check answers</button>';
      if (att >= 3) h += '<button class="btn ghost" id="showApp">Show the approach</button>';
      if (att >= 6) h += '<button class="btn ghost" id="showSol">Show the solution</button>';
      h += '</div>';
      if (S.open[t.id]) h += '<div class="approach"><h3>Approach</h3>' + t.approach + '</div>';
    } else {
      h += '<div class="success" id="success"><h3>' + (t.successTitle || "Solved") + '</h3>' + t.success +
        '<div class="actions"><button class="btn" id="next">' + (idx + 1 < N ? "Go to task " + (idx + 2) : "Finish the case") + '</button></div></div>';
    }
    return h + '</section>';
  }
  function solvedHtml(t, idx) {
    var h = '<details class="solved"><summary><span class="tick">✓</span>Task ' + (idx + 1) + ': ' + t.title + '</summary><dl>';
    (t.fields || []).forEach(function (f) { h += '<dt>' + f.plain + '</dt><dd>' + fmt(f) + '</dd>'; });
    if (t.mc) h += '<dt>Decision</dt><dd>' + t.mc.options[dec(t.mc.ans)].t + '</dd>';
    return h + '</dl><div class="body">' + t.success + '</div></details>';
  }
  function minutes() { return S.t0 ? Math.max(0, Math.round(((S.t1 || Date.now()) - S.t0) / 60000)) : 0; }

  var view = -1; // index of the task shown in full; solved tasks stay open until "next" is pressed
  function render(scroll) {
    var flow = $("flow"), tr = $("track"), i, h = "";
    var cur = S.stage < 0 ? -1 : Math.min(view < 0 ? S.stage : view, N);
    tr.innerHTML = D.tasks.map(function (t, k) {
      return '<li class="' + (k < S.stage ? "done" : (k === cur ? "now" : "")) + '" aria-label="Task ' + (k + 1) + '">' + (k + 1) + '</li>';
    }).join("");
    $("clock").textContent = S.t0 ? minutes() + " min" : "";
    if (S.stage < 0) {
      h = '<section class="intro">' + D.intro + '<div class="actions"><button class="btn" id="start">Start the case</button></div>' +
        '<p class="foot">No login, no grades. The page stores only an anonymous random ID and which tasks are solved, so your lecturer can see how far the class is.' + (tracking ? '' : ' There is no open class session right now, so your progress is not counted.') + '</p></section>';
    } else {
      for (i = 0; i < Math.min(cur, N); i++) h += solvedHtml(D.tasks[i], i);
      if (cur < N) h += taskHtml(D.tasks[cur], cur);
      else h += '<section class="task finale" id="task">' + D.finale.replace("{min}", minutes()) + '</section>';
    }
    flow.innerHTML = h;
    $("aside").hidden = S.stage < 0;
    if (hooks.render && S.stage >= 0) hooks.render($("aside"), S.stage, cur);
    bind(cur);
    if (scroll) { var el = $(scroll); if (el) el.scrollIntoView({ behavior: "smooth", block: scroll === "success" ? "center" : "start" }); }
  }

  function bind(cur) {
    var t = D.tasks[cur];
    if ($("start")) $("start").onclick = function () { S.stage = 0; S.t0 = Date.now(); view = 0; save(); track(0); render(); window.scrollTo(0, 0); };
    if ($("next")) $("next").onclick = function () { view = cur + 1; render(); window.scrollTo(0, 0); };
    if (!t || S.stage > cur) return;
    (t.fields || []).forEach(function (f) {
      var inp = $("f-" + f.key);
      inp.oninput = function () { (S.vals[t.id] = S.vals[t.id] || {})[f.key] = inp.value; save(); };
      inp.onkeydown = function (e) { if (e.key === "Enter") check(t, cur); };
    });
    document.querySelectorAll('input[name=pred]').forEach(function (r) { r.onchange = function () { S.pred[t.id] = +r.value; save(); }; });
    document.querySelectorAll('input[name=mc]').forEach(function (r) { r.onchange = function () { S.mc[t.id] = +r.value; save(); }; });
    $("check").onclick = function () { check(t, cur); };
    if ($("showApp")) $("showApp").onclick = function () { S.open[t.id] = 1; save(); render(); };
    if ($("showSol")) $("showSol").onclick = function () { solve(t, cur); };
  }

  function solve(t, cur) {
    S.stage = cur + 1; view = cur;
    if (S.stage === N) S.t1 = Date.now();
    save(); track(S.stage); render("success");
  }

  function check(t, cur) {
    if (t.predict && S.pred[t.id] == null) {
      $("pred").querySelector(".hintbox").innerHTML = '<p class="hint">Make your guess first. It is not graded.</p>';
      return;
    }
    var att = (S.att[t.id] = (S.att[t.id] || 0) + 1), all = true;
    if ($("pred")) $("pred").querySelector(".hintbox").innerHTML = "";
    (t.fields || []).forEach(function (f) {
      var inp = $("f-" + f.key), r = judge(f, inp.value, att), box = inp.closest(".field");
      inp.className = r.ok ? "ok" : "bad";
      var m = box.querySelector(".mark"); m.className = "mark " + (r.ok ? "ok" : "bad"); m.textContent = r.ok ? "correct" : "not yet";
      box.querySelector(".hintbox").innerHTML = r.ok ? "" : '<p class="hint">' + r.hint + '</p>';
      if (!r.ok) all = false;
    });
    if (t.mc) {
      var pick = S.mc[t.id], box = $("mc").querySelector(".hintbox"), right = dec(t.mc.ans);
      $("mc").querySelectorAll("label").forEach(function (l, i) { l.className = pick === i ? (i === right ? "ok" : "bad") : ""; });
      if (pick == null) { box.innerHTML = '<p class="hint">Choose one of the options.</p>'; all = false; }
      else if (pick !== right) { box.innerHTML = '<p class="hint">' + t.mc.options[pick].h + '</p>'; all = false; }
      else box.innerHTML = "";
    }
    save();
    if (all) return solve(t, cur);
    if ((att === 3 && !$("showApp")) || (att === 6 && !$("showSol"))) {
      var a = document.querySelector(".actions"), b = document.createElement("button");
      b.className = "btn ghost"; b.id = att === 3 ? "showApp" : "showSol"; b.textContent = att === 3 ? "Show the approach" : "Show the solution";
      a.appendChild(b); bind(cur);
    }
  }

  document.title = D.title;
  $("name").textContent = D.short;
  getControl(function (c) {
    startSession(c);
    if (S.stage >= 0) view = Math.min(S.stage, N);
    render();
    setInterval(function () { if (S.t0 && !S.t1) $("clock").textContent = minutes() + " min"; }, 15000);
  });
})();
