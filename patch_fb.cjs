const fs = require('fs');
let content = fs.readFileSync('src/firebase.ts', 'utf8');

// add registries: true to sections
content = content.replace(
  /blessings: true,/,
  'blessings: true,\n      registries: true,'
);

// add registries fallback
const registriesFallback = `
  registries: [
    {
      id: "reg-1",
      storeName: "Macy's",
      url: "https://www.macys.com",
      description: "Home goods and kitchenware"
    },
    {
      id: "reg-2",
      storeName: "Williams Sonoma",
      url: "https://www.williams-sonoma.com",
      description: "Kitchen appliances and cookware"
    }
  ],
`;

content = content.replace(
  /family: {/,
  registriesFallback + 'family: {'
);

// update getPublicData
content = content.replace(
  /gallery: config.gallery,/,
  'gallery: config.gallery,\n      registries: config.registries || FALLBACK_CONFIG.registries,'
);

// update updateAdminData
content = content.replace(
  /gallery: updates.gallery \|\| current.gallery,/,
  'gallery: updates.gallery || current.gallery,\n      registries: updates.registries || current.registries,'
);

fs.writeFileSync('src/firebase.ts', content);
