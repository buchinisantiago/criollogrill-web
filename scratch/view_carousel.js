const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const trackMatch = html.match(/(<div class="carousel-track" id="carouselTrack">)([\s\S]*?)(<\/div>)/);
let markdown = '# Carousel Images\n\n';
if (trackMatch) {
    const images = trackMatch[2].match(/src="([^"]+)"/g);
    if (images) {
        images.forEach(img => {
            const src = img.substring(5, img.length - 1);
            markdown += '## ' + src + '\n';
            markdown += '![' + src + '](file:///C:/xampp/htdocs/CriolloGrill/' + src + ')\n\n';
        });
    }
}
fs.writeFileSync('C:/Users/buchi/.gemini/antigravity/brain/dbd37b12-e317-4c49-861b-3b3582afa5c2/view_carousel.md', markdown);
