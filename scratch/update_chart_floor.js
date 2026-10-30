const fs = require('fs');
const path = 'C:\\Users\\buchi\\.gemini\\antigravity\\brain\\dbd37b12-e317-4c49-861b-3b3582afa5c2\\pricing_charts.html';
let html = fs.readFileSync(path, 'utf8');

html = html.replace(
  'let totalDIY = (foodDIY + pkgDIY + 300) * (people <= 35 ? 1.15 : 1.18) * 0.92;',
  'let totalDIY = (foodDIY + pkgDIY + 300) * (people <= 35 ? 1.15 : 1.18) * 0.92;\n      let diyFloor = false;\n      if (totalDIY / people < 158) { totalDIY = 158 * people; diyFloor = true; }'
);

html = html.replace(
  'diy: { total: Math.round(totalDIY), pp: Math.round(totalDIY / people) }',
  'diy: { total: Math.round(totalDIY), pp: Math.round(totalDIY / people), floor: diyFloor }'
);

html = html.replace(
  "document.getElementById('card-diy-sub').textContent = data.diy.total.toLocaleString() + ' Kr total';",
  "document.getElementById('card-diy-sub').textContent = data.diy.total.toLocaleString() + ' Kr total' + (data.diy.floor ? ' (Piso)' : '');"
);

html = html.replace(
  'Street Food tiene piso de <span class="text-orange-400 font-semibold">280 Kr/pax</span> y Asado al Plato de <span class="text-amber-400 font-semibold">295 Kr/pax</span>',
  'Street Food tiene piso de <span class="text-orange-400 font-semibold">280 Kr/pax</span>, Asado al Plato de <span class="text-amber-400 font-semibold">295 Kr/pax</span> y Grill it Yourself de <span class="text-emerald-400 font-semibold">158 Kr/pax</span>'
);

fs.writeFileSync(path, html, 'utf8');
console.log('Successfully updated pricing_charts.html');
