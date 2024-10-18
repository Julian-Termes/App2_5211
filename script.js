// Tab functionality
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanes = document.querySelectorAll(".tab-pane");
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabPanes.forEach((pane) => pane.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(button.dataset.tab).classList.add("active");
  });
});

// Stopwatch functionality
// let time = 1500; // OLD CODE: This caused the stopwatch to reset to 1500ms instead of 0
let stopwatchTime = 0; // NEW CODE: Changed variable to represent the stopwatch's time, initializing to 0
let stopwatchInterval; // NEW CODE: Separate interval for stopwatch
let stopwatchRunning = false; // NEW CODE: Separate running state for stopwatch

function formatTime(ms) {
  const date = new Date(ms);
  return date.toISOString().substr(11, 8) + "." + Math.floor((ms % 1000) / 10);
}

// function updateDisplay(elementId) {  // OLD CODE: Shared display update function
//   document.querySelector(`#${elementId} .time-display`).textContent = formatTime(time);
// }

function updateStopwatchDisplay() {
  // NEW CODE: Update display specifically for stopwatch
  document.querySelector(`#stopwatch .time-display`).textContent =
    formatTime(stopwatchTime);
}

function startStopStopwatch() {
  // NEW CODE: Updated function for the stopwatch
  const button = document.querySelector(`#stopwatch-startstop`);
  if (stopwatchRunning) {
    clearInterval(stopwatchInterval);
    button.textContent = "Start";
  } else {
    stopwatchInterval = setInterval(() => {
      stopwatchTime += 10;
      updateStopwatchDisplay();
    }, 10);
    button.textContent = "Stop";
  }
  stopwatchRunning = !stopwatchRunning;
}

// function startStop(timerId) {  // OLD CODE: This function managed both stopwatch and lap timer simultaneously
//   const button = document.querySelector(`#${timerId}-startstop`);
//   if (isRunning) {
//     clearInterval(interval);
//     button.textContent = "Start";
//   } else {
//     interval = setInterval(() => {
//       time += 1;
//       updateDisplay(timerId);
//     }, 10);
//     button.textContent = "Stop";
//   }
//   isRunning = !isRunning;
// }

function resetStopwatch() {
  // NEW CODE: Reset logic for the stopwatch
  clearInterval(stopwatchInterval);
  stopwatchTime = 0; // Reset to 0 instead of 1500
  stopwatchRunning = false;
  updateStopwatchDisplay();
  document.querySelector(`#stopwatch-startstop`).textContent = "Start";
}

// Lap Timer functionality
// let time = 1500;  // OLD CODE: Shared time variable for both stopwatch and lap timer
let lapTime = 0; // NEW CODE: Separate variable to track lap timer
let lapInterval; // NEW CODE: Separate interval for lap timer
let lapRunning = false; // NEW CODE: Separate running state for lap timer
let laps = [];

// function updateDisplay(elementId) {  // OLD CODE: Shared display update function
//   document.querySelector(`#${elementId} .time-display`).textContent = formatTime(time);
// }

function updateLapTimerDisplay() {
  // NEW CODE: Update display specifically for lap timer
  document.querySelector(`#laptimer .time-display`).textContent =
    formatTime(lapTime);
}

function startStopLapTimer() {
  // NEW CODE: Function to start/stop the lap timer
  const button = document.querySelector(`#laptimer-startstop`);
  if (lapRunning) {
    clearInterval(lapInterval);
    button.textContent = "Start";
  } else {
    lapInterval = setInterval(() => {
      lapTime += 10;
      updateLapTimerDisplay();
    }, 10);
    button.textContent = "Stop";
  }
  lapRunning = !lapRunning;
}

// function startStop(timerId) {  // OLD CODE: Managed both stopwatch and lap timer simultaneously
//   const button = document.querySelector(`#${timerId}-startstop`);
//   if (isRunning) {
//     clearInterval(interval);
//     button.textContent = "Start";
//   } else {
//     interval = setInterval(() => {
//       time += 1;
//       updateDisplay(timerId);
//     }, 10);
//     button.textContent = "Stop";
//   }
//   isRunning = !isRunning;
// }

function resetLapTimer() {
  // NEW CODE: Reset logic for the lap timer
  clearInterval(lapInterval);
  lapTime = 0; // Reset lap timer to 0
  lapRunning = false;
  updateLapTimerDisplay();
  document.querySelector(`#laptimer-startstop`).textContent = "Start";
  laps = [];
  document.getElementById("lap-list").innerHTML = "";
}

// Lap functionality
document.getElementById("laptimer-lap").addEventListener("click", () => {
  if (lapRunning) {
    laps.push(lapTime);
    const lapItem = document.createElement("div");
    lapItem.classList.add("lap-item");
    lapItem.innerHTML = `<span>Lap ${laps.length}</span><span>${formatTime(
      lapTime
    )}</span>`;
    document.getElementById("lap-list").prepend(lapItem);
  }
});

// Stopwatch event listeners
document
  .getElementById("stopwatch-startstop")
  .addEventListener("click", startStopStopwatch); // NEW CODE: Independent stopwatch listener
document
  .getElementById("stopwatch-reset")
  .addEventListener("click", resetStopwatch); // NEW CODE: Independent reset for stopwatch

// Lap Timer event listeners
document
  .getElementById("laptimer-startstop")
  .addEventListener("click", startStopLapTimer); // NEW CODE: Independent lap timer listener
document
  .getElementById("laptimer-reset")
  .addEventListener("click", resetLapTimer); // NEW CODE: Independent reset for lap timer

// Alarm functionality
let alarmTimeout;
let alarmTime = null;
const alarmSound = document.getElementById("alarm-sound");

function playAlarmSound() {
  alarmSound.play();
}

function stopAlarmSound() {
  alarmSound.pause();
  alarmSound.currentTime = 0;
}

document.getElementById("alarm-set").addEventListener("click", () => {
  const input = document.getElementById("alarm-time");
  const alarmButton = document.getElementById("alarm-set");

  if (alarmButton.textContent === "Set Alarm") {
    const now = new Date();
    const [hours, minutes] = input.value.split(":");
    const alarmDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );
    if (alarmDate <= now) {
      alarmDate.setDate(alarmDate.getDate() + 1);
    }
    const timeDiff = alarmDate - now;
    clearTimeout(alarmTimeout);
    alarmTimeout = setTimeout(() => {
      document.getElementById("alarm-display").textContent = "ALARM!";
      document.getElementById("alarm-display").classList.add("alarm-ringing");
      playAlarmSound();
    }, timeDiff);

    alarmTime = input.value;
    document.getElementById(
      "alarm-display"
    ).textContent = `Alarm set for ${alarmTime}`;
    alarmButton.textContent = "Cancel Alarm";
  } else {
    clearTimeout(alarmTimeout);
    stopAlarmSound();
    document.getElementById("alarm-display").textContent = "";
    document.getElementById("alarm-display").classList.remove("alarm-ringing");
    alarmButton.textContent = "Set Alarm";
    alarmTime = null;
  }
});
