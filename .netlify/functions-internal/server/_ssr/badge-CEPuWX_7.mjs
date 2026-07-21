import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BNLMDY-V.mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as cn } from "./card-CfnZI4Vd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-CEPuWX_7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useCompetitionData() {
	const [state, setState] = (0, import_react.useState)(null);
	const [contestants, setContestants] = (0, import_react.useState)([]);
	const [scores, setScores] = (0, import_react.useState)([]);
	const [judges, setJudges] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		async function load() {
			const [s, c, sc, j] = await Promise.all([
				supabase.from("competition_state").select("*").eq("id", 1).maybeSingle(),
				supabase.from("contestants").select("*").order("number"),
				supabase.from("scores").select("*"),
				supabase.from("judges").select("*").order("created_at")
			]);
			if (!mounted) return;
			if (s.data) setState(s.data);
			if (c.data) setContestants(c.data);
			if (sc.data) setScores(sc.data);
			if (j.data) setJudges(j.data);
			setLoading(false);
		}
		load();
		const ch = supabase.channel("competition").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "competition_state"
		}, (p) => {
			if (p.new && p.new.id) setState(p.new);
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "contestants"
		}, () => {
			supabase.from("contestants").select("*").order("number").then(({ data }) => {
				if (data && mounted) setContestants(data);
			});
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "scores"
		}, () => {
			supabase.from("scores").select("*").then(({ data }) => {
				if (data && mounted) setScores(data);
			});
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "judges"
		}, () => {
			supabase.from("judges").select("*").order("created_at").then(({ data }) => {
				if (data && mounted) setJudges(data);
			});
		}).subscribe();
		return () => {
			mounted = false;
			supabase.removeChannel(ch);
		};
	}, []);
	return {
		state,
		setState,
		contestants,
		scores,
		judges,
		loading
	};
}
function computeLeaderboard(contestants, scores, round) {
	const byContestant = /* @__PURE__ */ new Map();
	for (const s of scores) {
		if (s.round !== round) continue;
		if (!byContestant.has(s.contestant_id)) byContestant.set(s.contestant_id, []);
		byContestant.get(s.contestant_id).push(s);
	}
	const entries = contestants.map((c) => {
		const list = byContestant.get(c.id) ?? [];
		const perJudge = /* @__PURE__ */ new Map();
		for (const s of list) perJudge.set(s.judge_id, (perJudge.get(s.judge_id) ?? 0) + s.total);
		const totals = Array.from(perJudge.values());
		const total = totals.reduce((a, b) => a + b, 0);
		return {
			contestant: c,
			average: totals.length ? total / totals.length : 0,
			total,
			judgeCount: perJudge.size,
			walksScored: list.length,
			rank: 0
		};
	});
	entries.sort((a, b) => b.average - a.average || a.contestant.number - b.contestant.number);
	let lastAvg = -1;
	let lastRank = 0;
	entries.forEach((e, i) => {
		if (e.average === lastAvg) e.rank = lastRank;
		else {
			e.rank = i + 1;
			lastRank = e.rank;
			lastAvg = e.average;
		}
	});
	return entries;
}
var CATEGORIES = [
	{
		key: "confidence",
		label: "Confidence"
	},
	{
		key: "catwalk",
		label: "Catwalk"
	},
	{
		key: "creativity",
		label: "Creativity"
	},
	{
		key: "stage_presence",
		label: "Stage Presence"
	},
	{
		key: "overall_appearance",
		label: "Overall Appearance"
	}
];
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { useCompetitionData as i, CATEGORIES as n, computeLeaderboard as r, Badge as t };
