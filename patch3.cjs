const fs = require('fs');
let content = fs.readFileSync('src/components/EventCarousel.tsx', 'utf8');

const regex = /const drawOverlay = \(\) => \{[\s\S]*?ctx\.fillText\("✦ SCRATCH TO REVEAL DATE ✦", canvas\.width \/ 2, canvas\.height \/ 2\);\s*\};/;

const replacement = `const drawOverlay = () => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#C59B27");
      gradient.addColorStop(0.3, "#F3E5AB");
      gradient.addColorStop(0.5, "#D4AF37");
      gradient.addColorStop(0.7, "#FFFDD0");
      gradient.addColorStop(1, "#AA7900");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 2;
      ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

      ctx.fillStyle = "#3E2723";
      ctx.font = "bold 16px 'Cinzel', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(255,255,255,0.6)";
      ctx.shadowBlur = 4;
      ctx.fillText("✨ Scratch to Reveal ✨", canvas.width / 2, canvas.height / 2);
      ctx.shadowBlur = 0;
    };`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/EventCarousel.tsx', content);
