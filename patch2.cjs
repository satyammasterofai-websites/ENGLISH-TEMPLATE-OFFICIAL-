const fs = require('fs');
let content = fs.readFileSync('src/components/EventCarousel.tsx', 'utf8');

// Remove the thumbnail section
content = content.replace(
  /\s*\{\/\* Thumbnail Image \*\/\}[\s\S]*?(?=\{\/\* Event Details \*\/})/,
  '\n          '
);

// Update the Event Details section width
content = content.replace(
  /<div className="w-full md:w-7\/12 p-8 md:p-12 flex flex-col justify-center relative">/,
  '<div className="w-full p-8 md:p-12 flex flex-col justify-center items-center text-center relative">'
);

// We should also center the details inside the Event Details
content = content.replace(
  /<div className="flex items-start gap-4">/g,
  '<div className="flex flex-col items-center gap-3">'
);

content = content.replace(
  /<MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" \/>/g,
  '<MapPin className="w-6 h-6 text-gold-400 shrink-0" />'
);

content = content.replace(
  /<div className="space-y-6 text-gray-700 font-sans text-sm md:text-base">/,
  '<div className="space-y-6 text-gray-700 font-sans text-sm md:text-base flex flex-col items-center">'
);

fs.writeFileSync('src/components/EventCarousel.tsx', content);
