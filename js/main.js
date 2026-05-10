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

    // --- Calculator Logic ---
    const calcMenu = document.getElementById('calc-menu');
    const calcPeople = document.getElementById('calc-people');
    const extrasPlato = document.getElementById('extras-plato');
    
    // Checkboxes
    const cbVerduras = document.getElementById('extra-verduras');
    const cbEnsaladas = document.getElementById('extra-ensaladas');
    const cbEntrada = document.getElementById('extra-entrada');
    
    // Summary elements
    const summaryMenuName = document.getElementById('summary-menu-name');
    const summaryMenuPrice = document.getElementById('summary-menu-price');
    const summaryExtrasContainer = document.getElementById('summary-extras-container');
    const summaryTotal = document.getElementById('summary-total');
    const btnWhatsapp = document.getElementById('btn-whatsapp');

    // Base Prices per person
    const PRICES = {
        callejera: 8000,
        plato: 12000
    };

    function updateCalculator() {
        if (!calcMenu || !calcPeople) return;

        const menuType = calcMenu.value;
        let people = parseInt(calcPeople.value) || 0;
        if (people < 10) people = 10; // Minimum 10 people

        let total = 0;
        let basePrice = PRICES[menuType] * people;
        total += basePrice;

        // Update base UI
        summaryMenuName.textContent = menuType === 'callejera' 
            ? `Menú Callejera (${people} pax)` 
            : `Asado al Plato (${people} pax)`;
        summaryMenuPrice.textContent = `$${basePrice.toLocaleString()}`;

        // Handle Extras visibility and calculation
        summaryExtrasContainer.innerHTML = ''; // Clear previous extras
        let extrasList = [];

        if (menuType === 'plato') {
            extrasPlato.style.display = 'block';
            
            [cbVerduras, cbEnsaladas, cbEntrada].forEach(cb => {
                if (cb.checked) {
                    const extraPrice = parseInt(cb.value) * people;
                    total += extraPrice;
                    
                    const label = cb.parentElement.textContent.trim().split(':')[0];
                    extrasList.push(`${label} ($${parseInt(cb.value)} c/u)`);

                    const div = document.createElement('div');
                    div.className = 'summary-row';
                    div.innerHTML = `<span>+ ${label}</span><span>$${extraPrice.toLocaleString()}</span>`;
                    summaryExtrasContainer.appendChild(div);
                }
            });
        } else {
            // Hide and uncheck extras if not 'plato'
            extrasPlato.style.display = 'none';
            cbVerduras.checked = false;
            cbEnsaladas.checked = false;
            cbEntrada.checked = false;
        }

        // Update Total
        summaryTotal.textContent = `$${total.toLocaleString()}`;

        // Update WhatsApp Button Link
        let message = `Hola Criollo Grill! Quisiera consultar por un presupuesto para un evento:\n\n`;
        message += `👨‍👩‍👧‍👦 *Personas:* ${people}\n`;
        message += `🥩 *Menú:* ${menuType === 'callejera' ? 'Comida Callejera' : 'Asado al Plato'}\n`;
        
        if (extrasList.length > 0) {
            message += `➕ *Adicionales:* ${extrasList.join(', ')}\n`;
        }
        
        message += `\n💰 *Total Estimado:* $${total.toLocaleString()} ARS\n\n`;
        message += `Me gustaría saber disponibilidad y confirmar detalles.`;

        btnWhatsapp.onclick = () => {
            const phone = "5491112345678"; // Replace with real phone number
            const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        };
    }

    // Event Listeners for Calculator
    if (calcMenu) {
        calcMenu.addEventListener('change', updateCalculator);
        calcPeople.addEventListener('input', updateCalculator);
        cbVerduras.addEventListener('change', updateCalculator);
        cbEnsaladas.addEventListener('change', updateCalculator);
        cbEntrada.addEventListener('change', updateCalculator);
        
        // Initial Calculation
        updateCalculator();
    }
});
