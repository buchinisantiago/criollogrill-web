const fs = require('fs');
const index = fs.readFileSync('index.html', 'utf8');

const heroMarker = '<!-- HERO -->';
let header = index.substring(0, index.indexOf(heroMarker));
const footer = index.substring(index.indexOf('<footer>'));

const createPage = (filename, title, h1, introText, sections, bgImg) => {
    let newHeader = header.replace(/<title>.*<\/title>/, '<title>' + title + '</title>');
    
    let content = `
    <section class="hero" style="background-image: linear-gradient(to right, var(--bg-dark), rgba(8,8,8,0.7)), url('${bgImg}'); min-height: 60vh;">
        <div class="container hero-content" style="padding-top: 150px;">
            <h1 style="margin-bottom: 20px; text-transform: uppercase;">${h1}</h1>
            <p class="hero-sub" style="max-width: 800px; line-height: 1.6; font-size: 1.2rem;">${introText}</p>
            <a href="index.html#cotizar" class="btn-primary" style="margin-top: 30px; display: inline-block;">Get your Quote</a>
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
                <a href="index.html#cotizar" class="btn-primary">Calculate your Price Now</a>
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
            text: '<p>Experience the tradition of Argentine asado with a live grill at your event. If you are looking for a comprehensive <a href="bbq-catering-copenhagen.html">Argentinian BBQ catering</a> solution, our grillmaster prepares selected cuts over live fire, creating an interactive food experience for your guests.</p>'
        },
        {
            h2: 'Live Grill Catering',
            text: '<p>We bring the fire to you. Our Tromen/Duomo grills are not just a cooking method; they are a visual and aromatic centerpiece that captivates your guests. A true <a href="argentinian-grill-copenhagen.html">Argentinian Grill Copenhagen</a> experience.</p><div style="display:flex; gap: 20px; margin-top: 20px; flex-wrap: wrap;"><img src="img/fotos/4.jpeg" style="flex: 1; min-width: 250px; border-radius: 8px; height: 250px; object-fit: cover;" alt="Live Grill Catering Copenhagen"><img src="img/fotos/asado-equipo.jpg" style="flex: 1; min-width: 250px; border-radius: 8px; height: 250px; object-fit: cover;" alt="Argentine Grillmaster"></div>'
        },
        {
            h2: 'Grill Catering for Events',
            text: '<ul style="list-style: none; padding: 0;"><li style="margin-bottom: 10px;">🔥 <strong>Weddings</strong>: Make your special day unforgettable with an elegant rustic grill. Check out our <a href="wedding-catering-copenhagen.html">Wedding Catering</a> options.</li><li style="margin-bottom: 10px;">🔥 <strong>Corporate events</strong>: Impress your clients and team with an interactive dining experience via our <a href="corporate-catering-copenhagen.html">Corporate Catering</a>.</li><li style="margin-bottom: 10px;">🔥 <strong>Private parties</strong>: Enjoy the party while our grillmaster handles the fire.</li></ul>'
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
            text: '<p>We do not simply deliver BBQ in trays. If you need professional <a href="grill-catering-copenhagen.html">grill catering in Copenhagen</a>, we bring the Argentine grill to your event and cook over live fire in front of your guests. It is a fully immersive culinary journey.</p>'
        },
        {
            h2: 'Live Fire BBQ',
            text: '<p>The crackle of the wood, the aroma of the smoke, and the perfect sear on the meat. Our <a href="argentinian-grill-copenhagen.html">live-fire grill catering</a> is designed for those who appreciate the true art of outdoor cooking and authentic <a href="asado-catering-copenhagen.html">Argentine asado catering</a>.</p>'
        },
        {
            h2: 'BBQ for Events',
            text: '<p>Elevate your events with an authentic BBQ experience. Perfect for both outdoor venues and elegant rustic settings across Copenhagen. We specialize in both <a href="wedding-catering-copenhagen.html">Wedding Catering</a> and <a href="corporate-catering-copenhagen.html">Corporate Catering</a>.</p>'
        }
    ],
    'img/1.jpeg'
);

// 3. Argentinian Grill Copenhagen
createPage('argentinian-grill-copenhagen.html',
    'Argentinian Grill Copenhagen | Live Fire BBQ | Criollo Grill',
    'Argentinian Grill Copenhagen',
    'Discover the magic of a real Argentinian Grill in Copenhagen. Criollo Grill brings the passion of live fire and premium meats to your venue, delivering an authentic South American feast.',
    [
        {
            h2: 'The Authentic Argentinian Grill',
            text: '<p>Our <a href="grill-catering-copenhagen.html">grill catering in Copenhagen</a> revolves around the traditional Argentine method of cooking with wood and charcoal. This slow-cooking process guarantees tender, smoky, and flavorful meats.</p>'
        },
        {
            h2: 'A Culinary Show',
            text: '<p>When you book our <a href="bbq-catering-copenhagen.html">Argentinian BBQ catering</a>, you get more than food. The sight of the glowing embers and the smell of the asado is a spectacle that your guests will talk about for years.</p>'
        }
    ],
    'img/fotos/asador-trabajando.jpg'
);

// 4. Asado Catering Copenhagen
createPage('asado-catering-copenhagen.html',
    'Asado Catering Copenhagen | Traditional Argentine BBQ | Criollo Grill',
    'Asado Catering Copenhagen',
    'Celebrate like an Argentine with our specialized Asado Catering in Copenhagen. We bring the complete ritual of the asado—from choripanes to vacio—right to your backyard or event venue.',
    [
        {
            h2: 'Traditional Argentine Asado Catering',
            text: '<p>An asado is more than a meal; it is a cultural event. With our <a href="bbq-catering-copenhagen.html">Argentinian BBQ catering</a>, we handle the fire, the timing, and the cutting. You just enjoy the feast with your friends and family.</p>'
        },
        {
            h2: 'Perfect for Any Gathering',
            text: '<p>Whether you are planning a casual family reunion or looking for unique <a href="wedding-catering-copenhagen.html">Wedding Catering</a>, a live <a href="argentinian-grill-copenhagen.html">Argentinian Grill Copenhagen</a> experience fits perfectly. The relaxed yet elegant nature of an asado brings people together around the fire.</p>'
        }
    ],
    'img/fotos/asado-completo-copenhague.jpg'
);

// 5. Wedding Catering Copenhagen
createPage('wedding-catering-copenhagen.html',
    'Wedding Catering Copenhagen | BBQ & Asado Events | Criollo Grill',
    'Wedding Catering Copenhagen',
    'Make your wedding day truly memorable with Criollo Grill. Our live-fire wedding catering in Copenhagen offers a unique, elegant, and interactive dining experience for you and your guests.',
    [
        {
            h2: 'A Unique Wedding Banquet',
            text: '<p>Step away from traditional cold buffets. Our <a href="asado-catering-copenhagen.html">Argentine asado catering</a> brings warmth, aroma, and a rustic elegance to your wedding reception. We provide full <a href="grill-catering-copenhagen.html">grill catering in Copenhagen</a> ensuring everything runs smoothly.</p>'
        },
        {
            h2: 'Tailored to Your Big Day',
            text: '<p>We work closely with you to design a menu that suits your style. From premium cuts served on elegant boards to casual street-food style sandwiches for late-night snacks, our <a href="bbq-catering-copenhagen.html">live-fire grill catering</a> adapts to your wedding vision.</p>'
        }
    ],
    'img/fotos/carrusel_nuevo_1.jpg'
);

// 6. Corporate Catering Copenhagen
createPage('corporate-catering-copenhagen.html',
    'Corporate Catering Copenhagen | BBQ Team Building | Criollo Grill',
    'Corporate Catering Copenhagen',
    'Reward your team or impress your clients with exceptional corporate catering in Copenhagen. Criollo Grill provides a professional, high-quality Argentine BBQ experience for company events of all sizes.',
    [
        {
            h2: 'Corporate BBQ Events',
            text: '<p>Nothing builds camaraderie quite like sharing a fantastic meal around a fire. Our <a href="bbq-catering-copenhagen.html">Argentinian BBQ catering</a> is the perfect centerpiece for summer parties, team-building exercises, and milestone celebrations.</p>'
        },
        {
            h2: 'Professional and Reliable',
            text: '<p>We understand that corporate events require flawless execution. Our team provides comprehensive <a href="grill-catering-copenhagen.html">grill catering in Copenhagen</a>, handling logistics, setup, and service, so you can focus on networking and enjoying the <a href="argentinian-grill-copenhagen.html">Argentinian Grill Copenhagen</a> experience.</p>'
        }
    ],
    'img/fotos/carrusel_nuevo_2.jpg'
);
