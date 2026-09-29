const fs = require('fs');
const path = require('path');

const dir = 'c:\\xampp\\htdocs\\CriolloGrill';
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(dir, file);
        let html = fs.readFileSync(filePath, 'utf8');
        html = html.replace(/main\.js\?v=21/g, 'main.js?v=22');
        fs.writeFileSync(filePath, html, 'utf8');
    }
});
console.log('Bumped main.js version to v=22 in all HTML files');
