const fs = require('fs');
let content = fs.readFileSync('src/components/EventCarousel.tsx', 'utf8');

content = content.replace(
  /className="relative w-full max-w-4xl mx-auto/g,
  'className="relative w-full max-w-2xl mx-auto'
);

fs.writeFileSync('src/components/EventCarousel.tsx', content);
