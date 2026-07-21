import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BNLMDY-V.mjs";
import { a as Overlay2, c as Title2, i as Description2, l as Trigger2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action, v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as CardContent, r as cn, t as Card } from "./card-CfnZI4Vd.mjs";
import { i as useCompetitionData, r as computeLeaderboard, t as Badge } from "./badge-CEPuWX_7.mjs";
import { n as Input, r as buttonVariants, t as Button } from "./input-qsCcmt6g.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Square, c as Play, d as Lock, f as ListChecks, h as ChevronLeft, i as Trophy, m as ChevronRight, p as Crown, r as UserX, s as RotateCcw, t as Users, u as LogOut } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-mPvJuZFH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AlertDialog = Root2;
var AlertDialogTrigger = Trigger2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
var ADMIN_KEY = "miss_champs_admin";
function AdminPage() {
	const [authed, setAuthed] = (0, import_react.useState)(() => typeof window !== "undefined" && localStorage.getItem(ADMIN_KEY) === "1");
	const [pin, setPin] = (0, import_react.useState)("");
	if (!authed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-sm py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "mx-auto h-8 w-8 text-gold" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-2xl font-bold",
						children: "Administrator"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Enter the admin PIN to continue."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					if (pin === "champs2025") {
						localStorage.setItem(ADMIN_KEY, "1");
						setAuthed(true);
					} else toast.error("Incorrect PIN");
				},
				className: "mt-5 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "password",
					autoFocus: true,
					value: pin,
					onChange: (e) => setPin(e.target.value),
					placeholder: "Admin PIN",
					className: "h-12"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "lg",
					className: "w-full",
					children: "Unlock"
				})]
			})]
		}) })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDashboard, { onLogout: () => {
		localStorage.removeItem(ADMIN_KEY);
		setAuthed(false);
	} });
}
function AdminDashboard({ onLogout }) {
	const { state, setState, contestants, scores, judges, loading } = useCompetitionData();
	const r1 = (0, import_react.useMemo)(() => computeLeaderboard(contestants, scores, 1), [contestants, scores]);
	const r2Pool = (0, import_react.useMemo)(() => contestants.filter((c) => c.qualified_round2), [contestants]);
	const r2 = (0, import_react.useMemo)(() => computeLeaderboard(r2Pool, scores, 2), [r2Pool, scores]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-12 text-center text-muted-foreground",
		children: "Loading…"
	});
	if (!state) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-12 text-center text-destructive",
		children: "Database not initialized. Please run the SQL schema in your Supabase project."
	});
	async function updateState(patch) {
		if (state) setState({
			...state,
			...patch
		});
		const { error } = await supabase.from("competition_state").update({
			...patch,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", 1);
		if (error) toast.error(error.message);
	}
	async function startRound1() {
		await updateState({
			current_round: 1,
			round1_status: "open",
			round1_current_walk: 1,
			top5_published: false
		});
		toast.success("Round 1 started — Walk 1");
	}
	async function closeRound1() {
		await updateState({ round1_status: "closed" });
		toast.success("Round 1 closed");
	}
	function validateWalkAdvancement(round, currentWalk, targetWalk) {
		if (targetWalk <= currentWalk) return true;
		const zeroScore = scores.filter((s) => s.round === round && s.walk === currentWalk).find((s) => s.confidence === 0 || s.catwalk === 0 || s.creativity === 0 || s.stage_presence === 0 || s.overall_appearance === 0);
		if (zeroScore) {
			const judgeName = judges.find((j) => j.id === zeroScore.judge_id)?.name || "Unknown Judge";
			toast.error(`Cannot proceed! Judge ${judgeName} has a score of 0 recorded for this walk.`, { duration: 6e3 });
			return false;
		}
		return true;
	}
	async function setRound1Walk(w) {
		if (w < 1 || w > 4) return;
		if (!validateWalkAdvancement(1, state.round1_current_walk ?? 1, w)) return;
		await updateState({ round1_current_walk: w });
		toast.success(`Round 1 · Walk ${w}`);
	}
	async function setRound2Walk(w) {
		if (w < 1 || w > 4) return;
		if (!validateWalkAdvancement(2, state.round2_current_walk ?? 1, w)) return;
		await updateState({ round2_current_walk: w });
		toast.success(`Round 2 · Walk ${w}`);
	}
	async function publishTop5() {
		const top5Ids = r1.slice(0, 5).map((e) => e.contestant.id);
		await supabase.from("contestants").update({ qualified_round2: false }).neq("id", "00000000-0000-0000-0000-000000000000");
		if (top5Ids.length) await supabase.from("contestants").update({ qualified_round2: true }).in("id", top5Ids);
		await updateState({ top5_published: true });
		toast.success("Top 5 finalists published");
	}
	async function startRound2() {
		if (!state?.top5_published) {
			toast.error("Publish Top 5 first");
			return;
		}
		await updateState({
			current_round: 2,
			round2_status: "open",
			round2_current_walk: 1,
			winners_published: false
		});
		toast.success("Round 2 started — Walk 1");
	}
	async function closeRound2() {
		await updateState({ round2_status: "closed" });
		toast.success("Round 2 closed");
	}
	async function publishWinners() {
		await updateState({ winners_published: true });
		toast.success("Winners published");
	}
	async function toggleLeaderboardVisibility() {
		const next = !state?.leaderboard_visible;
		const { error } = await supabase.from("competition_state").update({
			leaderboard_visible: next,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", 1);
		if (error) {
			toast.error("Leaderboard toggle not available. Please run the SQL migration to add the 'leaderboard_visible' column.");
			return;
		}
		if (state) setState({
			...state,
			leaderboard_visible: next
		});
		toast.success(`Leaderboard is now ${next ? "visible to judges" : "hidden from judges"}`);
	}
	async function resetCompetition() {
		await supabase.from("scores").delete().neq("id", "00000000-0000-0000-0000-000000000000");
		await supabase.from("contestants").update({ qualified_round2: false }).neq("id", "00000000-0000-0000-0000-000000000000");
		await updateState({
			current_round: 0,
			round1_status: "pending",
			round2_status: "pending",
			round1_current_walk: 1,
			round2_current_walk: 1,
			top5_published: false,
			winners_published: false
		});
		toast.success("Competition reset");
	}
	async function removeJudge(judgeId, name) {
		const { error: se } = await supabase.from("scores").delete().eq("judge_id", judgeId);
		if (se) {
			toast.error(se.message);
			return;
		}
		const { error: je } = await supabase.from("judges").delete().eq("id", judgeId);
		if (je) {
			toast.error(je.message);
			return;
		}
		toast.success(`Removed ${name} and their scores`);
	}
	const r1Walk = state.round1_current_walk ?? 1;
	const r2Walk = state.round2_current_walk ?? 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold",
				children: "Admin Dashboard"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Manage rounds, walks, judges, and results."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: onLogout,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-1 h-4 w-4" }), "Lock"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-3 sm:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					href: "#round-controls",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-4 w-4 text-gold" }),
					label: "Current round",
					value: state.current_round === 0 ? "—" : `R${state.current_round} · W${state.current_round === 1 ? r1Walk : r2Walk}`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					href: "#manage-judges",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-gold" }),
					label: "Judges",
					value: judges.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					href: "#leaderboard-preview",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-gold" }),
					label: "Contestants",
					value: contestants.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					href: "#leaderboard-preview",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "h-4 w-4 text-gold" }),
					label: "Scores submitted",
					value: scores.length
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			id: "round-controls",
			className: "mt-6 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "glass border-white/10 overflow-hidden relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-5 relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-bold text-white text-glow",
								children: "Round 1 — Preliminary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: state.round1_status === "open" ? "bg-gold text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]" : "bg-white/10 text-white",
								variant: state.round1_status === "open" ? "default" : "secondary",
								children: state.round1_status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: startRound1,
									disabled: state.round1_status !== "pending",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "mr-1 h-4 w-4" }), " Start Round 1"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: closeRound1,
									disabled: state.round1_status !== "open",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "mr-1 h-4 w-4" }), " Close Round 1"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: publishTop5,
									disabled: state.round1_status !== "closed" || state.top5_published,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "mr-1 h-4 w-4" }), " Publish Top 5"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalkControls, {
							disabled: state.round1_status !== "open",
							walk: r1Walk,
							onPrev: () => setRound1Walk(r1Walk - 1),
							onNext: () => setRound1Walk(r1Walk + 1),
							onSet: setRound1Walk
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "glass border-white/10 overflow-hidden relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-5 relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-bold text-white text-glow",
								children: "Round 2 — Finals"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: state.round2_status === "open" ? "bg-gold text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]" : "bg-white/10 text-white",
								variant: state.round2_status === "open" ? "default" : "secondary",
								children: state.round2_status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: startRound2,
									disabled: !state.top5_published || state.round2_status !== "pending",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "mr-1 h-4 w-4" }), " Start Round 2"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: closeRound2,
									disabled: state.round2_status !== "open",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "mr-1 h-4 w-4" }), " Close Round 2"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: publishWinners,
									disabled: state.round2_status !== "closed" || state.winners_published,
									className: "bg-gold text-black hover:bg-gold/90",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "mr-1 h-4 w-4" }), " Publish Winners"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalkControls, {
							disabled: state.round2_status !== "open",
							walk: r2Walk,
							onPrev: () => setRound2Walk(r2Walk - 1),
							onNext: () => setRound2Walk(r2Walk + 1),
							onSet: setRound2Walk
						})
					]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			id: "leaderboard-preview",
			className: "mt-6 glass border-white/10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-bold text-white text-glow",
						children: "Live Leaderboard Preview"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-1",
						children: state.current_round === 2 ? "Round 2 (Top 5) · cumulative across walks" : "Round 1 standings · cumulative across walks"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: state.leaderboard_visible ? "default" : "outline",
						className: state.leaderboard_visible ? "bg-gold text-black hover:bg-gold-soft shadow-[0_0_15px_rgba(212,175,55,0.4)]" : "text-muted-foreground",
						onClick: toggleLeaderboardVisibility,
						children: state.leaderboard_visible ? "Visible to Judges" : "Hidden from Judges"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-1 text-sm",
					children: [(state.current_round === 2 ? r2 : r1).slice(0, 10).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b py-1.5 last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono w-8 text-muted-foreground",
								children: [e.rank, "."]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex-1 truncate",
								children: [
									"#",
									e.contestant.number,
									" ",
									e.contestant.name
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold tabular-nums",
								children: e.average.toFixed(2)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-3 text-xs text-muted-foreground",
								children: [
									e.judgeCount,
									" judges · ",
									e.walksScored,
									" scores"
								]
							})
						]
					}, e.contestant.id)), (state.current_round === 2 ? r2 : r1).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-3 text-muted-foreground",
						children: "No scores yet."
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			id: "manage-judges",
			className: "mt-4 glass border-white/10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-bold text-white text-glow",
							children: "Manage Judges"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							children: [judges.length, " active"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Removing a judge deletes their account and all scores they've submitted — cumulative averages update instantly."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 divide-y",
						children: [judges.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-4 text-sm text-muted-foreground",
							children: "No judges have signed in yet."
						}), judges.map((j) => {
							const jScores = scores.filter((s) => s.judge_id === j.id).length;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-medium",
										children: j.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											jScores,
											" score",
											jScores === 1 ? "" : "s",
											" submitted"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "text-destructive hover:bg-destructive/10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "mr-1 h-4 w-4" }), " Remove"]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
									"Remove judge ",
									j.name,
									"?"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
									"This deletes the judge and all ",
									jScores,
									" score",
									jScores === 1 ? "" : "s",
									" they submitted. Leaderboard averages will recalculate immediately."
								] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
									onClick: () => removeJudge(j.id, j.name),
									className: "bg-destructive text-destructive-foreground",
									children: "Remove judge"
								})] })] })] })]
							}, j.id);
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mt-4 glass border-destructive/40 shadow-[0_0_15px_rgba(220,38,38,0.1)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-bold text-destructive drop-shadow-[0_0_5px_rgba(220,38,38,0.4)]",
						children: "Danger Zone"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Reset the competition. This deletes all scores and clears finalist qualifications."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "destructive",
							className: "mt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-1 h-4 w-4" }), " Reset competition"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Reset the entire competition?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "All scores will be permanently deleted and both rounds reset to pending. This cannot be undone." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
						onClick: resetCompetition,
						className: "bg-destructive text-destructive-foreground",
						children: "Reset"
					})] })] })] })
				]
			})
		})
	] });
}
function WalkControls({ disabled, walk, onPrev, onNext, onSet }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 rounded-lg border bg-secondary/40 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-wider text-muted-foreground",
				children: "Current walk"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-display text-lg font-bold",
				children: [
					"Walk ",
					walk,
					" of ",
					4
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					disabled: disabled || walk <= 1,
					onClick: onPrev,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					disabled: disabled || walk >= 4,
					onClick: onNext,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 flex gap-1.5",
			children: Array.from({ length: 4 }).map((_, i) => {
				const w = i + 1;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					disabled,
					onClick: () => onSet(w),
					className: [
						"flex-1 rounded-md py-1.5 text-xs font-semibold transition",
						w === walk ? "bg-blue-600 text-white" : w < walk ? "bg-green-600 text-white" : "bg-background hover:bg-secondary",
						disabled ? "opacity-50" : ""
					].join(" "),
					children: ["Walk ", w]
				}, w);
			})
		})]
	});
}
function Stat({ icon, label, value, href }) {
	const content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: `glass border-white/10 hover:bg-white/5 transition-colors ${href ? "cursor-pointer hover:border-gold/50" : ""}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-xs uppercase tracking-wider text-white/50",
				children: [icon, label]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-display text-3xl font-bold text-white text-glow",
				children: value
			})]
		})
	});
	if (href) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href,
		className: "block hover:scale-[1.02] transition-transform",
		children: content
	});
	return content;
}
//#endregion
export { AdminPage as component };
