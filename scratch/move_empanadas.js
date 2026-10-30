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

// 1. index.html (already updated or check)
let html = fs.readFileSync('index.html', 'utf8');
if (html.includes('id="calc-empanadas"')) {
  const oldIndexBlock = `                    <!-- EMPANADAS -->
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="calc-empanadas" style="width:18px;height:18px;accent-color:var(--gold);">
                            <span data-i18n="calc_empanadas_label">Include Argentine Empanadas Starter (+35 Kr / person)</span>
                        </label>
                        <small style="color:var(--text-muted);margin-top:4px;display:block;" data-i18n="calc_empanadas_note">Artisan handmade meat &amp; vegetarian empanadas served warm as an appetizer</small>
                    </div>
                    <div id="extras-plato" class="extras-section" style="display:none;">
                        <h3 data-i18n="extras_title">Add-ons (Plate Asado)</h3>
                        <label class="checkbox-label"><input type="checkbox" id="extra-verduras"> <span data-i18n="extra1">Side dish: Grilled vegetables and aubergine purée</span></label>
                        <label class="checkbox-label"><input type="checkbox" id="extra-ensaladas"> <span data-i18n="extra2">Premium Salads: Chimichurri potatoes and green leaves</span></label>
                        <label class="checkbox-label"><input type="checkbox" id="extra-entrada"> <span data-i18n="extra3">Starter: Homemade bread, olives and cheese board</span></label>
                    </div>`;

  const newIndexBlock = `                    <div id="extras-plato" class="extras-section" style="display:none;">
                        <h3 data-i18n="extras_title">Add-ons (Plate Asado)</h3>
                        <label class="checkbox-label"><input type="checkbox" id="extra-verduras"> <span data-i18n="extra1">Side dish: Grilled vegetables and aubergine purée</span></label>
                        <label class="checkbox-label"><input type="checkbox" id="extra-ensaladas"> <span data-i18n="extra2">Premium Salads: Chimichurri potatoes and green leaves</span></label>
                        <label class="checkbox-label"><input type="checkbox" id="extra-entrada"> <span data-i18n="extra3">Starter: Homemade bread, olives and cheese board</span></label>
                        <label class="checkbox-label"><input type="checkbox" id="extra-empanadas"> <span data-i18n="extra_empanadas">Starter: Argentine artisan empanadas (+35 Kr/person)</span></label>
                    </div>`;

  html = replaceFlexible(html, oldIndexBlock, newIndexBlock);
  fs.writeFileSync('index.html', html, 'utf8');
}
console.log('Checked index.html');

// 2. js/i18n.js
let i18n = fs.readFileSync('js/i18n.js', 'utf8');

i18n = replaceFlexible(i18n,
  `extra3:"Starter: Homemade bread, olives and cheese board",`,
  `extra3:"Starter: Homemade bread, olives and cheese board",\n    extra_empanadas:"Starter: Argentine artisan empanadas (+35 Kr/person)",`
);

i18n = replaceFlexible(i18n,
  `extra3:"Entrada: Tabla de pan casero, aceitunas y quesos",`,
  `extra3:"Entrada: Tabla de pan casero, aceitunas y quesos",\n    extra_empanadas:"Entrada: Empanadas argentinas caseras (+35 Kr/persona)",`
);

i18n = replaceFlexible(i18n,
  `extra3:"Forret: Hjemmebagt brød, oliven og ostetallerken",`,
  `extra3:"Forret: Hjemmebagt brød, oliven og ostetallerken",\n    extra_empanadas:"Forret: Hjemmelavede argentinske empanadas (+35 Kr/person)",`
);

fs.writeFileSync('js/i18n.js', i18n, 'utf8');
console.log('Updated js/i18n.js with extra_empanadas');

// 3. js/main.js
let main = fs.readFileSync('js/main.js', 'utf8');

main = replaceFlexible(main,
  `    const calcMozos     = document.getElementById('calc-mozos');
    const calcEmpanadas = document.getElementById('calc-empanadas');
    const extrasPlato   = document.getElementById('extras-plato');
    const cbVerduras    = document.getElementById('extra-verduras');
    const cbEnsaladas   = document.getElementById('extra-ensaladas');
    const cbEntrada     = document.getElementById('extra-entrada');`,
  `    const calcMozos     = document.getElementById('calc-mozos');
    const extrasPlato   = document.getElementById('extras-plato');
    const cbVerduras    = document.getElementById('extra-verduras');
    const cbEnsaladas   = document.getElementById('extra-ensaladas');
    const cbEntrada     = document.getElementById('extra-entrada');
    const cbEmpanadas   = document.getElementById('extra-empanadas');`
);

main = replaceFlexible(main,
  `const inputs = [calcMenu, calcPeople, calcTimeStart, calcTimeFood, calcTimeEnd, calcMozos, calcEmpanadas, cbVerduras, cbEnsaladas, cbEntrada];`,
  `const inputs = [calcMenu, calcPeople, calcTimeStart, calcTimeFood, calcTimeEnd, calcMozos, cbVerduras, cbEnsaladas, cbEntrada, cbEmpanadas];`
);

// In callejera reset:
main = replaceFlexible(main,
  `            if(cbVerduras) cbVerduras.checked = false;
            if(cbEnsaladas) cbEnsaladas.checked = false;
            if(cbEntrada) cbEntrada.checked = false;`,
  `            if(cbVerduras) cbVerduras.checked = false;
            if(cbEnsaladas) cbEnsaladas.checked = false;
            if(cbEntrada) cbEntrada.checked = false;
            if(cbEmpanadas) cbEmpanadas.checked = false;`
);

// Remove empanadas from callejera summary since it's an extras-plato item now:
const oldCallejeraEmp = `            if (calcEmpanadas && calcEmpanadas.checked) {
                const div = document.createElement('div');
                div.className = 'summary-row';
                const currentLang = localStorage.getItem('criollo_lang') || 'en';
                let empLabel = \`🥟 Empanadas Starter (\${people} pax)\`;
                if (currentLang === 'es') empLabel = \`🥟 Entrada de Empanadas (\${people} pax)\`;
                if (currentLang === 'dk') empLabel = \`🥟 Empanadas Forret (\${people} pax)\`;
                div.innerHTML = \`<span>\${empLabel}</span><span>\${(35 * people).toLocaleString()} Kr</span>\`;
                summaryExtrasContainer.appendChild(div);
            }`;

if (main.replace(/\r\n/g, '\n').includes(oldCallejeraEmp.replace(/\r\n/g, '\n'))) {
  main = replaceFlexible(main, oldCallejeraEmp, '');
}

// In extras-plato handling:
main = replaceFlexible(main,
  `if (calcEmpanadas && calcEmpanadas.checked) {`,
  `if (cbEmpanadas && cbEmpanadas.checked) {`
);

main = replaceFlexible(main,
  `        if (calcEmpanadas && calcEmpanadas.checked) {
            empanadasCost = 35 * people;
            total += empanadasCost;
        }`,
  `        if (cbEmpanadas && cbEmpanadas.checked) {
            empanadasCost = 35 * people;
            total += empanadasCost;
        }`
);

fs.writeFileSync('js/main.js', main, 'utf8');
console.log('Updated js/main.js for cbEmpanadas');
