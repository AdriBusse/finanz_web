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

