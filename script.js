document.addEventListener('DOMContentLoaded', () => {
    // Get all required elements
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const saveSettings = document.getElementById('saveSettings');
    const closeSettings = document.getElementById('closeSettings');
    const workTimeInput = document.getElementById('workTime');
    const breakTimeInput = document.getElementById('breakTime');
    const toggleButton = document.getElementById('toggleButton');
    const startButton = document.getElementById('start-btn');
    const resetButton = document.getElementById('reset-btn');
    const timerDisplay = document.getElementById('timer');
    const modeDisplay = document.getElementById('mode-display');
    const quoteElement = document.getElementById('quote');
    const addTimeBtn = document.getElementById('add-time-btn');
    const taskInput = document.getElementById('taskInput');
    let currentTask = '';

    // Initialize timer variables
    let workTime = 25 * 60;
    let breakTime = 5 * 60;
    let isWorkTime = true;
    let timeLeft = workTime;
    let timerInterval = null;
    let isRunning = false;

    const quotes = [
        // Carl Jung quotes
        {
            text: "Until you make the unconscious conscious, it will direct your life and you will call it fate.",
            author: "Carl Jung"
        },
        {
            text: "I am not what happened to me, I am what I choose to become.",
            author: "Carl Jung"
        },
        {
            text: "Who looks outside, dreams; who looks inside, awakes.",
            author: "Carl Jung"
        },
        {
            text: "The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed.",
            author: "Carl Jung"
        },
        {
            text: "Everything that irritates us about others can lead us to an understanding of ourselves.",
            author: "Carl Jung"
        },
        
        // David Goggins quotes
        {
            text: "Don't stop when you're tired. Stop when you're done.",
            author: "David Goggins"
        },
        {
            text: "The most important conversations you'll ever have are the ones you'll have with yourself.",
            author: "David Goggins"
        },
        {
            text: "You are in danger of living a life so comfortable and soft, that you will die without ever realizing your true potential.",
            author: "David Goggins"
        },
        {
            text: "The pain that you are willing to endure is measured by how bad you want it.",
            author: "David Goggins"
        },
        {
            text: "If you can get through doing things that you hate to do, on the other side is greatness.",
            author: "David Goggins"
        }
    ];

    // Timer update function
    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Settings button event listener
    settingsBtn.addEventListener('click', () => {
        workTimeInput.value = workTime / 60;
        breakTimeInput.value = breakTime / 60;
        settingsModal.style.display = 'block';
    });

    // Save settings event listener
    saveSettings.addEventListener('click', () => {
        const workMinutes = parseInt(workTimeInput.value);
        const breakMinutes = parseInt(breakTimeInput.value);
        
        if (isNaN(workMinutes) || isNaN(breakMinutes) || workMinutes <= 0 || breakMinutes <= 0) {
            alert('Please enter valid numbers greater than 0');
            return;
        }

        workTime = workMinutes * 60;
        breakTime = breakMinutes * 60;
        timeLeft = isWorkTime ? workTime : breakTime;
        updateTimer();
        settingsModal.style.display = 'none';
    });

    // Close settings event listener
    closeSettings.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    // Toggle button event listener
    toggleButton.addEventListener('click', () => {
        isWorkTime = !isWorkTime;
        timeLeft = isWorkTime ? workTime : breakTime;
        updateMode();
        updateDisplay();
        
        updateQuoteOnModeSwitch();
        
        if (isRunning) {
            clearInterval(timerInterval);
            startTimer();
        }
    });

    // Start button event listener
    startButton.addEventListener('click', () => {
        if (!isRunning) {
            // If input is visible, get value from there, otherwise use existing currentTask
            if (taskInput.parentElement.style.display !== 'none') {
                currentTask = taskInput.value.trim();
                if (currentTask) {
                    convertInputToLabel();
                } else {
                    alert('Please enter what you\'re working on');
                    return;
                }
            }
            
            isRunning = true;
            startButton.textContent = 'Pause';
            addTimeBtn.style.display = 'block';
            startTimer();
        } else {
            isRunning = false;
            startButton.textContent = 'Start';
            clearInterval(timerInterval);
        }
    });

    // Reset button event listener
    resetButton.addEventListener('click', () => {
        clearInterval(timerInterval);
        isRunning = false;
        timeLeft = isWorkTime ? workTime : breakTime;
        startButton.textContent = 'Start';
        addTimeBtn.style.display = 'none';
        
        // Remove task label if it exists and show input
        const taskLabel = document.querySelector('.task-label');
        if (taskLabel) {
            taskLabel.remove();
        }
        const taskInputContainer = taskInput.parentElement;
        taskInputContainer.style.display = 'block';
        currentTask = '';
        taskInput.value = '';
        
        updateTimer();
    });

    // Click outside modal to close
    window.addEventListener('click', (event) => {
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    // Initial timer display
    updateTimer();

    function updateQuoteOnModeSwitch() {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteElement.innerHTML = `"${randomQuote.text}"<br>- ${randomQuote.author}`;
    }

    function displayInitialQuote() {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteElement.innerHTML = `"${randomQuote.text}"<br>- ${randomQuote.author}`;
    }

    // Call this once when the page loads
    displayInitialQuote();

    // Add/restore the startTimer function
    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft < 0) {
                clearInterval(timerInterval);
                timeLeft = isWorkTime ? workTime : breakTime;
                isRunning = false;
                startButton.textContent = 'Start';
            }
            updateDisplay();
        }, 1000);
    }

    // Make sure we have the updateDisplay function
    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timerDisplay.textContent = timeString;
        updateTitle();
    }

    function updateMode() {
        if (isWorkTime) {
            modeDisplay.textContent = '☀️';  // Work mode: sun
        } else {
            modeDisplay.textContent = '🌙';  // Break mode: moon
        }
    }

    function updateTitle() {
        const timeString = `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;
        const taskString = currentTask ? ` - ${currentTask}` : '';
        document.title = `${timeString}${taskString} - Pomodoro Timer`;
    }

    function addFiveMinutes() {
        timeLeft += 5 * 60;
        updateDisplay();
    }

    // Add new add time button listener
    addTimeBtn.addEventListener('click', () => {
        if (isRunning) {
            addFiveMinutes();
        }
    });

    function convertInputToLabel() {
        const taskInputContainer = taskInput.parentElement;
        const label = document.createElement('div');
        label.className = 'task-label';
        label.textContent = currentTask;
        taskInputContainer.style.display = 'none';
        taskInputContainer.parentElement.insertBefore(label, taskInputContainer);
    }

    // Add this function to handle the enter key conversion
    function handleEnterKey(event) {
        if (event.key === 'Enter') {
            currentTask = taskInput.value.trim();
            if (currentTask) {
                convertInputToLabel();
            }
        }
    }

    // Add this event listener after other element selections
    taskInput.addEventListener('keypress', handleEnterKey);
});
