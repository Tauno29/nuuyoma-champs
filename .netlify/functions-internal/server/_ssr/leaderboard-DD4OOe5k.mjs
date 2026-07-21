import { r as __toESM } from "../_runtime.mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as CardContent, t as Card } from "./card-CfnZI4Vd.mjs";
import { i as useCompetitionData, r as computeLeaderboard, t as Badge } from "./badge-CEPuWX_7.mjs";
import { i as Trophy, l as Medal, n as User, p as Crown } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leaderboard-DD4OOe5k.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LeaderboardPage() {
	const { state, contestants, scores, judges, loading } = useCompetitionData();
	const round = state?.current_round ?? 0;
	const displayRound = round === 0 ? 1 : round;
	const board = (0, import_react.useMemo)(() => {
		return computeLeaderboard(displayRound === 2 ? contestants.filter((c) => c.qualified_round2) : contestants, scores, displayRound);
	}, [
		contestants,
		scores,
		displayRound
	]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-12 text-center text-muted-foreground",
		children: "Loading…"
	});
	const round2Closed = state?.round2_status === "closed" && state?.winners_published;
	const isAdmin = typeof window !== "undefined" && localStorage.getItem("miss_champs_admin") === "1";
	if (!state?.leaderboard_visible && !isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md py-16 text-center animate-float",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 ring-1 ring-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.1)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-8 w-8 text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] opacity-50" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 font-display text-3xl font-bold text-white text-glow",
				children: "Leaderboard Hidden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-white/70",
				children: "The administrator has currently hidden the live leaderboard. Please wait until it is revealed!"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8 text-center animate-float",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.3em] text-gold/70",
					children: "Live Leaderboard"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl font-bold sm:text-5xl text-glow text-white",
					children: round2Closed ? "Final Winners" : displayRound === 2 ? "Round 2 — Finalists" : "Round 1 Standings"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-white/60",
					children: [
						judges.length,
						" judge",
						judges.length === 1 ? "" : "s",
						" • ",
						scores.filter((s) => s.round === displayRound).length,
						" scores across walks"
					]
				})
			]
		}),
		round2Closed && board.length >= 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WinnersPodium, { board }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 space-y-2",
			children: [board.map((e) => {
				const isTop5 = displayRound === 1 && e.rank <= 5 && (state?.top5_published || state?.round1_status === "closed");
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: ["transition-all duration-300 hover:scale-[1.01] overflow-hidden relative", isTop5 ? "glass-gold border-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.15)]" : "glass border-white/5 hover:bg-white/10"].join(" "),
					children: [isTop5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-gold/10 to-transparent pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex items-center gap-3 p-4 relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: ["flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-xl font-bold shadow-lg", e.rank === 1 ? "bg-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.5)]" : e.rank === 2 ? "bg-zinc-300 text-black shadow-[0_0_10px_rgba(212,212,216,0.3)]" : e.rank === 3 ? "bg-amber-700 text-white shadow-[0_0_10px_rgba(180,83,9,0.3)]" : "bg-black/50 border border-white/10 text-white"].join(" "),
								children: e.rank
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black/40 border border-white/10 overflow-hidden",
								children: e.contestant.photo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: e.contestant.photo_url,
									alt: "",
									className: "h-full w-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-5 w-5 text-white/50" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate font-bold text-white text-lg",
									children: [
										"#",
										e.contestant.number,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-white/80 font-normal",
											children: ["· ", e.contestant.name]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-white/50",
									children: [
										e.judgeCount,
										" judge",
										e.judgeCount === 1 ? "" : "s",
										" • ",
										e.walksScored,
										" walk score",
										e.walksScored === 1 ? "" : "s",
										" • Total ",
										e.total
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-3xl font-bold text-gold text-glow",
									children: e.average.toFixed(1)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase tracking-widest text-gold/60",
									children: "Avg"
								})]
							}),
							isTop5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "bg-gold text-black border-none shadow-[0_0_10px_rgba(212,175,55,0.4)]",
								children: "Top 5"
							})
						]
					})]
				}, e.contestant.id);
			}), board.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-8 text-center text-muted-foreground",
				children: "No contestants to display yet."
			})]
		})
	] });
}
function WinnersPodium({ board }) {
	const winner = board[0];
	const first = board[1];
	const second = board[2];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 sm:grid-cols-3",
		children: [
			winner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PodiumCard, {
				rank: "Winner",
				entry: winner,
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-6 w-6" }),
				accent: "bg-gold text-black"
			}),
			first && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PodiumCard, {
				rank: "1st Runner-up",
				entry: first,
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-6 w-6" }),
				accent: "bg-zinc-200 text-black"
			}),
			second && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PodiumCard, {
				rank: "2nd Runner-up",
				entry: second,
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medal, { className: "h-6 w-6" }),
				accent: "bg-amber-700 text-white"
			})
		]
	});
}
function PodiumCard({ rank, entry, icon, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "overflow-hidden glass-gold border-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.15)] animate-float",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold tracking-wide shadow-md ${accent}`,
			children: [
				icon,
				" ",
				rank
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-6 text-center relative",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-4xl font-bold text-white text-glow relative",
					children: ["#", entry.contestant.number]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-white/80 mt-1 relative",
					children: entry.contestant.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 inline-block bg-black/40 rounded-full px-6 py-2 border border-gold/20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl font-bold text-gold text-glow",
						children: entry.average.toFixed(1)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] uppercase tracking-widest text-gold/70 mt-1",
						children: "Average"
					})]
				})
			]
		})]
	});
}
//#endregion
export { LeaderboardPage as component };
