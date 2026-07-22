export function normalizeProjectIdentity(value: string): string {
  const normalized = value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
  const tokens = normalized.replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);

  if (tokens.includes("signalboard") || (tokens.length === 1 && tokens[0] === "sb")) {
    return "sb (signalboard)";
  }
  return normalized;
}

export function preferredProjectName(identity: string, candidates: string[]): string {
  if (identity === "sb (signalboard)") return "SB (SignalBoard)";
  return [...candidates]
    .sort((a, b) => projectNameScore(b) - projectNameScore(a) || a.localeCompare(b))[0] ?? identity;
}

function projectNameScore(value: string): number {
  let score = 0;
  if (/^[A-Z][A-Za-z0-9]*(?:\s+[A-Z][A-Za-z0-9]*)*$/.test(value)) score += 2;
  if (/\(.+\)/.test(value)) score += 2;
  if (!/[.!?]$/.test(value)) score += 1;
  if (value.length <= 60) score += 1;
  return score;
}
