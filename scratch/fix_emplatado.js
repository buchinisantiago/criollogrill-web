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

// 1. index.html
let html = fs.readFileSync('index.html', 'utf8');
const oldSelect = `<select id="calc-menu" class="calc-input" data-i18n-opt="calc_menu_opt1,calc_menu_opt2,calc_menu_opt3">
                            <option value="callejera" data-i18n="calc_menu_opt1">Street Food (Choripán, Sandwiches)</option>
                            <option value="plato" data-i18n="calc_menu_opt2" selected>Plate Asado (Premium cuts + Sides)</option>
                            <option value="hazlo-tu-mismo" data-i18n="calc_menu_opt3">Grill it Yourself (Prepared ingredients, you grill)</option>
                        </select>`;

const newSelect = `<select id="calc-menu" class="calc-input" data-i18n-opt="calc_menu_opt1,calc_menu_opt2,calc_menu_opt4,calc_menu_opt3">
                            <option value="callejera" data-i18n="calc_menu_opt1">Street Food (Choripán, Sandwiches)</option>
                            <option value="plato" data-i18n="calc_menu_opt2" selected>Plate Asado - Buffet (Premium cuts + Sides)</option>
                            <option value="plato-emplatado" data-i18n="calc_menu_opt4">Plate Asado - Plated (Premium cuts + Sides)</option>
                            <option value="hazlo-tu-mismo" data-i18n="calc_menu_opt3">Grill it Yourself (Prepared ingredients, you grill)</option>
                        </select>`;

html = replaceFlexible(html, oldSelect, newSelect);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated index.html');

// 2. js/main.js
let main = fs.readFileSync('js/main.js', 'utf8');

const oldLabelBlock = `            let label = 'Plate Asado';
            if (menuType === 'hazlo-tu-mismo') {
                label = 'Grill it Yourself';
                if (currentLang === 'es') label = 'Hazlo tú mismo';
                if (currentLang === 'dk') label = 'Grill Det Selv';
            } else {
                if (currentLang === 'es') label = 'Asado al Plato';
                if (currentLang === 'dk') label = 'Tallerken Asado';
            }`;

const newLabelBlock = `            let label = 'Plate Asado (Buffet)';
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
            }`;

main = replaceFlexible(main, oldLabelBlock, newLabelBlock);

const oldFloors = `        if (menuType === 'plato' && currentPerPerson < 295) {
            total = 295 * people;
        } else if (menuType === 'callejera' && currentPerPerson < 280) {
            total = 280 * people;
        } else if (menuType === 'hazlo-tu-mismo' && currentPerPerson < 158) {
            total = 158 * people;
        }`;

const newFloors = `        if (menuType === 'plato' && currentPerPerson < 295) {
            total = 295 * people;
        } else if (menuType === 'plato-emplatado' && currentPerPerson < 350) {
            total = 350 * people;
        } else if (menuType === 'callejera' && currentPerPerson < 280) {
            total = 280 * people;
        } else if (menuType === 'hazlo-tu-mismo' && currentPerPerson < 158) {
            total = 158 * people;
        }`;

main = replaceFlexible(main, oldFloors, newFloors);

fs.writeFileSync('js/main.js', main, 'utf8');
console.log('Successfully updated js/main.js');
