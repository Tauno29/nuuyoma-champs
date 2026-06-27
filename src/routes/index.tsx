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
      { title: "Sign in — Miss Champs Modelling" },
      { name: "description", content: "Judge sign-in for the Nuuyoma SSS Miss Champs Modelling Competition." },
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
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-soft">
          <Crown className="h-8 w-8 text-gold" />
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Nuuyoma Senior Secondary School</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Miss Champs</h1>
        <p className="mt-1 font-display text-xl text-gold">Modelling Competition</p>
        <p className="mt-3 inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-gold" /> Official judging panel
        </p>
      </div>

      <Card className="mt-8 border-gold/30">
        <CardContent className="p-6">
          {judge ? (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Signed in as</p>
              <p className="mt-1 font-display text-xl font-semibold">{judge.name}</p>
              <Button className="mt-4 w-full" size="lg" onClick={() => navigate({ to: "/judge" })}>
                Continue judging
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Your full name</label>
                <Input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Nangolo"
                  className="mt-1 h-12 text-base"
                  required
                  minLength={2}
                />
                <p className="mt-1 text-xs text-muted-foreground">Your name will appear next to every score you submit.</p>
              </div>
              <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={loading}>
                {loading ? "Signing in…" : "Enter judging panel"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
