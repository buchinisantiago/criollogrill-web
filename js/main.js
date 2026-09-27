// main.js — Criollo Grill

document.addEventListener('DOMContentLoaded', () => {

    // ─── FIRE CURSOR ───────────────────────────────────────────
    const canvas = document.getElementById('fire-cursor');
    const ctx = canvas.getContext('2d');

    let mouseX = -200, mouseY = -200;
    const particles = [];

    class FireParticle {
        constructor(x, y) {
            this.x = x + (Math.random() - 0.5) * 8;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = -(Math.random() * 3 + 1.5);
            this.life = 1;
            this.decay = Math.random() * 0.04 + 0.025;
            this.size = Math.random() * 10 + 6;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            this.vy *= 0.97; this.vx *= 0.98;
            this.life -= this.decay; this.size *= 0.97;
        }
        draw(ctx) {
            const alpha = Math.max(0, this.life);
            let r, g, b;
            if (alpha > 0.7) { r=255; g=240; b=100; }
            else if (alpha > 0.4) { r=255; g=140; b=0; }
            else { r=200; g=30; b=0; }
            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
            grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = grad; ctx.fill();
        }
    }

    function animateFire() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 5; i++) particles.push(new FireParticle(mouseX, mouseY));
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update(); particles[i].draw(ctx);
            if (particles[i].life <= 0) particles.splice(i, 1);
        }
        if (particles.length > 200) particles.splice(0, particles.length - 200);
        requestAnimationFrame(animateFire);
    }

    function setupCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    animateFire();


    // ─── MOBILE MENU ───────────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');
    const links     = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    links.forEach(link => link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }));


    // ─── NAVBAR SCROLL ─────────────────────────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });


    // ─── SCROLL REVEAL ─────────────────────────────────────────
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    reveals.forEach(el => revealObserver.observe(el));


    // ─── CONTACT FORM ──────────────────────────────────────────
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const orig = btn.textContent;
            
            // Localized sending state
            const currentLang = localStorage.getItem('criollo_lang') || 'en';
            let sendingText = 'Sending...';
            if (currentLang === 'es') sendingText = 'Enviando...';
            if (currentLang === 'dk') sendingText = 'Sender...';
            
            btn.textContent = sendingText; 
            btn.disabled = true;

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const event = document.getElementById('event').value;
            const message = document.getElementById('message').value;

            // Fetch to FormSubmit AJAX endpoint
            fetch("https://formsubmit.co/ajax/info@criollogrill.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    event: event,
                    message: message,
                    _cc: "buchinisantiago@gmail.com",
                    _subject: `New Event Quote Request - ${name}`
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success === "true" || data.success === true) {
                    contactForm.reset();
                    // Redirect to Thank You page
                    window.location.href = 'gracias.html';
                } else {
                    alert("Error: " + (data.message || "Failed to send email. Please try again."));
                }
            })
            .catch(err => {
                console.error("FormSubmit Error:", err);
                alert("Failed to send email. Please check your connection and try again.");
            })
            .finally(() => {
                btn.textContent = orig; 
                btn.disabled = false;
            });
        });
    }


    // ─── SUPABASE CALCULATOR ───────────────────────────────────
    const SUPABASE_URL      = 'https://qgriwpjsslovkkmnlntg.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_ZnEVeUYjF7ZII5An9ku5rw_1CrNo3Gl';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    let CONFIG = {
        carnePremiumKg: 210,
        panPorPersona: 10,
        aderezosPorPersona: 6,
        packagingPorPersona: 8,
        ensaladaKg: 60,
        picadaKg: 100,
        verdurasPorPersona: 15,
        asadorHora: 240,
        asistenteHora: 200,
        logistica: 3500,
        mozosHora: 180
    };

    async function loadConfig() {
        try {
            const { data, error } = await supabase
                .from('criollo_config').select('*').eq('id', 1).single();
            if (data && !error) {
                CONFIG = { ...CONFIG, ...data };
                if (window.translations && CONFIG.logistica !== 3500) {
                    const cost = CONFIG.logistica.toLocaleString();
                    window.translations.en.calc_log_flat_note = `A flat fee of ${cost} DKK is automatically added for transportation, professional setup and teardown of the grill.`;
                    window.translations.es.calc_log_flat_note = `Se cobra una tarifa fija de ${cost} DKK por el traslado, armado y desarmado profesional de la parrilla.`;
                    window.translations.dk.calc_log_flat_note = `Et fast gebyr på ${cost} DKK tilføjes automatisk for transport, professionel opsætning og nedtagning af grillen.`;
                    if (window.applyLang) window.applyLang(localStorage.getItem('criollo_lang') || 'en');
                }
            }
        } catch (err) { console.error('Error loading config:', err); }
        updateCalculator();
    }
    
    window.addEventListener('languageChanged', updateCalculator);

    const calcMenu      = document.getElementById('calc-menu');
    const calcPeople    = document.getElementById('calc-people');
    const calcTimeStart = document.getElementById('calc-time-start');
    const calcTimeFood = document.getElementById('calc-time-food');
    const calcTimeEnd   = document.getElementById('calc-time-end');

    const calcMozos     = document.getElementById('calc-mozos');
    const extrasPlato   = document.getElementById('extras-plato');
    const cbVerduras    = document.getElementById('extra-verduras');
    const cbEnsaladas   = document.getElementById('extra-ensaladas');
    const cbEntrada     = document.getElementById('extra-entrada');

    const summaryMenuName        = document.getElementById('summary-menu-name');
    const summaryMenuPrice       = document.getElementById('summary-menu-price');
    const summaryExtrasContainer = document.getElementById('summary-extras-container');
    const summaryStaffName       = document.getElementById('summary-staff-name');
    const summaryStaffPrice      = document.getElementById('summary-staff-price');
    const summaryLogisticsRow    = document.getElementById('summary-logistics-row');
    const summaryTotal           = document.getElementById('summary-total');
    const diyRec                 = document.getElementById('diy-recommendation');
    const btnWhatsapp            = document.getElementById('btn-whatsapp');

    function updateCalculator() {
        if (!calcMenu || !calcPeople || !calcTimeStart || !calcTimeEnd || !calcTimeFood) return;

        const menuType = calcMenu.value;
        let people = parseInt(calcPeople.value) || 0;
        if (people < 10) people = 10;

        // Hours
        const totalHours = 6; // Fixed at 6 hours based on request

        // Staff
        let asadores  = 1;
        let asistentes = people <= 20 ? 1 : people <= 50 ? 2 : 3;
        let staffCost = (asadores * CONFIG.asadorHora + asistentes * CONFIG.asistenteHora) * totalHours;
        
        if (menuType === 'hazlo-tu-mismo') {
            asadores = 0;
            asistentes = 0;
            staffCost = 0;
        }

        // Food — always premium quality
        const meatPriceKg = CONFIG.carnePremiumKg;
        let foodCost = 0;
        summaryExtrasContainer.innerHTML = '';

        if (menuType === 'callejera') {
            extrasPlato.style.display = 'none';
            if(cbVerduras) cbVerduras.checked = false;
            if(cbEnsaladas) cbEnsaladas.checked = false;
            if(cbEntrada) cbEntrada.checked = false;
            // 250g meat/person + bread + sauces + packaging
            const cpp = (0.25 * meatPriceKg) + CONFIG.panPorPersona + CONFIG.aderezosPorPersona + CONFIG.packagingPorPersona;
            foodCost = (cpp * people) * 1.05; // 5% extra margin on food
            const currentLang = localStorage.getItem('criollo_lang') || 'en';
            let label = 'Street Food Menu';
            if (currentLang === 'es') label = 'Menú Street Food';
            if (currentLang === 'dk') label = 'Street Food Menu';
            if(summaryMenuName) summaryMenuName.textContent = `${label} (${people} pax)`;
            if(summaryMenuPrice) summaryMenuPrice.textContent = `${Math.round(foodCost).toLocaleString()} Kr`;
        } else {
            extrasPlato.style.display = 'block';
            let meatKgPerPerson = 0.4; // 400g/person plate asado
            let extrasCost = 0;
            const extrasList = [];

            if (cbEntrada && cbEntrada.checked) {
                meatKgPerPerson = 0.3;
                extrasCost += ((0.1 * CONFIG.picadaKg) + (0.1 * CONFIG.ensaladaKg)) * people;
                extrasList.push('Cheese/Deli Starter');
            } else if (cbEnsaladas && cbEnsaladas.checked) {
                meatKgPerPerson = 0.3;
                extrasCost += (0.2 * CONFIG.ensaladaKg) * people;
                extrasList.push('Premium Salads');
            }
            if (cbVerduras && cbVerduras.checked) {
                extrasCost += CONFIG.verdurasPorPersona * people;
                extrasList.push('Grilled Veg Side');
            }

            let baseFoodCost = (meatKgPerPerson * meatPriceKg) * people;
            baseFoodCost *= 1.05; // 5% extra margin
            extrasCost *= 1.05; // 5% extra margin on extras
            foodCost = baseFoodCost + extrasCost;
            const currentLang = localStorage.getItem('criollo_lang') || 'en';
            let label = 'Plate Asado';
            if (menuType === 'hazlo-tu-mismo') {
                label = 'Grill it Yourself';
                if (currentLang === 'es') label = 'Hazlo tú mismo';
                if (currentLang === 'dk') label = 'Grill Det Selv';
            } else {
                if (currentLang === 'es') label = 'Asado al Plato';
                if (currentLang === 'dk') label = 'Tallerken Asado';
            }
            if(summaryMenuName) summaryMenuName.textContent = `${label} (${people} pax)`;
            if(summaryMenuPrice) summaryMenuPrice.textContent = `${Math.round(baseFoodCost).toLocaleString()} Kr`;

            if (extrasCost > 0) {
                const div = document.createElement('div');
                div.className = 'summary-row';
                const currentLang = localStorage.getItem('criollo_lang') || 'en';
                let addOnLabel = '+ Add-ons selected';
                if (currentLang === 'es') addOnLabel = '+ Adicionales seleccionados';
                if (currentLang === 'dk') addOnLabel = '+ Tilvalg valgt';
                div.innerHTML = `<span>${addOnLabel}</span><span>${Math.round(extrasCost).toLocaleString()} Kr</span>`;
                summaryExtrasContainer.appendChild(div);
            }
        }

        // Logistics (Flat delivery, setup & teardown fee is always included)
        let logisticsCost = CONFIG.logistica || 3500;
        let logisticsLabel = 'Logistics';
        if (menuType === 'hazlo-tu-mismo') {
            logisticsCost = 300;
            logisticsLabel = 'Delivery';
        }
        
        if(summaryLogisticsRow) {
            summaryLogisticsRow.style.display = 'flex';
            const currentLang = localStorage.getItem('criollo_lang') || 'en';
            
            if (menuType !== 'hazlo-tu-mismo') {
                if (currentLang === 'es') logisticsLabel = 'Logística';
                if (currentLang === 'dk') logisticsLabel = 'Logistik';
            }
            summaryLogisticsRow.querySelector('span:first-child').textContent = logisticsLabel;
            summaryLogisticsRow.querySelector('span:last-child').textContent = `${logisticsCost.toLocaleString()} Kr`;
        }


        // Packaging (30% of food cost for Grill it Yourself)
        let packagingCost = 0;
        const summaryPackagingRow = document.getElementById('summary-packaging-row');
        if (menuType === 'hazlo-tu-mismo') {
            packagingCost = foodCost * 0.30;
            if (summaryPackagingRow) {
                summaryPackagingRow.style.display = 'flex';
                const currentLang = localStorage.getItem('criollo_lang') || 'en';
                let pkgLabel = 'Packaging';
                if (currentLang === 'es') pkgLabel = 'Embalaje';
                if (currentLang === 'dk') pkgLabel = 'Emballage';
                summaryPackagingRow.querySelector('span:first-child').textContent = pkgLabel;
                summaryPackagingRow.querySelector('span:last-child').textContent = `${Math.round(packagingCost).toLocaleString()} Kr`;
            }
        } else {
            if (summaryPackagingRow) summaryPackagingRow.style.display = 'none';
        }

        // Mozos (waitstaff - auto-calculated based on guests: 1 waiter every 15 people)
        let mozosCost = 0;
        let numMozos = 0;
        const mozosRow = document.getElementById('summary-mozos-row');
        if (calcMozos && calcMozos.checked && menuType !== 'hazlo-tu-mismo') {
            numMozos = Math.ceil(people / 15);
            mozosCost = numMozos * CONFIG.mozosHora * totalHours;
            if (mozosRow) {
                mozosRow.style.display = 'flex';
                mozosRow.querySelector('span:last-child').textContent = `${Math.round(mozosCost).toLocaleString()} Kr`;
                
                // Dynamic translation based on current selected language for waitstaff
                const currentLang = localStorage.getItem('criollo_lang') || 'en';
                let labelText = `Waitstaff (${numMozos} waiters × ${totalHours}h)`;
                if (currentLang === 'es') {
                    const word = numMozos === 1 ? 'mozo' : 'mozos';
                    labelText = `Mozos (${numMozos} ${word} × ${totalHours}h)`;
                } else if (currentLang === 'dk') {
                    const word = numMozos === 1 ? 'tjener' : 'tjenere';
                    labelText = `Servering (${numMozos} ${word} × ${totalHours}t)`;
                }
                mozosRow.querySelector('span:first-child').textContent = labelText;
            }
        } else {
            if (mozosRow) mozosRow.style.display = 'none';
        }

        let total = foodCost + staffCost + logisticsCost + mozosCost + packagingCost;
        let markup = people <= 35 ? 1.15 : 1.18;
        total = total * markup; // Apply dynamic markup
        total = total * 0.92; // Apply global 8% discount
        
        // --- APPLY MINIMUM PRICE FLOORS ---
        let currentPerPerson = total / people;
        if (menuType === 'plato' && currentPerPerson < 295) {
            total = 295 * people;
        } else if (menuType === 'callejera' && currentPerPerson < 280) {
            total = 280 * people;
        }
        
        const currentLang = localStorage.getItem('criollo_lang') || 'en';
        let staffLabel = 'Staff';
        let grillLabel = 'Grillmaster';
        let asstLabel = 'Assist.';
        if (currentLang === 'es') { staffLabel = 'Personal'; grillLabel = 'Parrillero'; asstLabel = 'Ayu.'; }
        if (currentLang === 'dk') { staffLabel = 'Personale'; grillLabel = 'Grillmester'; asstLabel = 'Ass.'; }
        if (summaryStaffName) summaryStaffName.textContent = `${staffLabel} (${totalHours}h — ${asadores} ${grillLabel}, ${asistentes} ${asstLabel})`;
        if (summaryStaffPrice) summaryStaffPrice.textContent = `${Math.round(staffCost).toLocaleString()} Kr`;
        if (summaryTotal) summaryTotal.textContent = `${Math.round(total).toLocaleString()} Kr`;

        // Update Price per Person
        const summaryPerPerson = document.getElementById('summary-per-person');
        if (summaryPerPerson) {
            const perPerson = Math.round(total / people);
            let personLabel = '/ person';
            if (currentLang === 'es') personLabel = '/ persona';
            if (currentLang === 'dk') personLabel = '/ person';
            summaryPerPerson.textContent = `${perPerson.toLocaleString()} Kr ${personLabel}`;
        }

        // WhatsApp message
        let msg = `Hello Criollo Grill! I'd like a quote:\n\n`;
        msg += `👥 *People:* ${people}\n`;
        msg += `🥩 *Menu:* ${menuType === 'callejera' ? 'Street Food' : menuType === 'hazlo-tu-mismo' ? 'Grill it Yourself' : 'Plate Asado'} (Premium Quality Meat)\n`;
        msg += `⏰ *Schedule:* Event: ${calcTimeStart.value} | Food: ${calcTimeFood.value} | End: ${calcTimeEnd.value} (6h total)\n`;
        msg += `🚚 *Logistics & Setup:* Flat fee included (${logisticsCost.toLocaleString()} Kr)\n`;
        if (packagingCost > 0) msg += `📦 *Packaging:* ${Math.round(packagingCost).toLocaleString()} Kr\n`;
        if (mozosCost > 0) msg += `🤵 *Waitstaff:* ${numMozos} ${numMozos === 1 ? 'waiter' : 'waiters'} included\n`;
        msg += `\n💰 *Estimated Total:* ${Math.round(total).toLocaleString()} Kr\n\nI'd like to confirm availability and details.`;

        if (btnWhatsapp) {
            btnWhatsapp.onclick = () => {
                const finalUrl = `https://wa.me/4551999400?text=${encodeURIComponent(msg)}`;
                if (typeof window.gtagSendEventBlank === 'function') {
                    window.gtagSendEventBlank(finalUrl);
                } else {
                    window.open(finalUrl, '_blank');
                }
                setTimeout(() => {
                    window.location.href = 'gracias.html';
                }, 800);
            };
        }
    }

    const inputs = [calcMenu, calcPeople, calcTimeStart, calcTimeFood, calcTimeEnd, calcMozos, cbVerduras, cbEnsaladas, cbEntrada];
    inputs.forEach(input => {
        if (input) {
            const evt = (input.tagName === 'SELECT' || input.type === 'checkbox') ? 'change' : 'input';
            input.addEventListener(evt, updateCalculator);
        }
    });


    if (calcMenu) loadConfig();


    // ─── EVENTOS CAROUSEL ──────────────────────────────────────
    const track  = document.getElementById('carouselTrack');
    const slides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');

    if (track && slides.length) {
        let current = 0;
        const total = slides.length;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Photo ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });

        function goTo(index) {
            current = (index + total) % total;
            track.style.transform = `translateX(-${current * 100}%)`;
            document.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === current));
        }

        prevBtn.addEventListener('click', () => goTo(current - 1));
        nextBtn.addEventListener('click', () => goTo(current + 1));

        let touchStartX = 0;
        track.parentElement.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.parentElement.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
        });

        let autoPlay = setInterval(() => goTo(current + 1), 4000);
        const carousel = document.getElementById('eventosCarousel');
        carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
        carousel.addEventListener('mouseleave', () => { autoPlay = setInterval(() => goTo(current + 1), 4000); });
    }
});
// --- WHATSAPP WIDGET ---
document.addEventListener('DOMContentLoaded', () => {
    // Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .wa-widget {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }
        .wa-button {
            width: 60px;
            height: 60px;
            background-color: #25D366;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: transform 0.3s ease;
        }
        .wa-button:hover {
            transform: scale(1.1);
        }
        .wa-chat-box {
            width: 320px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.2);
            overflow: hidden;
            margin-bottom: 20px;
            display: none;
            flex-direction: column;
            transform-origin: bottom right;
            animation: wa-pop 0.3s ease forwards;
        }
        @keyframes wa-pop {
            0% { opacity: 0; transform: scale(0.5); }
            100% { opacity: 1; transform: scale(1); }
        }
        .wa-chat-box.active {
            display: flex;
        }
        .wa-header {
            background-color: #075E54;
            color: white;
            padding: 15px;
            display: flex;
            align-items: center;
            gap: 12px;
            position: relative;
        }
        .wa-avatar img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: contain;
            background: #fff;
            padding: 2px;
        }
        .wa-header-info {
            display: flex;
            flex-direction: column;
        }
        .wa-header-info strong {
            font-size: 1rem;
            font-weight: 600;
        }
        .wa-header-info span {
            font-size: 0.8rem;
            opacity: 0.8;
        }
        .wa-close {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0.7;
        }
        .wa-close:hover { opacity: 1; }
        .wa-body {
            padding: 20px;
            background-color: #e5ddd5;
            background-image: url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png");
            height: 180px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        }
        .wa-message {
            background: #fff;
            padding: 12px 15px;
            border-radius: 0 12px 12px 12px;
            font-size: 0.95rem;
            color: #303030;
            max-width: 85%;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            position: relative;
            margin-top: auto;
        }
        .wa-message::before {
            content: '';
            position: absolute;
            top: 0;
            left: -8px;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 8px 8px 0;
            border-color: transparent #fff transparent transparent;
        }
        .wa-footer {
            padding: 10px;
            background: #f0f0f0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .wa-footer input {
            flex: 1;
            border: none;
            padding: 12px 15px;
            border-radius: 20px;
            outline: none;
            font-size: 0.95rem;
            color: #333;
        }
        .wa-footer button {
            background: #008f68;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: background 0.2s;
        }
        .wa-footer button:hover { background: #007a58; }
        
        @media (max-width: 768px) {
            .wa-widget { bottom: 20px; right: 20px; }
        }
    `;
    document.head.appendChild(style);

    // Inject HTML
    const widget = document.createElement('div');
    widget.className = 'wa-widget';
    widget.id = 'wa-widget';
    
    // Check lang for greeting
    const currentLang = localStorage.getItem('criollo_lang') || 'en';
    let greeting = "Hola ¿cómo estás? ¿te puedo ayudar?";
    if (currentLang === 'en') greeting = "Hi, how are you? How can I help you?";
    if (currentLang === 'dk') greeting = "Hej, hvordan har du det? Kan jeg hjælpe dig?";

    widget.innerHTML = `
        <div class="wa-chat-box" id="wa-chat-box">
            <div class="wa-header">
                <div class="wa-avatar">
                    <img src="img/Criollo 2.png" alt="Criollo Grill">
                </div>
                <div class="wa-header-info">
                    <strong>Criollo Grill</strong>
                    <span>Online</span>
                </div>
                <button class="wa-close" id="wa-close">&times;</button>
            </div>
            <div class="wa-body">
                <div class="wa-message">${greeting}</div>
            </div>
            <div class="wa-footer">
                <input type="text" id="wa-input" placeholder="Escribe un mensaje..." autocomplete="off">
                <button id="wa-send">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                </button>
            </div>
        </div>
        <div class="wa-button" id="wa-button">
            <svg viewBox="0 0 24 24" width="35" height="35" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.739-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.019-5.117-2.877-6.977-1.858-1.859-4.332-2.881-6.973-2.882-5.441 0-9.867 4.42-9.871 9.864-.001 1.77.464 3.498 1.348 5.048l-.995 3.637 3.733-.979zm11.233-7.666c-.301-.15-1.782-.879-2.056-.979-.275-.1-.475-.15-.675.15-.2.3-.775.979-.95 1.179-.175.2-.35.225-.65.075-.3-.15-1.266-.467-2.41-1.485-.89-.793-1.49-1.773-1.665-2.073-.175-.3-.019-.462.13-.611.135-.134.3-.35.45-.525.15-.175.2-.3.3-.5s.05-.375-.025-.525C10.944 8.784 10.319 7.24 10.057 6.6c-.256-.615-.514-.532-.705-.542-.182-.01-.39-.01-.599-.01-.208 0-.547.078-.833.39-.286.313-1.094 1.07-1.094 2.61s1.119 3.025 1.275 3.235c.156.21 2.201 3.364 5.333 4.717.745.322 1.327.514 1.78.658.748.238 1.43.204 1.97.124.6-.09 1.782-.729 2.03-1.432.249-.703.249-1.305.174-1.432-.075-.127-.275-.202-.575-.352z"/>
            </svg>
        </div>
    `;
    document.body.appendChild(widget);

    // Logic
    const waBtn = document.getElementById('wa-button');
    const waChat = document.getElementById('wa-chat-box');
    const waClose = document.getElementById('wa-close');
    const waSend = document.getElementById('wa-send');
    const waInput = document.getElementById('wa-input');

    waBtn.addEventListener('click', () => {
        waChat.classList.toggle('active');
        if (waChat.classList.contains('active')) {
            setTimeout(() => waInput.focus(), 300);
        }
    });

    waClose.addEventListener('click', () => {
        waChat.classList.remove('active');
        sessionStorage.setItem('wa_closed', 'true');
    });

    const sendMsg = () => {
        let text = waInput.value.trim();
        if(!text) return;
        const url = 'https://wa.me/4551999400?text=' + encodeURIComponent(text);
        if (typeof window.gtagSendEventBlank === 'function') {
            window.gtagSendEventBlank(url);
        } else {
            window.open(url, '_blank');
        }
        waInput.value = '';
        waChat.classList.remove('active');
    };

    waSend.addEventListener('click', sendMsg);
    waInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') sendMsg();
    });

    // Auto open after 6 seconds
    setTimeout(() => {
        if(!waChat.classList.contains('active') && !sessionStorage.getItem('wa_closed')) {
            waChat.classList.add('active');
        }
    }, 6000);
});
