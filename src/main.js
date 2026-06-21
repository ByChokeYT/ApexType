import './style.css';
import { snippets } from './data/snippets.js';
import { texts } from './data/texts.js';

const wordsWrapper = document.getElementById('words-wrapper');
const inputField = document.getElementById('input-field');
const caret = document.getElementById('caret');
const wpmDisplay = document.getElementById('wpm');
const accDisplay = document.getElementById('acc');
const langBadge = document.getElementById('language-badge');

const resultsScreen = document.getElementById('results-screen');
const gameUI = document.getElementById('game-ui');
const finalWpm = document.getElementById('final-wpm');
const finalAcc = document.getElementById('final-acc');
const finalErrors = document.getElementById('final-errors');
const restartBtn = document.getElementById('restart-btn');

// Progress State
let userStats = JSON.parse(localStorage.getItem('apexTypeStats')) || { xp: 0, level: 1 };
let currentSnippet = '';
let currentCharIndex = 0;
let errors = 0;
let startTime = null;
let isGameActive = false;
let typedChars = 0;

// Modes & Filters
let currentMode = 'code'; // 'code' or 'prose'
let selectedFilter = 'all';

// CapsLock Warning element
const capsWarning = document.createElement('div');
capsWarning.className = 'caps-warning hidden';
capsWarning.innerHTML = '<span>󰌎</span> Bloq Mayús Activado';
document.body.appendChild(capsWarning);

// Header DOM Setup
const header = document.querySelector('.header');

// Level Display
const levelDisplay = document.createElement('div');
levelDisplay.className = 'level-display';
updateLevelUI();
header.prepend(levelDisplay);

// Subcategory Filter (Languages or Prose categories)
const langSelector = document.createElement('div');
langSelector.className = 'lang-selector';
header.appendChild(langSelector);

// Mode Switch Elements
const modeCodeBtn = document.getElementById('mode-code-btn');
const modeProseBtn = document.getElementById('mode-prose-btn');

function setMode(mode) {
  currentMode = mode;
  selectedFilter = 'all';
  
  if (mode === 'code') {
    modeCodeBtn.classList.add('active');
    modeProseBtn.classList.remove('active');
  } else {
    modeCodeBtn.classList.remove('active');
    modeProseBtn.classList.add('active');
  }
  
  renderSubSelector();
  initGame();
}

function renderSubSelector() {
  if (currentMode === 'code') {
    langSelector.innerHTML = `
      <button class="lang-btn ${selectedFilter === 'all' ? 'active' : ''}" data-filter="all">Todos</button>
      <button class="lang-btn ${selectedFilter === 'javascript' ? 'active' : ''}" data-filter="javascript">JS</button>
      <button class="lang-btn ${selectedFilter === 'php' ? 'active' : ''}" data-filter="php">PHP</button>
      <button class="lang-btn ${selectedFilter === 'python' ? 'active' : ''}" data-filter="python">Python</button>
      <button class="lang-btn ${selectedFilter === 'golang' ? 'active' : ''}" data-filter="golang">Go</button>
      <button class="lang-btn ${selectedFilter === 'java' ? 'active' : ''}" data-filter="java">Java</button>
      <button class="lang-btn ${selectedFilter === 'css' ? 'active' : ''}" data-filter="css">CSS</button>
    `;
  } else {
    langSelector.innerHTML = `
      <button class="lang-btn ${selectedFilter === 'all' ? 'active' : ''}" data-filter="all">Todos</button>
      <button class="lang-btn ${selectedFilter === 'spanish' ? 'active' : ''}" data-filter="spanish">Español</button>
      <button class="lang-btn ${selectedFilter === 'english' ? 'active' : ''}" data-filter="english">Inglés</button>
      <button class="lang-btn ${selectedFilter === 'citas' ? 'active' : ''}" data-filter="citas">Citas</button>
      <button class="lang-btn ${selectedFilter === 'historias' ? 'active' : ''}" data-filter="historias">Historias</button>
      <button class="lang-btn ${selectedFilter === 'curiosidades' ? 'active' : ''}" data-filter="curiosidades">Curiosidades</button>
    `;
  }
}

modeCodeBtn.addEventListener('click', () => setMode('code'));
modeProseBtn.addEventListener('click', () => setMode('prose'));

langSelector.addEventListener('click', (e) => {
  if (e.target.classList.contains('lang-btn')) {
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    selectedFilter = e.target.dataset.filter;
    initGame();
  }
});

function initGame() {
  let sample = null;

  if (currentMode === 'code') {
    const filteredSnippets = selectedFilter === 'all' 
      ? snippets 
      : snippets.filter(s => s.language === selectedFilter);
    
    if (filteredSnippets.length === 0) {
      sample = snippets[0];
    } else {
      sample = filteredSnippets[Math.floor(Math.random() * filteredSnippets.length)];
    }
    
    currentSnippet = sample.code;
    langBadge.textContent = sample.language;
  } else {
    let filteredTexts = texts;
    if (selectedFilter === 'spanish' || selectedFilter === 'english') {
      filteredTexts = texts.filter(t => t.language === selectedFilter);
    } else if (selectedFilter !== 'all') {
      filteredTexts = texts.filter(t => t.category === selectedFilter);
    }

    if (filteredTexts.length === 0) {
      sample = texts[0];
    } else {
      sample = filteredTexts[Math.floor(Math.random() * filteredTexts.length)];
    }

    currentSnippet = sample.text;
    const langCode = sample.language === 'spanish' ? 'ES' : 'EN';
    langBadge.textContent = `${langCode} | ${sample.category.toUpperCase()}: ${sample.title}`;
  }
  
  wordsWrapper.innerHTML = '<div id="caret" class="caret"></div>';
  currentSnippet.split('').forEach((char, index) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.classList.add('char');
    if (index === 0) span.classList.add('current');
    wordsWrapper.appendChild(span);
  });

  currentCharIndex = 0;
  errors = 0;
  startTime = null;
  isGameActive = true;
  typedChars = 0;
  
  wpmDisplay.textContent = '0';
  accDisplay.textContent = '100%';
  
  resultsScreen.classList.add('hidden');
  gameUI.classList.remove('hidden');
  
  inputField.value = '';
  inputField.focus();
  updateCaret();
}

