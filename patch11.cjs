const fs = require('fs');
let content = fs.readFileSync('src/components/PhotoGallery.tsx', 'utf8');

const thumbnailRegex = /\s*\{\/\* Thumbnail Indicators \*\/\}[\s\S]*?<\/div>\s*<\/section>/;
content = content.replace(thumbnailRegex, '\n    </section>');

fs.writeFileSync('src/components/PhotoGallery.tsx', content);
