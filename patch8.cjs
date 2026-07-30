const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  '<BackgroundEffects />',
  '<BackgroundEffects />\n      <FloatingElements />'
);
fs.writeFileSync('src/App.tsx', content);
