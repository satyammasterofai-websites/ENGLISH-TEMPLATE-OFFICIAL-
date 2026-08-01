const fs = require('fs');
let content = fs.readFileSync('src/components/EventsSection.tsx', 'utf8');

content = content.replace(
  /<h2 className="font-serif text-4xl sm:text-5xl text-gold-200 tracking-wider font-bold mb-4 drop-shadow-md">/,
  '<h2 className="font-serif text-4xl sm:text-5xl text-black tracking-wider font-bold mb-4 drop-shadow-sm">'
);

fs.writeFileSync('src/components/EventsSection.tsx', content);
