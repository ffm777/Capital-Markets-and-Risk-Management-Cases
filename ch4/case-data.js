/* Chapter 4 case: "The battery bet". Numbers are base64-encoded so they are not readable at a glance. */
window.CASE = {
  id: "ch4",
  title: "The battery bet",
  short: "The battery bet",
  intro: `
    <h1>The battery bet</h1>
    <p class="lede">You are two analysts in corporate finance at Brunnen AG, the mineral water company. CEO Markus Brunner is bored with water. He wants to buy a battery cell plant for €900 million and present the deal to the supervisory board this morning. Your job: find out what the plant is really worth.</p>
    <table class="given">
      <tr><th>The plant</th><th class="r"></th></tr>
      <tr><td>Purchase price</td><td class="r">€900 million</td></tr>
      <tr><td>Expected revenues per year</td><td class="r">€500 million</td></tr>
      <tr><td>Operating costs</td><td class="r">80% of revenues</td></tr>
      <tr><td>Corporate tax rate</td><td class="r">30%</td></tr>
    </table>
    <p>There is no growth, so the plant can be valued as a perpetuity. Free cash flow equals NOPAT. The risk-free rate is 3% and the market risk premium is 5%.</p>
    <ul class="rules">
      <li>Seven tasks, about 30 minutes. Work as a team of two on one device.</li>
      <li>You need a calculator and your chapter 4 slides.</li>
      <li>Enter percentages as numbers (12.5 for 12.5%) and round to two decimals. Enter money in € million.</li>
      <li>Wrong answers cost nothing. You get a hint and try again.</li>
    </ul>`,
  tasks: [
    {
      id: "t1", title: "The CEO’s five percent",
      mail: { from: "Markus Brunner, CEO, 8:31", text: "We finance ourselves at roughly 5%. The plant earns far more than that. Just confirm my number so I can put it on the first slide." },
      body: `<p>Check his number. Brunnen AG has a market capitalisation of €4,000 million and an equity beta of 0.5. It has €1,000 million of debt with an A rating and no excess cash. Use the credit spreads on the deal sheet.</p>`,
      fields: [
        { key: "reb", label: "Brunnen’s equity cost of capital", plain: "Equity cost of capital", unit: "%", kind: "pct", ans: "NS41", tol: 0.05,
          mis: [{ v: "Mi41", h: "Add the risk-free rate to the risk premium." }, { v: "NA==", h: "The 5% is already the market risk premium. Do not subtract the risk-free rate from it again." }, { v: "Nw==", h: "Multiply beta by the market risk premium only, not by the market return." }],
          hints: ["Use the CAPM: risk-free rate + beta × market risk premium."] },
        { key: "rdb", label: "Brunnen’s pre-tax debt cost of capital", plain: "Pre-tax debt cost of capital", unit: "%", kind: "pct", ans: "My44NQ==", tol: 0.05,
          mis: [{ v: "MC44NQ==", h: "That is only the credit spread. Add it to the risk-free rate." }, { v: "Mi43", h: "That is the after-tax value. The question asks for the pre-tax cost of debt." }, { v: "MTEuNQ==", h: "85 basis points are 0.85 percentage points, not 8.5." }, { v: "ODg=", h: "85 basis points are 0.85 percentage points." }],
          hints: ["Risk-free rate + credit spread for the rating class.", "Look up the spread for an A rating on the deal sheet. 100 basis points are 1 percentage point."] },
        { key: "wb", label: "Brunnen’s cost of capital (WACC)", plain: "WACC", unit: "%", kind: "pct", ans: "NC45NA==", tol: 0.05,
          mis: [{ v: "NS4xNw==", h: "Interest is tax-deductible. Use the after-tax cost of debt in the WACC." }, { v: "NC42OA==", h: "Weight equity and debt with their shares of firm value, not half and half." }, { v: "My4yNg==", h: "The weights are swapped. Equity is the larger part of firm value." }, { v: "NC44", h: "The weights are E/(E+D) and D/(E+D), not D/E." }],
          hints: ["Weighted average of the equity cost of capital and the after-tax debt cost of capital, with market values as weights.",
            "E/(E+D) × equity cost of capital + D/(E+D) × pre-tax debt cost × (1 − tax rate)."] }
      ],
      approach: `<p><span class="f">r<sub>E</sub> = r<sub>f</sub> + β<sub>E</sub>·(E(R<sub>Mkt</sub>) − r<sub>f</sub>)</span></p>
        <p><span class="f">r<sub>D</sub> pre-tax = r<sub>f</sub> + credit spread (rating)</span></p>
        <p><span class="f">WACC = E/(E+D)·r<sub>E</sub> + D/(E+D)·r<sub>D</sub>·(1 − τ)</span></p>`,
      successTitle: "Markus was close",
      success: `<p>Brunnen’s cost of capital is 4.94%. So far the CEO has his numbers right.</p>`
    },
    {
      id: "t2", title: "A bargain at five percent?",
      mail: { from: "Markus Brunner, CEO, 8:36", text: "Told you. Now discount the plant’s cash flows at our cost of capital and tell me how much value we create." },
      body: `<p>Do what he asks, for now. Calculate the plant’s free cash flow per year, its value as a perpetuity at Brunnen’s WACC from task 1, and the NPV of buying it for €900 million.</p>`,
      fields: [
        { key: "fcf", label: "Free cash flow per year", plain: "Free cash flow per year", pre: "€", unit: "million", big: true, ans: "NzA=", tol: 0.5,
          mis: [{ v: "MTAw", h: "That is the profit before tax. Free cash flow here equals NOPAT, so deduct the tax." }, { v: "MzUw", h: "Deduct the operating costs before you deduct the tax." }, { v: "MzA=", h: "That is the tax payment. The free cash flow is what remains after tax." }, { v: "NTAw", h: "That is revenue. Deduct operating costs and tax." }],
          hints: ["Revenues minus operating costs gives the operating profit. NOPAT is the operating profit after tax."] },
        { key: "v1", label: "Value of the plant at Brunnen’s WACC", plain: "Value at Brunnen’s WACC", pre: "€", unit: "million", big: true, ans: "MTQxNw==", tol: 5,
          mis: [{ v: "MTQwMA==", h: "Use the WACC from task 1 (4.94%), not the CEO’s rounded 5%." }, { v: "MjAyNA==", h: "Discount the after-tax free cash flow, not the profit before tax." }, { v: "MTQuMTc=", h: "Divide the cash flow by the rate as a decimal: 4.94% is 0.0494." }],
          hints: ["Value of a perpetuity = cash flow per year ÷ discount rate."] },
        { key: "npv1", label: "NPV of the purchase at Brunnen’s WACC", plain: "NPV at Brunnen’s WACC", pre: "€", unit: "million", big: true, ans: "NTE3", tol: 5,
          mis: [{ v: "MTQxNw==", h: "That is the value. For the NPV, subtract the purchase price." }, { v: "NTAw", h: "Use the WACC from task 1 (4.94%), not the CEO’s rounded 5%." }, { v: "LTUxNw==", h: "Check the sign: the value is higher than the price here." }],
          hints: ["NPV = value of the plant − purchase price."] }
      ],
      approach: `<p><span class="f">FCF = NOPAT = (revenues − costs)·(1 − τ)</span></p>
        <p><span class="f">Value = FCF / r</span> and <span class="f">NPV = value − price</span></p>`,
      successTitle: "On paper, a great deal",
      success: `<p>At 4.94% the plant looks like it is worth about €1.4 billion, €517 million more than the price. Markus is delighted. Before this goes to the board, read the next mail.</p>`
    },
    {
      id: "t3", title: "The CFO’s objection",
      mail: { from: "Dr. Aylin Demir, CFO, 8:44", text: "Since when does a battery plant carry the risk of a water bottler? Battery stocks are twice as volatile as ours and their betas are three times ours. Which rate belongs in this valuation?" },
      body: `<p>No calculation this time. Decide which discount rate is the right one for the plant.</p>`,
      mc: {
        q: "Which cost of capital should you use to value the battery plant?",
        ans: "MQ==",
        options: [
          { t: "Brunnen’s WACC, because Brunnen is the company that raises the money.", h: "The cost of capital depends on the risk of the investment, not on who pays for it. Brunnen’s investors would carry battery risk and want to be paid for it." },
          { t: "The cost of capital of a comparable battery business, because investors require a return for the risk of this project." },
          { t: "Brunnen’s after-tax cost of debt, because the purchase would be financed with a loan.", h: "A loan does not make the plant’s cash flows safer. The extra debt makes Brunnen’s equity riskier instead." },
          { t: "Twice Brunnen’s WACC, because battery stocks are twice as volatile.", h: "Volatility is total risk. Only systematic risk, measured by beta, earns a risk premium." }]
      },
      approach: `<p>The cost of capital is an opportunity cost: the return investors could earn elsewhere on an investment with the same risk. Ask whose risk the plant’s cash flows carry.</p>`,
      successTitle: "Risk follows the project",
      success: `<p>The plant is a battery business, whoever owns it. You need the cost of capital of a comparable firm. Luckily there is a listed pure play: Voltaq.</p>`
    },
    {
      id: "t4", title: "Meet the comparable",
      mail: { from: "Dr. Aylin Demir, CFO, 8:49", text: "Take Voltaq. They do nothing but battery cells. And watch out for their cash pile." },
      body: `<p>Voltaq has 150 million shares trading at €40 and an equity beta of 1.5. It has €3,000 million of debt with a BB rating. It also holds €1,000 million in cash and short-term investments that it does not need for its operations.</p>`,
      fields: [
        { key: "ev", label: "Market value of Voltaq’s equity", plain: "Market value of equity", pre: "€", unit: "million", big: true, ans: "NjAwMA==", tol: 1,
          mis: [{ v: "Ng==", h: "Enter the amount in € million, not in billions." }],
          hints: ["Number of shares × share price."] },
        { key: "nd", label: "Voltaq’s net debt", plain: "Net debt", pre: "€", unit: "million", big: true, ans: "MjAwMA==", tol: 1,
          mis: [{ v: "MzAwMA==", h: "That is gross debt. Excess cash is a risk-free asset that offsets part of the debt." }, { v: "NDAwMA==", h: "Cash reduces the debt. Subtract it instead of adding it." }, { v: "Mg==", h: "Enter the amount in € million, not in billions." }],
          hints: ["Net debt = debt − excess cash and short-term investments."] },
        { key: "rev", label: "Voltaq’s equity cost of capital", plain: "Equity cost of capital", unit: "%", kind: "pct", ans: "MTAuNQ==", tol: 0.05,
          mis: [{ v: "Ny41", h: "Add the risk-free rate to the risk premium." }, { v: "MTU=", h: "The market risk premium in this case is 5%." }, { v: "NS41", h: "That is Brunnen’s value. Use Voltaq’s beta." }],
          hints: ["Use the CAPM with Voltaq’s equity beta."] }
      ],
      approach: `<p><span class="f">E = shares × price</span></p>
        <p><span class="f">Net debt = debt − excess cash</span></p>
        <p><span class="f">r<sub>E</sub> = r<sub>f</sub> + β<sub>E</sub>·(E(R<sub>Mkt</sub>) − r<sub>f</sub>)</span></p>`,
      successTitle: "Cash counts as negative debt",
      success: `<p>Voltaq’s shareholders require 10.5%, almost twice what Brunnen’s shareholders ask for. And because €1,000 million of the debt is matched by riskless cash, the battery business itself is financed with only €2,000 million of net debt.</p>`
    },
    {
      id: "t5", title: "Voltaq’s cost of capital",
      body: `<p>Now put the pieces together. Voltaq’s debt is rated BB and its tax rate is 30%. Use the credit spreads on the deal sheet and measure leverage with net debt.</p>`,
      fields: [
        { key: "rdv", label: "Voltaq’s pre-tax debt cost of capital", plain: "Pre-tax debt cost of capital", unit: "%", kind: "pct", ans: "NC45", tol: 0.05,
          mis: [{ v: "MS45", h: "That is only the credit spread. Add it to the risk-free rate." }, { v: "My44NQ==", h: "That is the value for an A rating. Voltaq is rated BB." }, { v: "MjI=", h: "190 basis points are 1.9 percentage points." }],
          hints: ["Risk-free rate + credit spread for a BB rating."] },
        { key: "rdva", label: "Voltaq’s after-tax debt cost of capital", plain: "After-tax debt cost of capital", unit: "%", kind: "pct", ans: "My40Mw==", tol: 0.05,
          mis: [{ v: "MS40Nw==", h: "Multiply by (1 − tax rate), not by the tax rate." }, { v: "NC45", h: "That is the pre-tax value. Take the tax benefit of interest into account." }],
          hints: ["Pre-tax debt cost of capital × (1 − tax rate)."] },
        { key: "wv", label: "Voltaq’s cost of capital (WACC)", plain: "WACC", unit: "%", kind: "pct", ans: "OC43Mw==", tol: 0.05,
          mis: [{ v: "OS4x", h: "Use the after-tax cost of debt in the WACC." }, { v: "OC4xNA==", h: "Measure leverage with net debt (task 4), not with gross debt." }, { v: "OC42Mw==", h: "Two things to check: use net debt for the weights and the after-tax cost of debt." }, { v: "NC45NA==", h: "That is Brunnen’s WACC. Use Voltaq’s numbers." }, { v: "NS4y", h: "The weights are swapped. Equity is the larger part of firm value." }],
          hints: ["Same formula as in task 1, with Voltaq’s equity value and net debt as weights.",
            "Firm value is equity plus net debt. Weight 10.5% with the equity share and the after-tax debt cost with the net debt share."] }
      ],
      approach: `<p><span class="f">r<sub>D</sub> pre-tax = r<sub>f</sub> + credit spread (BB)</span>, then <span class="f">r<sub>D</sub> after-tax = r<sub>D</sub> pre-tax·(1 − τ)</span></p>
        <p><span class="f">WACC = E/(E+ND)·r<sub>E</sub> + ND/(E+ND)·r<sub>D</sub> after-tax</span>, where ND is net debt.</p>`,
      successTitle: "8.73%, not 4.94%",
      success: `<p>Investors in a battery business require 8.73%. That is the hurdle the plant has to clear, and it is far above the 4.94% Markus used.</p>`
    },
    {
      id: "t6", title: "How risky is the battery business itself?",
      mail: { from: "Markus Brunner, CEO, 9:02", text: "A beta of 1.5? That is just because Voltaq is drowning in debt. We would run the plant much more conservatively." },
      body: `<p>He has half a point. Take the leverage out: estimate the beta of Voltaq’s underlying business (its asset beta). Use net debt and a debt beta of 0.17 for BB-rated debt. Round to two decimals.</p>`,
      fields: [
        { key: "bu", label: "Asset beta of Voltaq", plain: "Asset beta", kind: "ratio", ans: "MS4xNw==", tol: 0.01,
          mis: [{ v: "MS4xMw==", h: "BB-rated debt is not risk-free. Include the debt beta of 0.17." }, { v: "MS4wNg==", h: "Measure leverage with net debt (task 4), not with gross debt." }, { v: "MQ==", h: "Use net debt for the weights and include the debt beta of 0.17." }, { v: "MS41", h: "That is the equity beta. Weight it with the equity share and add the weighted debt beta." }, { v: "MC41", h: "The weights are swapped. Equity is the larger part of firm value." }],
          hints: ["The asset beta is the weighted average of the equity beta and the debt beta.", "E/(E+ND) × equity beta + ND/(E+ND) × debt beta, where ND is net debt."] }
      ],
      mc: {
        q: "Why is Voltaq’s equity beta (1.5) higher than its asset beta?",
        ans: "Mg==",
        options: [
          { t: "Because the cash on Voltaq’s balance sheet is a risky asset.", h: "Cash is the one asset without risk. It lowers the average risk of the assets." },
          { t: "Because the asset beta is measured after tax and the equity beta before tax.", h: "Taxes play no role in this formula. Think about who carries the risk of the business." },
          { t: "Because of leverage: debt holders are paid first, so shareholders carry most of the business risk on a smaller equity base." },
          { t: "Because BB-rated debt has a higher beta than equity.", h: "The debt beta is 0.17, far below the equity beta. Debt is the safer claim." }]
      },
      approach: `<p><span class="f">β<sub>U</sub> = E/(E+ND)·β<sub>E</sub> + ND/(E+ND)·β<sub>D</sub></span></p>
        <p>Use the equity value and net debt from task 4.</p>`,
      successTitle: "Leverage explains only a part",
      success: `<p>Without leverage the battery business still has a beta of 1.17. Brunnen’s own asset beta is only about 0.4. Even run conservatively, the plant carries almost three times the market risk of the water business.</p>`
    },
    {
      id: "t7", title: "The board paper",
      mail: { from: "Dr. Aylin Demir, CFO, 9:10", text: "The board meets in twenty minutes. I need three numbers and one sentence." },
      body: `<p>Value the plant with the cost of capital of the battery business (Voltaq’s WACC from task 5). Then find the discount rate at which the purchase breaks even, by calculation or with the slider on the deal sheet.</p>`,
      fields: [
        { key: "v2", label: "Value of the plant at Voltaq’s WACC", plain: "Value at Voltaq’s WACC", pre: "€", unit: "million", big: true, ans: "ODAy", tol: 4,
          mis: [{ v: "MTQxNw==", h: "That is the value at Brunnen’s WACC. Use the cost of capital of the battery business." }, { v: "MTE0NQ==", h: "Discount the after-tax free cash flow from task 2." }, { v: "OC4wMg==", h: "Divide the cash flow by the rate as a decimal: 8.73% is 0.0873." }],
          hints: ["Same perpetuity formula as in task 2, with the WACC from task 5."] },
        { key: "npv2", label: "NPV of the purchase at Voltaq’s WACC", plain: "NPV at Voltaq’s WACC", pre: "€", unit: "million", big: true, ans: "LTk4", tol: 4,
          mis: [{ v: "OTg=", h: "Check the sign: the price is higher than the value." }, { v: "ODAy", h: "That is the value. For the NPV, subtract the purchase price." }, { v: "NTE3", h: "That is the NPV at Brunnen’s WACC." }],
          hints: ["NPV = value of the plant − purchase price. It can be negative."] },
        { key: "be", label: "Break-even discount rate", plain: "Break-even discount rate", unit: "%", kind: "pct", ans: "Ny43OA==", tol: 0.035,
          mis: [{ v: "MTIuODY=", h: "The ratio is upside down: cash flow per year divided by the price." }, { v: "OC43Mw==", h: "That is Voltaq’s WACC. Look for the rate at which the value equals the price of €900 million." }],
          hints: ["At break-even the value equals the price: cash flow ÷ rate = €900 million.", "Solve for the rate: free cash flow per year ÷ purchase price."] }
      ],
      mc: {
        q: "What do you recommend to the board?",
        ans: "Mw==",
        options: [
          { t: "Buy. At Brunnen’s cost of capital the purchase creates €517 million of value.", h: "Brunnen’s cost of capital reflects the risk of selling water. The plant’s cash flows carry battery risk." },
          { t: "Buy, and finance the purchase entirely with debt to bring the cost of capital down.", h: "Cheap debt does not change the risk of the plant. More debt only shifts that risk to Brunnen’s shareholders, who will require a higher return." },
          { t: "Do not buy at any price. The battery business is too risky for Brunnen.", h: "Risk is not a reason to walk away. It is priced through the discount rate, and below a certain price the NPV turns positive." },
          { t: "Do not buy at €900 million. The plant is worth about €802 million, so only a lower price creates value." }]
      },
      approach: `<p><span class="f">Value = FCF / WACC<sub>Voltaq</sub></span> and <span class="f">NPV = value − price</span></p>
        <p>Break-even: <span class="f">FCF / r = price</span>, so <span class="f">r = FCF / price</span>.</p>`,
      successTitle: "No deal at this price",
      success: `<p>The plant returns 7.78% on the purchase price, but investors require 8.73% for battery risk. Buying it for €900 million would destroy about €98 million of value. Using Brunnen’s own WACC would have hidden that completely.</p>`
    }
  ],
  finale: `
    <h1>Your board paper</h1>
    <p>You finished the case in about {min} minutes. The same plant, the same cash flows, two discount rates:</p>
    <table class="given">
      <tr><th>Discount rate</th><th class="r">Value of the plant</th><th class="r">NPV at €900 million</th></tr>
      <tr><td>Brunnen’s WACC, 4.94%</td><td class="r">€1,417 million</td><td class="r">+€517 million</td></tr>
      <tr><td class="best">Battery business (Voltaq’s WACC), 8.73%</td><td class="r best">€802 million</td><td class="r best">−€98 million</td></tr>
    </table>
    <p>While the others finish, prepare answers to these questions for the discussion:</p>
    <ol class="rules">
      <li>Markus insists: “We can borrow the whole €900 million at 3.85%. That is our cost of capital for this deal.” What do you answer?</li>
      <li>Suppose Voltaq had no excess cash. Would its WACC be higher or lower, and would that be a better estimate for the plant?</li>
      <li>Which input of the cost of capital are you least sure about? How would you estimate Voltaq’s beta in practice?</li>
    </ol>`
};
