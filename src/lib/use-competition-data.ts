import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { CompetitionState, Contestant, Judge, Score } from "./competition";

export function useCompetitionData() {
  const [state, setState] = useState<CompetitionState | null>(null);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const [s, c, sc, j] = await Promise.all([
        supabase.from("competition_state").select("*").eq("id", 1).maybeSingle(),
        supabase.from("contestants").select("*").order("number"),
        supabase.from("scores").select("*"),
        supabase.from("judges").select("*").order("created_at"),
      ]);
      if (!mounted) return;
      if (s.data) setState(s.data as CompetitionState);
      if (c.data) setContestants(c.data as Contestant[]);
      if (sc.data) setScores(sc.data as Score[]);
      if (j.data) setJudges(j.data as Judge[]);
      setLoading(false);
    }
    load();

    const ch = supabase
      .channel("competition")
      .on("postgres_changes", { event: "*", schema: "public", table: "competition_state" }, (p) => {
        if (p.new && (p.new as any).id) setState(p.new as CompetitionState);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "contestants" }, () => {
        supabase.from("contestants").select("*").order("number").then(({ data }) => {
          if (data && mounted) setContestants(data as Contestant[]);
        });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "scores" }, () => {
        supabase.from("scores").select("*").then(({ data }) => {
          if (data && mounted) setScores(data as Score[]);
        });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "judges" }, () => {
        supabase.from("judges").select("*").order("created_at").then(({ data }) => {
          if (data && mounted) setJudges(data as Judge[]);
        });
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(ch);
    };
  }, []);

  return { state, contestants, scores, judges, loading };
}
