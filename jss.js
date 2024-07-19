const btn = document.querySelector('.talk')
const content = document.querySelector('.content')

document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('animated-text');
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

document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('animated-para');
    const text = "I'm Vadarly a voice assistant,How may i help you?";
    let index = 0;

    const animateText = () => {
        if (index < text.length) {
            textElement.textContent = textElement.textContent.slice(0, index) + text[index] + textElement.textContent.slice(index + 1);
            index++;
		if (index===12){
			setTimeout(animateText,600); 
		}
		else if (index===38){
			setTimeout(animateText,400);
		}
		else{
			setTimeout(animateText,60);
		}
	}
};

    setTimeout(animateText, 2700); 
});


function speak(text){
    const text_speak = new SpeechSynthesisUtterance(text);

    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
}

function wishMe(){
    var day = new Date();
    var hour = day.getHours();

    if(hour>=0 && hour<12){
        speak("Good Morning Boss...")
    }

    else if(hour>12 && hour<17){
        speak("Good Afternoon Master...")
    }

    else{
        speak("Good Evenining Sir...")
    }

}


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition =  new SpeechRecognition();

recognition.onresult = (event)=>{
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());

}
window.addEventListener('load', ()=>{
    speak("Initializing VADARLY..");
    wishMe();
});


btn.addEventListener('click', ()=>{
    content.textContent = "Listening...."
    recognition.start();
})

function takeCommand(message){
    if(message.includes('hey') || message.includes('hello')){
        speak("Hello Sir, How May I Help You?");
    }
    else if(message.includes("open google")){
        window.open("https://google.com", "_blank");
        speak("Opening Google...")
    }
    else if(message.includes("open youtube")){
        window.open("https://youtube.com", "_blank");
        speak("Opening Youtube...")
    }
    else if(message.includes('what is your name') || message.includes('who are you')) {
        speak("my name is vadarly voice assistant I am here to assist you...")
    }
    else if(message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "This is what i found on internet regarding " + message;
	    speak(finalText);
  
    }

    else if(message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "")}`, "_blank");
        const finalText = "This is what i found on wikipedia regarding " + message;
        speak(finalText);
    }

    else if(message.includes('time')) {
        const time = new Date().toLocaleString(undefined, {hour: "numeric", minute: "numeric"})
        const finalText = time;
        speak(finalText);
    }

    else if(message.includes('date')) {
        const date = new Date().toLocaleString(undefined, {month: "short", day: "numeric"})
        const finalText = date;
        speak(finalText);
    }

    else if(message.includes('calculator')) {
        window.open('Calculator:///')
        const finalText = "Opening Calculator..";
        speak(finalText);
    }

    else {
        speak("I cant understand you,sorry please try again..")
    }
}
