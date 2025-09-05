import CodeBox from "../components/CodeBox";

export default function Home() {
  const codeSnippets = [
    {
      title: "localhost:3000-clima-d1b3-d16ef0-fe6345-e",
      filename: "script.js", 
      code: ` // Fetch live API weather data

 async function getWeather() {
  
  // API key for OpenWeatherMap API
  const API_KEY = "YOUR_API_KEY";
  
  // URL for the OpenWeatherMap API
  const url = "https://api.openweathermap.org/data/2.5/weather";
  
  const response = await fetch(url);
  return await response.json();
}`,
      caption: "Ask AI. Press ⌘ + K anytime to ask inbuilt assistant to help you with writing code.",
      files: [
        "33772200-5286-4e4",
        "weatherApp-e458-428", 
        "untitled-1",
        "SpellCheck.js",
        "outline-environment",
        "custom-theme-stored",
        "CounterStyle.css",
        "weather-app-script",
        "GoogleAuth.js"
      ]
    },
    {
      title: "gsapText.js",
      filename: "gsapText.js",
        code: ` gsap.registerPlugin(ScrollTrigger);

  // Function to animate elements with the attribute data-th-el="gsap-text"
  function animateTextElements() {
    
    // Select all elements with the attribute data-th-el="gsap-text"
    const textElements = document.querySelectorAll('[data-th-el="gsap-text"]');
    
    // Check if any elements were found
    if (textElements.length === 0) {
      console.warn('No elements found with the attribute data-th-el="gsap-text"');
      return; // Exit the function if no elements are found
    }`,
      caption: "Code Predictions. Get real-time code suggestions as you type for both Javascript and CSS.",
      files: []
    },
    {
      title: "721ef8bd-42a4-4e6b-b728-3e847137c368.js", 
      filename: "vimeoByVideo.js",
      code: ` //There is built in JS intellisense and AI code predictions`,
      caption: "Intellisense. Enjoy features like code highlighting, syntax suggestions, and autocompletion, just like in VS Code.",
      files: []
    },
    {
      title: "vimeoByVideo.js",
      filename: "vimeoByVideo.js",
      code: ` //There is built in JS intellisense and AI code predictions
console.log("Hello World");
console.error("This is an error message");`,
      caption: "Built in CDN. Your files are hosted on our fast, global CDN for seamless performance.",
      files: []
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#42a5f5] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1976d2] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 max-w-[1400px] mx-auto h-[calc(100vh-2rem)] relative z-10">
        {codeSnippets.map((snippet, i) => (
          <CodeBox
            key={i}
            title={snippet.title}
            filename={snippet.filename}
            code={snippet.code}
            caption={snippet.caption}
            files={snippet.files}
          />
        ))}
      </div>
    </main>
  );
}
