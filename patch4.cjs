const fs = require('fs');
let content = fs.readFileSync('src/components/EventCarousel.tsx', 'utf8');

content = content.replace(
  /<h3 className="font-serif text-3xl md:text-4xl text-gold-100 mb-6 drop-shadow-md">/g,
  '<h3 className="font-serif text-4xl md:text-5xl text-gold-300 font-bold mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">'
);

fs.writeFileSync('src/components/EventCarousel.tsx', content);
