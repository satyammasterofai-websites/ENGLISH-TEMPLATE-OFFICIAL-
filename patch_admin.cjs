const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

content = content.replace(
  /FullAdminData, RSVP, Blessing, WeddingEvent, CoupleConfig/,
  'FullAdminData, RSVP, Blessing, WeddingEvent, CoupleConfig, Registry'
);

content = content.replace(
  /const handleAddGalleryImage = \(\) => {/,
  `const handleAddRegistry = () => {
    if (!db) return;
    setDb({
      ...db,
      registries: [...(db.registries || []), { id: Date.now().toString(), storeName: "", url: "", description: "" }]
    });
  };

  const handleUpdateRegistry = (idx: number, field: keyof Registry, value: string) => {
    if (!db) return;
    const newRegs = [...(db.registries || [])];
    newRegs[idx] = { ...newRegs[idx], [field]: value };
    setDb({ ...db, registries: newRegs });
  };

  const handleRemoveRegistry = (idx: number) => {
    if (!db) return;
    const newRegs = [...(db.registries || [])];
    newRegs.splice(idx, 1);
    setDb({ ...db, registries: newRegs });
  };

  const handleAddGalleryImage = () => {`
);

content = content.replace(
  /const TABS = \[/,
  `const TABS = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "events", label: "Events", icon: Calendar },
    { id: "registries", label: "Registry", icon: Heart },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "rsvps", label: "RSVPs", icon: Users },
    { id: "blessings", label: "Blessings", icon: Heart },
  ];
  // Ignore old TABS array in place
  const IGNORE_TABS = [`
);

// We need to find the old TABS array and remove it to not have conflicts
// Actually, it's easier to just do it accurately.
