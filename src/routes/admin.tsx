import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useCompetitionData } from "@/lib/use-competition-data";
import { ADMIN_PIN, WALKS_PER_ROUND, computeLeaderboard } from "@/lib/competition";
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
  head: () => ({ meta: [{ title: "Admin — Miss Champs" }] }),
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
  const { state, contestants, scores, judges, loading } = useCompetitionData();

  const r1 = useMemo(() => computeLeaderboard(contestants, scores, 1), [contestants, scores]);
  const r2Pool = useMemo(() => contestants.filter((c) => c.qualified_round2), [contestants]);
  const r2 = useMemo(() => computeLeaderboard(r2Pool, scores, 2), [r2Pool, scores]);

  if (loading || !state) return <div className="py-12 text-center text-muted-foreground">Loading…</div>;

  async function updateState(patch: Record<string, unknown>) {
    const { error } = await supabase.from("competition_state").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", 1);
    if (error) toast.error(error.message);
  }

  async function startRound1() {
    await updateState({ current_round: 1, round1_status: "open", round1_current_walk: 1, top5_published: false });
    toast.success("Round 1 started — Walk 1");
  }
  async function closeRound1() {
    await updateState({ round1_status: "closed" });
    toast.success("Round 1 closed");
  }
  async function setRound1Walk(w: number) {
    if (w < 1 || w > WALKS_PER_ROUND) return;
    await updateState({ round1_current_walk: w });
    toast.success(`Round 1 · Walk ${w}`);
  }
  async function setRound2Walk(w: number) {
    if (w < 1 || w > WALKS_PER_ROUND) return;
    await updateState({ round2_current_walk: w });
    toast.success(`Round 2 · Walk ${w}`);
  }
  async function publishTop5() {
    const top5Ids = r1.slice(0, 5).map((e) => e.contestant.id);
    await supabase.from("contestants").update({ qualified_round2: false }).neq("id", "00000000-0000-0000-0000-000000000000");
    if (top5Ids.length) {
      await supabase.from("contestants").update({ qualified_round2: true }).in("id", top5Ids);
    }
    await updateState({ top5_published: true });
    toast.success("Top 5 finalists published");
  }
  async function startRound2() {
    if (!state?.top5_published) { toast.error("Publish Top 5 first"); return; }
    await updateState({ current_round: 2, round2_status: "open", round2_current_walk: 1, winners_published: false });
    toast.success("Round 2 started — Walk 1");
  }
  async function closeRound2() {
    await updateState({ round2_status: "closed" });
    toast.success("Round 2 closed");
  }
  async function publishWinners() {
    await updateState({ winners_published: true });
    toast.success("Winners published");
  }
  async function resetCompetition() {
    await supabase.from("scores").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("contestants").update({ qualified_round2: false }).neq("id", "00000000-0000-0000-0000-000000000000");
    await updateState({
      current_round: 0, round1_status: "pending", round2_status: "pending",
      round1_current_walk: 1, round2_current_walk: 1,
      top5_published: false, winners_published: false,
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

  const r1Walk = state.round1_current_walk ?? 1;
  const r2Walk = state.round2_current_walk ?? 1;

  return (
    <div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage rounds, walks, judges, and results.</p>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout}><LogOut className="mr-1 h-4 w-4" />Lock</Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <Stat icon={<Crown className="h-4 w-4" />} label="Current round" value={state.current_round === 0 ? "—" : `R${state.current_round} · W${state.current_round === 1 ? r1Walk : r2Walk}`} />
        <Stat icon={<Users className="h-4 w-4" />} label="Judges" value={judges.length} />
        <Stat icon={<Users className="h-4 w-4" />} label="Contestants" value={contestants.length} />
        <Stat icon={<ListChecks className="h-4 w-4" />} label="Scores submitted" value={scores.length} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Round 1 — Preliminary</h2>
              <Badge className={state.round1_status === "open" ? "bg-gold text-black" : ""} variant={state.round1_status === "open" ? "default" : "secondary"}>
                {state.round1_status}
              </Badge>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={startRound1} disabled={state.round1_status !== "pending"}>
                <Play className="mr-1 h-4 w-4" /> Start Round 1
              </Button>
              <Button variant="outline" onClick={closeRound1} disabled={state.round1_status !== "open"}>
                <Square className="mr-1 h-4 w-4" /> Close Round 1
              </Button>
              <Button variant="outline" onClick={publishTop5} disabled={state.round1_status !== "closed" || state.top5_published}>
                <Trophy className="mr-1 h-4 w-4" /> Publish Top 5
              </Button>
            </div>
            <WalkControls
              disabled={state.round1_status !== "open"}
              walk={r1Walk}
              onPrev={() => setRound1Walk(r1Walk - 1)}
              onNext={() => setRound1Walk(r1Walk + 1)}
              onSet={setRound1Walk}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Round 2 — Finals</h2>
              <Badge className={state.round2_status === "open" ? "bg-gold text-black" : ""} variant={state.round2_status === "open" ? "default" : "secondary"}>
                {state.round2_status}
              </Badge>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={startRound2} disabled={!state.top5_published || state.round2_status !== "pending"}>
                <Play className="mr-1 h-4 w-4" /> Start Round 2
              </Button>
              <Button variant="outline" onClick={closeRound2} disabled={state.round2_status !== "open"}>
                <Square className="mr-1 h-4 w-4" /> Close Round 2
              </Button>
              <Button onClick={publishWinners} disabled={state.round2_status !== "closed" || state.winners_published} className="bg-gold text-black hover:bg-gold/90">
                <Crown className="mr-1 h-4 w-4" /> Publish Winners
              </Button>
            </div>
            <WalkControls
              disabled={state.round2_status !== "open"}
              walk={r2Walk}
              onPrev={() => setRound2Walk(r2Walk - 1)}
              onNext={() => setRound2Walk(r2Walk + 1)}
              onSet={setRound2Walk}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardContent className="p-5">
          <h2 className="font-display text-xl font-bold">Live Leaderboard Preview</h2>
          <p className="text-xs text-muted-foreground">
            {state.current_round === 2 ? "Round 2 (Top 5) · cumulative across walks" : "Round 1 standings · cumulative across walks"}
          </p>
          <div className="mt-3 space-y-1 text-sm">
            {(state.current_round === 2 ? r2 : r1).slice(0, 10).map((e) => (
              <div key={e.contestant.id} className="flex items-center justify-between border-b py-1.5 last:border-0">
                <span className="font-mono w-8 text-muted-foreground">{e.rank}.</span>
                <span className="flex-1 truncate">#{e.contestant.number} {e.contestant.name}</span>
                <span className="font-semibold tabular-nums">{e.average.toFixed(2)}</span>
                <span className="ml-3 text-xs text-muted-foreground">{e.judgeCount} judges · {e.walksScored} scores</span>
              </div>
            ))}
            {(state.current_round === 2 ? r2 : r1).length === 0 && (
              <p className="py-3 text-muted-foreground">No scores yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Manage Judges</h2>
            <Badge variant="secondary">{judges.length} active</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Removing a judge deletes their account and all scores they've submitted — cumulative averages update instantly.</p>
          <div className="mt-3 divide-y">
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

      <Card className="mt-4 border-destructive/30">
        <CardContent className="p-5">
          <h2 className="font-display text-xl font-bold text-destructive">Danger Zone</h2>
          <p className="text-sm text-muted-foreground">Reset the competition. This deletes all scores and clears finalist qualifications.</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="mt-3"><RotateCcw className="mr-1 h-4 w-4" /> Reset competition</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset the entire competition?</AlertDialogTitle>
                <AlertDialogDescription>
                  All scores will be permanently deleted and both rounds reset to pending. This cannot be undone.
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

function WalkControls({ disabled, walk, onPrev, onNext, onSet }: { disabled: boolean; walk: number; onPrev: () => void; onNext: () => void; onSet: (w: number) => void }) {
  return (
    <div className="mt-4 rounded-lg border bg-secondary/40 p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Current walk</p>
          <p className="font-display text-lg font-bold">Walk {walk} of {WALKS_PER_ROUND}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="outline" disabled={disabled || walk <= 1} onClick={onPrev}><ChevronLeft className="h-4 w-4" /></Button>
          <Button size="sm" variant="outline" disabled={disabled || walk >= WALKS_PER_ROUND} onClick={onNext}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="mt-2 flex gap-1.5">
        {Array.from({ length: WALKS_PER_ROUND }).map((_, i) => {
          const w = i + 1;
          const active = w === walk;
          return (
            <button
              key={w}
              disabled={disabled}
              onClick={() => onSet(w)}
              className={[
                "flex-1 rounded-md py-1.5 text-xs font-semibold transition",
                active ? "bg-gold text-black" : "bg-background hover:bg-secondary",
                disabled ? "opacity-50" : "",
              ].join(" ")}
            >
              Walk {w}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">{icon}{label}</div>
        <p className="mt-1 font-display text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
