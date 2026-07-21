import { r as __toESM } from "../_runtime.mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as CardContent, t as Card } from "./card-CfnZI4Vd.mjs";
import { n as Input, t as Button } from "./input-qsCcmt6g.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as Sparkles, p as Crown } from "../_libs/lucide-react.mjs";
import { n as useJudge } from "./judge-auth-YoW9CJBf.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BWPYWOT_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Index() {
	const { judge, signIn } = useJudge();
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function handleSignIn(e) {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 ring-1 ring-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.2)] animate-float",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-10 w-10 text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-xs uppercase tracking-[0.2em] text-gold/70",
					children: "Nuuyoma Senior Secondary School"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl font-bold sm:text-5xl text-glow text-white",
					children: "Miss Champs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-xl text-gold",
					children: "Modelling Competition"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground bg-white/5 px-4 py-1.5 rounded-full border border-white/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-gold" }), " Official judging panel"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-10 glass-gold border-gold/20 overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-8 relative",
				children: judge ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground uppercase tracking-wider",
							children: "Signed in as"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-2xl font-bold text-white text-glow",
							children: judge.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-6 w-full bg-gold text-black hover:bg-gold-soft transition-all duration-300 hover:scale-[1.02] shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] font-semibold",
							size: "lg",
							onClick: () => navigate({ to: "/judge" }),
							children: "Continue judging"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSignIn,
					className: "space-y-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-sm font-medium text-gold/90 uppercase tracking-wider",
							children: "Your full name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							autoFocus: true,
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "e.g. Sarah Nangolo",
							className: "mt-2 h-14 text-base bg-black/40 border-gold/30 focus-visible:ring-gold/50 text-white placeholder:text-muted-foreground/50 transition-all duration-300",
							required: true,
							minLength: 2
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground/70",
							children: "Your name will appear next to every score you submit."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "lg",
						className: "h-14 w-full text-base bg-gold text-black hover:bg-gold-soft transition-all duration-300 hover:scale-[1.02] shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] font-bold tracking-wide",
						disabled: loading,
						children: loading ? "Signing in…" : "Enter judging panel"
					})]
				})
			})]
		})]
	});
}
//#endregion
export { Index as component };
