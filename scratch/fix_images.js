const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Use proper regex object to avoid syntax issues in replace_file_content
html = html.replace(/<div class=\"card-img\">\s*<\/div>/g, '<div class="card-img">\n                        <img src="img/fotos/asado-completo-copenhague.jpg" alt="Eventos en Copenhague">\n                    </div>');

// Remove tromen_wide_10 from carousel
html = html.replace(/<img src="img\/fotos\/tromen_wide_10\.jpg"[^>]*>\s*/g, '');

fs.writeFileSync('index.html', html);
console.log('Fixed');
