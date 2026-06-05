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
                    // Localized success notification
                    let successMsg = 'Thank you! We have received your request and will contact you within 24 hours.';
                    if (window.translations && window.translations[currentLang] && window.translations[currentLang].form_success) {
                        successMsg = window.translations[currentLang].form_success;
                    }
                    alert(successMsg);
                    contactForm.reset();
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
        mozosHora: 180,
        horasFijasExtra: 4
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
    const btnWhatsapp            = document.getElementById('btn-whatsapp');

    function updateCalculator() {
        if (!calcMenu || !calcPeople || !calcTimeStart || !calcTimeEnd) return;

        const menuType = calcMenu.value;
        let people = parseInt(calcPeople.value) || 0;
        if (people < 10) people = 10;

        // Hours
        const [sh, sm] = calcTimeStart.value.split(':').map(Number);
        const [eh, em] = calcTimeEnd.value.split(':').map(Number);
        let diff = (eh + em/60) - (sh + sm/60);
        if (diff < 0) diff += 24;
        const totalHours = diff + CONFIG.horasFijasExtra;

        // Staff
        const asadores  = 1;
        const asistentes = people <= 20 ? 1 : people <= 50 ? 2 : 3;
        const staffCost = (asadores * CONFIG.asadorHora + asistentes * CONFIG.asistenteHora) * totalHours;

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
            foodCost = cpp * people;
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

            const baseFoodCost = (meatKgPerPerson * meatPriceKg) * people;
            foodCost = baseFoodCost + extrasCost;
            const currentLang = localStorage.getItem('criollo_lang') || 'en';
            let label = 'Plate Asado';
            if (currentLang === 'es') label = 'Asado al Plato';
            if (currentLang === 'dk') label = 'Tallerken Asado';
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
        if(summaryLogisticsRow) {
            summaryLogisticsRow.style.display = 'flex';
            const currentLang = localStorage.getItem('criollo_lang') || 'en';
            let logisticsLabel = 'Logistics';
            if (currentLang === 'es') logisticsLabel = 'Logística';
            if (currentLang === 'dk') logisticsLabel = 'Logistik';
            summaryLogisticsRow.querySelector('span:first-child').textContent = logisticsLabel;
            summaryLogisticsRow.querySelector('span:last-child').textContent = `${logisticsCost.toLocaleString()} Kr`;
        }

        // Mozos (waitstaff - auto-calculated based on guests: 1 waiter every 15 people)
        let mozosCost = 0;
        let numMozos = 0;
        const mozosRow = document.getElementById('summary-mozos-row');
        if (calcMozos && calcMozos.checked) {
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

        const total = foodCost + staffCost + logisticsCost + mozosCost;
        
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
        msg += `🥩 *Menu:* ${menuType === 'callejera' ? 'Street Food' : 'Plate Asado'} (Premium Quality Meat)\n`;
        msg += `⏰ *Schedule:* ${calcTimeStart.value} to ${calcTimeEnd.value} (${totalHours}h total)\n`;
        msg += `🚚 *Logistics & Setup:* Flat fee included (${logisticsCost.toLocaleString()} Kr)\n`;
        if (mozosCost > 0) msg += `🤵 *Waitstaff:* ${numMozos} ${numMozos === 1 ? 'waiter' : 'waiters'} included\n`;
        msg += `\n💰 *Estimated Total:* ${Math.round(total).toLocaleString()} Kr\n\nI'd like to confirm availability and details.`;

        if (btnWhatsapp) {
            btnWhatsapp.onclick = () => window.open(`https://wa.me/4551999400?text=${encodeURIComponent(msg)}`, '_blank');
        }
    }

    const inputs = [calcMenu, calcPeople, calcTimeStart, calcTimeEnd, calcMozos, cbVerduras, cbEnsaladas, cbEntrada];
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
