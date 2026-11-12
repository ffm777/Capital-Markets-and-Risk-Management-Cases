/* Chapter 3 case: "A million for Elena". Numbers are base64-encoded so they are not readable at a glance. */
window.CASE = {
  id: "ch3",
  title: "A million for Elena",
  short: "A million for Elena",
  intro: `
    <h1>A million for Elena</h1>
    <p class="lede">You are two junior analysts at Mainkai Partners, a wealth manager in Frankfurt. Dr. Elena Hartmann has just sold her dental-technology firm and wants to invest €1,000,000. She has strong opinions and two favourite stocks. Your job: turn her ideas into a portfolio you can defend.</p>
    <table class="given">
      <tr><th>Stock</th><th>What it does</th><th class="r">Expected return</th><th class="r">Volatility</th></tr>
      <tr><td>Voltaq</td><td>Battery technology</td><td class="r">15%</td><td class="r">40%</td></tr>
      <tr><td>Brunnen</td><td>Mineral water and soft drinks</td><td class="r">7%</td><td class="r">20%</td></tr>
    </table>
    <p>The returns of the two stocks are uncorrelated (correlation = 0).</p>
    <ul class="rules">
      <li>Seven tasks, about 30 minutes. Work as a team of two on one device.</li>
      <li>You need a calculator and your chapter 3 slides.</li>
      <li>Enter percentages as numbers (12.5 for 12.5%) and round to two decimals.</li>
      <li>Wrong answers cost nothing. You get a hint and try again.</li>
    </ul>`,
  tasks: [
    {
      id: "t1", title: "The fifty-fifty reflex",
      mail: { from: "Elena, 9:02", text: "Let’s keep it simple. Half in Voltaq, half in Brunnen. What do I get?" },
      body: `<p>Calculate the expected return and the volatility of a portfolio with 50% Voltaq and 50% Brunnen.</p>`,
      predict: {
        q: "Before you calculate, take a guess: the volatility of the 50/50 portfolio is…",
        options: [{ t: "exactly 30%, halfway between 40% and 20%" }, { t: "below 30%" }, { t: "above 30%" }],
        reveal: "The answer to the opening guess: below 30%. Your result of 22.36% is well below the 30% average of the two volatilities. With a correlation below +1 the stocks do not always move together, so part of the risk cancels out."
      },
      fields: [
        { key: "e50", label: "Expected return of the 50/50 portfolio", plain: "Expected return", unit: "%", kind: "pct", ans: "MTE=", tol: 0.05,
          mis: [{ v: "MjI=", h: "You added the two expected returns. Weight each one with its share of the portfolio." }],
          hints: ["The expected return of a portfolio is the weighted average of the individual expected returns."] },
        { key: "sd50", label: "Volatility of the 50/50 portfolio", plain: "Volatility", unit: "%", kind: "pct", ans: "MjIuMzY=", tol: 0.06,
          mis: [
            { v: "MzA=", h: "30% is the weighted average of the two volatilities. That only holds for a correlation of +1. Use the formula for the portfolio variance." },
            { v: "NQ==", h: "5% looks like the portfolio variance. Volatility is the square root of the variance." },
            { v: "MzEuNjI=", h: "In the variance formula the weights are squared, not just the volatilities." },
            { v: "NDQuNzI=", h: "The weights are missing: each variance is multiplied by its squared weight." },
            { v: "MTU=", h: "Square the volatilities as well as the weights, then take the square root of the sum." }],
          hints: ["Use the two-security variance formula from the slides. With a correlation of 0 the covariance term disappears.",
            "Variance = x₁²·σ₁² + x₂²·σ₂² with decimals (0.40 and 0.20). Then take the square root."] }
      ],
      approach: `<p><span class="f">E(R<sub>P</sub>) = x<sub>V</sub>·E(R<sub>V</sub>) + x<sub>B</sub>·E(R<sub>B</sub>)</span></p>
        <p><span class="f">Var(R<sub>P</sub>) = x<sub>V</sub>²·σ<sub>V</sub>² + x<sub>B</sub>²·σ<sub>B</sub>² + 2·x<sub>V</sub>·x<sub>B</sub>·ρ·σ<sub>V</sub>·σ<sub>B</sub></span>, and the last term is zero here. Volatility is the square root of the variance.</p>`,
      successTitle: "Diversification at work",
      success: `<p>The portfolio earns the average return of the two stocks (11%) but carries far less than their average volatility (22.36% instead of 30%). The new point on the map lies to the left of the straight line between Voltaq and Brunnen.</p>`
    },
    {
      id: "t2", title: "Is Brunnen the safe choice?",
      mail: { from: "Elena, 9:10", text: "Hm, 22% is still a lot. Brunnen alone has only 20%. So if I want as little risk as possible, I simply buy Brunnen and nothing else, right?" },
      body: `<p>Check her claim. Find the minimum variance portfolio of Voltaq and Brunnen: the mix with the lowest possible volatility.</p>
        <p>As in exercises 3.2 and 3.3: write the portfolio variance as a function of the Voltaq weight <span class="f">x</span>, set the first derivative to zero and solve for <span class="f">x</span>.</p>`,
      fields: [
        { key: "wmvp", label: "Weight of Voltaq in the minimum variance portfolio", plain: "Weight of Voltaq", unit: "%", kind: "pct", ans: "MjA=", tol: 0.1,
          mis: [
            { v: "ODA=", h: "It looks like the weights are swapped. The less volatile stock gets the larger share." },
            { v: "MzMuMzM=", h: "Use the variances (σ²) in the formula, not the volatilities." },
            { v: "NjYuNjc=", h: "Two things to check: use variances instead of volatilities, and make sure the less volatile stock gets the larger share." },
            { v: "NTA=", h: "Task 1 showed that 50/50 has 22.36% volatility, which is more than Brunnen alone. The minimum lies elsewhere." },
            { v: "MA==", h: "That is Elena’s claim. Test it: what happens to the variance if you add a little uncorrelated Voltaq?" }],
          hints: ["Var(x) = x²·σ<sub>V</sub>² + (1−x)²·σ<sub>B</sub>². Differentiate with respect to x and set the result to zero.",
            "Solving the first-order condition gives x = σ<sub>B</sub>² / (σ<sub>V</sub>² + σ<sub>B</sub>²)."] },
        { key: "emvp", label: "Expected return of this portfolio", plain: "Expected return", unit: "%", kind: "pct", ans: "OC42", tol: 0.05,
          mis: [{ v: "MTMuNA==", h: "You used the weights the wrong way round." }, { v: "MTE=", h: "That is the 50/50 portfolio. Use the minimum variance weights." }],
          hints: ["Weighted average of the two expected returns, using the minimum variance weights."] },
        { key: "sdmvp", label: "Volatility of this portfolio", plain: "Volatility", unit: "%", kind: "pct", ans: "MTcuODk=", tol: 0.06,
          mis: [
            { v: "My4y", h: "3.2% is the variance. Take the square root." },
            { v: "MjQ=", h: "That is the weighted average of the volatilities. Use the variance formula." },
            { v: "MzIuMjU=", h: "You used the weights the wrong way round." }],
          hints: ["Same formula as in task 1, now with the minimum variance weights.", "Variance = (weight of Voltaq)²·0.40² + (weight of Brunnen)²·0.20², then take the square root."] }
      ],
      approach: `<p><span class="f">Var(x) = x²·σ<sub>V</sub>² + (1−x)²·σ<sub>B</sub>²</span> (correlation is zero)</p>
        <p>First derivative: <span class="f">2x·σ<sub>V</sub>² − 2(1−x)·σ<sub>B</sub>² = 0</span>, so <span class="f">x = σ<sub>B</sub>² / (σ<sub>V</sub>² + σ<sub>B</sub>²)</span>.</p>
        <p>Then use this weight in the formulas from task 1.</p>`,
      successTitle: "Elena is wrong",
      success: `<p>Adding 20% of the much riskier Voltaq makes the portfolio <em>less</em> risky than Brunnen alone (17.89% instead of 20%), and it earns more. The map now shows the minimum variance portfolio (MVP) and the efficient frontier above it.</p>`
    },
    {
      id: "t3", title: "Same risk, more return",
      mail: { from: "Elena, 9:17", text: "Fine. But I know Brunnen, I drink their water every day. I can live with its 20% volatility. Why should I change anything?" },
      body: `<p>Use the slider under the risk-return map. Find the portfolio that has the same volatility as Brunnen alone (20%) but a higher expected return. We call it portfolio P.</p>`,
      fields: [
        { key: "wp", label: "Weight of Voltaq in portfolio P", plain: "Weight of Voltaq in P", unit: "%", kind: "pct", ans: "NDA=", tol: 0.5,
          mis: [{ v: "MA==", h: "That is Brunnen itself. Move further up the curve until the volatility is back at 20%." },
            { v: "NjA=", h: "Check which stock the slider value refers to: it shows the Voltaq weight." }],
          hints: ["Move the slider and watch the volatility. It falls first, then rises again and reaches 20.00% a second time."] },
        { key: "ep", label: "Expected return of portfolio P", plain: "Expected return of P", unit: "%", kind: "pct", ans: "MTAuMg==", tol: 0.05,
          mis: [{ v: "Nw==", h: "That is Brunnen’s own return. Read the value for the second portfolio with 20% volatility." }],
          hints: ["Read the expected return next to the slider once the volatility shows 20.00%."] }
      ],
      mc: {
        q: "What does this tell you about a portfolio of 100% Brunnen?",
        ans: "MQ==",
        options: [
          { t: "It is efficient, because Brunnen is the stock with the lowest volatility.", h: "Low volatility of a single stock does not make it efficient. Compare Brunnen with portfolio P." },
          { t: "It is inefficient: another portfolio offers a higher expected return at the same volatility." },
          { t: "It is inefficient, because its expected return is below the average of the two stocks.", h: "Efficiency is not about the average. It compares portfolios with the same volatility, or with the same expected return." },
          { t: "It is the minimum variance portfolio.", h: "You calculated the minimum variance portfolio in task 2. It contains 20% Voltaq." }]
      },
      approach: `<p>Brunnen alone sits on the lower, dashed part of the curve. Go straight up from Brunnen on the map until you hit the efficient frontier. The slider shows the weights of that portfolio.</p>
        <p>A portfolio is efficient if no other portfolio has a higher expected return at the same volatility.</p>`,
      successTitle: "3.2 percentage points for free",
      success: `<p>Portfolio P (40% Voltaq, 60% Brunnen) has exactly Brunnen’s volatility but earns 10.2% instead of 7%. On €1,000,000 that is €32,000 more expected return per year, without any extra risk.</p>`
    },
    {
      id: "t4", title: "Enter the Bund",
      mail: { from: "Jonas (your colleague), 9:24", text: "She can also buy German government bonds at 3%, risk-free. I’d mix the Bund with the minimum variance portfolio. Lowest risk, can’t go wrong." },
      body: `<p>You suspect that portfolio P is the better partner for the Bund. Compare the two candidates by their Sharpe ratio, the slope of the line from the risk-free asset through the portfolio:</p>
        <p><span class="f">Sharpe ratio = (E(R<sub>P</sub>) − r<sub>f</sub>) / SD(R<sub>P</sub>)</span></p>
        <p>Round to three decimals.</p>`,
      fields: [
        { key: "srmvp", label: "Sharpe ratio of the minimum variance portfolio", plain: "Sharpe ratio of the MVP", kind: "ratio", ans: "MC4zMTM=", tol: 0.003,
          mis: [{ v: "MC40ODE=", h: "Subtract the risk-free rate from the expected return first." }, { v: "MC4zNg==", h: "That is the value for portfolio P." }],
          hints: ["Use the expected return and volatility of the minimum variance portfolio from task 2.", "(8.6% − risk-free rate) divided by 17.89%."] },
        { key: "srp", label: "Sharpe ratio of portfolio P", plain: "Sharpe ratio of P", kind: "ratio", ans: "MC4zNg==", tol: 0.003,
          mis: [{ v: "MC41MQ==", h: "Subtract the risk-free rate from the expected return first." }, { v: "MC4zMTM=", h: "That is the value for the minimum variance portfolio." }],
          hints: ["Use the expected return and volatility of portfolio P from task 3.", "(10.2% − risk-free rate) divided by 20%."] }
      ],
      mc: {
        q: "Which portfolio should Elena combine with the Bund?",
        ans: "MA==",
        options: [
          { t: "Portfolio P. Its line is steeper, so every mix with the Bund earns more per unit of risk." },
          { t: "The minimum variance portfolio, because it has the lowest volatility.", h: "Elena can reduce volatility with the Bund anyway. What matters is the return per unit of risk." },
          { t: "It makes no difference. With the Bund any risk level can be reached either way.", h: "Any risk level can be reached, but not at the same expected return. Compare the two slopes." }]
      },
      approach: `<p>For each candidate: subtract the risk-free rate of 3% from the expected return and divide by the volatility.</p>
        <p>The higher Sharpe ratio means a steeper line in the risk-return map. Every point on the steeper line beats the point with the same volatility on the flatter line.</p>`,
      successTitle: "Steeper is better",
      success: `<p>The map now shows both lines from the Bund. The steepest possible line touches the efficient frontier at the tangent portfolio, which holds about 43% Voltaq. P is so close to it that we continue with P.</p>`
    },
    {
      id: "t5", title: "Dial in Elena’s risk",
      mail: { from: "Elena, 9:31", text: "I’ll be honest with you. If my portfolio swings by more than 10% a year, I can’t sleep. Make it 10% and tell me what I earn." },
      body: `<p>Build portfolio K from the Bund (3%, risk-free) and portfolio P (expected return 10.2%, volatility 20%) so that K has a volatility of exactly 10%.</p>`,
      fields: [
        { key: "xk", label: "Share of the €1,000,000 invested in portfolio P", plain: "Share invested in P", unit: "%", kind: "pct", ans: "NTA=", tol: 0.1,
          mis: [{ v: "MjAw", h: "You divided the wrong way round: target volatility divided by the volatility of P." }],
          hints: ["The Bund has no volatility, so the volatility of K is simply the share in P times the volatility of P."] },
        { key: "ek", label: "Expected return of portfolio K", plain: "Expected return of K", unit: "%", kind: "pct", ans: "Ni42", tol: 0.05,
          mis: [{ v: "NS4x", h: "The money outside P is not idle. It earns the risk-free rate." }, { v: "MTAuMg==", h: "That is P itself. K holds only part of the money in P." }],
          hints: ["Weighted average of the risk-free rate and the expected return of P."] },
        { key: "eurv", label: "Euros that end up in Voltaq", plain: "Euros in Voltaq", pre: "€", big: true, ans: "MjAwMDAw", tol: 500,
          mis: [
            { v: "NDAwMDAw", h: "Voltaq is 40% of portfolio P, but only part of the €1,000,000 goes into P." },
            { v: "NTAwMDAw", h: "That is the total amount in portfolio P. Voltaq is only one part of P." },
            { v: "MzAwMDAw", h: "That is the amount in Brunnen." },
            { v: "MjAw", h: "Enter the amount in euros, not in thousands." }],
          hints: ["First the amount invested in P, then Voltaq’s weight inside P."] }
      ],
      approach: `<p><span class="f">SD(R<sub>K</sub>) = x·SD(R<sub>P</sub>)</span>, so <span class="f">x = 10% / SD(R<sub>P</sub>)</span>.</p>
        <p><span class="f">E(R<sub>K</sub>) = r<sub>f</sub> + x·(E(R<sub>P</sub>) − r<sub>f</sub>)</span></p>
        <p>Voltaq in euros: €1,000,000 × x × weight of Voltaq in P.</p>`,
      successTitle: "A portfolio Elena can sleep with",
      success: `<p>K holds €500,000 in the Bund, €200,000 in Voltaq and €300,000 in Brunnen. It earns 6.6% at 10% volatility.</p>
        <p>Her original idea, only Brunnen, would need 50% Bund to reach the same 10% volatility and would earn just 5.0%. Thinking in portfolios is worth €16,000 of expected return per year.</p>`
    },
    {
      id: "t6", title: "What does the market say?",
      mail: { from: "Research desk, 9:38", text: "For your file: the market portfolio has an expected return of 11% and a volatility of 16%. Correlation with the market is 0.6 for Voltaq and 0.4 for Brunnen." },
      body: `<p>Your head of desk wants to know whether the 15% and 7% you have been using are consistent with the CAPM. Calculate each stock’s beta and its expected return according to the CAPM (risk-free rate 3%). Round betas to two decimals.</p>`,
      fields: [
        { key: "bv", label: "Beta of Voltaq", plain: "Beta of Voltaq", kind: "ratio", ans: "MS41", tol: 0.01,
          mis: [{ v: "Mi41", h: "The correlation with the market is missing." }, { v: "MC4yNA==", h: "The ratio is upside down: the stock’s volatility goes on top, the market’s volatility below." }, { v: "MC42", h: "That is the correlation. Beta also scales with the ratio of the two volatilities." }],
          hints: ["Beta = volatility of the stock × correlation with the market ÷ volatility of the market."] },
        { key: "bb", label: "Beta of Brunnen", plain: "Beta of Brunnen", kind: "ratio", ans: "MC41", tol: 0.01,
          mis: [{ v: "MS4yNQ==", h: "The correlation with the market is missing." }, { v: "MC4zMg==", h: "The ratio is upside down: the stock’s volatility goes on top, the market’s volatility below." }, { v: "MC40", h: "That is the correlation. Beta also scales with the ratio of the two volatilities." }],
          hints: ["Beta = volatility of the stock × correlation with the market ÷ volatility of the market."] },
        { key: "cv", label: "CAPM expected return of Voltaq", plain: "CAPM return of Voltaq", unit: "%", kind: "pct", ans: "MTU=", tol: 0.05,
          mis: [{ v: "MTkuNQ==", h: "Multiply beta by the market risk premium (market return minus risk-free rate), not by the market return." }, { v: "MTI=", h: "Add the risk-free rate to the risk premium." }, { v: "MTYuNQ==", h: "Beta is multiplied by the market risk premium, and the risk-free rate is added." }],
          hints: ["Security market line: risk-free rate + beta × (expected market return − risk-free rate)."] },
        { key: "cb", label: "CAPM expected return of Brunnen", plain: "CAPM return of Brunnen", unit: "%", kind: "pct", ans: "Nw==", tol: 0.05,
          mis: [{ v: "OC41", h: "Multiply beta by the market risk premium (market return minus risk-free rate), not by the market return." }, { v: "NA==", h: "Add the risk-free rate to the risk premium." }, { v: "NS41", h: "Beta is multiplied by the market risk premium, and the risk-free rate is added." }],
          hints: ["Security market line: risk-free rate + beta × (expected market return − risk-free rate)."] }
      ],
      approach: `<p><span class="f">β<sub>i</sub> = SD(R<sub>i</sub>)·Corr(R<sub>i</sub>, R<sub>Mkt</sub>) / SD(R<sub>Mkt</sub>)</span></p>
        <p><span class="f">E(R<sub>i</sub>) = r<sub>f</sub> + β<sub>i</sub>·(E(R<sub>Mkt</sub>) − r<sub>f</sub>)</span>. The market risk premium here is 11% − 3%.</p>`,
      successTitle: "Both stocks sit on the security market line",
      success: `<p>The CAPM gives exactly 15% and 7%. Note what drives the difference: Voltaq does not earn more because its volatility is 40%, but because its beta is 1.5. Only the part of its risk that moves with the market is rewarded.</p>`
    },
    {
      id: "t7", title: "The ETF question",
      mail: { from: "Elena, 9:46", text: "My tennis partner says stock picking is nonsense and I should just buy an ETF on the whole market. Is my portfolio K any better than that?" },
      body: `<p>Portfolio K is 20% Voltaq, 30% Brunnen and 50% Bund. Compare it with portfolio L, a mix of the Bund and the market portfolio (expected return 11%, volatility 16%) that also has a volatility of exactly 10%.</p>`,
      fields: [
        { key: "bk", label: "Beta of portfolio K", plain: "Beta of K", kind: "ratio", ans: "MC40NQ==", tol: 0.005,
          mis: [{ v: "MC45", h: "That is the beta of portfolio P. Only half of the money is in P, and the Bund has a beta of zero." }, { v: "MQ==", h: "Use the weights of the whole portfolio K: 20%, 30% and 50%. The Bund has a beta of zero." }, { v: "Mg==", h: "Weight each beta with its share of the portfolio instead of adding them up." }],
          hints: ["The beta of a portfolio is the weighted average of the betas of its securities. The Bund has a beta of zero."] },
        { key: "ck", label: "CAPM expected return of portfolio K", plain: "CAPM return of K", unit: "%", kind: "pct", ans: "Ni42", tol: 0.05,
          mis: [{ v: "Ny45NQ==", h: "Multiply beta by the market risk premium (market return minus risk-free rate), not by the market return." }, { v: "NC45NQ==", h: "Multiply beta by the market risk premium (market return minus risk-free rate), not by the market return, and add the risk-free rate." }, { v: "My42", h: "Add the risk-free rate to the risk premium." }],
          hints: ["Security market line with the portfolio beta. Compare the result with task 5."] },
        { key: "xl", label: "Share of the market portfolio in L", plain: "Share of the market portfolio in L", unit: "%", kind: "pct", ans: "NjIuNQ==", tol: 0.1,
          mis: [{ v: "MTYw", h: "You divided the wrong way round: target volatility divided by the market’s volatility." }, { v: "NTA=", h: "50% was right for portfolio P with its 20% volatility. The market portfolio has 16%." }],
          hints: ["Same logic as in task 5: share × volatility of the market portfolio = 10%."] },
        { key: "el", label: "Expected return of portfolio L", plain: "Expected return of L", unit: "%", kind: "pct", ans: "OA==", tol: 0.05,
          mis: [{ v: "Ni44OA==", h: "The money outside the market portfolio earns the risk-free rate." }, { v: "MTE=", h: "That is the market portfolio itself. L holds only part of the money in it." }],
          hints: ["Weighted average of the risk-free rate and the expected market return."] }
      ],
      mc: {
        q: "K and L have the same volatility. Why does L earn more?",
        ans: "Mg==",
        options: [
          { t: "Because ETFs charge lower fees than single stocks.", h: "Fees are not part of the calculation. Look at the kind of risk each portfolio carries." },
          { t: "Because the CAPM underestimates the returns of Voltaq and Brunnen.", h: "In task 6 both stocks earned exactly their CAPM return. The reason lies in the risk, not in the returns." },
          { t: "Part of K’s volatility is diversifiable risk, which earns no premium. L’s volatility is pure market risk." },
          { t: "Because L takes more total risk than K.", h: "Both portfolios have a volatility of 10%, so total risk is the same. What differs is how much of it is market risk." }]
      },
      approach: `<p><span class="f">β<sub>K</sub> = 0.2·β<sub>V</sub> + 0.3·β<sub>B</sub> + 0.5·0</span>, then the security market line gives the expected return of K.</p>
        <p>For L: <span class="f">x = 10% / SD(R<sub>Mkt</sub>)</span> and <span class="f">E(R<sub>L</sub>) = r<sub>f</sub> + x·(E(R<sub>Mkt</sub>) − r<sub>f</sub>)</span>.</p>`,
      successTitle: "The tennis partner has a point",
      success: `<p>K’s beta of 0.45 explains its 6.6% return exactly. But a beta of 0.45 would only need 7.2% volatility if it came from the market portfolio. The rest of K’s 10% is firm-specific risk that nobody pays Elena for. L uses the full 10% for market risk and earns 8%. It lies on the capital market line.</p>`
    }
  ],
  finale: `
    <h1>Your recommendation</h1>
    <p>You finished the case in about {min} minutes. Three ways to give Elena a portfolio with 10% volatility:</p>
    <table class="given">
      <tr><th>Portfolio</th><th class="r">Expected return</th><th class="r">On €1,000,000 per year</th></tr>
      <tr><td>Elena’s first idea: Brunnen and Bund</td><td class="r">5.0%</td><td class="r">€50,000</td></tr>
      <tr><td>K: Voltaq, Brunnen and Bund</td><td class="r">6.6%</td><td class="r">€66,000</td></tr>
      <tr><td class="best">L: market portfolio and Bund</td><td class="r best">8.0%</td><td class="r best">€80,000</td></tr>
    </table>
    <p>While the others finish, prepare answers to these questions for the discussion:</p>
    <ol class="rules">
      <li>Elena asks: “If the market portfolio is the best choice for everyone, why does anybody still pick stocks?” Which CAPM assumption is behind your answer?</li>
      <li>How would the map look if Voltaq and Brunnen had a correlation of +1? What would have happened in task 2?</li>
      <li>Voltaq has two and a half times the market’s volatility, but its beta is only 1.5. Where does the rest of its risk go?</li>
    </ol>`
};
