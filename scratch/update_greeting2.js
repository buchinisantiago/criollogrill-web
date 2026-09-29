const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');

// Replace the greetings
js = js.replace(/let greeting = "¡Hola! Somos un servicio de CATERING para eventos \(no somos restaurante\)\. ¿En qué te podemos ayudar\?";/, 'let greeting = "Hola, ¿cómo puedo ayudarte con la organización de tu evento?";');
js = js.replace(/if \(currentLang === 'en'\) greeting = "Hi! We are an event CATERING service \(we are not a restaurant\)\. How can we help you\?";/, 'if (currentLang === \'en\') greeting = "Hi, how can I help you organize your event?";');
js = js.replace(/if \(currentLang === 'dk'\) greeting = "Hej! Vi er en CATERING-virksomhed \(vi er ikke en restaurant\)\. Hvordan kan vi hjælpe dig\?";/, 'if (currentLang === \'dk\') greeting = "Hej, hvordan kan jeg hjælpe dig med at organisere dit arrangement?";');

// Replace the title
js = js.replace(/<strong>Criollo Grill<\/strong>/g, '<strong>CATERING CRIOLLO GRILL</strong>');

fs.writeFileSync('js/main.js', js, 'utf8');
console.log('Updated WhatsApp greeting and title');