function updateCaret() {
  const chars = wordsWrapper.querySelectorAll('.char');
  const currentChar = chars[currentCharIndex];
  
  if (currentChar) {
    const rect = currentChar.getBoundingClientRect();
    const wrapperRect = wordsWrapper.getBoundingClientRect();
    
    caret.style.left = `${rect.left - wrapperRect.left}px`;
    caret.style.top = `${rect.top - wrapperRect.top}px`;
  } else {
    // End of snippet / text
    const lastChar = chars[chars.length - 1];
    const rect = lastChar.getBoundingClientRect();
    const wrapperRect = wordsWrapper.getBoundingClientRect();
    caret.style.left = `${rect.right - wrapperRect.left}px`;
  }
}

function calculateMetrics() {
  if (!startTime) return;
  const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
  const wpm = Math.round((typedChars / 5) / timeElapsed);
  const accuracy = Math.round(((typedChars - errors) / typedChars) * 100) || 100;
  
  wpmDisplay.textContent = wpm;
  accDisplay.textContent = `${accuracy}%`;
}

inputField.addEventListener('keydown', (e) => {
  if (!isGameActive) return;
  if (e.key === 'Backspace') {
    const charSpans = wordsWrapper.querySelectorAll('.char');
    if (currentCharIndex > 0) {
      charSpans[currentCharIndex].classList.remove('current');
      currentCharIndex--;
      charSpans[currentCharIndex].classList.remove('correct', 'incorrect');
      charSpans[currentCharIndex].classList.add('current');
      updateCaret();
      calculateMetrics();
    }
  }
});

inputField.addEventListener('input', (e) => {
  if (!isGameActive) return;
  if (!startTime) startTime = Date.now();

  const val = e.target.value;
  if (val === '') return; // Ignore if value was cleared

  const charSpans = wordsWrapper.querySelectorAll('.char');
  const charToMatch = currentSnippet[currentCharIndex];
  const typedChar = val[val.length - 1];
  
  if (!typedChar) return;

  if (typedChar === charToMatch) {
    charSpans[currentCharIndex].classList.add('correct');
    charSpans[currentCharIndex].classList.remove('current', 'incorrect');
  } else {
    charSpans[currentCharIndex].classList.add('incorrect');
    charSpans[currentCharIndex].classList.remove('current');
    errors++;
  }
  typedChars++;

  charSpans[currentCharIndex].classList.remove('current');
  currentCharIndex++;

  if (currentCharIndex < currentSnippet.length) {
    charSpans[currentCharIndex].classList.add('current');
    updateCaret();
  } else {
    endGame();
  }

  calculateMetrics();
  inputField.value = ''; 
});

function endGame() {
  isGameActive = false;
  const timeElapsed = (Date.now() - startTime) / 1000 / 60;
  const wpm = Math.round((typedChars / 5) / timeElapsed);
  const accuracy = Math.round(((typedChars - errors) / typedChars) * 100) || 100;

  // XP Logic: (WPM * Accuracy / 100)
  const xpGained = Math.round((wpm * accuracy) / 100);
  userStats.xp += xpGained;
  
  if (userStats.xp >= userStats.level * 100) {
    userStats.xp -= userStats.level * 100;
    userStats.level++;
    showLevelUp();
  }
  
  localStorage.setItem('apexTypeStats', JSON.stringify(userStats));
  updateLevelUI();

  finalWpm.textContent = wpm;
  finalWpm.classList.add('highlight');
  finalAcc.textContent = `${accuracy}%`;
  finalErrors.textContent = errors;

  gameUI.classList.add('hidden');
  resultsScreen.classList.remove('hidden');
}

function updateLevelUI() {
  levelDisplay.innerHTML = `
    <div class="level-badge">NVL ${userStats.level}</div>
    <div class="xp-bar-container">
      <div class="xp-bar" style="width: ${(userStats.xp / (userStats.level * 100)) * 100}%"></div>
    </div>
  `;
}

function showLevelUp() {
  const popup = document.createElement('div');
  popup.className = 'level-up-popup';
  popup.textContent = '¡NIVEL ALCANZADO!';
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 2000);
}

// Global listeners
document.addEventListener('keydown', (e) => {
  // CapsLock Detection
  if (e.getModifierState('CapsLock')) {
    capsWarning.classList.remove('hidden');
  } else {
    capsWarning.classList.add('hidden');
  }

  if (e.key === 'Tab') {
    e.preventDefault();
    initGame();
  }
  if (e.key === 'Enter' && !isGameActive) {
    initGame();
  }
  // Refocus input if user clicks away
  inputField.focus();
});

restartBtn.addEventListener('click', initGame);

// Initial start setup
renderSubSelector();
initGame();
window.addEventListener('resize', updateCaret);
