export interface CategoryColorOption {
  key: string;
  hex: string;
  label: string;
}

export const CATEGORY_COLORS: CategoryColorOption[] = [
  { key: "red", hex: "#ef4444", label: "Red" },
  { key: "orange", hex: "#f97316", label: "Orange" },
  { key: "yellow", hex: "#eab308", label: "Yellow" },
  { key: "green", hex: "#22c55e", label: "Green" },
  { key: "cyan", hex: "#06b6d4", label: "Cyan" },
  { key: "blue", hex: "#3b82f6", label: "Blue" },
  { key: "violet", hex: "#8b5cf6", label: "Violet" },
  { key: "pink", hex: "#ec4899", label: "Pink" },
  { key: "amber", hex: "#f59e0b", label: "Amber" },
  { key: "emerald", hex: "#10b981", label: "Emerald" },
  { key: "teal", hex: "#14b8a6", label: "Teal" },
  { key: "indigo", hex: "#6366f1", label: "Indigo" },
  { key: "purple", hex: "#a855f7", label: "Purple" },
  { key: "rose", hex: "#f43f5e", label: "Rose" },
  { key: "lime", hex: "#84cc16", label: "Lime" },
  { key: "sky", hex: "#06b6d4", label: "Sky" },
  { key: "pink-2", hex: "#f472b6", label: "Pink" },
  { key: "violet-2", hex: "#a78bfa", label: "Violet" },
  { key: "emerald-2", hex: "#34d399", label: "Emerald" },
  { key: "amber-2", hex: "#fbbf24", label: "Amber" },
];

export function getHexByKey(key?: string | null): string | null {
  if (!key) return null;
  return CATEGORY_COLORS.find((c) => c.key === key)?.hex ?? null;
}

export function getKeyByHex(hex?: string | null): string | null {
  if (!hex) return null;
  const norm = hex.toLowerCase();
  return CATEGORY_COLORS.find((c) => c.hex.toLowerCase() === norm)?.key ?? null;
}

export function hexToRgba(hex: string, alpha = 1): string {
  let h = hex.trim().replace('#', '');
  if (h.length === 3) {
    h = h.split('').map((ch) => ch + ch).join('');
  }
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
