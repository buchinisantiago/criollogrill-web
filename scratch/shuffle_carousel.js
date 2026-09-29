const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const trackMatch = html.match(/(<div class="carousel-track" id="carouselTrack">)([\s\S]*?)(<\/div>\s*<button class="carousel-btn carousel-prev")/);

if (trackMatch) {
    const trackStart = trackMatch[1];
    const trackContent = trackMatch[2];
    const trackEnd = trackMatch[3];

    const images = trackContent.match(/<img[^>]+class="carousel-slide"[^>]*>/g);

    if (images) {
        for (let i = images.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [images[i], images[j]] = [images[j], images[i]];
        }
        
        const newContent = '\n                        ' + images.join('\n                        ') + '\n                    ';
        html = html.replace(trackMatch[0], trackStart + newContent + trackEnd);
        fs.writeFileSync('index.html', html);
        console.log('Shuffled ' + images.length + ' images.');
    }
} else {
    console.log('Not found');
}
