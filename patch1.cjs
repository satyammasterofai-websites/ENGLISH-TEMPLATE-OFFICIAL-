const fs = require('fs');
let content = fs.readFileSync('src/components/EventsSection.tsx', 'utf8');

content = content.replace(
  /<div className="text-center mb-16">[\s\S]*?<\/div>/,
  `<div className="text-center mb-16 relative">
        <span className="text-gold-300 font-serif text-sm tracking-[0.3em] uppercase block mb-3 drop-shadow-sm">
          Liturgical Celebrations
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl text-gold-200 tracking-wider font-bold mb-4 drop-shadow-md">
          Wedding Events
        </h2>
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="h-[1px] w-16 bg-gradient-to-l from-gold-400 to-transparent" />
          <div className="w-2 h-2 rounded-full bg-gold-400 rotate-45" />
          <div className="h-[1px] w-16 bg-gradient-to-r from-gold-400 to-transparent" />
        </div>
      </div>`
);
fs.writeFileSync('src/components/EventsSection.tsx', content);
