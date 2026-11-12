/* Deal sheet for the chapter 4 case. It fills in with every solved task. */
(function () {
  "use strict";
  var rf = 3, mrp = 5, tax = 0.30, price = 900;
  var fcf = 500 * (1 - 0.8) * (1 - tax);
  var B = { E: 4000, D: 1000, beta: 0.5, spread: 0.85 };
  var V = { E: 150 * 40, ND: 3000 - 1000, beta: 1.5, spread: 1.9, betaD: 0.17 };
  var wacc = function (c) { var d = c.D != null ? c.D : c.ND; return (c.E * (rf + c.beta * mrp) + d * (rf + c.spread) * (1 - tax)) / (c.E + d); };
  var wB = wacc(B), wV = wacc(V), bu = (V.E * V.beta + V.ND * V.betaD) / (V.E + V.ND);
  var C = { dark: "#362047", violet: "#5B4C9E", lilac: "#BDB5E3", berry: "#9C3A68", muted: "#6E6878", line: "#DCD8E4", ink: "#2B2533" };
  var eur = function (x) { return (x < 0 ? "−" : "") + "€" + Math.abs(Math.round(x)).toLocaleString("en-US") + " million"; };
  var pct = function (x) { return x.toFixed(2) + "%"; };
  var rate = 5;

  function bars(stage) {
    var W = 440, x0 = 168, max = 1500, sc = (W - x0 - 70) / max, y = 8, s = "";
    var row = function (label, val, col, known) {
      var w = known ? val * sc : 0;
      var r = '<text x="0" y="' + (y + 15) + '" font-size="12.5" fill="' + C.ink + '">' + label + '</text>' +
        '<rect x="' + x0 + '" y="' + y + '" width="' + (max * sc) + '" height="20" fill="#F6F5FA"/>' +
        (known ? '<rect x="' + x0 + '" y="' + y + '" width="' + w + '" height="20" fill="' + col + '"/>' : '') +
        '<text x="' + (x0 + w + 6) + '" y="' + (y + 15) + '" font-size="12.5" font-weight="700" fill="' + (known ? C.ink : C.muted) + '">' + (known ? "€" + Math.round(val).toLocaleString("en-US") + "m" : "?") + '</text>';
      y += 30; return r;
    };
    s += row("Purchase price", price, C.dark, true);
    s += row("Value at Brunnen’s WACC", fcf / wB * 100, C.lilac, stage >= 2);
    s += row("Value at Voltaq’s WACC", fcf / wV * 100, C.berry, stage >= 7);
    return '<svg viewBox="0 0 ' + W + ' ' + (y + 2) + '" role="img" aria-label="Purchase price compared with the value of the plant">' + s + '</svg>';
  }
  function sheet(stage) {
    var rows = [
      [1, "Brunnen’s WACC", pct(wB)],
      [2, "Free cash flow of the plant", eur(fcf) + " per year"],
      [4, "Voltaq: equity value", eur(V.E)],
      [4, "Voltaq: net debt", eur(V.ND)],
      [4, "Voltaq: equity cost of capital", pct(rf + V.beta * mrp)],
      [5, "Voltaq’s WACC", pct(wV)],
      [6, "Asset beta of the battery business", bu.toFixed(2)],
      [7, "NPV of the purchase", eur(fcf / wV * 100 - price)]
    ];
    var h = '<table class="file"><caption>Your results so far</caption>';
    rows.forEach(function (r) { h += '<tr><td>' + r[1] + '</td><td>' + (stage >= r[0] ? '<b>' + r[2] + '</b>' : '<span style="color:' + C.muted + '">open</span>') + '</td></tr>'; });
    return h + '</table>';
  }
  function market() {
    return '<table class="file"><caption>Market data</caption>' +
      '<tr><td>Risk-free rate</td><td>3%</td></tr><tr><td>Market risk premium</td><td>5%</td></tr><tr><td>Corporate tax rate</td><td>30%</td></tr></table>' +
      '<table class="file"><caption>Credit spreads over the risk-free rate</caption><tr><th>Rating</th><th>Spread in basis points</th></tr>' +
      '<tr><td>AA</td><td>55</td></tr><tr><td>A</td><td>85</td></tr><tr><td>BBB</td><td>115</td></tr><tr><td>BB</td><td>190</td></tr><tr><td>B</td><td>320</td></tr></table>';
  }
  function update() {
    var ro = document.getElementById("ro"); if (!ro) return;
    var v = fcf / rate * 100;
    ro.innerHTML = '<span>Discount rate</span><b>' + rate.toFixed(2) + '%</b><span>Value</span><b>' + eur(v) + '</b><span>NPV</span><b>' + eur(v - price) + '</b>';
  }
  window.CaseHooks = {
    render: function (el, stage, cur) {
      var h = '<h2>Deal sheet: the battery plant</h2>' + bars(stage);
      if (cur === 6) h += '<div class="sl"><label for="mixer">Try a discount rate</label><input type="range" id="mixer" min="4" max="12" step="0.05" value="' + rate + '"><div class="ro" id="ro" style="grid-template-columns:repeat(2,auto)"></div></div>';
      el.innerHTML = h + market() + sheet(stage);
      var sl = document.getElementById("mixer");
      if (sl) sl.oninput = function () { rate = +sl.value; update(); };
      update();
    }
  };
})();
