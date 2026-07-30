const fs = require('fs');
let content = fs.readFileSync('src/firebase.ts', 'utf8');

content = content.replace(/"wedding", "config"/g, '"wedding", "remix"');
content = content.replace(/"rsvps"/g, '"rsvps_remix"');
content = content.replace(/"blessings"/g, '"blessings_remix"');

fs.writeFileSync('src/firebase.ts', content);
