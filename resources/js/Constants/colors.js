export const availableColors = [
  // ─── 10 Major Colors ───
  { name: "Black", hex: "#1a1a1a" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy", hex: "#000080" },
  { name: "Red", hex: "#ff0000" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Grey", hex: "#808080" },
  { name: "Green", hex: "#228B22" },
  { name: "Brown", hex: "#654321" },
  { name: "Yellow", hex: "#FFD700" },
  { name: "Pink", hex: "#FFC0CB" },

  // ─── Blended / Mixed Variants ───
  { name: "Charcoal", hex: "#3F3F3F" },        // Black + Grey
  { name: "Off White", hex: "#F8F8F0" },       // White + Beige
  { name: "Navy Grey", hex: "#4A4E5A" },       // Navy + Grey
  { name: "Burgundy", hex: "#722F37" },        // Red + Brown
  { name: "Rust", hex: "#B7541A" },            // Red + Yellow + Brown
  { name: "Olive", hex: "#6B6B3A" },           // Green + Brown + Yellow
  { name: "Sage", hex: "#9CAF88" },            // Green + Grey + White
  { name: "Camel", hex: "#C19A6B" },           // Brown + Beige + Yellow
  { name: "Blush", hex: "#DE9CA0" },           // Pink + Beige
  { name: "Mauve", hex: "#997A8D" },           // Pink + Grey + Navy
];

export const getColorHexes = (colorName) => {
  if (!colorName) return [];
  return colorName.split("/").map(
    (part) => availableColors.find((c) => c.name?.toLowerCase() === part.trim().toLowerCase())?.hex || "#cccccc"
  );
};