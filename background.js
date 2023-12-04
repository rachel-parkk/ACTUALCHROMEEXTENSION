let countdownInterval;
let remainingSeconds = 0;

function startCountdown(totalSeconds) {
  remainingSeconds = totalSeconds;

  countdownInterval = setInterval(function () {
    if (remainingSeconds <= 0) {
      clearInterval(countdownInterval);
    } else {
      remainingSeconds--;

      // Save countdown state to storage
      chrome.storage.sync.set({ countdown: remainingSeconds });
    }
  }, 1000);
}

chrome.runtime.onInstalled.addListener(function () {
  console.log('Extension Installed');
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'startCountdown') {
    startCountdown(request.totalSeconds);
    sendResponse({ started: true });
  } else if (request.action === 'getRemainingSeconds') {
    sendResponse({ remainingSeconds });
  }
});

// Load countdown state from storage and resume the countdown
chrome.storage.sync.get(['countdown'], function (result) {
  if (result.countdown) {
    startCountdown(result.countdown);
  }
});

