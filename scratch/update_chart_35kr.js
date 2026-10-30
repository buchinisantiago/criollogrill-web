const fs = require('fs');
const path = 'C:\\Users\\buchi\\.gemini\\antigravity\\brain\\dbd37b12-e317-4c49-861b-3b3582afa5c2\\pricing_charts.html';
let html = fs.readFileSync(path, 'utf8');

html = html.replace(
  `      // Plato Emplatado (mismo base, piso 350 Kr)
      let totalEmplatado = (foodPlato + staffCost + CONFIG.logistica) * (people <= 35 ? 1.15 : 1.18) * 0.92;
      let emplatadoFloor = false;
      if (totalEmplatado / people < 350) { totalEmplatado = 350 * people; emplatadoFloor = true; }`,
  `      // Plato Emplatado (Siempre +35 Kr/pax sobre el buffet)
      let totalEmplatado = totalPlato + (35 * people);
      let emplatadoFloor = platoFloor;`
);

html = html.replace(
  'Plato Emplatado (Piso 350)',
  'Plato Emplatado (+35 Kr)'
);

html = html.replace(
  'Emplatado (<span class="text-purple-400 font-semibold">350 Kr</span>), Buffet (<span class="text-amber-400 font-semibold">295 Kr</span>)',
  'Emplatado (<span class="text-purple-400 font-semibold">+35 Kr/pax sobre Buffet, piso 330 Kr</span>), Buffet (<span class="text-amber-400 font-semibold">295 Kr</span>)'
);

html = html.replace(
  'Para grupos de menos de 35 personas comparten precio si la curva supera 350 Kr. A partir de 35-40 comensales, el Emplatado se sostiene en su piso de 350 Kr protegiendo la mayor demanda de servicio.',
  'El servicio Emplatado tiene un valor adicional fijo de <strong>35 Kr por comensal</strong> respecto al Buffet en todo momento (para 10 pax: 778 Kr vs 743 Kr; en el piso de 40+ pax: 330 Kr vs 295 Kr).'
);

fs.writeFileSync(path, html, 'utf8');
console.log('Updated pricing_charts.html with exact +35 Kr rule');
