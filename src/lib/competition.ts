export const ADMIN_PIN = "champs2025";
export const WALKS_PER_ROUND = 4;

export type CompetitionState = {
  id: number;
  current_round: number;
  round1_status: "pending" | "open" | "closed";
  round2_status: "pending" | "open" | "closed";
  round1_current_walk: number;
  round2_current_walk: number;
  top5_published: boolean;
  winners_published: boolean;
  leaderboard_visible?: boolean;
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
  walk: number;
  confidence: number;
  catwalk: number;
  creativity: number;
  stage_presence: number;
  overall_appearance: number;
  total: number;
  updated_at: string;
};

export type Judge = { id: string; name: string; approved: boolean; };

export type LeaderboardEntry = {
  contestant: Contestant;
  average: number; // average of per-judge cumulative totals across walks
  total: number; // sum of every score across judges & walks
  judgeCount: number; // distinct judges who scored at least one walk
  walksScored: number; // total (judge × walk) score rows
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
    const perJudge = new Map<string, number>();
    for (const s of list) {
      perJudge.set(s.judge_id, (perJudge.get(s.judge_id) ?? 0) + s.total);
    }
    const totals = Array.from(perJudge.values());
    const total = totals.reduce((a, b) => a + b, 0);
    const average = totals.length ? total / totals.length : 0;
    return {
      contestant: c,
      average,
      total,
      judgeCount: perJudge.size,
      walksScored: list.length,
      rank: 0,
    };
  });
  entries.sort((a, b) => b.average - a.average || a.contestant.number - b.contestant.number);
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
