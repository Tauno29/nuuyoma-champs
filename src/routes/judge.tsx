import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef } from "react";
import { useJudge } from "@/lib/judge-auth";
import { useCompetitionData } from "@/lib/use-competition-data";
import { CATEGORIES, computeLeaderboard, type CategoryKey, type Contestant } from "@/lib/competition";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Check, Lock, User } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/judge")({
  head: () => ({ meta: [{ title: "Score — PAGENTS MODELLING SYS" }] }),
  component: JudgePage,
});

type CategoryScores = Record<CategoryKey, number>;
const emptyScores = (): CategoryScores => ({
  confidence: 0, catwalk: 0, creativity: 0, stage_presence: 0, overall_appearance: 0,
});

function JudgePage() {
  const { judge, loading: authLoading } = useJudge();
  const navigate = useNavigate();
  const { state, contestants, scores, loading } = useCompetitionData();
  const [idx, setIdx] = useState(0);
  const [cats, setCats] = useState<CategoryScores>(emptyScores());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !judge) navigate({ to: "/" });
  }, [authLoading, judge, navigate]);

  const prevVisible = useRef(state?.leaderboard_visible);
  useEffect(() => {
    if (state?.leaderboard_visible && !prevVisible.current) {
      toast("🏆 The Live Leaderboard is now visible!", {
        description: "You can now check the current standings.",
        action: { label: "View", onClick: () => navigate({ to: "/leaderboard" }) },
        duration: 8000,
      });
    }
    prevVisible.current = state?.leaderboard_visible;
  }, [state?.leaderboard_visible, navigate]);

  const round = state?.current_round ?? 0;
  const roundStatus = state?.round_status ?? "pending";
  const isOpen = roundStatus === "open";

  const activeContestants = useMemo<Contestant[]>(() => {
    if (round >= 5) {
      const top5 = contestants.filter((c) => c.is_top5);
      const leaderboard = computeLeaderboard(top5, scores, [1, 2, 3, 4]);
      return leaderboard.map((l) => l.contestant);
    }
    return contestants;
  }, [contestants, round, scores]);

  const current = activeContestants[idx];

  const existingScore = useMemo(() => {
    if (!judge || !current || !round) return null;
    return scores.find(
      (s) => s.judge_id === judge.id && s.contestant_id === current.id && s.round === round,
    );
  }, [scores, judge, current, round]);

  useEffect(() => {
    if (existingScore) {
      setCats({
        confidence: existingScore.confidence,
        catwalk: existingScore.catwalk,
        creativity: existingScore.creativity,
        stage_presence: existingScore.stage_presence,
        overall_appearance: existingScore.overall_appearance,
      });
    } else {
      setCats(emptyScores());
    }
  }, [existingScore?.id, current?.id, round]);

  const total = CATEGORIES.reduce((sum, c) => sum + (cats[c.key] || 0), 0);

  if (authLoading || loading) {
    return <div className="py-12 text-center text-muted-foreground">Loading…</div>;
  }
  if (!judge) return null;

  if (round === 0) {
    return <EmptyState title="Competition not started" message="Waiting for the administrator to start Round 1." />;
  }
  if (activeContestants.length === 0) {
    return (
      <EmptyState
        title="No contestants to score"
        message={round >= 5 ? "The Top 5 finalists haven't been published yet." : "No contestants are registered."}
      />
    );
  }

  async function handleSubmit() {
    if (!judge || !current || !isOpen) return;
    
    const hasZero = CATEGORIES.some(c => cats[c.key] === 0);
    if (hasZero) {
      toast.error("Zero Score Detected! Please rate all categories (1-10) before submitting.", {
        duration: 5000,
      });
      return;
    }

    setSaving(true);
    const payload = {
      judge_id: judge.id,
      contestant_id: current.id,
      round,
      ...cats,
      total,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from("scores")
      .upsert(payload, { onConflict: "judge_id,contestant_id,round" });
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Saved Round ${round} score for #${current.number}`);
      if (idx < activeContestants.length - 1) setIdx(idx + 1);
    }
  }

  const scoredCount = activeContestants.filter((c) =>
    scores.some((s) => s.judge_id === judge.id && s.contestant_id === c.id && s.round === round),
  ).length;

  const roundLabel = round >= 5 ? `Round ${round} — Top 5 Finals` : `Round ${round} — Preliminary Phase`;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Round {round} of 7
          </p>
          <h1 className="font-display text-2xl font-bold">{roundLabel}</h1>
        </div>
        <Badge variant={isOpen ? "default" : "secondary"} className={isOpen ? "bg-gold text-black" : ""}>
          {isOpen ? "Open" : roundStatus === "closed" ? "Closed" : "Pending"}
        </Badge>
      </div>

      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>Contestant {idx + 1} of {activeContestants.length}</span>
        <span>{scoredCount} / {activeContestants.length} scored this round</span>
      </div>
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full bg-gold transition-all" style={{ width: `${((idx + 1) / activeContestants.length) * 100}%` }} />
      </div>

      <Card className="glass-gold border-gold/20 shadow-[0_0_40px_rgba(212,175,55,0.05)] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />
        <CardContent className="p-5 sm:p-6 relative">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gold/10 ring-2 ring-gold/40 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              {current.photo_url ? (
                <img src={current.photo_url} alt={current.name} className="h-full w-full rounded-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-gold drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]" />
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gold/70">Contestant · Round {round}</p>
              <h2 className="font-display text-3xl font-bold text-white text-glow">#{current.number}</h2>
              <p className="text-sm text-white/80">{current.name}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs uppercase tracking-wider text-gold/70">Total</p>
              <p className="font-display text-3xl font-bold text-gold text-glow">{total}<span className="text-base text-white/50">/50</span></p>
            </div>
          </div>

          {!isOpen && (
            <div className="mb-4 flex items-center gap-2 rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-200 backdrop-blur-sm">
              <Lock className="h-4 w-4" />
              {roundStatus === "closed" ? "Round closed. Scores are read-only." : "Waiting for the administrator to open this round."}
            </div>
          )}

          <div className="space-y-6">
            {CATEGORIES.map((cat) => (
              <div key={cat.key} className="group">
                <div className="mb-2 flex items-baseline justify-between">
                  <label className="text-sm font-medium text-white/90 group-hover:text-gold transition-colors">{cat.label}</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      value={cats[cat.key]}
                      disabled={!isOpen}
                      onChange={(e) => {
                        const v = Math.min(10, Math.max(0, Number(e.target.value) || 0));
                        setCats((p) => ({ ...p, [cat.key]: v }));
                      }}
                      className="h-9 w-16 text-center bg-black/40 border-white/10 focus-visible:ring-gold focus-visible:border-gold text-white font-semibold"
                    />
                    <span className="text-xs text-white/50">/ 10</span>
                  </div>
                </div>
                <Slider
                  value={[cats[cat.key]]}
                  min={0}
                  max={10}
                  step={1}
                  disabled={!isOpen}
                  onValueChange={(v) => setCats((p) => ({ ...p, [cat.key]: v[0] }))}
                  className="[&_[role=slider]]:bg-gold [&_[role=slider]]:border-gold [&_[role=slider]]:shadow-[0_0_10px_rgba(212,175,55,0.8)]"
                />
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3">
            <Button variant="outline" size="lg" className="h-12 bg-white/5 border-white/10 hover:bg-white/10 text-white" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              className="h-12 flex-1 bg-gold text-black hover:bg-gold-soft transition-all duration-300 hover:scale-[1.02] shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] font-bold text-base"
              disabled={!isOpen || saving}
              onClick={handleSubmit}
            >
              <Check className="mr-2 h-5 w-5 drop-shadow-sm" />
              {existingScore ? `Update Round ${round} score` : `Submit Round ${round} score`}
            </Button>
            <Button variant="outline" size="lg" className="h-12 bg-white/5 border-white/10 hover:bg-white/10 text-white" disabled={idx === activeContestants.length - 1} onClick={() => setIdx(idx + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold/70">Jump to contestant</h3>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {activeContestants.map((c, i) => {
            const scored = scores.some((s) => s.judge_id === judge.id && s.contestant_id === c.id && s.round === round);
            const active = i === idx;
            return (
              <button
                key={c.id}
                onClick={() => setIdx(i)}
                className={[
                  "relative h-12 rounded-md border text-sm font-bold transition-all duration-300",
                  active ? "border-gold bg-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-[1.05]" : scored ? "border-gold/50 bg-gold/10 text-gold" : "border-white/10 bg-black/40 hover:bg-white/10 text-white",
                ].join(" ")}
              >
                {c.number}
                {scored && !active && <Check className="absolute right-1 top-1 h-3 w-3 text-gold drop-shadow-[0_0_2px_rgba(212,175,55,1)]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center animate-float">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 ring-1 ring-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
        <Lock className="h-8 w-8 text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
      </div>
      <h2 className="mt-6 font-display text-3xl font-bold text-white text-glow">{title}</h2>
      <p className="mt-2 text-white/70">{message}</p>
    </div>
  );
}
