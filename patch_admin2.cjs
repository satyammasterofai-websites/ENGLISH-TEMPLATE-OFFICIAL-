const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Update useState type
content = content.replace(
  /"couple" \| "sections" \| "events" \| "gallery" \| "rsvps" \| "blessings"/,
  '"couple" | "sections" | "events" | "registries" | "gallery" | "rsvps" | "blessings"'
);

// Add tab button
const tabButton = `
              <button
                onClick={() => setActiveTab("registries")}
                className={\`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all \${
                  activeTab === "registries" ? "bg-gold-600 text-emerald-50 shadow-md" : "text-gold-200 hover:bg-amber-100"
                }\`}
              >
                <Heart className="w-4 h-4" />
                Registries
              </button>
`;

content = content.replace(
  /className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all \${\s*activeTab === "gallery"/,
  tabButton.trim() + '\n              <button\n                onClick={() => setActiveTab("gallery")}\n                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${' + '\n                  activeTab === "gallery"'
);

// Add tab content
const registriesTabContent = `
                  {activeTab === "registries" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-serif text-gold-200">Gift Registries</h3>
                        <button
                          onClick={handleAddRegistry}
                          className="px-3 py-1.5 bg-amber-100 text-gold-600 rounded-lg text-sm font-medium hover:bg-gold-200 transition-colors"
                        >
                          + Add Registry
                        </button>
                      </div>

                      <div className="grid gap-4">
                        {db.registries?.map((reg, idx) => (
                          <div key={idx} className="bg-amber-50/50 p-4 rounded-xl border border-gold-200/30 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium text-gold-200">Registry {idx + 1}</h4>
                              <button
                                onClick={() => handleRemoveRegistry(idx)}
                                className="text-red-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider">Store Name</label>
                                <input
                                  type="text"
                                  value={reg.storeName}
                                  onChange={(e) => handleUpdateRegistry(idx, "storeName", e.target.value)}
                                  className="w-full bg-white border border-gold-200/30 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-gold-400"
                                  placeholder="e.g. Macy's"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider">URL Link</label>
                                <input
                                  type="text"
                                  value={reg.url}
                                  onChange={(e) => handleUpdateRegistry(idx, "url", e.target.value)}
                                  className="w-full bg-white border border-gold-200/30 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-gold-400"
                                  placeholder="https://..."
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider">Description (Optional)</label>
                                <input
                                  type="text"
                                  value={reg.description || ""}
                                  onChange={(e) => handleUpdateRegistry(idx, "description", e.target.value)}
                                  className="w-full bg-white border border-gold-200/30 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-gold-400"
                                  placeholder="e.g. Home goods and kitchenware"
                                />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
`;

content = content.replace(
  /\{activeTab === "gallery" && \(/,
  registriesTabContent.trim() + '\n                  {activeTab === "gallery" && ('
);

fs.writeFileSync('src/components/AdminPanel.tsx', content);
