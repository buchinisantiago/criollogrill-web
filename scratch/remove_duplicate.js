const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/<img src="img\/fotos\/extra_picada_6\.jpg"[^>]*>\s*/g, '');
fs.writeFileSync('index.html', html);
console.log('Removed extra_picada_6.jpg');
