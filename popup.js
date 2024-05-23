const birthDateInput = document.getElementById("birthDate");
const lifeExpectancyInput = document.getElementById("lifeExpectancy");
const saveButton = document.getElementById("saveButton");
const countdownElement = document.getElementById("countdown");
const lifeProgressElement = document.getElementById("lifeProgress");
const lifeProgressBarElement = document.getElementById("lifeProgressBar");
let countdownInterval = null;

// Load saved data
chrome.storage.sync.get(["birthDate", "lifeExpectancy"], (data) => {
  if (data.birthDate) {
    birthDateInput.value = data.birthDate;
  }
  if (data.lifeExpectancy) {
    lifeExpectancyInput.value = data.lifeExpectancy;
  }
  updateDisplays();
});

document.addEventListener("DOMContentLoaded", function () {
  var lifeExpectancyInput = document.getElementById("lifeExpectancy");
  lifeExpectancyInput.addEventListener("input", validateLifeExpectancy);

  function validateLifeExpectancy() {
    var lifeExpectancy = lifeExpectancyInput.value;
    var warningElement = document.getElementById("warning");
    if (lifeExpectancy < 0) {
      warningElement.textContent = "Life expectancy can only be a positive number.";
      lifeExpectancyInput.value = "";
    } else {
      warningElement.textContent = "";
    }
  }
});

// Save data when the Save button is clicked
saveButton.addEventListener("click", () => {
  const birthDate = birthDateInput.value;
  const lifeExpectancy = lifeExpectancyInput.value;
  chrome.storage.sync.set({ birthDate, lifeExpectancy }, () => {
    updateDisplays();
  });
});

// Update the countdown display
function updateCountdown() {
  const birthDate = new Date(birthDateInput.value);
  const lifeExpectancy = parseInt(lifeExpectancyInput.value, 10);
  const expectedEndDate = new Date(birthDate);
  expectedEndDate.setFullYear(birthDate.getFullYear() + lifeExpectancy);

  const countdownInterval = setInterval(() => {
    const now = new Date();
    const timeRemaining = expectedEndDate - now;

    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      countdownElement.textContent = "Time's up!";
      return;
    }

    const years = Math.floor(timeRemaining / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
    );
    const days = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
    );
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    countdownElement.textContent = `${years}y ${months}m ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
}

// Update the life progress display
function updateLifeProgress() {
  const birthDate = new Date(birthDateInput.value);
  const lifeExpectancy = parseInt(lifeExpectancyInput.value, 10);
  const now = new Date();
  const ageInMilliseconds = now - birthDate;
  const lifeExpectancyInMilliseconds =
    lifeExpectancy * 365.25 * 24 * 60 * 60 * 1000;
  const lifeProgressPercentage =
    (ageInMilliseconds / lifeExpectancyInMilliseconds) * 100;

    
    lifeProgressElement.textContent = `${lifeProgressPercentage.toFixed(2)}%`;
    // lifeProgressBarElement.value = lifeProgressPercentage;
  document.querySelector(
    ".progress-bar-fill"
  ).style.width = `${lifeProgressPercentage}%`;
}

function updateDisplays() {
  const birthDate = new Date(birthDateInput.value);
  const lifeExpectancy = parseInt(lifeExpectancyInput.value, 10);

  if (isNaN(birthDate.getTime()) || isNaN(lifeExpectancy)) {
    countdownElement.textContent = "";
    lifeProgressElement.textContent = "";
    document.querySelector(".progress-bar-fill").style.width = "0%";
    return;
  }

  const expectedEndDate = new Date(birthDate);
  expectedEndDate.setFullYear(birthDate.getFullYear() + lifeExpectancy);

  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    const now = new Date();
    const timeRemaining = expectedEndDate - now;

    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      countdownElement.textContent = "Time's up!";
      return;
    }

    const years = Math.floor(timeRemaining / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((timeRemaining % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((timeRemaining % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    countdownElement.textContent = `${years}y ${months}m ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, 1000);

  const ageInMilliseconds = Date.now() - birthDate.getTime();
  const lifeExpectancyInMilliseconds = lifeExpectancy * 365.25 * 24 * 60 * 60 * 1000;
  const lifeProgressPercentage = (ageInMilliseconds / lifeExpectancyInMilliseconds) * 100;

  lifeProgressElement.textContent = `${lifeProgressPercentage.toFixed(2)}%`;
  document.querySelector(".progress-bar-fill").style.width = `${lifeProgressPercentage}%`;
}
