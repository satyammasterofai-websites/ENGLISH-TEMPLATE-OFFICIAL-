const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

content = content.replace(
  /blessings: boolean;\n}/,
  'blessings: boolean;\n  registries?: boolean;\n}'
);

const registryInterface = `
export interface Registry {
  id: string;
  storeName: string;
  url: string;
  description?: string;
  logoUrl?: string;
}
`;

content = content.replace(
  /export interface RSVP/,
  registryInterface + '\nexport interface RSVP'
);

content = content.replace(
  /blessings: Blessing\[\];\n}/,
  'blessings: Blessing[];\n  registries?: Registry[];\n}'
);

fs.writeFileSync('src/types.ts', content);
