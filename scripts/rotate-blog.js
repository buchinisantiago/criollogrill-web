const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// The section we want to target
const regex = /<div class="grid" style="grid-template-columns: repeat\(auto-fit, minmax\(300px, 1fr\)\);">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>\s*<!-- COTIZADOR -->/i;
const match = content.match(regex);

if (match) {
    let gridContent = match[1];
    
    // Split the cards
    // Assuming each card starts with <div class="card reveal">
    const cards = gridContent.split(/(?=<div class="card reveal">)/).filter(c => c.trim().length > 0);
    
    if (cards.length > 1) {
        // Rotate array: move the first item to the end
        const firstCard = cards.shift();
        cards.push(firstCard);
        
        let newGridContent = cards.join('');
        
        // Add a hidden timestamp so git always detects a change (to trigger movement for SEO)
        const timestamp = new Date().toISOString();
        newGridContent += `\n                <!-- Last auto-update: ${timestamp} -->\n            `;
        
        // Replace in content
        const replacement = `<div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">\n${newGridContent}</div>\n        </div>\n    </section>\n\n    <!-- COTIZADOR -->`;
        content = content.replace(match[0], replacement);
        
        fs.writeFileSync(indexPath, content, 'utf8');
        console.log(`Blog rotated successfully. Timestamp: ${timestamp}`);
    } else {
        console.log("Could not find enough cards to rotate.");
    }
} else {
    console.log("Could not find the blog grid in index.html");
}
