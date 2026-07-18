import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useCompetitionData } from "@/lib/use-competition-data";
import { computeLeaderboard } from "@/lib/competition";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Medal, Trophy, User } from "lucide-react";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — Miss Champs" }] }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const { state, contestants, scores, judges, loading } = useCompetitionData();

  const round = state?.current_round ?? 0;
  const displayRound = round === 0 ? 1 : round;

  const board = useMemo(() => {
    const pool = displayRound === 2 ? contestants.filter((c) => c.qualified_round2) : contestants;
    return computeLeaderboard(pool, scores, displayRound);
  }, [contestants, scores, displayRound]);

  if (loading) return <div className="py-12 text-center text-muted-foreground">Loading…</div>;

  const round2Closed = state?.round2_status === "closed" && state?.winners_published;

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Live Leaderboard</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
          {round2Closed ? "Final Winners" : displayRound === 2 ? "Round 2 — Finalists" : "Round 1 Standings"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {judges.length} judge{judges.length === 1 ? "" : "s"} • {scores.filter((s) => s.round === displayRound).length} scores across walks
        </p>
      </div>

      {round2Closed && board.length >= 1 && <WinnersPodium board={board} />}

      <div className="mt-6 space-y-2">
        {board.map((e) => {
          const isTop5 = displayRound === 1 && e.rank <= 5 && (state?.top5_published || state?.round1_status === "closed");
          return (
            <Card key={e.contestant.id} className={isTop5 ? "border-gold/60 bg-gold-soft/40" : ""}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={[
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-xl font-bold",
                  e.rank === 1 ? "bg-gold text-black" : e.rank === 2 ? "bg-zinc-300 text-black" : e.rank === 3 ? "bg-amber-700 text-white" : "bg-secondary text-foreground",
                ].join(" ")}>
                  {e.rank}
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                  {e.contestant.photo_url ? (
                    <img src={e.contestant.photo_url} alt="" className="h-full w-full rounded-full object-cover" />
                  ) : <User className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">#{e.contestant.number} · {e.contestant.name}</p>
                  <p className="text-xs text-muted-foreground">{e.judgeCount} judge{e.judgeCount === 1 ? "" : "s"} • {e.walksScored} walk score{e.walksScored === 1 ? "" : "s"} • Total {e.total}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl font-bold text-gold">{e.average.toFixed(1)}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg</p>
                </div>
                {isTop5 && <Badge className="bg-gold text-black">Top 5</Badge>}
              </CardContent>
            </Card>
          );
        })}
        {board.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">No contestants to display yet.</p>
        )}
      </div>
    </div>
  );
}

function WinnersPodium({ board }: { board: ReturnType<typeof computeLeaderboard> }) {
  const winner = board[0];
  const first = board[1];
  const second = board[2];
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {winner && <PodiumCard rank="Winner" entry={winner} icon={<Crown className="h-6 w-6" />} accent="bg-gold text-black" />}
      {first && <PodiumCard rank="1st Runner-up" entry={first} icon={<Trophy className="h-6 w-6" />} accent="bg-zinc-200 text-black" />}
      {second && <PodiumCard rank="2nd Runner-up" entry={second} icon={<Medal className="h-6 w-6" />} accent="bg-amber-700 text-white" />}
    </div>
  );
}

function PodiumCard({ rank, entry, icon, accent }: { rank: string; entry: ReturnType<typeof computeLeaderboard>[number]; icon: React.ReactNode; accent: string }) {
  return (
    <Card className="overflow-hidden border-gold/40">
      <div className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold ${accent}`}>
        {icon} {rank}
      </div>
      <CardContent className="p-4 text-center">
        <p className="font-display text-2xl font-bold">#{entry.contestant.number}</p>
        <p className="text-sm text-muted-foreground">{entry.contestant.name}</p>
        <p className="mt-2 font-display text-3xl font-bold text-gold">{entry.average.toFixed(1)}</p>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Average</p>
      </CardContent>
    </Card>
  );
}
