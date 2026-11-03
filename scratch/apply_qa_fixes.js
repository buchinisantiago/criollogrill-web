const fs = require('fs');

function replaceFlexible(content, target, replacement) {
  const normContent = content.replace(/\r\n/g, '\n');
  const normTarget = target.replace(/\r\n/g, '\n');
  const normReplacement = replacement.replace(/\r\n/g, '\n');
  if (normContent.includes(normTarget)) {
    const isCRLF = content.includes('\r\n');
    const result = normContent.replace(normTarget, normReplacement);
    return isCRLF ? result.replace(/\n/g, '\r\n') : result;
  }
  throw new Error('Target not found: ' + target.substring(0, 40));
}

// 1. UPDATE js/main.js
let main = fs.readFileSync('js/main.js', 'utf8');

// Replace updateCalculator calculation block
const oldCalcSection = `        if (menuType === 'callejera') {
            extrasPlato.style.display = 'none';
            if(cbVerduras) cbVerduras.checked = false;
            if(cbEnsaladas) cbEnsaladas.checked = false;
            if(cbEntrada) cbEntrada.checked = false;
            if(cbEmpanadas) cbEmpanadas.checked = false;
            // 250g meat/person + bread + sauces + packaging
            const cpp = (0.25 * meatPriceKg) + CONFIG.panPorPersona + CONFIG.aderezosPorPersona + CONFIG.packagingPorPersona;
            foodCost = (cpp * people) * 1.05; // 5% extra margin on food
            const currentLang = localStorage.getItem('criollo_lang') || 'en';
            let label = 'Street Food Menu';
            if (currentLang === 'es') label = 'Menú Street Food';
            if (currentLang === 'dk') label = 'Street Food Menu';
            if(summaryMenuName) summaryMenuName.textContent = \`\${label} (\${people} pax)\`;
            if(summaryMenuPrice) summaryMenuPrice.textContent = \`\${Math.round(foodCost).toLocaleString()} Kr\`;


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
            if (menuType === 'hazlo-tu-mismo') {
                baseFoodCost *= 1.20; // +20% requested for Grill it Yourself
                extrasCost *= 1.20;
            }
            foodCost = baseFoodCost + extrasCost;
            const currentLang = localStorage.getItem('criollo_lang') || 'en';
            let label = 'Plate Asado (Buffet)';
            if (menuType === 'hazlo-tu-mismo') {
                label = 'Grill it Yourself';
                if (currentLang === 'es') label = 'Hazlo tú mismo';
                if (currentLang === 'dk') label = 'Grill Det Selv';
            } else if (menuType === 'plato-emplatado') {
                label = 'Plate Asado (Plated)';
                if (currentLang === 'es') label = 'Asado al Plato (Emplatado)';
                if (currentLang === 'dk') label = 'Tallerken Asado (Anrettet)';
            } else {
                if (currentLang === 'es') label = 'Asado al Plato (Buffet)';
                if (currentLang === 'dk') label = 'Tallerken Asado (Buffet)';
            }
            let displayedMenuCost = baseFoodCost;
            if (menuType === 'plato-emplatado') {
                displayedMenuCost += 35 * people;
            }
            if(summaryMenuName) summaryMenuName.textContent = \`\${label} (\${people} pax)\`;
            if(summaryMenuPrice) summaryMenuPrice.textContent = \`\${Math.round(displayedMenuCost).toLocaleString()} Kr\`;

            if (extrasCost > 0) {
                const div = document.createElement('div');
                div.className = 'summary-row';
                const currentLang = localStorage.getItem('criollo_lang') || 'en';
                let addOnLabel = '+ Add-ons selected';
                if (currentLang === 'es') addOnLabel = '+ Adicionales seleccionados';
                if (currentLang === 'dk') addOnLabel = '+ Tilvalg valgt';
                div.innerHTML = \`<span>\${addOnLabel}</span><span>\${Math.round(extrasCost).toLocaleString()} Kr</span>\`;
                summaryExtrasContainer.appendChild(div);
            }

            if (cbEmpanadas && cbEmpanadas.checked) {
                const div = document.createElement('div');
                div.className = 'summary-row';
                const currentLang = localStorage.getItem('criollo_lang') || 'en';
                let empLabel = \`🥟 Empanadas Starter (\${people} pax)\`;
                if (currentLang === 'es') empLabel = \`🥟 Entrada de Empanadas (\${people} pax)\`;
                if (currentLang === 'dk') empLabel = \`🥟 Empanadas Forret (\${people} pax)\`;
                div.innerHTML = \`<span>\${empLabel}</span><span>\${(35 * people).toLocaleString()} Kr</span>\`;
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
            summaryLogisticsRow.querySelector('span:last-child').textContent = \`\${logisticsCost.toLocaleString()} Kr\`;
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
                summaryPackagingRow.querySelector('span:last-child').textContent = \`\${Math.round(packagingCost).toLocaleString()} Kr\`;
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
                mozosRow.querySelector('span:last-child').textContent = \`\${Math.round(mozosCost).toLocaleString()} Kr\`;
                
                // Dynamic translation based on current selected language for waitstaff
                const currentLang = localStorage.getItem('criollo_lang') || 'en';
                let labelText = \`Waitstaff (\${numMozos} waiters × \${totalHours}h)\`;
                if (currentLang === 'es') {
                    const word = numMozos === 1 ? 'mozo' : 'mozos';
                    labelText = \`Mozos (\${numMozos} \${word} × \${totalHours}h)\`;
                } else if (currentLang === 'dk') {
                    const word = numMozos === 1 ? 'tjener' : 'tjenere';
                    labelText = \`Servering (\${numMozos} \${word} × \${totalHours}t)\`;
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
        if ((menuType === 'plato' || menuType === 'plato-emplatado') && currentPerPerson < 295) {
            total = 295 * people;
        } else if (menuType === 'callejera' && currentPerPerson < 280) {
            total = 280 * people;
        } else if (menuType === 'hazlo-tu-mismo' && currentPerPerson < 158) {
            total = 158 * people;
        }

        if (menuType === 'plato-emplatado') {
            total += 35 * people; // Emplatado is always +35 Kr/person compared to buffet
        }

        let empanadasCost = 0;
        if (cbEmpanadas && cbEmpanadas.checked) {
            empanadasCost = 35 * people;
            total += empanadasCost;
        }`;

