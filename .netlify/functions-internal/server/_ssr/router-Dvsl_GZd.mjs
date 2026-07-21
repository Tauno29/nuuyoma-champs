import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { p as Crown, u as LogOut } from "../_libs/lucide-react.mjs";
import { n as useJudge, t as JudgeProvider } from "./judge-auth-YoW9CJBf.mjs";
import { _ as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Dvsl_GZd.js
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DBW8eSof.css";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-display font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-muted-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
					children: "Go home"
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold text-foreground",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: error.message
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						router.invalidate();
						reset();
					},
					className: "mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
					children: "Try again"
				})
			]
		})
	});
}
var Route$4 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Miss Champs Modelling — Nuuyoma SSS Judging" },
			{
				name: "description",
				content: "Live judging app for the Nuuyoma Senior Secondary School Miss Champs Modelling Competition."
			},
			{
				name: "theme-color",
				content: "#000000"
			},
			{
				property: "og:title",
				content: "Miss Champs Modelling — Nuuyoma SSS Judging"
			},
			{
				property: "og:description",
				content: "Live judging app for the Nuuyoma Senior Secondary School Miss Champs Modelling Competition."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:title",
				content: "Miss Champs Modelling — Nuuyoma SSS Judging"
			},
			{
				name: "twitter:description",
				content: "Live judging app for the Nuuyoma Senior Secondary School Miss Champs Modelling Competition."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9f6aecb2-c8ae-49ef-9975-6d38385f0231/id-preview-1d286b3d--3b41afae-75b9-4203-8c3b-8203bc16ee23.lovable.app-1782583044527.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9f6aecb2-c8ae-49ef-9975-6d38385f0231/id-preview-1d286b3d--3b41afae-75b9-4203-8c3b-8203bc16ee23.lovable.app-1782583044527.png"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700;900&family=Inter:wght@400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function Nav() {
	const { judge, signOut } = useJudge();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 border-b bg-background/80 backdrop-blur",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-5xl items-center justify-between px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-6 w-6 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-lg font-bold tracking-tight",
					children: "Miss Champs"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex items-center gap-1 text-sm",
				children: [
					judge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/judge",
						className: "rounded-md px-3 py-2 hover:bg-secondary",
						activeProps: { className: "rounded-md px-3 py-2 bg-secondary font-medium" },
						children: "Score"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/leaderboard",
						className: "rounded-md px-3 py-2 hover:bg-secondary",
						activeProps: { className: "rounded-md px-3 py-2 bg-secondary font-medium" },
						children: "Leaderboard"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin",
						className: "rounded-md px-3 py-2 hover:bg-secondary",
						activeProps: { className: "rounded-md px-3 py-2 bg-secondary font-medium" },
						children: "Admin"
					}),
					judge && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: signOut,
						className: "ml-2 inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs hover:bg-secondary",
						title: `Signed in as ${judge.name}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Sign out"
							})
						]
					})
				]
			})]
		})
	});
}
function RootComponent() {
	const { queryClient } = Route$4.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(JudgeProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen bg-background text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto max-w-5xl px-4 py-6 sm:py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			richColors: true,
			position: "top-center"
		})] })
	});
}
var $$splitComponentImporter$3 = () => import("./routes-BWPYWOT_.mjs");
var Route$3 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Sign in — Miss Champs Modelling" }, {
		name: "description",
		content: "Judge sign-in for the Nuuyoma SSS Miss Champs Modelling Competition."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./admin-mPvJuZFH.mjs");
var Route$2 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "Admin — Miss Champs" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./judge-lJ5n9Jit.mjs");
var Route$1 = createFileRoute("/judge")({
	head: () => ({ meta: [{ title: "Score — Miss Champs" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./leaderboard-DD4OOe5k.mjs");
var Route = createFileRoute("/leaderboard")({
	head: () => ({ meta: [{ title: "Leaderboard — Miss Champs" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$3.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$4
	}),
	AdminRoute: Route$2.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$4
	}),
	JudgeRoute: Route$1.update({
		id: "/judge",
		path: "/judge",
		getParentRoute: () => Route$4
	}),
	LeaderboardRoute: Route.update({
		id: "/leaderboard",
		path: "/leaderboard",
		getParentRoute: () => Route$4
	})
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
