const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const oldFuncRegex = /const handleCSVExport = \(\) => \{[\s\S]*?  \};\n\n  \/\/ Handle Nested State Updates/;

const newFunc = `const handleCSVExport = () => {
    if (!db) return;
    let csv = "ID,Full Name,Phone Number,Email,Number of Guests,Will Attend?,Side,Message,Submitted At\\n";
    db.rsvps.forEach((r: any) => {
      const name = \`"\${(r.name || '').replace(/"/g, '""')}"\`;
      const phone = \`"\${(r.phone || '').replace(/"/g, '""')}"\`;
      const email = \`"\${(r.email || '').replace(/"/g, '""')}"\`;
      const guests = r.guests || 1;
      const attending = \`"\${(r.attending || '').replace(/"/g, '""')}"\`;
      const side = \`"\${(r.side || '').replace(/"/g, '""')}"\`;
      const message = \`"\${(r.message || '').replace(/"/g, '""')}"\`;
      const time = \`"\${(r.timestamp ? new Date(r.timestamp?.seconds ? r.timestamp.seconds * 1000 : r.timestamp).toISOString() : '').replace(/"/g, '""')}"\`;
      csv += \`\${r.id},\${name},\${phone},\${email},\${guests},\${attending},\${side},\${message},\${time}\\n\`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'rsvps.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Nested State Updates`;

content = content.replace(oldFuncRegex, newFunc);
fs.writeFileSync('src/components/AdminPanel.tsx', content);