const newCalcSection = `        let baseFoodCost = 0;
        let extrasCost = 0;

        if (menuType === 'callejera') {
            extrasPlato.style.display = 'none';
            if(cbVerduras) cbVerduras.checked = false;
            if(cbEnsaladas) cbEnsaladas.checked = false;
            if(cbEntrada) cbEntrada.checked = false;
            if(cbEmpanadas) cbEmpanadas.checked = false;
            // 250g meat/person + bread + sauces + packaging
            const cpp = (0.25 * meatPriceKg) + CONFIG.panPorPersona + CONFIG.aderezosPorPersona + CONFIG.packagingPorPersona;
            baseFoodCost = (cpp * people) * 1.05;
        } else {
            extrasPlato.style.display = 'block';
            let meatKgPerPerson = 0.4; // 400g/person plate asado

            if (cbEntrada && cbEntrada.checked) {
                meatKgPerPerson = 0.3;
                extrasCost += ((0.1 * CONFIG.picadaKg) + (0.1 * CONFIG.ensaladaKg)) * people * 1.05;
            } else if (cbEnsaladas && cbEnsaladas.checked) {
                meatKgPerPerson = 0.3;
                extrasCost += (0.2 * CONFIG.ensaladaKg) * people * 1.05;
            }
            if (cbVerduras && cbVerduras.checked) {
                extrasCost += CONFIG.verdurasPorPersona * people * 1.05;
            }

            baseFoodCost = (meatKgPerPerson * meatPriceKg) * people * 1.05;
            if (menuType === 'hazlo-tu-mismo') {
                baseFoodCost *= 1.20; // +20% requested for Grill it Yourself
                extrasCost *= 1.20;
            }
        }

        // Logistics
        let logisticsCost = CONFIG.logistica || 3500;
        let logisticsLabel = 'Logistics';
        if (menuType === 'hazlo-tu-mismo') {
            logisticsCost = 300;
            logisticsLabel = 'Delivery';
        }

        // Packaging
        let packagingCost = 0;
        if (menuType === 'hazlo-tu-mismo') {
            packagingCost = Math.round(baseFoodCost * 0.30);
        }

        // --- 1. BASE TOTAL CALCULATION (Meat + Staff + Logistics + Packaging) ---
        let rawBase = baseFoodCost + staffCost + logisticsCost + packagingCost;
        let markup = people <= 35 ? 1.15 : 1.18;
        let baseTotal = rawBase * markup * 0.92;

        // --- 2. APPLY PRICE FLOORS TO BASE SERVICE ONLY ---
        let basePerPerson = baseTotal / people;
        if ((menuType === 'plato' || menuType === 'plato-emplatado') && basePerPerson < 295) {
            baseTotal = 295 * people;
        } else if (menuType === 'callejera' && basePerPerson < 280) {
            baseTotal = 280 * people;
        } else if (menuType === 'hazlo-tu-mismo' && basePerPerson < 158) {
            baseTotal = 158 * people;
        }

        if (menuType === 'plato-emplatado') {
            baseTotal += 35 * people; // Emplatado is always +35 Kr/person compared to buffet
        }

        // Menu price in summary displays the exact balanced portion so lines sum to baseTotal
        let displayedMenuCost = Math.round(baseTotal - staffCost - logisticsCost - packagingCost);

        const currentLang = localStorage.getItem('criollo_lang') || 'en';
        let label = 'Plate Asado (Buffet)';
        if (menuType === 'hazlo-tu-mismo') {
            label = 'Grill it Yourself';
            if (currentLang === 'es') label = 'Hazlo tú mismo';
            if (currentLang === 'dk') label = 'Grill Det Selv';
        } else if (menuType === 'plato-emplatado') {
            label = 'Plate Asado (Plated)';
            if (currentLang === 'es') label = 'Asado al Plato (Emplatado)';
            if (currentLang === 'dk') label = 'Tallerken Asado (Anrettet)';
        } else if (menuType === 'callejera') {
            label = 'Street Food Menu';
            if (currentLang === 'es') label = 'Menú Street Food';
            if (currentLang === 'dk') label = 'Street Food Menu';
        } else {
            if (currentLang === 'es') label = 'Asado al Plato (Buffet)';
            if (currentLang === 'dk') label = 'Tallerken Asado (Buffet)';
        }

        if(summaryMenuName) summaryMenuName.textContent = \`\${label} (\${people} pax)\`;
        if(summaryMenuPrice) summaryMenuPrice.textContent = \`\${displayedMenuCost.toLocaleString()} Kr\`;

        // Add-ons selected
        if (extrasCost > 0) {
            const div = document.createElement('div');
            div.className = 'summary-row';
            let addOnLabel = '+ Add-ons selected';
            if (currentLang === 'es') addOnLabel = '+ Adicionales seleccionados';
            if (currentLang === 'dk') addOnLabel = '+ Tilvalg valgt';
            div.innerHTML = \`<span>\${addOnLabel}</span><span>\${Math.round(extrasCost).toLocaleString()} Kr</span>\`;
            summaryExtrasContainer.appendChild(div);
        }

        // Empanadas (+35 Kr/person)
        let empanadasCost = 0;
        if (cbEmpanadas && cbEmpanadas.checked) {
            empanadasCost = 35 * people;
            const div = document.createElement('div');
            div.className = 'summary-row';
            let empLabel = \`🥟 Empanadas Starter (\${people} pax)\`;
            if (currentLang === 'es') empLabel = \`🥟 Entrada de Empanadas (\${people} pax)\`;
            if (currentLang === 'dk') empLabel = \`🥟 Empanadas Forret (\${people} pax)\`;
            div.innerHTML = \`<span>\${empLabel}</span><span>\${empanadasCost.toLocaleString()} Kr</span>\`;
            summaryExtrasContainer.appendChild(div);
        }

        // Staff Row in summary
        const summaryStaffRow = document.getElementById('summary-staff-row');
        if (summaryStaffRow) {
            summaryStaffRow.style.display = staffCost > 0 ? 'flex' : 'none';
        }

        // Logistics Row in summary
        if(summaryLogisticsRow) {
            summaryLogisticsRow.style.display = 'flex';
            if (menuType !== 'hazlo-tu-mismo') {
                if (currentLang === 'es') logisticsLabel = 'Logística';
                if (currentLang === 'dk') logisticsLabel = 'Logistik';
            }
            summaryLogisticsRow.querySelector('span:first-child').textContent = logisticsLabel;
            summaryLogisticsRow.querySelector('span:last-child').textContent = \`\${logisticsCost.toLocaleString()} Kr\`;
        }

        // Packaging Row in summary
        const summaryPackagingRow = document.getElementById('summary-packaging-row');
        if (menuType === 'hazlo-tu-mismo' && summaryPackagingRow) {
            summaryPackagingRow.style.display = 'flex';
            let pkgLabel = 'Packaging';
            if (currentLang === 'es') pkgLabel = 'Embalaje';
            if (currentLang === 'dk') pkgLabel = 'Emballage';
            summaryPackagingRow.querySelector('span:first-child').textContent = pkgLabel;
            summaryPackagingRow.querySelector('span:last-child').textContent = \`\${packagingCost.toLocaleString()} Kr\`;
        } else if (summaryPackagingRow) {
            summaryPackagingRow.style.display = 'none';
        }

        // Mozos Row in summary
        let mozosCost = 0;
        let numMozos = 0;
        const mozosRow = document.getElementById('summary-mozos-row');
        if (calcMozos && calcMozos.checked && menuType !== 'hazlo-tu-mismo') {
            numMozos = Math.ceil(people / 15);
            mozosCost = numMozos * CONFIG.mozosHora * totalHours;
            if (mozosRow) {
                mozosRow.style.display = 'flex';
                mozosRow.querySelector('span:last-child').textContent = \`\${Math.round(mozosCost).toLocaleString()} Kr\`;
                let labelText = \`Waitstaff (\${numMozos} waiters × \${totalHours}h)\`;
                if (currentLang === 'es') {
                    const word = numMozos === 1 ? 'mozo' : 'mozos';
                    labelText = \`Mozos (\${numMozos} \${word} × \${totalHours}h)\`;
                } else if (currentLang === 'dk') {
                    const word = numMozos === 1 ? 'tjener' : 'tjenere';
                    labelText = \`Servering (\${numMozos} \${word} × \${totalHours}t)\`;
                }
                mozosRow.querySelector('span:first-child').textContent = labelText;
            }
        } else if (mozosRow) {
            mozosRow.style.display = 'none';
        }

        // --- 3. FINAL GRAND TOTAL (Base + Mozos + Extras + Empanadas) ---
        let total = baseTotal + mozosCost + Math.round(extrasCost) + empanadasCost;`;

