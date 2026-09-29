const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/<img src="img\/fotos\/costillar_verduras_3\.jpg"[^>]*>\s*/g, '');
fs.writeFileSync('index.html', html);
console.log('Removed costillar_verduras_3.jpg');
