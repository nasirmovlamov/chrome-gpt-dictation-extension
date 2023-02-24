const getMicAccess = () => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        resolve(stream);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getAudioContext = () => {
  return new Promise((resolve, reject) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    resolve(audioContext);
  });
};

const getAudioStream = () => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        resolve(stream);
      })

      .catch((err) => {
        reject(err);
      });
  });
};

const sendAudioStreamToTextConverterApiAndConsoleLog = async () => {
  // console.log("script started");
  // const getUserAudioStream = () => {
  //   return new Promise((resolve, reject) => {
  //     navigator.mediaDevices
  //       .getUserMedia({ audio: true })
  //       .then((stream) => {
  //         resolve(stream);
  //       })
  //       .catch((err) => {
  //         reject(err);
  //       });
  //   });
  // };
  // const userAudioStream = await getUserAudioStream();
  // console.log(userAudioStream);

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
      const wait5Seconds = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 5000);
        });
      };
      const wait5SecondsPromise = wait5Seconds();
      wait5SecondsPromise.then(() => {});
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
      // Get the current tab
      //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      //     // Execute a script in the current tab's context to change the background color
      //     chrome.tabs.executeScript(tabs[0].id, {
      //       code: "(" + removeAllImages + ")()",
      //     });
      //   });
      // Send a message to the background script
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: sendAudioStreamToTextConverterApiAndConsoleLog,
        });
      });
    });
});