main = replaceFlexible(main, oldCalcSection, newCalcSection);

// Update per person label with moms
const oldPerPersonLabel = `            let personLabel = '/ person';
            if (currentLang === 'es') personLabel = '/ persona';
            if (currentLang === 'dk') personLabel = '/ person';
            summaryPerPerson.textContent = \`\${perPerson.toLocaleString()} Kr \${personLabel}\`;`;

const newPerPersonLabel = `            let personLabel = '/ person (inkl. moms)';
            if (currentLang === 'es') personLabel = '/ persona (IVA incl.)';
            if (currentLang === 'dk') personLabel = '/ person (inkl. moms)';
            summaryPerPerson.textContent = \`\${perPerson.toLocaleString()} Kr \${personLabel}\`;`;

main = replaceFlexible(main, oldPerPersonLabel, newPerPersonLabel);

// Remove the auto-open chat timer (lines 763-768)
const oldChatAutoOpen = `    // Auto open after 6 seconds
    setTimeout(() => {
        if(!waChat.classList.contains('active') && !sessionStorage.getItem('wa_closed')) {
            waChat.classList.add('active');
        }
    }, 6000);`;

if (main.replace(/\r\n/g, '\n').includes(oldChatAutoOpen.replace(/\r\n/g, '\n'))) {
    main = replaceFlexible(main, oldChatAutoOpen, `    // Chat starts closed; opens only on click`);
}

fs.writeFileSync('js/main.js', main, 'utf8');
console.log('Successfully updated js/main.js with airtight math, moms, and chat fixed');

// 2. UPDATE css/styles.css for mobile input box-sizing & time-group
let css = fs.readFileSync('css/styles.css', 'utf8');

const oldTimeGroupMedia = `  .calculator-container {
    grid-template-columns: 1fr;
    padding: 1.5rem 1rem;
    gap: 2rem;
  }`;

const newTimeGroupMedia = `  .calculator-container {
    grid-template-columns: 1fr;
    padding: 1.5rem 1rem;
    gap: 2rem;
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  .time-group {
    flex-direction: column !important;
    gap: 0.8rem;
  }`;

css = replaceFlexible(css, oldTimeGroupMedia, newTimeGroupMedia);

fs.writeFileSync('css/styles.css', css, 'utf8');
console.log('Successfully updated css/styles.css for mobile layout');
