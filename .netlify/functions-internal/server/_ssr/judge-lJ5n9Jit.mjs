import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BNLMDY-V.mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as CardContent, r as cn, t as Card } from "./card-CfnZI4Vd.mjs";
import { i as useCompetitionData, n as CATEGORIES, r as computeLeaderboard, t as Badge } from "./badge-CEPuWX_7.mjs";
import { n as Input, t as Button } from "./input-qsCcmt6g.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as Lock, g as Check, h as ChevronLeft, m as ChevronRight, n as User } from "../_libs/lucide-react.mjs";
import { n as useJudge } from "./judge-auth-YoW9CJBf.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/judge-lJ5n9Jit.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })]
}));
Slider.displayName = Slider$1.displayName;
var emptyScores = () => ({
	confidence: 0,
	catwalk: 0,
	creativity: 0,
	stage_presence: 0,
	overall_appearance: 0
});
function JudgePage() {
	const { judge, loading: authLoading } = useJudge();
	const navigate = useNavigate();
	const { state, contestants, scores, loading } = useCompetitionData();
	const [idx, setIdx] = (0, import_react.useState)(0);
	const [cats, setCats] = (0, import_react.useState)(emptyScores());
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!authLoading && !judge) navigate({ to: "/" });
	}, [
		authLoading,
		judge,
		navigate
	]);
	const prevVisible = (0, import_react.useRef)(state?.leaderboard_visible);
	(0, import_react.useEffect)(() => {
		if (state?.leaderboard_visible && !prevVisible.current) toast("🏆 The Live Leaderboard is now visible!", {
			description: "You can now check the current standings.",
			action: {
				label: "View",
				onClick: () => navigate({ to: "/leaderboard" })
			},
			duration: 8e3
		});
		prevVisible.current = state?.leaderboard_visible;
	}, [state?.leaderboard_visible, navigate]);
	const round = state?.current_round ?? 0;
	const roundStatus = round === 1 ? state?.round1_status : round === 2 ? state?.round2_status : "pending";
	const walk = round === 1 ? state?.round1_current_walk ?? 1 : round === 2 ? state?.round2_current_walk ?? 1 : 1;
	const isOpen = roundStatus === "open";
	const activeContestants = (0, import_react.useMemo)(() => {
		if (round === 2) return computeLeaderboard(contestants.filter((c) => c.qualified_round2), scores, 1).map((l) => l.contestant);
		return contestants;
	}, [
		contestants,
		round,
		scores
	]);
	const current = activeContestants[idx];
	const existingScore = (0, import_react.useMemo)(() => {
		if (!judge || !current || !round) return null;
		return scores.find((s) => s.judge_id === judge.id && s.contestant_id === current.id && s.round === round && s.walk === walk);
	}, [
		scores,
		judge,
		current,
		round,
		walk
	]);
	(0, import_react.useEffect)(() => {
		if (existingScore) setCats({
			confidence: existingScore.confidence,
			catwalk: existingScore.catwalk,
			creativity: existingScore.creativity,
			stage_presence: existingScore.stage_presence,
			overall_appearance: existingScore.overall_appearance
		});
		else setCats(emptyScores());
	}, [
		existingScore?.id,
		current?.id,
		walk
	]);
	const total = CATEGORIES.reduce((sum, c) => sum + (cats[c.key] || 0), 0);
	if (authLoading || loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-12 text-center text-muted-foreground",
		children: "Loading…"
	});
	if (!judge) return null;
	if (round === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Competition not started",
		message: "Waiting for the administrator to start Round 1."
	});
	if (activeContestants.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "No contestants to score",
		message: round === 2 ? "The Top 5 finalists haven't been published yet." : "No contestants are registered."
	});
	async function handleSubmit() {
		if (!judge || !current || !isOpen) return;
		if (CATEGORIES.some((c) => cats[c.key] === 0)) {
			toast.error("Zero Score Detected! Please rate all categories (1-10) before submitting.", { duration: 5e3 });
			return;
		}
		setSaving(true);
		const payload = {
			judge_id: judge.id,
			contestant_id: current.id,
			round,
			walk,
			...cats,
			total,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		const { error } = await supabase.from("scores").upsert(payload, { onConflict: "judge_id,contestant_id,round,walk" });
		setSaving(false);
		if (error) toast.error(error.message);
		else {
			toast.success(`Saved Walk ${walk} score for #${current.number}`);
			if (idx < activeContestants.length - 1) setIdx(idx + 1);
		}
	}
	const scoredCount = activeContestants.filter((c) => scores.some((s) => s.judge_id === judge.id && s.contestant_id === c.id && s.round === round && s.walk === walk)).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs uppercase tracking-wider text-muted-foreground",
				children: [
					"Round ",
					round,
					" · Walk ",
					walk,
					" of ",
					4
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-bold",
				children: round === 2 ? "Final Round — Top 5" : "Round 1 — Preliminary"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: isOpen ? "default" : "secondary",
				className: isOpen ? "bg-gold text-black" : "",
				children: isOpen ? "Open" : roundStatus === "closed" ? "Closed" : "Pending"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap items-center gap-1.5",
			children: [Array.from({ length: 4 }).map((_, i) => {
				const w = i + 1;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: ["rounded-full px-3 py-1 text-xs font-semibold", w === walk ? "bg-blue-600 text-white" : w < walk ? "bg-green-600 text-white" : "bg-secondary text-muted-foreground"].join(" "),
					children: ["Walk ", w]
				}, w);
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ml-auto text-xs text-muted-foreground",
				children: "Admin controls the current walk"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-between text-sm text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				"Contestant ",
				idx + 1,
				" of ",
				activeContestants.length
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				scoredCount,
				" / ",
				activeContestants.length,
				" scored this walk"
			] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 h-1.5 w-full overflow-hidden rounded-full bg-secondary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full bg-gold transition-all",
				style: { width: `${(idx + 1) / activeContestants.length * 100}%` }
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "glass-gold border-gold/20 shadow-[0_0_40px_rgba(212,175,55,0.05)] overflow-hidden relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-5 sm:p-6 relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-5 flex items-center gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gold/10 ring-2 ring-gold/40 shadow-[0_0_20px_rgba(212,175,55,0.2)]",
								children: current.photo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: current.photo_url,
									alt: current.name,
									className: "h-full w-full rounded-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-8 w-8 text-gold drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs uppercase tracking-wider text-gold/70",
									children: ["Contestant · Walk ", walk]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-display text-3xl font-bold text-white text-glow",
									children: ["#", current.number]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-white/80",
									children: current.name
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-auto text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-wider text-gold/70",
									children: "Total"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-display text-3xl font-bold text-gold text-glow",
									children: [total, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base text-white/50",
										children: "/50"
									})]
								})]
							})
						]
					}),
					!isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center gap-2 rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-200 backdrop-blur-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" }), roundStatus === "closed" ? "Round closed. Scores are read-only." : "Waiting for the administrator to open this round."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-6",
						children: CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-baseline justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium text-white/90 group-hover:text-gold transition-colors",
									children: cat.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										max: 10,
										value: cats[cat.key],
										disabled: !isOpen,
										onChange: (e) => {
											const v = Math.min(10, Math.max(0, Number(e.target.value) || 0));
											setCats((p) => ({
												...p,
												[cat.key]: v
											}));
										},
										className: "h-9 w-16 text-center bg-black/40 border-white/10 focus-visible:ring-gold focus-visible:border-gold text-white font-semibold"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-white/50",
										children: "/ 10"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								value: [cats[cat.key]],
								min: 0,
								max: 10,
								step: 1,
								disabled: !isOpen,
								onValueChange: (v) => setCats((p) => ({
									...p,
									[cat.key]: v[0]
								})),
								className: "[&_[role=slider]]:bg-gold [&_[role=slider]]:border-gold [&_[role=slider]]:shadow-[0_0_10px_rgba(212,175,55,0.8)]"
							})]
						}, cat.key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "lg",
								className: "h-12 bg-white/5 border-white/10 hover:bg-white/10 text-white",
								disabled: idx === 0,
								onClick: () => setIdx(idx - 1),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "lg",
								className: "h-12 flex-1 bg-gold text-black hover:bg-gold-soft transition-all duration-300 hover:scale-[1.02] shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] font-bold text-base",
								disabled: !isOpen || saving,
								onClick: handleSubmit,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-2 h-5 w-5 drop-shadow-sm" }), existingScore ? `Update Walk ${walk} score` : `Submit Walk ${walk} score`]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "lg",
								className: "h-12 bg-white/5 border-white/10 hover:bg-white/10 text-white",
								disabled: idx === activeContestants.length - 1,
								onClick: () => setIdx(idx + 1),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
							})
						]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-3 text-xs font-semibold uppercase tracking-wider text-gold/70",
				children: "Jump to contestant"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-5 gap-2 sm:grid-cols-10",
				children: activeContestants.map((c, i) => {
					const scored = scores.some((s) => s.judge_id === judge.id && s.contestant_id === c.id && s.round === round && s.walk === walk);
					const active = i === idx;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setIdx(i),
						className: ["relative h-12 rounded-md border text-sm font-bold transition-all duration-300", active ? "border-gold bg-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-[1.05]" : scored ? "border-gold/50 bg-gold/10 text-gold" : "border-white/10 bg-black/40 hover:bg-white/10 text-white"].join(" "),
						children: [c.number, scored && !active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "absolute right-1 top-1 h-3 w-3 text-gold drop-shadow-[0_0_2px_rgba(212,175,55,1)]" })]
					}, c.id);
				})
			})]
		})
	] });
}
function EmptyState({ title, message }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md py-16 text-center animate-float",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 ring-1 ring-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.1)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-8 w-8 text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 font-display text-3xl font-bold text-white text-glow",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-white/70",
				children: message
			})
		]
	});
}
//#endregion
export { JudgePage as component };
