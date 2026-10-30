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

// 1. js/i18n.js
let i18n = fs.readFileSync('js/i18n.js', 'utf8');

i18n = replaceFlexible(i18n,
  `    calc_mozos_label:"Request waitstaff service",
    calc_mozos_note:"1 waiter per 15 guests (180 Kr/hour per waiter)",`,
  `    calc_mozos_label:"Request waitstaff service",
    calc_mozos_note:"1 waiter per 15 guests (180 Kr/hour per waiter)",
    calc_empanadas_label:"Include Argentine Empanadas Starter (+35 Kr / person)",
    calc_empanadas_note:"Artisan handmade meat & vegetarian empanadas served warm as an appetizer",`
);

i18n = replaceFlexible(i18n,
  `    calc_mozos_label:"Solicitar servicio de mozos",
    calc_mozos_note:"1 mozo cada 15 personas (180 Kr/hora por mozo)",`,
  `    calc_mozos_label:"Solicitar servicio de mozos",
    calc_mozos_note:"1 mozo cada 15 personas (180 Kr/hora por mozo)",
    calc_empanadas_label:"Agregar Entrada de Empanadas Caseras (+35 Kr / persona)",
    calc_empanadas_note:"Auténticas empanadas argentinas de carne y vegetarianas servidas calientes como recepción",`
);

i18n = replaceFlexible(i18n,
  `    calc_mozos_label:"Anmod om serveringspersonale",
    calc_mozos_note:"1 tjener pr. 15 gæster (180 Kr/time pr. tjener)",`,
  `    calc_mozos_label:"Anmod om serveringspersonale",
    calc_mozos_note:"1 tjener pr. 15 gæster (180 Kr/time pr. tjener)",
    calc_empanadas_label:"Tilføj Hjemmelavede Argentinske Empanadas (+35 Kr / person)",
    calc_empanadas_note:"Autentiske håndlavede kød- og vegetariske empanadas serveret varme som velkomstsnack",`
);

fs.writeFileSync('js/i18n.js', i18n, 'utf8');
console.log('Updated js/i18n.js with empanadas translations');

// 2. js/main.js
let main = fs.readFileSync('js/main.js', 'utf8');

main = replaceFlexible(main,
  `const calcMozos     = document.getElementById('calc-mozos');`,
  `const calcMozos     = document.getElementById('calc-mozos');\n    const calcEmpanadas = document.getElementById('calc-empanadas');`
);

const oldInputs = `const inputs = [calcMenu, calcPeople, calcTimeStart, calcTimeFood, calcTimeEnd, calcMozos, cbVerduras, cbEnsaladas, cbEntrada];`;
const newInputs = `const inputs = [calcMenu, calcPeople, calcTimeStart, calcTimeFood, calcTimeEnd, calcMozos, calcEmpanadas, cbVerduras, cbEnsaladas, cbEntrada];`;
main = replaceFlexible(main, oldInputs, newInputs);

const oldExtrasHandling = `            if (extrasCost > 0) {
                const div = document.createElement('div');
                div.className = 'summary-row';
                const currentLang = localStorage.getItem('criollo_lang') || 'en';
                let addOnLabel = '+ Add-ons selected';
                if (currentLang === 'es') addOnLabel = '+ Adicionales seleccionados';
                if (currentLang === 'dk') addOnLabel = '+ Tilvalg valgt';
                div.innerHTML = \`<span>\${addOnLabel}</span><span>\${Math.round(extrasCost).toLocaleString()} Kr</span>\`;
                summaryExtrasContainer.appendChild(div);
            }`;

const newExtrasHandling = `            if (extrasCost > 0) {
                const div = document.createElement('div');
                div.className = 'summary-row';
                const currentLang = localStorage.getItem('criollo_lang') || 'en';
                let addOnLabel = '+ Add-ons selected';
                if (currentLang === 'es') addOnLabel = '+ Adicionales seleccionados';
                if (currentLang === 'dk') addOnLabel = '+ Tilvalg valgt';
                div.innerHTML = \`<span>\${addOnLabel}</span><span>\${Math.round(extrasCost).toLocaleString()} Kr</span>\`;
                summaryExtrasContainer.appendChild(div);
            }

            if (calcEmpanadas && calcEmpanadas.checked) {
                const div = document.createElement('div');
                div.className = 'summary-row';
                const currentLang = localStorage.getItem('criollo_lang') || 'en';
                let empLabel = \`🥟 Empanadas Starter (\${people} pax)\`;
                if (currentLang === 'es') empLabel = \`🥟 Entrada de Empanadas (\${people} pax)\`;
                if (currentLang === 'dk') empLabel = \`🥟 Empanadas Forret (\${people} pax)\`;
                div.innerHTML = \`<span>\${empLabel}</span><span>\${(35 * people).toLocaleString()} Kr</span>\`;
                summaryExtrasContainer.appendChild(div);
            }`;

main = replaceFlexible(main, oldExtrasHandling, newExtrasHandling);

const oldCallejeraSummaryPrice = `            if(summaryMenuName) summaryMenuName.textContent = \`\${label} (\${people} pax)\`;
            if(summaryMenuPrice) summaryMenuPrice.textContent = \`\${Math.round(foodCost).toLocaleString()} Kr\`;
        } else {`;

const newCallejeraSummaryPrice = `            if(summaryMenuName) summaryMenuName.textContent = \`\${label} (\${people} pax)\`;
            if(summaryMenuPrice) summaryMenuPrice.textContent = \`\${Math.round(foodCost).toLocaleString()} Kr\`;

            if (calcEmpanadas && calcEmpanadas.checked) {
                const div = document.createElement('div');
                div.className = 'summary-row';
                const currentLang = localStorage.getItem('criollo_lang') || 'en';
                let empLabel = \`🥟 Empanadas Starter (\${people} pax)\`;
                if (currentLang === 'es') empLabel = \`🥟 Entrada de Empanadas (\${people} pax)\`;
                if (currentLang === 'dk') empLabel = \`🥟 Empanadas Forret (\${people} pax)\`;
                div.innerHTML = \`<span>\${empLabel}</span><span>\${(35 * people).toLocaleString()} Kr</span>\`;
                summaryExtrasContainer.appendChild(div);
            }
        } else {`;

main = replaceFlexible(main, oldCallejeraSummaryPrice, newCallejeraSummaryPrice);

const oldTotalCalc = `        if (menuType === 'plato-emplatado') {
            total += 35 * people; // Emplatado is always +35 Kr/person compared to buffet
        }`;

const newTotalCalc = `        if (menuType === 'plato-emplatado') {
            total += 35 * people; // Emplatado is always +35 Kr/person compared to buffet
        }

        let empanadasCost = 0;
        if (calcEmpanadas && calcEmpanadas.checked) {
            empanadasCost = 35 * people;
            total += empanadasCost;
        }`;

main = replaceFlexible(main, oldTotalCalc, newTotalCalc);

const oldWAMsg = `        if (packagingCost > 0) msg += \`📦 *Packaging:* \${Math.round(packagingCost).toLocaleString()} Kr\\n\`;`;
const newWAMsg = `        if (packagingCost > 0) msg += \`📦 *Packaging:* \${Math.round(packagingCost).toLocaleString()} Kr\\n\`;
        if (empanadasCost > 0) msg += \`🥟 *Empanadas Starter:* Included (\${empanadasCost.toLocaleString()} Kr)\\n\`;`;

main = replaceFlexible(main, oldWAMsg, newWAMsg);

fs.writeFileSync('js/main.js', main, 'utf8');
console.log('Updated js/main.js with empanadas calculation');
