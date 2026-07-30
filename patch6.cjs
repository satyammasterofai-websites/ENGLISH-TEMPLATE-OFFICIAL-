const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace('import ScrollToTop from "./components/ScrollToTop";', 'import ScrollToTop from "./components/ScrollToTop";\nimport FloatingElements from "./components/FloatingElements";');
fs.writeFileSync('src/App.tsx', content);
