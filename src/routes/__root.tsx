import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { JudgeProvider, useJudge } from "@/lib/judge-auth";
import { Toaster } from "@/components/ui/sonner";
import { Crown, LogOut } from "lucide-react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-bold text-foreground">404</h1>
        <p className="mt-4 text-muted-foreground">Page not found</p>
        <Link to="/" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Miss Champs Modelling — Nuuyoma SSS Judging" },
      { name: "description", content: "Live judging app for the Nuuyoma Senior Secondary School Miss Champs Modelling Competition." },
      { name: "theme-color", content: "#000000" },
      { property: "og:title", content: "Miss Champs Modelling — Nuuyoma SSS" },
      { property: "og:description", content: "Official judging app for the Miss Champs Modelling Competition." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700;900&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Nav() {
  const { judge, signOut } = useJudge();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-gold" />
          <span className="font-display text-lg font-bold tracking-tight">Miss Champs</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {judge && (
            <Link to="/judge" className="rounded-md px-3 py-2 hover:bg-secondary" activeProps={{ className: "rounded-md px-3 py-2 bg-secondary font-medium" }}>
              Score
            </Link>
          )}
          <Link to="/leaderboard" className="rounded-md px-3 py-2 hover:bg-secondary" activeProps={{ className: "rounded-md px-3 py-2 bg-secondary font-medium" }}>
            Leaderboard
          </Link>
          <Link to="/admin" className="rounded-md px-3 py-2 hover:bg-secondary" activeProps={{ className: "rounded-md px-3 py-2 bg-secondary font-medium" }}>
            Admin
          </Link>
          {judge && (
            <button onClick={signOut} className="ml-2 inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs hover:bg-secondary" title={`Signed in as ${judge.name}`}>
              <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Sign out</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <JudgeProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Nav />
          <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
            <Outlet />
          </main>
        </div>
        <Toaster richColors position="top-center" />
      </JudgeProvider>
    </QueryClientProvider>
  );
}
