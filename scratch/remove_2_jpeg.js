const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/<img src="img\/fotos\/2\.jpeg"[^>]*>\s*/g, '');
fs.writeFileSync('index.html', html);
console.log('Removed 2.jpeg');
