import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Crown, Sparkles } from "lucide-react";
import { useJudge } from "@/lib/judge-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — PAGENTS MODELLING SYS" },
      { name: "description", content: "Judge sign-in for the Nuuyoma SSS PAGENTS MODELLING SYS Competition." },
    ],
  }),
  component: Index,
});

function Index() {
  const { judge, signIn } = useJudge();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(name);
    setLoading(false);
    if (error) toast.error(error);
    else {
      toast.success("Welcome, " + name.trim());
      navigate({ to: "/judge" });
    }
  }

  return (
    <div className="mx-auto max-w-md py-8">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 ring-1 ring-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.2)] animate-float">
          <Crown className="h-10 w-10 text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-gold/70">Nuuyoma Senior Secondary School</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl text-glow text-white">PAGENTS MODELLING SYS</h1>
        <p className="mt-2 font-display text-xl text-gold">Modelling Competition</p>
        <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
          <Sparkles className="h-4 w-4 text-gold" /> Official judging panel
        </p>
      </div>

      <Card className="mt-10 glass-gold border-gold/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />
        <CardContent className="p-8 relative">
          {judge ? (
            <div className="text-center">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Signed in as</p>
              <p className="mt-2 font-display text-2xl font-bold text-white text-glow">{judge.name}</p>
              <Button className="mt-6 w-full bg-gold text-black hover:bg-gold-soft transition-all duration-300 hover:scale-[1.02] shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] font-semibold" size="lg" onClick={() => navigate({ to: "/judge" })}>
                Continue judging
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gold/90 uppercase tracking-wider">Your full name</label>
                <Input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Nangolo"
                  className="mt-2 h-14 text-base bg-black/40 border-gold/30 focus-visible:ring-gold/50 text-white placeholder:text-muted-foreground/50 transition-all duration-300"
                  required
                  minLength={2}
                />
                <p className="mt-2 text-xs text-muted-foreground/70">Your name will appear next to every score you submit.</p>
              </div>
              <Button type="submit" size="lg" className="h-14 w-full text-base bg-gold text-black hover:bg-gold-soft transition-all duration-300 hover:scale-[1.02] shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] font-bold tracking-wide" disabled={loading}>
                {loading ? "Signing in…" : "Enter judging panel"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
