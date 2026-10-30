const fs = require('fs');
const path = require('path');

const dir = 'c:\\xampp\\htdocs\\CriolloGrill';
const files = fs.readdirSync(dir);

let count = 0;
files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(dir, file);
        let html = fs.readFileSync(filePath, 'utf8');
        if (html.includes('main.js?v=22')) {
            html = html.replace(/main\.js\?v=22/g, 'main.js?v=23');
            fs.writeFileSync(filePath, html, 'utf8');
            count++;
        }
    }
});
console.log(`Bumped main.js version to v=23 in ${count} HTML files`);
