let tf=0;
document.addEventListener("DOMContentLoaded", function () {
  const textInput = document.getElementById("textInput");
  const processButton = document.getElementById("processButton");
  const viewAllButton = document.getElementById("viewAllButton");
  const output = document.getElementById("output");
  const Delete = document.getElementById("Delete");
  const processedTextList = document.getElementById("processedTextList");
  let x = 0;
  //let tf=0;
  // Initialize the processedTexts array with previously stored data (if any)
  chrome.storage.sync.get({ processedTexts: [] }, function (data) {
    processedTexts = data.processedTexts;
  });

  let processedTexts = [];
  processButton.addEventListener("click", processText);

  function processText() {
    const inputText = textInput.value;
    if (inputText.trim().length!=0){
      const processedText = processInput(inputText);
      if (processedTexts.includes(processedText)==false){
        // Store the processed text in the array
        processedTexts.push(processedText);
        // Store the updated array in chrome.storage.sync
        chrome.storage.sync.set({ processedTexts });
        // Display the processed text below the input field
        output.textContent = "Site Blocked: "+processedText;
      }
      else{
        output.textContent = "Link Already Added!";
      }
      // Clear the input field
      textInput.value = "";
  }
  else{
    output.textContent = "Enter Valid Input";
  }
}

  Delete.addEventListener('click', function() {
    if (tf==0){
      const inputValue = processInput(textInput.value);
      const index = processedTexts.indexOf(inputValue);
      if (index !==-1){
        processedTexts.splice(index, 1);
        chrome.storage.sync.set({ processedTexts });
        output.textContent = 'Site has been unblocked!';
      }
      else{
        output.textContent = 'Site not found.';
      }
      textInput.value = "";
  }
  });

  function processInput(inputText) {
    inputText = inputText.replace(/.*?(www\.|https:\/\/)/, '');
    inputText = inputText.replace(/.*?(www\.|https:\/\/)/, '');

    if (inputText.includes(".com")) {
      inputText = inputText.substring(0, inputText.indexOf(".com")+4);
    } else if (inputText.includes(".org")) {
      inputText = inputText.substring(0, inputText.indexOf(".org")+4);
    } else if (inputText.includes(".gov")) {
      inputText = inputText.substring(0, inputText.indexOf(".gov")+4);
    } 
    return inputText;
  }
  processButton.addEventListener("click", processText);
  viewAllButton.addEventListener('click', function () {
    if (x==0){
      processedTextList.style.display = 'block';
      processedTextList.innerHTML = processedTexts.map((text, index) => `<p>${text}</p>`).join("<br>");
      x=1;
    }
    else{
      processedTextList.style.display = 'none';
      x=0;
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('startButton');
    const timeInput = document.getElementById('timeInput');
    const countdownElement = document.getElementById('countdown');
    //let tf=0;

    startButton.addEventListener('click', function () {
      if (tf==0){
        const inputTime = parseTimeInput(timeInput.value);
        if (inputTime>43200){
          alert('Maximum time allowed is 12 hours. Please start practicing healthy working habits...');
        }
        else if (inputTime !== null) {
          // Disable the time input field
          timeInput.disabled = true;
          // Send a message to the background script to start the countdown
          chrome.runtime.sendMessage({ action: 'startCountdown', totalSeconds: inputTime }, function (response) {
            if (response.started) {
              console.log('Countdown started.');
            }
          });
            // Get remaining seconds from the background script
          chrome.runtime.sendMessage({ action: 'getRemainingSeconds' }, function (response) {
            if (response.remainingSeconds > 0) {
              tf=1;
              timeInput.disabled = true;
              // Update the time input field with the remaining time
              updateCountdown(response.remainingSeconds);
            }
      });
        } else {
          alert('Invalid time format. Please enter time in HH:MM:SS.');
        }
    }
    });
  
    // Get remaining seconds from the background script
    chrome.runtime.sendMessage({ action: 'getRemainingSeconds' }, function (response) {
      if (response.remainingSeconds > 0) {
        // Update the time input field with the remaining time
        updateCountdown(response.remainingSeconds);
      }
    });
  
    function parseTimeInput(input) {
      const timeRegex = /^(\d{2}):(\d{2}):(\d{2})$/;
      const match = input.match(timeRegex);
      if (match) {
        const hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const seconds = parseInt(match[3]);
        return hours * 3600 + minutes * 60 + seconds;
      }
      return null;
    }
  
    function updateCountdown(seconds) {
      const interval = setInterval(function () {
        if (seconds == 0) {
          timeInput.disabled=false;
          tf=0;
        } 
        if (seconds>0) {
          timeInput.disabled = true;
          tf=1;
          //countdownElement.textContent = formatTime(seconds);
          seconds--;
          timeInput.value = formatTime(seconds);
          timeInput.disabled = true;
          // Update the time input field with the remaining time
        }
      }, 1000);
    }
  
    function formatTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    }
  
    function pad(number) {
      return number < 10 ? `0${number}` : number;
    }
  });
  
