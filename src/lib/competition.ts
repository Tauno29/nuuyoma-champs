export const ADMIN_PIN = "champs2025";

export type CompetitionState = {
  id: number;
  current_round: number;
  round1_status: "pending" | "open" | "closed";
  round2_status: "pending" | "open" | "closed";
  top5_published: boolean;
  winners_published: boolean;
  updated_at: string;
};

export type Contestant = {
  id: string;
  number: number;
  name: string;
  photo_url: string | null;
  qualified_round2: boolean;
};

export type Score = {
  id: string;
  judge_id: string;
  contestant_id: string;
  round: number;
  confidence: number;
  catwalk: number;
  creativity: number;
  stage_presence: number;
  overall_appearance: number;
  total: number;
  updated_at: string;
};

export type Judge = { id: string; name: string };

export type LeaderboardEntry = {
  contestant: Contestant;
  average: number;
  total: number;
  judgeCount: number;
  rank: number;
};

export function computeLeaderboard(
  contestants: Contestant[],
  scores: Score[],
  round: number,
): LeaderboardEntry[] {
  const byContestant = new Map<string, Score[]>();
  for (const s of scores) {
    if (s.round !== round) continue;
    if (!byContestant.has(s.contestant_id)) byContestant.set(s.contestant_id, []);
    byContestant.get(s.contestant_id)!.push(s);
  }
  const entries = contestants.map((c) => {
    const list = byContestant.get(c.id) ?? [];
    const total = list.reduce((sum, s) => sum + s.total, 0);
    const average = list.length ? total / list.length : 0;
    return {
      contestant: c,
      average,
      total,
      judgeCount: list.length,
      rank: 0,
    };
  });
  entries.sort((a, b) => b.average - a.average || a.contestant.number - b.contestant.number);
  // ranks with ties
  let lastAvg = -1;
  let lastRank = 0;
  entries.forEach((e, i) => {
    if (e.average === lastAvg) e.rank = lastRank;
    else {
      e.rank = i + 1;
      lastRank = e.rank;
      lastAvg = e.average;
    }
  });
  return entries;
}

export const CATEGORIES = [
  { key: "confidence", label: "Confidence" },
  { key: "catwalk", label: "Catwalk" },
  { key: "creativity", label: "Creativity" },
  { key: "stage_presence", label: "Stage Presence" },
  { key: "overall_appearance", label: "Overall Appearance" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];
