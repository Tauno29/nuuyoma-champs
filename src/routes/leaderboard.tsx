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
  
  const isAdmin = typeof window !== "undefined" && localStorage.getItem("miss_champs_admin") === "1";
  
  if (!state?.leaderboard_visible && !isAdmin) {
    return (
      <div className="mx-auto max-w-md py-16 text-center animate-float">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 ring-1 ring-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
          <Crown className="h-8 w-8 text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] opacity-50" />
        </div>
        <h2 className="mt-6 font-display text-3xl font-bold text-white text-glow">Leaderboard Hidden</h2>
        <p className="mt-2 text-white/70">The administrator has currently hidden the live leaderboard. Please wait until it is revealed!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 text-center animate-float">
        <p className="text-xs uppercase tracking-[0.3em] text-gold/70">Live Leaderboard</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl text-glow text-white">
          {round2Closed ? "Final Winners" : displayRound === 2 ? "Round 2 — Finalists" : "Round 1 Standings"}
        </h1>
        <p className="mt-3 text-sm text-white/60">
          {judges.length} judge{judges.length === 1 ? "" : "s"} • {scores.filter((s) => s.round === displayRound).length} scores across walks
        </p>
      </div>

      {round2Closed && board.length >= 1 && <WinnersPodium board={board} />}

      <div className="mt-6 space-y-2">
        {board.map((e) => {
          const isTop5 = displayRound === 1 && e.rank <= 5 && (state?.top5_published || state?.round1_status === "closed");
          return (
            <Card key={e.contestant.id} className={[
              "transition-all duration-300 hover:scale-[1.01] overflow-hidden relative",
              isTop5 ? "glass-gold border-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.15)]" : "glass border-white/5 hover:bg-white/10"
            ].join(" ")}>
              {isTop5 && <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-transparent pointer-events-none" />}
              <CardContent className="flex items-center gap-3 p-4 relative">
                <div className={[
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-xl font-bold shadow-lg",
                  e.rank === 1 ? "bg-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.5)]" : e.rank === 2 ? "bg-zinc-300 text-black shadow-[0_0_10px_rgba(212,212,216,0.3)]" : e.rank === 3 ? "bg-amber-700 text-white shadow-[0_0_10px_rgba(180,83,9,0.3)]" : "bg-black/50 border border-white/10 text-white",
                ].join(" ")}>
                  {e.rank}
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black/40 border border-white/10 overflow-hidden">
                  {e.contestant.photo_url ? (
                    <img src={e.contestant.photo_url} alt="" className="h-full w-full object-cover" />
                  ) : <User className="h-5 w-5 text-white/50" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-white text-lg">#{e.contestant.number} <span className="text-white/80 font-normal">· {e.contestant.name}</span></p>
                  <p className="text-xs text-white/50">{e.judgeCount} judge{e.judgeCount === 1 ? "" : "s"} • {e.walksScored} walk score{e.walksScored === 1 ? "" : "s"} • Total {e.total}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl font-bold text-gold text-glow">{e.average.toFixed(1)}</p>
                  <p className="text-[10px] uppercase tracking-widest text-gold/60">Avg</p>
                </div>
                {isTop5 && <Badge className="bg-gold text-black border-none shadow-[0_0_10px_rgba(212,175,55,0.4)]">Top 5</Badge>}
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
    <Card className="overflow-hidden glass-gold border-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.15)] animate-float">
      <div className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold tracking-wide shadow-md ${accent}`}>
        {icon} {rank}
      </div>
      <CardContent className="p-6 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        <p className="font-display text-4xl font-bold text-white text-glow relative">#{entry.contestant.number}</p>
        <p className="text-sm text-white/80 mt-1 relative">{entry.contestant.name}</p>
        <div className="mt-4 inline-block bg-black/40 rounded-full px-6 py-2 border border-gold/20">
          <p className="font-display text-3xl font-bold text-gold text-glow">{entry.average.toFixed(1)}</p>
          <p className="text-[10px] uppercase tracking-widest text-gold/70 mt-1">Average</p>
        </div>
      </CardContent>
    </Card>
  );
}
