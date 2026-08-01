const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /import BlessingsWall from ".\/components\/BlessingsWall";/,
  'import BlessingsWall from "./components/BlessingsWall";\nimport RegistrySection from "./components/RegistrySection";'
);

content = content.replace(
  /\{settings\.sections\.gallery && \(/,
  `{settings.sections.registries && data.registries && data.registries.length > 0 && (
          <>
            <SectionDivider />
            <RegistrySection registries={data.registries} />
          </>
        )}

        {settings.sections.gallery && (`
);

fs.writeFileSync('src/App.tsx', content);
