const btn = document.querySelector(".talk");
const stopBtn = document.querySelector(".stop");
const content = document.querySelector(".content");

document.addEventListener("DOMContentLoaded", () => {
  const textElement = document.getElementById("animated-text");
  const text = "VADARLY";
  let index = 0;

  const animateText = () => {
    if (index < text.length) {
      textElement.textContent = textElement.textContent.slice(0, index) + text[index] + textElement.textContent.slice(index + 1);
      index++;
      setTimeout(animateText, 130);
    }
  };

  setTimeout(animateText, 2000);
});

document.addEventListener("DOMContentLoaded", () => {
  const textElement = document.getElementById("animated-para");
  const text = "I'm Vadarly, a voice assistant. How may I help you?";
  let index = 0;

  const animateText = () => {
    if (index < text.length) {
      textElement.textContent = textElement.textContent.slice(0, index) + text[index] + textElement.textContent.slice(index + 1);
      index++;
      setTimeout(animateText, index === 25 ? 350 : 60);
    }
  };

  setTimeout(animateText, 2700);
});

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.volume = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function wishMe() {
  const hour = new Date().getHours();
  if (hour < 12) {
    speak("Good Morning Boss...");
  } else if (hour < 17) {
    speak("Good Afternoon Master...");
  } else {
    speak("Good Evening Sir...");
  }
}

window.addEventListener("load", () => {
  speak("Initializing VADARLY...");
  wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
  const transcript = event.results[event.resultIndex][0].transcript.toLowerCase();
  content.textContent = transcript;
  takeCommand(transcript);
};

btn.addEventListener("click", () => {
  content.textContent = "Listening...";
  recognition.start();
});

stopBtn.addEventListener("click", () => {
  window.speechSynthesis.cancel();
});

function takeCommand(message) {
  if (message.includes("hey") || message.includes("hello")) {
    speak("Hello Sir, How May I Help You?");
  } else if (message.includes("open google")) {
    window.open("https://google.com", "_blank");
    speak("Opening Google...");
  } else if (message.includes("open youtube")) {
    window.open("https://youtube.com", "_blank");
    speak("Opening Youtube...");
  } else if (message.includes("what is your name") || message.includes("who are you")) {
    speak("My name is VADARLY, your voice assistant. I am here to assist you...");
  } else if (message.includes("what is") || message.includes("who is") || message.includes("what are")) {
    getSummary(message.replace(/(what is|who is|what are)/, "").trim());
  } else if (message.includes("time")) {
    speak(new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" }));
  } else if (message.includes("date")) {
    speak(new Date().toLocaleString(undefined, { month: "short", day: "numeric" }));
  } else if (message.includes("calculator")) {
    window.open("Calculator:///");
    speak("Opening Calculator...");
  } else if (message.match(/(add|subtract|multiply|divide)/)) {
    handleArithmetic(message);
  } else {
    getAnswerFromModel(message);
  }
}

function handleArithmetic(message) {
  let result;
  try {
    const words = message.split(" ");
    let num1, num2, operator;

    words.forEach(word => {
      if (!isNaN(word)) {
        if (num1 === undefined) {
          num1 = parseFloat(word);
        } else {
          num2 = parseFloat(word);
        }
      } else if (["add", "subtract", "multiply", "divide"].includes(word)) {
        operator = word === "add" ? "+" : word === "subtract" ? "-" : word === "multiply" ? "*" : "/";
      }
    });

    if (num1 !== undefined && num2 !== undefined && operator) {
      result = eval(`${num1} ${operator} ${num2}`);
      speak(`The result is ${result}`);
    } else {
      throw new Error("Invalid arithmetic command");
    }
  } catch (e) {
    speak("Sorry, I couldn't perform the arithmetic operation.");
  }
}

function getSummary(topic) {
  const sanitizedTopic = topic.replace(/[()]/g, ""); // Remove parentheses from topic
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${sanitizedTopic}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.extract) {
        speak(data.extract);
      } else {
        fallbackSearch(topic);
      }
    })
    .catch(() => {
      fallbackSearch(topic);
    });
}

function fallbackSearch(topic) {
  const query = encodeURIComponent(topic);
  const url = `https://api.duckduckgo.com/?q=${query}&format=json`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.Abstract) {
        speak(data.Abstract);
      } else {
        speak("Sorry, I couldn't find information on that topic.");
      }
    })
    .catch(() => {
      speak("Sorry, I couldn't retrieve the information.");
    });
}

function getAnswerFromModel(message) {
  const responses = {
    "how are you": "I am doing great, thank you!",
    "what is your purpose": "My purpose is to assist you with your tasks.",
    "tell me a joke": "Why don't scientists trust atoms? Because they make up everything!",
    "who created you": "I was created by a team of skilled developers."
  };

  const response = responses[message] || "Sorry, I don't have an answer for that.";
  speak(response);
}
