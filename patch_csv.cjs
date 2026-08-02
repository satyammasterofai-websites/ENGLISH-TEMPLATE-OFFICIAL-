const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

content = content.replace(
  />\s*Export RSVPs as CSV\s*<\/button>/,
  '>\n                          Download CSV\n                        </button>'
);

// We should also ensure the side is in the CSV.
content = content.replace(
  /let csv = "ID,Full Name,Phone Number,Email,Number of Guests,Will Attend\?,Message,Submitted At\\n";/,
  'let csv = "ID,Full Name,Phone Number,Email,Number of Guests,Will Attend?,Side,Message,Submitted At\\n";'
);
content = content.replace(
  /const time = \`"\\\$\{\(r\.timestamp/,
  'const side = `"${(r.side || \'\').replace(/"/g, \'""\')}"`;\n      const time = `"${(r.timestamp'
);
content = content.replace(
  /csv \+= \\\`\\\$\{r\.id\},\\\$\{name\},\\\$\{phone\},\\\$\{email\},\\\$\{guests\},\\\$\{attending\},\\\$\{message\},\\\$\{time\}\\\\n\\\`;/,
  'csv += `${r.id},${name},${phone},${email},${guests},${attending},${side},${message},${time}\\n`;'
);

fs.writeFileSync('src/components/AdminPanel.tsx', content);
