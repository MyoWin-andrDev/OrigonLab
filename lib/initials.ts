/**
 * Monogram for a team member's portrait placeholder.
 *
 * Two words → first letter of each ("Ada Lovelace" → "AL").
 * One word  → first two letters ("Zyden" → "ZY").
 *
 * The single-name case matters: taking only the first letter would render
 * Zyden and Zenith identically, so two mononymous teammates would be
 * indistinguishable on the grid.
 *
 * Shared by TeamCard and TeamDialog so the two can never drift apart.
 */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
