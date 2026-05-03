    var Q1_ACCEPTED = [
      "tim berners-lee",
      "tim berners lee",
      "berners-lee",
      "berners lee"
    ];

    var Q5_CORRECT = ["a", "c", "d"];

    var TOTAL_POSSIBLE = 5;
    var PASS_THRESHOLD = 0.50;

    /* Correct answers */
    var CORRECT_TEXT = {
      q1: "Tim Berners-Lee",
      q2: "Mosaic",
      q3: "Rendering",
      q4: "2008",
      q5: "Warns users about dangerous websites; Helps block malicious pop-ups and downloads; Uses secure connections for safer browsing"
    };

    /* Question labels for result cards */
    var Q_LABELS = {
      q1: "Question 1 — Fill in the Blank",
      q2: "Question 2 — Multiple Choice",
      q3: "Question 3 — Multiple Choice",
      q4: "Question 4 — Multiple Choice",
      q5: "Question 5 — Select All That Apply"
    };

    function gradeQuiz() {
      var score = 0;
      var html = "";

      /* Q1: fill in the blank */
      var q1Input = document.getElementById("q1").value.trim();
      var q1Correct = Q1_ACCEPTED.indexOf(q1Input.toLowerCase()) !== -1;
      var q1Pts = q1Correct ? 1 : 0;
      score += q1Pts;
      html += buildCard("q1", q1Correct ? "correct" : "incorrect", q1Pts, 1,
        q1Input.length > 0 ? "You entered: " + q1Input : "You left this blank.");

      /* Q2: single choice */
      var q2Val = getRadio("q2");
      var q2Correct = q2Val === "b";
      var q2Pts = q2Correct ? 1 : 0;
      score += q2Pts;
      html += buildCard("q2", q2Correct ? "correct" : "incorrect", q2Pts, 1,
        q2Val ? "You selected: " + getLabelText("q2", q2Val) : "You did not select an answer.");

      /* Q3: single choice */
      var q3Val = getRadio("q3");
      var q3Correct = q3Val === "b";
      var q3Pts = q3Correct ? 1 : 0;
      score += q3Pts;
      html += buildCard("q3", q3Correct ? "correct" : "incorrect", q3Pts, 1,
        q3Val ? "You selected: " + getLabelText("q3", q3Val) : "You did not select an answer.");

      /* Q4: single choice */
      var q4Val = getRadio("q4");
      var q4Correct = q4Val === "c";
      var q4Pts = q4Correct ? 1 : 0;
      score += q4Pts;
      html += buildCard("q4", q4Correct ? "correct" : "incorrect", q4Pts, 1,
        q4Val ? "You selected: " + getLabelText("q4", q4Val) : "You did not select an answer.");

      /* Q5: multi-select
        3 correct answers */
      var q5Checked = getCheckboxes("q5");
      var q5HasWrong = false;
      for (var i = 0; i < q5Checked.length; i++) {
        if (Q5_CORRECT.indexOf(q5Checked[i]) === -1) { q5HasWrong = true; break; }
      }
      var q5CorrectCount = 0;
      for (var j = 0; j < q5Checked.length; j++) {
        if (Q5_CORRECT.indexOf(q5Checked[j]) !== -1) q5CorrectCount++;
      }
      var q5Pts = 0;
      var q5Status = "incorrect";
      if (!q5HasWrong && q5CorrectCount === 3) {
        q5Pts = 1; q5Status = "correct";
      } else if (!q5HasWrong && q5CorrectCount > 0) {
        q5Pts = 1; q5Status = "partial";
      }
      score += q5Pts;
      var q5Entered = q5Checked.length > 0
        ? "You selected: " + q5Checked.map(function(v) { return getLabelText("q5", v); }).join("; ")
        : "You did not select any options.";
      html += buildCard("q5", q5Status, q5Pts, 1, q5Entered);

      /* Display overall score and if user has passed or failed the quiz */
      var pct = Math.round((score / TOTAL_POSSIBLE) * 100);
      document.getElementById("score-display").textContent =
        "Total Score: " + score + " / " + TOTAL_POSSIBLE + " (" + pct + "%)";

      var pfEl = document.getElementById("pass-fail-display");
      if (score / TOTAL_POSSIBLE >= PASS_THRESHOLD) {
        pfEl.textContent = "Result: PASS";
        pfEl.className = "result-pass";
      } else {
        pfEl.textContent = "Result: FAIL";
        pfEl.className = "result-fail";
      }

      /* Result block that gets added once quiz is finished with results */
      document.getElementById("question-results").innerHTML = html;
      var resultsDiv = document.getElementById("quiz-results");
      resultsDiv.style.display = "block";
      resultsDiv.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    /* Builds one result card using the same .card class as the rest of the site */
    function buildCard(qKey, status, earned, max, userAnswer) {
      var cls, label;
      if (status === "correct")       { cls = "answer-correct";   label = "Correct"; }
      else if (status === "partial")  { cls = "answer-partial";   label = "Partially Correct"; }
      else                            { cls = "answer-incorrect"; label = "Incorrect"; }

      return '<section class="card">' +
        '<strong>' + Q_LABELS[qKey] + '</strong>' +
        '<p class="' + cls + '">' + label + '</p>' +
        '<p class="result-note">' + userAnswer + '</p>' +
        '<p class="result-note">Correct answer: <strong>' + CORRECT_TEXT[qKey] + '</strong></p>' +
        '<p class="result-points">Points earned: ' + earned + ' / ' + max + '</p>' +
        '</section>';
    }

    /*Returns the value of the checked radio for a given name */
    function getRadio(name) {
      var el = document.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : null;
    }

    /* Returns all selected boxes to check check if they're correct */
    function getCheckboxes(name) {
      var els = document.querySelectorAll('input[name="' + name + '"]:checked');
      var vals = [];
      for (var i = 0; i < els.length; i++) vals.push(els[i].value);
      return vals;
    }

    /* Returns the visible answer choice for each question by its value */
    function getLabelText(name, value) {
      var el = document.querySelector('input[name="' + name + '"][value="' + value + '"]');
      return (el && el.parentElement) ? el.parentElement.textContent.trim() : value;
    }

    /* Clears all answers for quiz restart */
    function resetQuiz() {
      document.getElementById("q1").value = "";

      var radios = document.querySelectorAll('input[type="radio"]');
      for (var i = 0; i < radios.length; i++) radios[i].checked = false;

      var boxes = document.querySelectorAll('input[type="checkbox"]');
      for (var j = 0; j < boxes.length; j++) boxes[j].checked = false;

      var resultsDiv = document.getElementById("quiz-results");
      resultsDiv.style.display = "none";
      document.getElementById("question-results").innerHTML = "";
      document.getElementById("score-display").textContent = "";
      var pfEl = document.getElementById("pass-fail-display");
      pfEl.textContent = "";
      pfEl.className = "";

      document.getElementById("quiz-form").scrollIntoView({ behavior: "smooth", block: "start" });
    }
