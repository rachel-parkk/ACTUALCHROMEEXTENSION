const timeInput = document.getElementById('time-input');
const startButton = document.getElementById('start-button');
const demoval=document.getElementById("demo");
var list = '';
const linkInput = document.getElementById("link-input");

document.addEventListener("DOMContentLoaded", function () {
    const textInput = document.getElementById("textInput");
    const processButton = document.getElementById("processButton");
    const viewAllButton = document.getElementById("viewAllButton");
    const output = document.getElementById("output");
    const processedTextList = document.getElementById("processedTextList");
    let x = 0;
  
    // Initialize the processedTexts array with previously stored data (if any)
    chrome.storage.sync.get({ processedTexts: [] }, function (data) {
      processedTexts = data.processedTexts;
    });
  
    //processButton.addEventListener("click", processText);
    processButton.addEventListener("click", processText);
    if (x==1){
      viewAllButton.addEventListener("click", processedTextList.innerHTML="");
      x=0;
    }
    else{
      viewAllButton.addEventListener("click", showAllTexts);
    }
    //viewAllButton.addEventListener("click",processedTextList.innerHTML="");
  
    let processedTexts = [];
  
    function processText() {
      const inputText = textInput.value;
      const processedText = processInput(inputText);
      // Store the processed text in the array
      processedTexts.push(processedText);
  
      // Store the updated array in chrome.storage.sync
      chrome.storage.sync.set({ processedTexts });
  
      // Display the processed text below the input field
      output.textContent = processedText;
  
      // Clear the input field
      textInput.value = "";
    }
  
    function showAllTexts() {
      x=1;
      // Display all the processed texts in the container
      processedTextList.style.display = "block";
      processedTextList.innerHTML = processedTexts.map((text, index) => `<p>${index + 1}: ${text}</p>`).join("<br>");
    }
  
    function processInput(inputText) {
      inputText = inputText.replace(/.*?(www\.|https:\/\/)/, '');
  
      // Remove text after ".com", ".gov", or ".gov"
      //inputText = inputText.replace(/(\.com|\.gov|\.gov).*/, '');
      if (inputText.includes(".com")) {
        inputText = inputText.substring(0, inputText.indexOf(".com")+4);
      } else if (inputText.includes(".org")) {
        inputText = inputText.substring(0, inputText.indexOf(".org")+4);
      } else if (inputText.includes(".gov")) {
        inputText = inputText.substring(0, inputText.indexOf(".gov")+4);
      }
      return inputText; 
    }
  });
  

startButton.addEventListener('click', function () {
    const timeValue = timeInput.value;
    if (validateTimeInput(timeValue)) {
      // Disable the input field
      timeInput.disabled = true;
  
      // Parse the time input into hours, minutes, and seconds
      const [hours, minutes, seconds] = timeValue.split(':').map(Number);
      let totalSeconds = hours * 3600 + minutes * 60 + seconds;
      chrome.storage.set=({ countdownTime: totalSeconds });
      // Function to update the countdown
      function updateCountdown() {
        chrome.storage.set=({ countdownTime: totalSeconds });
        //chrome.storage.local.set({ countdownTime: totalSeconds });
        const hoursRemaining = Math.floor(totalSeconds / 3600);
        const minutesRemaining = Math.floor((totalSeconds % 3600) / 60);
        const secondsRemaining = totalSeconds % 60;
  
        // Display the countdown in the input field
        timeInput.value = `${String(hoursRemaining).padStart(2, '0')}:${String(minutesRemaining).padStart(2, '0')}:${String(secondsRemaining).padStart(2, '0')}`;
  
        // Check if the countdown has reached zero
        if (totalSeconds <= 0) {
          clearInterval(countdownInterval);
          alert('Countdown has finished!');
          timeInput.disabled=false;
  
        } else {
          totalSeconds--;
        }
      }
  
      // Update the countdown every second
      const countdownInterval = setInterval(updateCountdown, 1000);
    } else {
      alert('Invalid time format. Please use hh:mm:ss format.');
    }
  });
  
  function validateTimeInput(input) {
    const timePattern = /^(\d{2}):(\d{2}):(\d{2})$/;
    return timePattern.test(input);
  }

  chrome.storage.local.countdownIntervalget(["countdownTime"], function(result) {
    const countdownTime = result.countdownTime;
    if (countdownTime) {
      const timeInput = document.getElementById("time-input");
      timeInput.value = secondsToHms(countdownTime);
      timeInput.disabled = true;
    }
  });
  
