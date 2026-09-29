const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/<img src="img\/fotos\/grill_gloves_7\.jpg"[^>]*>\s*/g, '');
fs.writeFileSync('index.html', html);
console.log('Removed grill_gloves_7.jpg');
