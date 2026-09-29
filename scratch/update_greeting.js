const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');

const oldGreetingBlock = `let greeting = "Hola ¿cómo estás? ¿te puedo ayudar?";
    if (currentLang === 'en') greeting = "Hi, how are you? How can I help you?";
    if (currentLang === 'dk') greeting = "Hej, hvordan har du det? Kan jeg hjælpe dig?";`;

const newGreetingBlock = `let greeting = "¡Hola! Somos un servicio de CATERING para eventos (no somos restaurante). ¿En qué te podemos ayudar?";
    if (currentLang === 'en') greeting = "Hi! We are an event CATERING service (we are not a restaurant). How can we help you?";
    if (currentLang === 'dk') greeting = "Hej! Vi er en CATERING-virksomhed (vi er ikke en restaurant). Hvordan kan vi hjælpe dig?";`;

js = js.replace(oldGreetingBlock, newGreetingBlock);
fs.writeFileSync('js/main.js', js, 'utf8');
console.log('Updated WhatsApp greeting in main.js');
