const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/<img src="img\/fotos\/carrusel_nuevo_14\.jpg"[^>]*>\s*/g, '');
fs.writeFileSync('index.html', html);
console.log('Removed carrusel_nuevo_14.jpg');
