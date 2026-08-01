const fs = require('fs');
let content = fs.readFileSync('src/components/EventCarousel.tsx', 'utf8');

content = content.replace(
  /<h3 className="font-serif text-4xl md:text-5xl text-gold-300 font-bold mb-6 drop-shadow-\[0_4px_4px_rgba\(0,0,0,0\.5\)\]">\s*\{event\.title\}\s*<\/h3>/,
  `<div className="relative inline-block mb-6">
              <h3 className="font-serif text-4xl md:text-5xl text-black font-bold drop-shadow-sm pb-4">
                {event.title}
              </h3>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[200px] flex items-center justify-center gap-2">
                <div className="h-[2px] flex-grow bg-gradient-to-l from-gold-500 to-transparent"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gold-500 rotate-45"></div>
                <div className="h-[2px] flex-grow bg-gradient-to-r from-gold-500 to-transparent"></div>
              </div>
            </div>`
);

fs.writeFileSync('src/components/EventCarousel.tsx', content);
