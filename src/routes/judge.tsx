import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useJudge } from "@/lib/judge-auth";
import { useCompetitionData } from "@/lib/use-competition-data";
import { CATEGORIES, WALKS_PER_ROUND, type CategoryKey, type Contestant } from "@/lib/competition";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Check, Lock, User } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/judge")({
  head: () => ({ meta: [{ title: "Score — Miss Champs" }] }),
  component: JudgePage,
});

type CategoryScores = Record<CategoryKey, number>;
const emptyScores = (): CategoryScores => ({
  confidence: 10, catwalk: 10, creativity: 10, stage_presence: 10, overall_appearance: 10,
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

  const round = state?.current_round ?? 0;
  const roundStatus = round === 1 ? state?.round1_status : round === 2 ? state?.round2_status : "pending";
  const walk = round === 1 ? state?.round1_current_walk ?? 1 : round === 2 ? state?.round2_current_walk ?? 1 : 1;
  const isOpen = roundStatus === "open";

  const activeContestants = useMemo<Contestant[]>(() => {
    if (round === 2) return contestants.filter((c) => c.qualified_round2);
    return contestants;
  }, [contestants, round]);

  const current = activeContestants[idx];

  const existingScore = useMemo(() => {
    if (!judge || !current || !round) return null;
    return scores.find(
      (s) => s.judge_id === judge.id && s.contestant_id === current.id && s.round === round && s.walk === walk,
    );
  }, [scores, judge, current, round, walk]);

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
  }, [existingScore?.id, current?.id, walk]);

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
        message={round === 2 ? "The Top 5 finalists haven't been published yet." : "No contestants are registered."}
      />
    );
  }

  async function handleSubmit() {
    if (!judge || !current || !isOpen) return;
    setSaving(true);
    const payload = {
      judge_id: judge.id,
      contestant_id: current.id,
      round,
      walk,
      ...cats,
      total,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from("scores")
      .upsert(payload, { onConflict: "judge_id,contestant_id,round,walk" });
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Saved Walk ${walk} score for #${current.number}`);
      if (idx < activeContestants.length - 1) setIdx(idx + 1);
    }
  }

  const scoredCount = activeContestants.filter((c) =>
    scores.some((s) => s.judge_id === judge.id && s.contestant_id === c.id && s.round === round && s.walk === walk),
  ).length;

  const roundLabel = round === 2 ? "Final Round — Top 5" : "Round 1 — Preliminary";

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Round {round} · Walk {walk} of {WALKS_PER_ROUND}
          </p>
          <h1 className="font-display text-2xl font-bold">{roundLabel}</h1>
        </div>
        <Badge variant={isOpen ? "default" : "secondary"} className={isOpen ? "bg-gold text-black" : ""}>
          {isOpen ? "Open" : roundStatus === "closed" ? "Closed" : "Pending"}
        </Badge>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {Array.from({ length: WALKS_PER_ROUND }).map((_, i) => {
          const w = i + 1;
          const active = w === walk;
          return (
            <span
              key={w}
              className={[
                "rounded-full px-3 py-1 text-xs font-semibold",
                active ? "bg-gold text-black" : w < walk ? "bg-gold-soft text-foreground" : "bg-secondary text-muted-foreground",
              ].join(" ")}
            >
              Walk {w}
            </span>
          );
        })}
        <span className="ml-auto text-xs text-muted-foreground">Admin controls the current walk</span>
      </div>

      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>Contestant {idx + 1} of {activeContestants.length}</span>
        <span>{scoredCount} / {activeContestants.length} scored this walk</span>
      </div>
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full bg-gold transition-all" style={{ width: `${((idx + 1) / activeContestants.length) * 100}%` }} />
      </div>

      <Card className="border-gold/30 shadow-lg">
        <CardContent className="p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gold-soft ring-2 ring-gold/40">
              {current.photo_url ? (
                <img src={current.photo_url} alt={current.name} className="h-full w-full rounded-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-gold" />
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Contestant · Walk {walk}</p>
              <h2 className="font-display text-3xl font-bold">#{current.number}</h2>
              <p className="text-sm text-muted-foreground">{current.name}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Total</p>
              <p className="font-display text-3xl font-bold text-gold">{total}<span className="text-base text-muted-foreground">/100</span></p>
            </div>
          </div>

          {!isOpen && (
            <div className="mb-4 flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
              <Lock className="h-4 w-4" />
              {roundStatus === "closed" ? "Round closed. Scores are read-only." : "Waiting for the administrator to open this round."}
            </div>
          )}

          <div className="space-y-5">
            {CATEGORIES.map((cat) => (
              <div key={cat.key}>
                <div className="mb-2 flex items-baseline justify-between">
                  <label className="text-sm font-medium">{cat.label}</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={20}
                      value={cats[cat.key]}
                      disabled={!isOpen}
                      onChange={(e) => {
                        const v = Math.min(20, Math.max(0, Number(e.target.value) || 0));
                        setCats((p) => ({ ...p, [cat.key]: v }));
                      }}
                      className="h-9 w-16 text-center"
                    />
                    <span className="text-xs text-muted-foreground">/ 20</span>
                  </div>
                </div>
                <Slider
                  value={[cats[cat.key]]}
                  min={0}
                  max={20}
                  step={1}
                  disabled={!isOpen}
                  onValueChange={(v) => setCats((p) => ({ ...p, [cat.key]: v[0] }))}
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2">
            <Button variant="outline" size="lg" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              className="h-12 flex-1 bg-gold text-black hover:bg-gold/90"
              disabled={!isOpen || saving}
              onClick={handleSubmit}
            >
              <Check className="mr-2 h-4 w-4" />
              {existingScore ? `Update Walk ${walk} score` : `Submit Walk ${walk} score`}
            </Button>
            <Button variant="outline" size="lg" disabled={idx === activeContestants.length - 1} onClick={() => setIdx(idx + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Jump to contestant</h3>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {activeContestants.map((c, i) => {
            const scored = scores.some((s) => s.judge_id === judge.id && s.contestant_id === c.id && s.round === round && s.walk === walk);
            const active = i === idx;
            return (
              <button
                key={c.id}
                onClick={() => setIdx(i)}
                className={[
                  "relative h-12 rounded-md border text-sm font-semibold transition",
                  active ? "border-gold bg-gold text-black" : scored ? "border-gold/40 bg-gold-soft text-foreground" : "border-border bg-card hover:bg-secondary",
                ].join(" ")}
              >
                {c.number}
                {scored && !active && <Check className="absolute right-1 top-1 h-3 w-3 text-gold" />}
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
    <div className="mx-auto max-w-md py-16 text-center">
      <Lock className="mx-auto h-10 w-10 text-muted-foreground" />
      <h2 className="mt-4 font-display text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-muted-foreground">{message}</p>
    </div>
  );
}
