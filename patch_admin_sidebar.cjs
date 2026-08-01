const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const registrySidebarBtn = `
              <button
                onClick={() => setActiveTab("registries")}
                className={\`flex items-center gap-2.5 w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer \${
                  activeTab === "registries" ? "bg-gold-600 text-emerald-50 shadow-md" : "text-gold-200 hover:bg-amber-100"
                }\`}
              >
                <Heart className="w-4 h-4 shrink-0" />
                Registries
              </button>
`;

content = content.replace(
  /<button\s+onClick=\{\(\) => setActiveTab\("gallery"\)\}/,
  registrySidebarBtn.trim() + '\n              <button\n                onClick={() => setActiveTab("gallery")}'
);

fs.writeFileSync('src/components/AdminPanel.tsx', content);
