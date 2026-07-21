import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BNLMDY-V.mjs";
import { v as require_jsx_runtime, y as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/judge-auth-YoW9CJBf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var JudgeCtx = (0, import_react.createContext)(null);
var STORAGE_KEY = "miss_champs_judge";
function JudgeProvider({ children }) {
	const [judge, setJudge] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		async function load() {
			try {
				const raw = localStorage.getItem(STORAGE_KEY);
				if (raw) {
					const j = JSON.parse(raw);
					const { data } = await supabase.from("judges").select("id").eq("id", j.id).maybeSingle();
					if (data) setJudge(j);
					else localStorage.removeItem(STORAGE_KEY);
				}
			} catch {}
			setLoading(false);
		}
		load();
	}, []);
	const signIn = async (rawName) => {
		const name = rawName.trim().replace(/\s+/g, " ");
		if (name.length < 2) return { error: "Please enter your full name." };
		const { data: existing } = await supabase.from("judges").select("id, name").ilike("name", name).maybeSingle();
		let j = existing ?? null;
		if (!j) {
			const { data, error } = await supabase.from("judges").insert({ name }).select("id, name").single();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JudgeCtx.Provider, {
		value: {
			judge,
			loading,
			signIn,
			signOut
		},
		children
	});
}
function useJudge() {
	const c = (0, import_react.useContext)(JudgeCtx);
	if (!c) throw new Error("useJudge must be used within JudgeProvider");
	return c;
}
//#endregion
export { useJudge as n, JudgeProvider as t };
