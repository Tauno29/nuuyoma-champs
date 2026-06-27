import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type Judge = { id: string; name: string };
type Ctx = {
  judge: Judge | null;
  loading: boolean;
  signIn: (name: string) => Promise<{ error?: string }>;
  signOut: () => void;
};

const JudgeCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "miss_champs_judge";

export function JudgeProvider({ children }: { children: ReactNode }) {
  const [judge, setJudge] = useState<Judge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setJudge(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const signIn = async (rawName: string) => {
    const name = rawName.trim().replace(/\s+/g, " ");
    if (name.length < 2) return { error: "Please enter your full name." };
    // Try fetch existing
    const { data: existing } = await supabase
      .from("judges")
      .select("id, name")
      .ilike("name", name)
      .maybeSingle();
    let j: Judge | null = existing ?? null;
    if (!j) {
      const { data, error } = await supabase
        .from("judges")
        .insert({ name })
        .select("id, name")
        .single();
      if (error) return { error: error.message };
      j = data;
    }
    setJudge(j);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(j));
    return {};
  };

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    setJudge(null);
  };

  return (
    <JudgeCtx.Provider value={{ judge, loading, signIn, signOut }}>
      {children}
    </JudgeCtx.Provider>
  );
}

export function useJudge() {
  const c = useContext(JudgeCtx);
  if (!c) throw new Error("useJudge must be used within JudgeProvider");
  return c;
}
