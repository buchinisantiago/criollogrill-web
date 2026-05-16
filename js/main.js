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
            this.x += this.vx;
            this.y += this.vy;
            this.vy *= 0.97;
            this.vx *= 0.98;
            this.life -= this.decay;
            this.size *= 0.97;
        }
        draw(ctx) {
            const alpha = Math.max(0, this.life);
            // Color shifts: white -> yellow -> orange -> red -> transparent
            let r, g, b;
            if (alpha > 0.7) { r = 255; g = 240; b = 100; }
            else if (alpha > 0.4) { r = 255; g = 140; b = 0; }
            else { r = 200; g = 30; b = 0; }

            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
            grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        }
    }

    function animateFire() {
        // Resize canvas to viewport
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '99999';

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Spawn new particles at cursor
        for (let i = 0; i < 4; i++) {
            particles.push(new FireParticle(mouseX, mouseY));
        }

        // Update and draw
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw(ctx);
            if (particles[i].life <= 0) particles.splice(i, 1);
        }

        // Limit particles
        if (particles.length > 200) particles.splice(0, particles.length - 200);

        requestAnimationFrame(animateFire);
    }

    // Resize canvas on load
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    animateFire();


    // ─── MOBILE MENU ───────────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');
    const links     = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });


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
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 100);
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
            btn.textContent = 'Enviando...';
            btn.disabled = true;
            setTimeout(() => {
                alert('¡Gracias por tu mensaje! Nos contactaremos pronto para armar tu evento en Criollo Grill.');
                contactForm.reset();
                btn.textContent = orig;
                btn.disabled = false;
            }, 1500);
        });
    }


    // ─── SUPABASE CALCULATOR ───────────────────────────────────
    const SUPABASE_URL      = 'https://qgriwpjsslovkkmnlntg.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_ZnEVeUYjF7ZII5An9ku5rw_1CrNo3Gl';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    let CONFIG = {
        carnePremiumKg: 210,
        carneEuropeaKg: 170,
        panPorPersona: 10,
        aderezosPorPersona: 6,
        packagingPorPersona: 8,
        ensaladaKg: 60,
        picadaKg: 100,
        verdurasPorPersona: 15,
        asadorHora: 240,
        asistenteHora: 200,
        logistica: 2000,
        horasFijasExtra: 4
    };

    async function loadConfig() {
        try {
            const { data, error } = await supabase
                .from('criollo_config')
                .select('*')
                .eq('id', 1)
                .single();
            if (data && !error) CONFIG = { ...CONFIG, ...data };
        } catch (err) {
            console.error('Error loading config:', err);
        }
        updateCalculator();
    }

    const calcMenu      = document.getElementById('calc-menu');
    const calcPeople    = document.getElementById('calc-people');
    const calcMeatType  = document.getElementById('calc-meat-type');
    const calcTimeStart = document.getElementById('calc-time-start');
    const calcTimeEnd   = document.getElementById('calc-time-end');
    const calcLogistics = document.getElementById('calc-logistics');
    const extrasPlato   = document.getElementById('extras-plato');
    const cbVerduras    = document.getElementById('extra-verduras');
    const cbEnsaladas   = document.getElementById('extra-ensaladas');
    const cbEntrada     = document.getElementById('extra-entrada');

    const summaryMenuName       = document.getElementById('summary-menu-name');
    const summaryMenuPrice      = document.getElementById('summary-menu-price');
    const summaryExtrasContainer= document.getElementById('summary-extras-container');
    const summaryStaffRow       = document.getElementById('summary-staff-row');
    const summaryStaffName      = document.getElementById('summary-staff-name');
    const summaryStaffPrice     = document.getElementById('summary-staff-price');
    const summaryLogisticsRow   = document.getElementById('summary-logistics-row');
    const summaryTotal          = document.getElementById('summary-total');
    const btnWhatsapp           = document.getElementById('btn-whatsapp');

    function updateCalculator() {
        if (!calcMenu || !calcPeople || !calcTimeStart || !calcTimeEnd) return;

        const menuType = calcMenu.value;
        let people = parseInt(calcPeople.value) || 0;
        if (people < 10) people = 10;

        const startParts = calcTimeStart.value.split(':');
        const endParts   = calcTimeEnd.value.split(':');
        let startHour = parseInt(startParts[0]) + parseInt(startParts[1]) / 60;
        let endHour   = parseInt(endParts[0])   + parseInt(endParts[1])   / 60;
        let diff = endHour - startHour;
        if (diff < 0) diff += 24;
        const totalHours = diff + CONFIG.horasFijasExtra;

        let asadores  = 1;
        let asistentes = people <= 20 ? 1 : people <= 50 ? 2 : 3;
        const staffCost = (asadores * CONFIG.asadorHora + asistentes * CONFIG.asistenteHora) * totalHours;

        const meatPriceKg = calcMeatType.value === 'premium' ? CONFIG.carnePremiumKg : CONFIG.carneEuropeaKg;
        let foodCost = 0;
        let extrasList = [];
        summaryExtrasContainer.innerHTML = '';

        if (menuType === 'callejera') {
            extrasPlato.style.display = 'none';
            cbVerduras.checked = cbEnsaladas.checked = cbEntrada.checked = false;
            const cpp = (0.25 * meatPriceKg) + CONFIG.panPorPersona + CONFIG.aderezosPorPersona + CONFIG.packagingPorPersona;
            foodCost = cpp * people;
            summaryMenuName.textContent = `Menú Callejera (${people} pax)`;
            summaryMenuPrice.textContent = `${foodCost.toLocaleString()} Kr`;
        } else {
            extrasPlato.style.display = 'block';
            let meatKgPerPerson = 0.4;
            let extrasCost = 0;

            if (cbEntrada.checked) {
                meatKgPerPerson = 0.3;
                extrasCost += ((0.1 * CONFIG.picadaKg) + (0.1 * CONFIG.ensaladaKg)) * people;
                extrasList.push('Entrada de Quesos/Fiambres');
            } else if (cbEnsaladas.checked) {
                meatKgPerPerson = 0.3;
                extrasCost += (0.2 * CONFIG.ensaladaKg) * people;
                extrasList.push('Ensaladas Premium');
            }
            if (cbVerduras.checked) {
                extrasCost += CONFIG.verdurasPorPersona * people;
                extrasList.push('Guarnición de Verduras');
            }

            const baseFoodCost = (meatKgPerPerson * meatPriceKg) * people;
            foodCost = baseFoodCost + extrasCost;
            summaryMenuName.textContent = `Asado al Plato (${people} pax)`;
            summaryMenuPrice.textContent = `${baseFoodCost.toLocaleString()} Kr`;

            if (extrasCost > 0) {
                const div = document.createElement('div');
                div.className = 'summary-row';
                div.innerHTML = `<span>+ Adicionales Seleccionados</span><span>${extrasCost.toLocaleString()} Kr</span>`;
                summaryExtrasContainer.appendChild(div);
            }
        }

        let logisticsCost = 0;
        let logisticsText = 'Retiro propio (Trailer/Van)';
        if (calcLogistics.value === 'delivery') {
            logisticsCost = CONFIG.logistica;
            summaryLogisticsRow.style.display = 'flex';
            logisticsText = 'Logística y envío de Criollo Grill';
        } else {
            summaryLogisticsRow.style.display = 'none';
        }

        const total = foodCost + staffCost + logisticsCost;
        if (summaryStaffName) summaryStaffName.textContent = `Personal (${totalHours}hs — ${asadores} Asador, ${asistentes} Asis.)`;
        if (summaryStaffPrice) summaryStaffPrice.textContent = `${staffCost.toLocaleString()} Kr`;
        if (summaryTotal) summaryTotal.textContent = `${total.toLocaleString()} Kr`;

        let msg = `Hola Criollo Grill! Quisiera consultar por un presupuesto:\n\n`;
        msg += `👥 *Personas:* ${people}\n`;
        msg += `🥩 *Menú:* ${menuType === 'callejera' ? 'Comida Callejera' : 'Asado al Plato'} (${calcMeatType.value === 'premium' ? 'Carne Premium Arg.' : 'Carne Europea'})\n`;
        msg += `⏰ *Horario:* ${calcTimeStart.value} a ${calcTimeEnd.value} (${totalHours} horas totales)\n`;
        if (extrasList.length) msg += `➕ *Adicionales:* ${extrasList.join(', ')}\n`;
        msg += `🚚 *Logística:* ${logisticsText}\n`;
        msg += `\n💰 *Total Estimado:* ${total.toLocaleString()} Kr\n\nMe gustaría confirmar disponibilidad y detalles.`;

        if (btnWhatsapp) {
            btnWhatsapp.onclick = () => {
                window.open(`https://wa.me/4551999400?text=${encodeURIComponent(msg)}`, '_blank');
            };
        }
    }

    const inputs = [calcMenu, calcPeople, calcMeatType, calcTimeStart, calcTimeEnd, calcLogistics, cbVerduras, cbEnsaladas, cbEntrada];
    inputs.forEach(input => {
        if (input) {
            const evt = (input.tagName === 'SELECT' || input.type === 'checkbox') ? 'change' : 'input';
            input.addEventListener(evt, updateCalculator);
        }
    });

    if (calcMenu) loadConfig();
});
