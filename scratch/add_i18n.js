const fs = require('fs');
let content = fs.readFileSync('js/i18n.js', 'utf8');

content = content.replace(/hero_scroll:"Scroll",/g, 'hero_scroll:"Scroll",\n    trust_title:"Top-class service", trust_desc:"At Criollo Grill, we are committed to giving you Copenhagen\'s best Argentine BBQ experience with fantastic service and personal attention.", trust_google:"5.0 on Google reviews",');
content = content.replace(/hero_scroll:"Descubrir",/g, 'hero_scroll:"Descubrir",\n    trust_title:"Servicio de primera clase", trust_desc:"En Criollo Grill, estamos comprometidos a brindarte la mejor experiencia de asado argentino en Copenhague con un servicio fantástico y atención personalizada.", trust_google:"5.0 en reseñas de Google",');
content = content.replace(/hero_scroll:"Udforsk",/g, 'hero_scroll:"Udforsk",\n    trust_title:"Førsteklasses service", trust_desc:"Hos Criollo Grill er vi dedikerede til at give dig Københavns bedste argentinske BBQ-oplevelse med fantastisk service og personlig opmærksomhed.", trust_google:"5.0 på Google anmeldelser",');

fs.writeFileSync('js/i18n.js', content);
