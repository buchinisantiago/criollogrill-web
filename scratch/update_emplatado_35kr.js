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

let main = fs.readFileSync('js/main.js', 'utf8');

// Update summaryMenuPrice to include the +35 Kr * people for emplatado
const oldMenuPrice = `            if(summaryMenuName) summaryMenuName.textContent = \`\${label} (\${people} pax)\`;
            if(summaryMenuPrice) summaryMenuPrice.textContent = \`\${Math.round(baseFoodCost).toLocaleString()} Kr\`;`;

const newMenuPrice = `            let displayedMenuCost = baseFoodCost;
            if (menuType === 'plato-emplatado') {
                displayedMenuCost += 35 * people;
            }
            if(summaryMenuName) summaryMenuName.textContent = \`\${label} (\${people} pax)\`;
            if(summaryMenuPrice) summaryMenuPrice.textContent = \`\${Math.round(displayedMenuCost).toLocaleString()} Kr\`;`;

main = replaceFlexible(main, oldMenuPrice, newMenuPrice);

// Update floor and calculation for plato-emplatado
const oldFloors = `        // --- APPLY MINIMUM PRICE FLOORS ---
        let currentPerPerson = total / people;
        if (menuType === 'plato' && currentPerPerson < 295) {
            total = 295 * people;
        } else if (menuType === 'plato-emplatado' && currentPerPerson < 350) {
            total = 350 * people;
        } else if (menuType === 'callejera' && currentPerPerson < 280) {
            total = 280 * people;
        } else if (menuType === 'hazlo-tu-mismo' && currentPerPerson < 158) {
            total = 158 * people;
        }`;

const newFloors = `        // --- APPLY MINIMUM PRICE FLOORS ---
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
        }`;

main = replaceFlexible(main, oldFloors, newFloors);

fs.writeFileSync('js/main.js', main, 'utf8');
console.log('Successfully updated js/main.js with +35 Kr rule for emplatado');
