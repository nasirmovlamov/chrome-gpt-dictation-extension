const getTranscriptOfAudioStream = async () => {
  // Create a new instance of the SpeechRecognition object
  const recognition = new window.webkitSpeechRecognition();

  // Set the language to the user's preferred language
  recognition.lang = window.navigator.language;

  // Set continuous mode to keep listening until stopped
  recognition.continuous = true;

  // Start capturing user audio
  recognition.start();

  // Listen for results
  recognition.onresult = (event) => {
    // Get the transcript from the event results
    const transcript = event.results[event.results.length - 1][0].transcript;
    // Log the transcript to the console
    console.log(transcript);
    //if contains "stop" then stop
    if (
      transcript.toLowerCase().includes("stop") ||
      transcript.toLowerCase().includes("exit")
    ) {
      recognition.stop();
    }

    //if contains "search" then search
    if (transcript.toLowerCase().includes("google")) {
      const textAreaElement = document.querySelector("textarea");
      textAreaElement.value = transcript.toLowerCase().replace("google", "");
      //click on searconst ch button which is sibling element
      textAreaElement.nextElementSibling.click();

      // read the text
      // const wait5Seconds = () => {
      //   return new Promise((resolve, reject) => {
      //     setTimeout(() => {
      //       resolve();
      //     }, 5000);
      //   });
      // };
      // const wait5SecondsPromise = wait5Seconds();
      // wait5SecondsPromise.then(() => {});
    }
  };

  // Listen for errors
  recognition.onerror = (event) => {
    console.error(event.error);
  };
};

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("activateGPTDictation")
    .addEventListener("click", function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: getTranscriptOfAudioStream,
        });
      });
    });
});
