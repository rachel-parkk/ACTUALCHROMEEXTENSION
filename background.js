let countdownInterval;
let remainingSeconds = 0;
let y=0;

function startCountdown(totalSeconds) {
  remainingSeconds = totalSeconds;

  countdownInterval = setInterval(function () {
    if (remainingSeconds <= 0) {
      clearInterval(countdownInterval);
      y=0;
    } else {
      remainingSeconds--;
      y=1;

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

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
  // Check if the URL contains any element from the list
  chrome.storage.sync.get(["processedTexts"], function(data) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const processedTexts = data.processedTexts || [];
      for (const listItem of processedTexts) {
        if (y>0){
          const targetUrl = tabs[0].url.toLowerCase();
          if (targetUrl.includes(listItem.toLowerCase())) {
          // Redirect to "hello.com"
            chrome.tabs.update(details.tabId, { url: "www.google.com" });
          break; // Stop checking once a match is found
          }
    }
    }
  });
});
});
