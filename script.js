let timeLeft;
let timerId = null;
let isWorkMode = true;

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const REST_TIME = 5 * 60;  // 5 minutes in seconds

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start-btn');
const resetButton = document.getElementById('reset-btn');
const modeToggle = document.getElementById('mode-toggle');
const modeDisplay = document.getElementById('mode-display');

const quotes = [
    "Until you make the unconscious conscious, it will direct your life and you will call it fate.",
    "I am not what happened to me, I am what I choose to become.",
    "The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed.",
    "Everything that irritates us about others can lead us to an understanding of ourselves.",
    "Who looks outside, dreams; who looks inside, awakes.",
    "The pendulum of the mind oscillates between sense and nonsense, not between right and wrong.",
    "In all chaos there is a cosmos, in all disorder a secret order.",
    "What you resist, persists."
];

function updateDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function displayRandomQuote() {
    const quoteElement = document.getElementById('quote');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteElement.textContent = `"${quotes[randomIndex]}" - Carl Jung`;
}

function startTimer() {
    if (timerId !== null) {
        // Timer is running, pause it
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
        return;
    }

    // Display a new quote when starting
    displayRandomQuote();

    // Start the timer
    startButton.textContent = 'Pause';
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay(timeLeft);
        
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            startButton.textContent = 'Start';
            alert(isWorkMode ? 'Work time is up! Take a break!' : 'Break time is up! Back to work!');
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = isWorkMode ? WORK_TIME : REST_TIME;
    updateDisplay(timeLeft);
    startButton.textContent = 'Start';
}

function toggleMode() {
    isWorkMode = !isWorkMode;
    modeDisplay.textContent = isWorkMode ? 'Work Time' : 'Rest Time';
    modeToggle.textContent = isWorkMode ? 'Switch to Rest' : 'Switch to Work';
    resetTimer();
}

// Initialize
timeLeft = WORK_TIME;
updateDisplay(timeLeft);

// Event listeners
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
modeToggle.addEventListener('click', toggleMode);
