import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useCompetitionData } from "@/lib/use-competition-data";
import { ADMIN_PIN, computeLeaderboard, TOTAL_INITIAL_ROUNDS, TOTAL_FINAL_ROUNDS } from "@/lib/competition";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Lock, Play, Square, Trophy, RotateCcw, Users, ListChecks, Crown, ChevronLeft, ChevronRight, UserX, LogOut } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — PAGENTS MODELLING SYS" }] }),
  component: AdminPage,
});

const ADMIN_KEY = "miss_champs_admin";

function AdminPage() {
  const [authed, setAuthed] = useState(() => typeof window !== "undefined" && localStorage.getItem(ADMIN_KEY) === "1");
  const [pin, setPin] = useState("");

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm py-12">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Lock className="mx-auto h-8 w-8 text-gold" />
              <h1 className="mt-3 font-display text-2xl font-bold">Administrator</h1>
              <p className="text-sm text-muted-foreground">Enter the admin PIN to continue.</p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (pin === ADMIN_PIN) {
                  localStorage.setItem(ADMIN_KEY, "1");
                  setAuthed(true);
                } else toast.error("Incorrect PIN");
              }}
              className="mt-5 space-y-3"
            >
              <Input type="password" autoFocus value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Admin PIN" className="h-12" />
              <Button type="submit" size="lg" className="w-full">Unlock</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AdminDashboard onLogout={() => { localStorage.removeItem(ADMIN_KEY); setAuthed(false); }} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { state, setState, contestants, scores, judges, loading } = useCompetitionData();

  const rInitial = useMemo(() => computeLeaderboard(contestants, scores, [1, 2, 3, 4]), [contestants, scores]);
  const rTop5Pool = useMemo(() => contestants.filter((c) => c.is_top5), [contestants]);
  const rFinal = useMemo(() => computeLeaderboard(rTop5Pool, scores, [5, 6, 7]), [rTop5Pool, scores]);

  if (loading) return <div className="py-12 text-center text-muted-foreground">Loading…</div>;
  if (!state) return <div className="py-12 text-center text-destructive">Database not initialized. Please run the SQL schema in your Supabase project.</div>;

  const currentRound = state.current_round ?? 0;
  const roundStatus = state.round_status ?? "pending";

  async function updateState(patch: Record<string, unknown>) {
    if (state) setState({ ...state, ...patch } as any);
    const { error } = await supabase.from("competition_state").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", 1);
    if (error) toast.error(error.message);
  }

  async function setRound(r: number) {
    if (r < 1 || r > 7) return;
    if (r >= 5 && !state?.top5_published) {
      toast.error("You must publish the Top 5 finalists before starting Round 5!");
      return;
    }
    await updateState({ current_round: r, round_status: "open" });
    toast.success(`Round ${r} opened for scoring`);
  }

  async function closeCurrentRound() {
    await updateState({ round_status: "closed" });
    toast.success(`Round ${currentRound} closed`);
  }

  async function publishTop5() {
    const top5Ids = rInitial.slice(0, 5).map((e) => e.contestant.id);
    await supabase.from("contestants").update({ is_top5: false }).neq("id", "00000000-0000-0000-0000-000000000000");
    if (top5Ids.length) {
      await supabase.from("contestants").update({ is_top5: true }).in("id", top5Ids);
    }
    await updateState({ top5_published: true });
    toast.success("Top 5 finalists published!");
  }

  async function publishWinners() {
    await updateState({ winners_published: true, top3_published: true });
    toast.success("Top 3 Winners published!");
  }

  async function toggleLeaderboardVisibility() {
    const next = !state?.leaderboard_visible;
    const { error } = await supabase
      .from("competition_state")
      .update({ leaderboard_visible: next, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) {
      toast.error("Leaderboard toggle error: " + error.message);
      return;
    }
    if (state) setState({ ...state, leaderboard_visible: next } as any);
    toast.success(`Leaderboard is now ${next ? "visible to judges" : "hidden from judges"}`);
  }

  async function resetCompetition() {
    await supabase.from("scores").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("contestants").update({ is_top5: false }).neq("id", "00000000-0000-0000-0000-000000000000");
    await updateState({
      current_round: 0,
      round_status: "pending",
      top5_published: false,
      top3_published: false,
      winners_published: false,
    });
    toast.success("Competition reset");
  }

  async function removeJudge(judgeId: string, name: string) {
    const { error: se } = await supabase.from("scores").delete().eq("judge_id", judgeId);
    if (se) { toast.error(se.message); return; }
    const { error: je } = await supabase.from("judges").delete().eq("id", judgeId);
    if (je) { toast.error(je.message); return; }
    toast.success(`Removed ${name} and their scores`);
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage the 7 rounds, Top 5 qualification, judges, and results.</p>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout}><LogOut className="mr-1 h-4 w-4" />Lock</Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <Stat href="#round-controls" icon={<Crown className="h-4 w-4 text-gold" />} label="Current round" value={currentRound === 0 ? "Not Started" : `Round ${currentRound} (${currentRound <= 4 ? "Prelims" : "Finals"})`} />
        <Stat href="#manage-judges" icon={<Users className="h-4 w-4 text-gold" />} label="Judges" value={judges.length} />
        <Stat href="#leaderboard-preview" icon={<Users className="h-4 w-4 text-gold" />} label="Contestants" value={currentRound >= 5 ? `${rTop5Pool.length} (Top 5)` : contestants.length} />
        <Stat href="#leaderboard-preview" icon={<ListChecks className="h-4 w-4 text-gold" />} label="Scores submitted" value={scores.length} />
      </div>

      {/* Round Management Controls */}
      <div id="round-controls" className="mt-6 space-y-4">
        <Card className="glass border-white/10 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          <CardContent className="p-5 relative">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-xl font-bold text-white text-glow">
                  {currentRound === 0 ? "Competition Not Started" : `Round ${currentRound} ${currentRound <= 4 ? "— Preliminary Phase" : "— Top 5 Final Stage"}`}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {currentRound <= 4 ? "Rounds 1–4: All 20 contestants compete." : "Rounds 5–7: Top 5 finalists compete for Top 3."}
                </p>
              </div>
              <Badge className={roundStatus === "open" ? "bg-gold text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]" : "bg-white/10 text-white"} variant={roundStatus === "open" ? "default" : "secondary"}>
                {roundStatus.toUpperCase()}
              </Badge>
            </div>

            {/* Quick Round Navigation */}
            <div className="mt-5 grid grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((r) => {
                const isCurrent = currentRound === r;
                const isFinals = r >= 5;
                const isDisabled = isFinals && !state.top5_published;
                return (
                  <button
                    key={r}
                    disabled={isDisabled}
                    onClick={() => setRound(r)}
                    className={[
                      "flex flex-col items-center justify-center p-3 rounded-lg border transition-all text-xs font-bold",
                      isCurrent ? "border-gold bg-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105" : isFinals ? "border-gold/30 bg-gold/10 text-gold hover:bg-gold/20" : "border-white/10 bg-white/5 text-white hover:bg-white/10",
                      isDisabled ? "opacity-40 cursor-not-allowed" : ""
                    ].join(" ")}
                  >
                    <span>Round {r}</span>
                    <span className="text-[10px] opacity-75 font-normal">{r <= 4 ? "Prelim" : "Final"}</span>
                  </button>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="mt-5 flex flex-wrap gap-2">
              {currentRound === 0 ? (
                <Button onClick={() => setRound(1)} size="lg" className="bg-gold text-black hover:bg-gold-soft">
                  <Play className="mr-2 h-4 w-4" /> Start Round 1
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={closeCurrentRound} disabled={roundStatus !== "open"}>
                    <Square className="mr-1.5 h-4 w-4" /> Close Round {currentRound}
                  </Button>

                  {currentRound < 7 && (
                    <Button onClick={() => setRound(currentRound + 1)} disabled={currentRound === 4 && !state.top5_published}>
                      <ChevronRight className="mr-1.5 h-4 w-4" /> Open Round {currentRound + 1}
                    </Button>
                  )}
                </>
              )}

              {currentRound >= 4 && (
                <Button
                  variant={state.top5_published ? "outline" : "default"}
                  onClick={publishTop5}
                  disabled={state.top5_published}
                  className={!state.top5_published ? "bg-gold text-black hover:bg-gold/90 font-bold" : ""}
                >
                  <Trophy className="mr-1.5 h-4 w-4" /> {state.top5_published ? "Top 5 Published ✓" : "Publish Top 5 Finalists"}
                </Button>
              )}

              {currentRound >= 7 && (
                <Button
                  onClick={publishWinners}
                  disabled={state.winners_published}
                  className="bg-gold text-black hover:bg-gold/90 font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                >
                  <Crown className="mr-1.5 h-4 w-4" /> {state.winners_published ? "Top 3 Winners Published ✓" : "Publish Final Top 3 Winners"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card id="leaderboard-preview" className="mt-6 glass border-white/10">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-white text-glow">Live Leaderboard Preview</h2>
              <p className="text-xs text-muted-foreground mt-1">
                {currentRound >= 5 ? "Top 5 Stage (Rounds 5–7 Standings)" : "Preliminary Stage (Rounds 1–4 Cumulative)"}
              </p>
            </div>
            <Button 
              variant={state.leaderboard_visible ? "default" : "outline"} 
              className={state.leaderboard_visible ? "bg-gold text-black hover:bg-gold-soft shadow-[0_0_15px_rgba(212,175,55,0.4)]" : "text-muted-foreground"}
              onClick={toggleLeaderboardVisibility}
            >
              {state.leaderboard_visible ? "Visible to Judges" : "Hidden from Judges"}
            </Button>
          </div>
          <div className="mt-4 space-y-1 text-sm">
            {(currentRound >= 5 ? rFinal : rInitial).slice(0, 10).map((e) => (
              <div key={e.contestant.id} className="flex items-center justify-between border-b border-white/10 py-2 last:border-0">
                <span className="font-mono w-8 text-muted-foreground">{e.rank}.</span>
                <span className="flex-1 truncate font-semibold">#{e.contestant.number} {e.contestant.name}</span>
                <span className="font-semibold tabular-nums text-gold">{e.average.toFixed(2)}</span>
                <span className="ml-3 text-xs text-muted-foreground">{e.judgeCount} judges · {e.scoresCount} scores</span>
              </div>
            ))}
            {(currentRound >= 5 ? rFinal : rInitial).length === 0 && (
              <p className="py-3 text-muted-foreground">No scores yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card id="manage-judges" className="mt-4 glass border-white/10">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-white text-glow">Manage Judges</h2>
            <Badge variant="secondary">{judges.length} active</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Removing a judge deletes their account and all scores they've submitted.</p>
          <div className="mt-3 divide-y divide-white/10">
            {judges.length === 0 && <p className="py-4 text-sm text-muted-foreground">No judges have signed in yet.</p>}
            {judges.map((j) => {
              const jScores = scores.filter((s) => s.judge_id === j.id).length;
              return (
                <div key={j.id} className="flex items-center justify-between gap-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{j.name}</p>
                    <p className="text-xs text-muted-foreground">{jScores} score{jScores === 1 ? "" : "s"} submitted</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                        <UserX className="mr-1 h-4 w-4" /> Remove
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove judge {j.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This deletes the judge and all {jScores} score{jScores === 1 ? "" : "s"} they submitted. Leaderboard averages will recalculate immediately.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => removeJudge(j.id, j.name)} className="bg-destructive text-destructive-foreground">
                          Remove judge
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4 glass border-destructive/40 shadow-[0_0_15px_rgba(220,38,38,0.1)]">
        <CardContent className="p-5">
          <h2 className="font-display text-xl font-bold text-destructive drop-shadow-[0_0_5px_rgba(220,38,38,0.4)]">Danger Zone</h2>
          <p className="text-sm text-muted-foreground">Reset the competition. This deletes all scores and clears finalist qualifications.</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="mt-3"><RotateCcw className="mr-1 h-4 w-4" /> Reset competition</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset the entire competition?</AlertDialogTitle>
                <AlertDialogDescription>
                  All scores will be permanently deleted and the competition reset to Round 0. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetCompetition} className="bg-destructive text-destructive-foreground">Reset</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: React.ReactNode; href?: string }) {
  const content = (
    <Card className={`glass border-white/10 hover:bg-white/5 transition-colors ${href ? "cursor-pointer hover:border-gold/50" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/50">{icon}{label}</div>
        <p className="mt-1 font-display text-3xl font-bold text-white text-glow">{value}</p>
      </CardContent>
    </Card>
  );
  if (href) {
    return <a href={href} className="block hover:scale-[1.02] transition-transform">{content}</a>;
  }
  return content;
}
