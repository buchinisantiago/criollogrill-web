const fs = require('fs');
const index = fs.readFileSync('index.html', 'utf8');

// The marker where we split header from content
const heroMarker = '<!-- HERO SECTION -->';
let header = index.substring(0, index.indexOf(heroMarker));
const footer = index.substring(index.indexOf('<footer>'));

// Fix some paths if needed, but index.html paths are absolute/relative to root so it's fine.

const createPage = (filename, title, h1, introText, sections, bgImg) => {
    // Replace title
    let newHeader = header.replace(/<title>.*<\/title>/, '<title>' + title + '</title>');
    
    // Create the Hero
    let content = `
    <section class="hero" style="background-image: linear-gradient(to right, var(--bg-dark), rgba(8,8,8,0.7)), url('${bgImg}'); min-height: 60vh;">
        <div class="container hero-content" style="padding-top: 150px;">
            <h1 style="margin-bottom: 20px; text-transform: uppercase;">${h1}</h1>
            <p class="hero-sub" style="max-width: 800px; line-height: 1.6; font-size: 1.2rem;">${introText}</p>
            <a href="index.html#cotizar" class="btn-primary" style="margin-top: 30px; display: inline-block;">Get your ${h1} Quote</a>
        </div>
    </section>
    
    <section class="menu-section">
        <div class="container" style="max-width: 900px; margin: 0 auto;">
    `;
    
    sections.forEach(s => {
        content += `
            <h2 class="section-title" style="margin-top: 50px;"><span>${s.h2}</span></h2>
            <div style="font-size: 1.1rem; line-height: 1.8; color: var(--text-main);">${s.text}</div>
        `;
    });
    
    content += `
            <div style="text-align: center; margin-top: 60px;">
                <a href="index.html#cotizar" class="btn-primary">Get your Quote</a>
            </div>
        </div>
    </section>
    `;
    
    fs.writeFileSync(filename, newHeader + content + footer);
};

// 1. Grill Catering Copenhagen
createPage('grill-catering-copenhagen.html',
    'Grill Catering Copenhagen | Argentine Live Fire BBQ | Criollo Grill',
    'Grill Catering in Copenhagen',
    'Looking for grill catering in Copenhagen? Criollo Grill brings an authentic Argentine live-fire grill directly to your event. We provide freshly grilled meat, Argentine asado, chimichurri and homemade sides, prepared on-site by our grillmaster.',
    [
        {
            h2: 'Argentine Grill Catering',
            text: '<p>Experience the tradition of Argentine asado with a live grill at your event. Our grillmaster prepares selected cuts over live fire, creating an interactive food experience for your guests.</p>'
        },
        {
            h2: 'Live Grill Catering',
            text: '<p>We bring the fire to you. Our Tromen/Duomo grills are not just a cooking method; they are a visual and aromatic centerpiece that captivates your guests.</p><div style="display:flex; gap: 20px; margin-top: 20px; flex-wrap: wrap;"><img src="img/fotos/4.jpeg" style="flex: 1; min-width: 250px; border-radius: 8px; height: 250px; object-fit: cover;" alt="Live Grill Catering Copenhagen"><img src="img/fotos/asado-equipo.jpg" style="flex: 1; min-width: 250px; border-radius: 8px; height: 250px; object-fit: cover;" alt="Argentine Grillmaster"></div>'
        },
        {
            h2: 'Grill Catering for Events',
            text: '<ul style="list-style: none; padding: 0;"><li style="margin-bottom: 10px;">🔥 <strong>Weddings</strong>: Make your special day unforgettable with an elegant rustic grill.</li><li style="margin-bottom: 10px;">🔥 <strong>Corporate events</strong>: Impress your clients and team with an interactive dining experience.</li><li style="margin-bottom: 10px;">🔥 <strong>Private parties</strong>: Enjoy the party while our grillmaster handles the fire.</li><li style="margin-bottom: 10px;">🔥 <strong>Festivals & celebrations</strong>: High-volume, high-quality street food or plated service.</li></ul>'
        },
        {
            h2: 'What is included?',
            text: '<ul style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; list-style: none; padding: 0;"><li>✔️ Argentine grill</li><li>✔️ Professional Grillmaster</li><li>✔️ Premium meat preparation</li><li>✔️ Chimichurri & sauces</li><li>✔️ Homemade sides</li><li>✔️ Full setup</li><li>✔️ Logistics handling</li><li>✔️ Flexible service options</li></ul>'
        }
    ],
    'img/3.jpeg'
);

// 2. BBQ Catering Copenhagen
createPage('bbq-catering-copenhagen.html',
    'BBQ Catering Copenhagen | Argentine BBQ | Criollo Grill',
    'BBQ Catering in Copenhagen',
    'Criollo Grill provides authentic Argentine BBQ catering in Copenhagen and the surrounding area. We bring our live-fire grill to weddings, corporate events, private parties and festivals, cooking Argentine asado directly at your event.',
    [
        {
            h2: 'Argentine BBQ Catering',
            text: '<p>We do not simply deliver BBQ in trays. We bring the Argentine grill to your event and cook over live fire in front of your guests. It is a fully immersive culinary journey.</p>'
        },
        {
            h2: 'Live Fire BBQ',
            text: '<p>The crackle of the wood, the aroma of the smoke, and the perfect sear on the meat. Our Live Fire BBQ is designed for those who appreciate the true art of outdoor cooking.</p>'
        },
        {
            h2: 'BBQ for Weddings',
            text: '<p>Elevate your wedding banquet with an authentic BBQ experience. Perfect for both outdoor venues and elegant rustic settings across Copenhagen.</p>'
        },
        {
            h2: 'Corporate BBQ Catering',
            text: '<p>From summer company parties to team-building events, our corporate BBQ catering offers a relaxed yet highly professional catering solution.</p>'
        },
        {
            h2: 'Private BBQ Parties',
            text: '<p>Hosting a birthday, anniversary, or gathering? Let us take over the grilling so you can be a guest at your own party.</p>'
        },
        {
            h2: 'Argentine Asado Catering',
            text: '<p>More than a BBQ, an Asado is a ritual. Slow-cooked meats, choripanes, and fresh salads, all served straight from the fire to the plate.</p>'
        }
    ],
    'img/1.jpeg'
);
