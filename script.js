// ---------- 1. QUESTION BANK (12 questions, only 5 will be asked) ----------
const questionBank = [
  { q: "Which programming language do you use most?", options: ["Python", "Java", "JavaScript", "C / C++"] },
  { q: "How many hours do you study daily?", options: ["Less than 1", "1 - 2", "3 - 4", "More than 4"] },
  { q: "Which device do you mostly use for studying?", options: ["Laptop", "Mobile", "Tablet", "Desktop PC"] },
  { q: "What is your preferred way of learning?", options: ["Videos", "Reading books", "Practising projects", "Classroom lectures"] },
  { q: "Which domain interests you the most?", options: ["Web Development", "AI / ML", "Cyber Security", "Mobile Apps"] },
  { q: "How often do you use GitHub?", options: ["Daily", "Weekly", "Rarely", "Never"] },
  { q: "Which code editor do you prefer?", options: ["VS Code", "PyCharm", "IntelliJ IDEA", "Notepad++"] },
  { q: "How do you rate your internet connection?", options: ["Excellent", "Good", "Average", "Poor"] },
  { q: "Which learning platform do you use most?", options: ["YouTube", "Coursera", "Udemy", "College LMS"] },
  { q: "What do you want to become after graduation?", options: ["Software Developer", "Data Scientist", "Entrepreneur", "Higher Studies"] },
  { q: "How do you prefer to work on projects?", options: ["Alone", "With a partner", "Small team", "Large team"] },
  { q: "How would you rate this survey app?", options: ["Excellent", "Good", "Okay", "Needs improvement"] }
];

const QUESTIONS_PER_SURVEY = 5;

// ---------- 2. HELPERS ----------
// Fisher-Yates shuffle: gives a fair random order, then we take the first 5
function pickRandomQuestions(bank, count) {
  const copy = [...bank];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

const $ = (id) => document.getElementById(id);

// ---------- 3. STATE ----------
let selectedQuestions = [];
let currentIndex = 0;
let answers = [];
let chosenOption = null;

// ---------- 4. SCREEN CONTROL ----------
function showScreen(id) {
  ["start-screen", "question-screen", "result-screen"].forEach((s) =>
    $(s).classList.add("hidden")
  );
  $(id).classList.remove("hidden");
}

function startSurvey() {
  selectedQuestions = pickRandomQuestions(questionBank, QUESTIONS_PER_SURVEY);
  currentIndex = 0;
  answers = [];
  showScreen("question-screen");
  showQuestion();
}

function showQuestion() {
  const item = selectedQuestions[currentIndex];
  chosenOption = null;

  $("counter").textContent = `Question ${currentIndex + 1} of ${QUESTIONS_PER_SURVEY}`;
  $("progress-bar").style.width = `${(currentIndex / QUESTIONS_PER_SURVEY) * 100}%`;
  $("question-text").textContent = item.q;
  $("next-btn").disabled = true;
  $("next-btn").textContent =
    currentIndex === QUESTIONS_PER_SURVEY - 1 ? "Submit" : "Next";

  const box = $("options");
  box.innerHTML = "";
  item.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = opt;
    btn.onclick = () => {
      document.querySelectorAll(".option").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      chosenOption = opt;
      $("next-btn").disabled = false;
    };
    box.appendChild(btn);
  });
}

function nextQuestion() {
  answers.push({ question: selectedQuestions[currentIndex].q, answer: chosenOption });
  currentIndex++;
  if (currentIndex < QUESTIONS_PER_SURVEY) {
    showQuestion();
  } else {
    finishSurvey();
  }
}

function finishSurvey() {
  // Save to browser storage so responses are remembered
  const saved = JSON.parse(localStorage.getItem("surveyResponses") || "[]");
  saved.push({ time: new Date().toISOString(), answers });
  localStorage.setItem("surveyResponses", JSON.stringify(saved));

  $("progress-bar").style.width = "100%";
  const list = $("summary");
  list.innerHTML = "";
  answers.forEach((a) => {
    const li = document.createElement("li");
    li.innerHTML = `${a.question}<br><span class="answer">→ ${a.answer}</span>`;
    list.appendChild(li);
  });
  $("total-count").textContent = `Total surveys submitted on this browser: ${saved.length}`;
  showScreen("result-screen");
}

// ---------- 5. EVENTS ----------
$("start-btn").addEventListener("click", startSurvey);
$("next-btn").addEventListener("click", nextQuestion);
$("restart-btn").addEventListener("click", startSurvey);
