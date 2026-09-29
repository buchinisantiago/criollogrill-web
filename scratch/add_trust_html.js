const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const bannerHTML = `
    <!-- TRUST BANNER -->
    <section class="trust-banner">
        <div class="container trust-container">
            <div class="trust-text">
                <h2 data-i18n="trust_title">Top-class service</h2>
                <p data-i18n="trust_desc">At Criollo Grill, we are committed to giving you Copenhagen's best Argentine BBQ experience with fantastic service and personal attention.</p>
            </div>
            <div class="trust-ratings">
                <div class="trust-rating-item">
                    <div class="stars">
                        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    </div>
                    <span class="trust-label" data-i18n="trust_google">5.0 on Google reviews</span>
                </div>
            </div>
        </div>
    </section>
`;

html = html.replace('<!-- ESPECIALIDADES -->', bannerHTML + '\n    <!-- ESPECIALIDADES -->');
fs.writeFileSync('index.html', html);
