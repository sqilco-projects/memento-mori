const birthDateInput = document.getElementById('birthDate');
const lifeExpectancyInput = document.getElementById('lifeExpectancy');
const saveButton = document.getElementById('saveButton');
const countdownElement = document.getElementById('countdown');

// Load saved data
chrome.storage.sync.get(['birthDate', 'lifeExpectancy'], (data) => {
  if (data.birthDate) {
    birthDateInput.value = data.birthDate;
  }
  if (data.lifeExpectancy) {
    lifeExpectancyInput.value = data.lifeExpectancy;
  }
  updateCountdown();
});

// Save data when the Save button is clicked
saveButton.addEventListener('click', () => {
  const birthDate = birthDateInput.value;
  const lifeExpectancy = lifeExpectancyInput.value;
  chrome.storage.sync.set({ birthDate, lifeExpectancy }, () => {
    updateCountdown();
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
    const months = Math.floor((timeRemaining % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((timeRemaining % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    countdownElement.textContent = `${years}y ${months}m ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
}