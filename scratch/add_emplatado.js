const fs = require('fs');

// 1. UPDATE js/i18n.js
let i18n = fs.readFileSync('js/i18n.js', 'utf8');

i18n = i18n.replace(
  'calc_menu_opt2:"Plate Asado (Vacío, Chorizo, Entraña)",',
  'calc_menu_opt2:"Plate Asado - Buffet (Vacío, Chorizo, Entraña)",\n    calc_menu_opt4:"Plate Asado - Plated (Vacío, Chorizo, Entraña)",'
);

i18n = i18n.replace(
  'calc_menu_opt2:"Asado al Plato (Vacío, Chorizo, Entraña)",',
  'calc_menu_opt2:"Asado al Plato - Buffet (Vacío, Chorizo, Entraña)",\n    calc_menu_opt4:"Asado al Plato - Emplatado (Vacío, Chorizo, Entraña)",'
);

i18n = i18n.replace(
  'calc_menu_opt2:"Tallerken Asado (Vacío, Chorizo, Entraña)",',
  'calc_menu_opt2:"Tallerken Asado - Buffet (Vacío, Chorizo, Entraña)",\n    calc_menu_opt4:"Tallerken Asado - Tallerkenanrettet (Vacío, Chorizo, Entraña)",'
);

fs.writeFileSync('js/i18n.js', i18n, 'utf8');
console.log('Updated js/i18n.js');

// 2. UPDATE index.html
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

html = html.replace(oldSelect, newSelect);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Updated index.html');

// 3. UPDATE js/main.js
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

main = main.replace(oldLabelBlock, newLabelBlock);

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

main = main.replace(oldFloors, newFloors);

const oldWAMsg = `msg += \`🥩 *Menu:* \${menuType === 'callejera' ? 'Street Food' : menuType === 'hazlo-tu-mismo' ? 'Grill it Yourself' : 'Plate Asado'} (Premium Quality Meat)\\n\`;`;

const newWAMsg = `let menuNameWA = 'Plate Asado (Buffet)';
        if (menuType === 'callejera') menuNameWA = 'Street Food';
        else if (menuType === 'plato-emplatado') menuNameWA = 'Plate Asado (Plated)';
        else if (menuType === 'hazlo-tu-mismo') menuNameWA = 'Grill it Yourself';
        msg += \`🥩 *Menu:* \${menuNameWA} (Premium Quality Meat)\\n\`;`;

main = main.replace(oldWAMsg, newWAMsg);

fs.writeFileSync('js/main.js', main, 'utf8');
console.log('Updated js/main.js');
