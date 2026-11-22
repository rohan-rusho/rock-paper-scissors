/* Rock Paper Scissors — first to 5 wins the match. */
"use strict";

/* ---------- Pure game logic (testable in node) ---------- */
const CHOICES = ["rock", "paper", "scissors"];
const BEATS = { rock: "scissors", paper: "rock", scissors: "paper" };
const EMOJI = { rock: "✊", paper: "✋", scissors: "✌️", unknown: "❔" };
const WIN_SCORE = 5;

function decideWinner(player, computer) {
  if (player === computer) return "draw";
  return BEATS[player] === computer ? "win" : "lose";
}

function randomChoice() {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/* DOM BOOTSTRAP */
if (typeof document !== "undefined") {
  const $ = (id) => document.getElementById(id);
  const playerScoreEl = $("player-score");
  const computerScoreEl = $("computer-score");
  const playerPickEl = $("player-pick");
  const computerPickEl = $("computer-pick");
  const resultLine = $("result-line");
  const resultSub = $("result-sub");
  const playerPips = $("player-pips");
  const computerPips = $("computer-pips");
  const matchBanner = $("match-banner");
  const matchTitle = $("match-title");
  const matchText = $("match-text");
  const historyList = $("history-list");
  const historyEmpty = $("history-empty");
  const choiceBtns = Array.from(document.querySelectorAll(".choice-btn"));

  let playerScore = 0;
  let computerScore = 0;
  let round = 0;
  let matchOver = false;
  const history = [];

  function renderPips(container, wins) {
    container.innerHTML = "";
    for (let i = 0; i < WIN_SCORE; i++) {
      const pip = document.createElement("span");
      pip.className = "pip" + (i < wins ? (container === playerPips ? " you" : " cpu") : "");
      pip.setAttribute("aria-hidden", "true");
      container.appendChild(pip);
    }
  }

  function renderScores() {
    playerScoreEl.textContent = playerScore;
    computerScoreEl.textContent = computerScore;
    playerScoreEl.classList.toggle("green", playerScore > computerScore);
    playerScoreEl.classList.toggle("red", playerScore < computerScore);
    computerScoreEl.classList.toggle("green", computerScore > playerScore);
    computerScoreEl.classList.toggle("red", computerScore < playerScore);
    renderPips(playerPips, playerScore);
    renderPips(computerPips, computerScore);
  }

  function setChoicesEnabled(enabled) {
    choiceBtns.forEach((b) => { b.disabled = !enabled; });
  }

  function addHistory(player, computer, outcome) {
    round += 1;
    history.unshift({ round, player, computer, outcome });
    if (history.length > 10) history.pop();
    historyEmpty.classList.add("hidden");
    historyList.innerHTML = "";
    history.forEach((h) => {
      const li = document.createElement("li");
      li.className = "history-item";
      const label = h.outcome === "win" ? "You win" : h.outcome === "lose" ? "You lose" : "Draw";
      li.innerHTML = "<span>Round " + h.round + ": " + EMOJI[h.player] + " " + capitalize(h.player) +
        " vs " + EMOJI[h.computer] + " " + capitalize(h.computer) + "</span>" +
        "<span class=\"outcome-" + h.outcome + "\">" + label + "</span>";
      historyList.appendChild(li);
    });
  }

  function play(player) {
    if (matchOver) return;
    const computer = randomChoice();
    const outcome = decideWinner(player, computer);
    playerPickEl.textContent = EMOJI[player];
    computerPickEl.textContent = EMOJI[computer];

    if (outcome === "win") {
      playerScore += 1;
      resultLine.textContent = capitalize(player) + " beats " + computer + " — you win the round! 🎉";
      resultSub.textContent = "Nice throw. " + (WIN_SCORE - playerScore) + " more to take the match.";
    } else if (outcome === "lose") {
      computerScore += 1;
      resultLine.textContent = capitalize(computer) + " beats " + player + " — computer takes the round.";
      resultSub.textContent = "Shake it off. " + (WIN_SCORE - computerScore) + " more for the computer to win.";
    } else {
      resultLine.textContent = "Draw — both threw " + player + ". 🤝";
      resultSub.textContent = "No points. Throw again.";
    }
    addHistory(player, computer, outcome);
    renderScores();

    if (playerScore >= WIN_SCORE || computerScore >= WIN_SCORE) {
      matchOver = true;
      const youWon = playerScore >= WIN_SCORE;
      matchTitle.textContent = youWon ? "🏆 You win the match!" : "🤖 Computer wins the match!";
      matchText.textContent = "Final score " + playerScore + " – " + computerScore +
        (youWon ? " — first to 5, and you got there first." : " — first to 5. Run it back?");
      matchBanner.classList.remove("hidden");
      setChoicesEnabled(false);
      showToast(youWon ? "🏆 Match won!" : "Computer takes the match");
      $("play-again-btn").focus();
    }
  }

  function resetMatch() {
    playerScore = 0;
    computerScore = 0;
    round = 0;
    matchOver = false;
    history.length = 0;
    historyList.innerHTML = "";
    historyEmpty.classList.remove("hidden");
    playerPickEl.textContent = EMOJI.unknown;
    computerPickEl.textContent = EMOJI.unknown;
    resultLine.textContent = "Make your first throw 👇";
    resultSub.textContent = "Rock, paper or scissors — your call.";
    matchBanner.classList.add("hidden");
    renderScores();
    setChoicesEnabled(true);
  }

  choiceBtns.forEach((btn) => {
    btn.addEventListener("click", () => play(btn.dataset.choice));
  });
  document.addEventListener("keydown", (e) => {
    if (matchOver) return;
    if (e.key === "1") play("rock");
    else if (e.key === "2") play("paper");
    else if (e.key === "3") play("scissors");
  });
  $("play-again-btn").addEventListener("click", resetMatch);
  $("reset-btn").addEventListener("click", () => { resetMatch(); showToast("Match reset"); });

  renderScores();
  initChrome();
}

/* ---------- Shared chrome: header, nav, reveal, toast, year ---------- */
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2600);
}

function initChrome() {
  const header = document.getElementById("site-header");
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("mobile-menu");
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 8);
  }, { passive: true });
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => menu.classList.remove("open")));
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}
