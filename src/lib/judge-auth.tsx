import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type Judge = { id: string; name: string; approved?: boolean };
type SignInResult = { error?: string; pending?: boolean; judge?: Judge };

type Ctx = {
  judge: Judge | null;
  loading: boolean;
  signIn: (name: string) => Promise<SignInResult>;
  signOut: () => void;
  finalizeSignIn: (j: Judge) => void;
};

const JudgeCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "miss_champs_judge";

export function JudgeProvider({ children }: { children: ReactNode }) {
  const [judge, setJudge] = useState<Judge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const j = JSON.parse(raw);
          // Only log them in if they are still approved
          const { data } = await supabase.from("judges").select("id, approved").eq("id", j.id).maybeSingle();
          if (data && data.approved) {
            setJudge(j);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const signIn = async (rawName: string): Promise<SignInResult> => {
    const name = rawName.trim().replace(/\s+/g, " ");
    if (name.length < 2) return { error: "Please enter your full name." };
    
    // Try fetch existing
    const { data: existing } = await supabase
      .from("judges")
      .select("id, name, approved")
      .ilike("name", name)
      .maybeSingle();
      
    let j: Judge | null = existing ?? null;
    
    if (!j) {
      // Create new request
      const { data, error } = await supabase
        .from("judges")
        .insert({ name })
        .select("id, name, approved")
        .single();
      if (error) return { error: error.message };
      j = data;
    }

    if (!j.approved) {
      return { pending: true, judge: j };
    }

    finalizeSignIn(j);
    return { judge: j };
  };

  const finalizeSignIn = (j: Judge) => {
    setJudge(j);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(j));
  };

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    setJudge(null);
  };

  return (
    <JudgeCtx.Provider value={{ judge, loading, signIn, signOut, finalizeSignIn }}>
      {children}
    </JudgeCtx.Provider>
  );
}

export function useJudge() {
  const c = useContext(JudgeCtx);
  if (!c) throw new Error("useJudge must be used within JudgeProvider");
  return c;
}
