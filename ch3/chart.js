/* Risk-return map for the chapter 3 case. It grows with every solved task. */
(function () {
  "use strict";
  var W = 560, H = 400, m = { l: 50, r: 14, t: 14, b: 42 }, XM = 45, YM = 17;
  var px = function (sd) { return m.l + sd / XM * (W - m.l - m.r); };
  var py = function (mu) { return H - m.b - mu / YM * (H - m.t - m.b); };
  var mix = function (x) { return { mu: x * 15 + (1 - x) * 7, sd: Math.sqrt(x * x * 1600 + (1 - x) * (1 - x) * 400) }; };
  var C = { ink: "#2B2533", grid: "#E6E3EE", amber: "#362047", teal: "#362047", berry: "#9C3A68", muted: "#6E6878", line: "#5B4C9E", green: "#3F7A5E" };
  var w = 50, built = false;

  function path(a, b, n) { var d = "", i, p; for (i = 0; i <= n; i++) { p = mix(a + (b - a) * i / n); d += (i ? "L" : "M") + px(p.sd).toFixed(1) + " " + py(p.mu).toFixed(1); } return d; }
  function dot(sd, mu, col, label, dx, dy, r) {
    return '<circle cx="' + px(sd) + '" cy="' + py(mu) + '" r="' + (r || 6) + '" fill="' + col + '" stroke="#fff" stroke-width="2"/>' +
      '<text x="' + (px(sd) + dx) + '" y="' + (py(mu) + dy) + '" font-size="13" font-weight="700" fill="' + C.ink + '">' + label + '</text>';
  }
  function ray(mu0, slope, col, dash) {
    var sdEnd = Math.min(XM, (YM - mu0) / slope);
    return '<line x1="' + px(0) + '" y1="' + py(mu0) + '" x2="' + px(sdEnd) + '" y2="' + py(mu0 + slope * sdEnd) + '" stroke="' + col + '" stroke-width="2"' + (dash ? ' stroke-dasharray="5 5"' : '') + '/>';
  }
  function svg(stage, slider) {
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Risk-return map">', i;
    for (i = 0; i <= XM; i += 5) s += '<line x1="' + px(i) + '" y1="' + py(0) + '" x2="' + px(i) + '" y2="' + py(YM) + '" stroke="' + C.grid + '"/>' +
      (i % 10 === 0 ? '<text x="' + px(i) + '" y="' + (py(0) + 16) + '" font-size="12" text-anchor="middle" fill="' + C.muted + '">' + i + '%</text>' : '');
    for (i = 0; i <= YM; i += 2) s += '<line x1="' + px(0) + '" y1="' + py(i) + '" x2="' + px(XM) + '" y2="' + py(i) + '" stroke="' + C.grid + '"/>' +
      '<text x="' + (px(0) - 6) + '" y="' + (py(i) + 4) + '" font-size="12" text-anchor="end" fill="' + C.muted + '">' + i + '%</text>';
    s += '<text x="' + px(XM) + '" y="' + (H - 6) + '" font-size="12.5" text-anchor="end" fill="' + C.ink + '">Volatility</text>' +
      '<text x="' + (m.l + 6) + '" y="' + (m.t + 10) + '" font-size="12.5" fill="' + C.ink + '">Expected return</text>';
    if (stage >= 7) s += ray(3, 0.5, C.berry) + '<text x="' + px(21) + '" y="' + (py(14.4)) + '" font-size="12.5" font-weight="700" fill="' + C.berry + '" text-anchor="end">Capital market line</text>';
    if (stage >= 4) s += ray(3, (8.6 - 3) / Math.sqrt(320), C.line, true) + ray(3, 0.36, C.line);
    if (stage >= 2) s += '<path d="' + path(0, 0.2, 20) + '" fill="none" stroke="' + C.muted + '" stroke-width="2" stroke-dasharray="4 5"/>' +
      '<path d="' + path(0.2, 1, 60) + '" fill="none" stroke="' + C.green + '" stroke-width="3.5"/>' +
      '<text x="' + px(29) + '" y="' + py(10.3) + '" font-size="12.5" font-weight="700" fill="' + C.green + '">Efficient frontier</text>';
    else if (stage >= 1) s += '<path d="' + path(0, 1, 80) + '" fill="none" stroke="' + C.muted + '" stroke-width="2"/>';
    s += dot(40, 15, C.amber, "Voltaq", -18, -12) + dot(20, 7, C.teal, "Brunnen", 10, 16);
    if (stage >= 1) s += dot(mix(.5).sd, 11, C.ink, "50/50", 10, 14, 5);
    if (stage >= 2) s += dot(mix(.2).sd, 8.6, C.ink, "MVP", -42, 5, 5);
    if (stage >= 3) s += dot(20, 10.2, C.ink, "P", -20, -9, 5);
    if (stage >= 4) s += dot(0, 3, C.line, "Bund", 9, 16, 5);
    if (stage >= 5) s += dot(10, 6.6, C.line, "K", 8, 16, 5);
    if (stage >= 6) s += dot(16, 11, C.berry, "Market", -56, -8);
    if (stage >= 7) s += dot(10, 8, C.berry, "L", -16, -8, 5);
    if (slider) s += '<circle id="me" r="8" fill="none" stroke="' + C.berry + '" stroke-width="3"/>';
    return s + '</svg>';
  }
  function file(stage) {
    var h = '<table class="file"><caption>Elena’s file</caption><tr><th></th><th>Expected return</th><th>Volatility</th>' + (stage >= 5 ? '<th>Corr. with market</th>' : '') + '</tr>';
    var row = function (n, a, b, c) { return '<tr><td>' + n + '</td><td>' + a + '</td><td>' + b + '</td>' + (stage >= 5 ? '<td>' + (c || "") + '</td>' : '') + '</tr>'; };
    h += row("Voltaq", "15%", "40%", "0.6") + row("Brunnen", "7%", "20%", "0.4");
    if (stage >= 3) h += row("Bund (risk-free)", "3%", "0%", "");
    if (stage >= 5) h += row("Market portfolio", "11%", "16%", "1");
    return h + '</table><p class="locked">Voltaq and Brunnen are uncorrelated with each other. Budget: €1,000,000.</p>';
  }
  function update(stage) {
    var p = mix(w / 100), me = document.getElementById("me"), ro = document.getElementById("ro");
    if (me) { me.setAttribute("cx", px(p.sd)); me.setAttribute("cy", py(p.mu)); }
    if (ro) ro.innerHTML = '<span>Voltaq</span><b>' + w + '%</b><span>Brunnen</span><b>' + (100 - w) + '%</b>' +
      '<span>Expected return</span><b>' + p.mu.toFixed(2) + '%</b><span>Volatility</span><b>' + p.sd.toFixed(2) + '%</b>' +
      '';
  }
  window.CaseHooks = {
    render: function (el, stage, cur) {
      var slider = cur === 2; // only while task 3 is on screen
      var h = '<h2>Risk-return map</h2>' + svg(stage, slider);
      if (slider) h += '<div class="sl"><label for="mixer">Try a mix of Voltaq and Brunnen</label><input type="range" id="mixer" min="0" max="100" step="1" value="' + w + '"><div class="ro" id="ro"></div></div>';
      else if (stage < 7) h += '<p class="locked">The map fills in as you solve the tasks.</p>';
      el.innerHTML = h + file(stage);
      var sl = document.getElementById("mixer");
      if (sl) sl.oninput = function () { w = +sl.value; update(stage); };
      update(stage);
    }
  };
})();
