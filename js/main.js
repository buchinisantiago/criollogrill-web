// main.js

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Contact Form Submission (Mock)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            btn.textContent = 'Enviando...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                alert('¡Gracias por tu mensaje! Nos contactaremos pronto para armar tu evento en Criollo Grill.');
                contactForm.reset();
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }

    // --- Configuración de Precios (Calculos Auxiliares) ---
    // Listos para ser migrados a Supabase
    const CONFIG = {
        carnePremiumKg: 210,
        carneEuropeaKg: 170,
        panPorPersona: 10,
        aderezosPorPersona: 6,
        packagingPorPersona: 8,
        ensaladaKg: 60,
        picadaKg: 100,
        verdurasPorPersona: 15, // Costo estimado
        asadorHora: 240,
        asistenteHora: 200,
        logistica: 2000,
        horasFijasExtra: 4 // 1h armado, 2h coccion, 1h desarmado
    };

    // --- Calculator Logic ---
    const calcMenu = document.getElementById('calc-menu');
    const calcPeople = document.getElementById('calc-people');
    const calcMeatType = document.getElementById('calc-meat-type');
    const calcTimeStart = document.getElementById('calc-time-start');
    const calcTimeEnd = document.getElementById('calc-time-end');
    const calcLogistics = document.getElementById('calc-logistics');
    
    const extrasPlato = document.getElementById('extras-plato');
    const cbVerduras = document.getElementById('extra-verduras');
    const cbEnsaladas = document.getElementById('extra-ensaladas');
    const cbEntrada = document.getElementById('extra-entrada');
    
    const summaryMenuName = document.getElementById('summary-menu-name');
    const summaryMenuPrice = document.getElementById('summary-menu-price');
    const summaryExtrasContainer = document.getElementById('summary-extras-container');
    const summaryStaffRow = document.getElementById('summary-staff-row');
    const summaryStaffName = document.getElementById('summary-staff-name');
    const summaryStaffPrice = document.getElementById('summary-staff-price');
    const summaryLogisticsRow = document.getElementById('summary-logistics-row');
    const summaryTotal = document.getElementById('summary-total');
    const btnWhatsapp = document.getElementById('btn-whatsapp');

    function updateCalculator() {
        if (!calcMenu || !calcPeople || !calcTimeStart || !calcTimeEnd) return;

        const menuType = calcMenu.value;
        let people = parseInt(calcPeople.value) || 0;
        if (people < 10) people = 10;

        // 1. Cálculo de Tiempos
        const startParts = calcTimeStart.value.split(':');
        const endParts = calcTimeEnd.value.split(':');
        let startHour = parseInt(startParts[0]) + parseInt(startParts[1])/60;
        let endHour = parseInt(endParts[0]) + parseInt(endParts[1])/60;
        
        let diff = endHour - startHour;
        if (diff < 0) diff += 24; // Pasa de medianoche
        const totalHours = diff + CONFIG.horasFijasExtra;

        // 2. Cálculo de Personal
        let asadores = 1;
        let asistentes = 0;
        if (people <= 20) asistentes = 1;
        else if (people <= 50) asistentes = 2;
        else asistentes = 3;

        const staffCost = (asadores * CONFIG.asadorHora + asistentes * CONFIG.asistenteHora) * totalHours;

        // 3. Cálculo de Comida
        const meatPriceKg = calcMeatType.value === 'premium' ? CONFIG.carnePremiumKg : CONFIG.carneEuropeaKg;
        let foodCost = 0;
        let extrasList = [];
        summaryExtrasContainer.innerHTML = '';

        if (menuType === 'callejera') {
            extrasPlato.style.display = 'none';
            cbVerduras.checked = false;
            cbEnsaladas.checked = false;
            cbEntrada.checked = false;

            const costPerPerson = (0.25 * meatPriceKg) + CONFIG.panPorPersona + CONFIG.aderezosPorPersona + CONFIG.packagingPorPersona;
            foodCost = costPerPerson * people;
            summaryMenuName.textContent = `Menú Callejera (${people} pax)`;
            summaryMenuPrice.textContent = `${foodCost.toLocaleString()} Kr`;
        } else {
            extrasPlato.style.display = 'block';
            let meatKgPerPerson = 0.4;
            let extrasCost = 0;
            
            let hasEnsalada = cbEnsaladas.checked;
            let hasPicada = cbEntrada.checked;

            if (hasPicada) {
                meatKgPerPerson = 0.3;
                let picadaCostPerPerson = (0.1 * CONFIG.picadaKg) + (0.1 * CONFIG.ensaladaKg);
                extrasCost += picadaCostPerPerson * people;
                extrasList.push('Entrada de Quesos/Fiambres');
            } else if (hasEnsalada) {
                meatKgPerPerson = 0.3;
                let ensaladaCostPerPerson = 0.2 * CONFIG.ensaladaKg;
                extrasCost += ensaladaCostPerPerson * people;
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

        // 4. Logística
        let logisticsCost = 0;
        let logisticsText = "Retiro propio (Trailer/Van)";
        if (calcLogistics.value === 'delivery') {
            logisticsCost = CONFIG.logistica;
            summaryLogisticsRow.style.display = 'flex';
            logisticsText = "Logística y envío de Criollo Grill";
        } else {
            summaryLogisticsRow.style.display = 'none';
        }

        // 5. Totales
        const total = foodCost + staffCost + logisticsCost;

        // Actualizar UI
        if(summaryStaffName) summaryStaffName.textContent = `Personal (${totalHours}hs - ${asadores} Asador, ${asistentes} Asis.)`;
        if(summaryStaffPrice) summaryStaffPrice.textContent = `${staffCost.toLocaleString()} Kr`;
        if(summaryTotal) summaryTotal.textContent = `${total.toLocaleString()} Kr`;

        // Update WhatsApp Button Link
        let message = `Hola Criollo Grill! Quisiera consultar por un presupuesto para un evento:\n\n`;
        message += `👨‍👩‍👧‍👦 *Personas:* ${people}\n`;
        message += `🥩 *Menú:* ${menuType === 'callejera' ? 'Comida Callejera' : 'Asado al Plato'} (${calcMeatType.value === 'premium' ? 'Carne Premium Arg' : 'Carne Europea'})\n`;
        message += `⏰ *Horario:* ${calcTimeStart.value} a ${calcTimeEnd.value} (${totalHours} horas totales calculadas)\n`;
        if (extrasList.length > 0) {
            message += `➕ *Adicionales:* ${extrasList.join(', ')}\n`;
        }
        message += `🚚 *Logística:* ${logisticsText}\n`;
        message += `\n💰 *Total Estimado:* ${total.toLocaleString()} Kr\n\n`;
        message += `Me gustaría saber disponibilidad y confirmar detalles.`;

        if(btnWhatsapp) {
            btnWhatsapp.onclick = () => {
                const phone = "4551999400";
                const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                window.open(url, '_blank');
            };
        }
    }

    // Event Listeners for Calculator
    const inputs = [calcMenu, calcPeople, calcMeatType, calcTimeStart, calcTimeEnd, calcLogistics, cbVerduras, cbEnsaladas, cbEntrada];
    inputs.forEach(input => {
        if(input) input.addEventListener(input.tagName === 'SELECT' || input.type === 'checkbox' ? 'change' : 'input', updateCalculator);
    });
    
    // Initial Calculation
    if(calcMenu) updateCalculator();
});
