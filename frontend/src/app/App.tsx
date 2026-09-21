import { useEffect, useState } from "react";
import { AppShell } from "./AppShell.js";
import { Dashboard } from "../features/dashboard/Dashboard.js";

const routes = new Set(["/dashboard", "/security", "/approvals", "/agents", "/tasks", "/clients", "/finance", "/communications", "/content", "/integrations", "/settings"]);

export const App = (): React.ReactElement => {
  const [path, setPath] = useState(window.location.pathname === "/" ? "/dashboard" : window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    if (window.location.pathname === "/" || window.location.pathname === "/login") window.history.replaceState({}, "", path);
    return () => window.removeEventListener("popstate", onPop);
  }, [path]);
  if (path === "/login") return <Login />;
  const valid = routes.has(path);
  return <AppShell path={valid ? path : "/dashboard"} onNavigate={(next) => { window.history.pushState({}, "", next); setPath(next); }}><RouteContent path={valid ? path : "/dashboard"} /></AppShell>;
};

const RouteContent = ({ path }: { path: string }): React.ReactElement => path === "/dashboard" ? <Dashboard /> : <section className="page-placeholder"><p className="eyebrow">{path.slice(1)}</p><h1>Coming into focus</h1><p className="muted">This workspace is reserved for a future module. No data is connected yet.</p></section>;
const Login = (): React.ReactElement => <main className="login"><div className="login-card"><div className="brand-mark">J</div><p className="eyebrow">Private workspace</p><h1>Sign in to JARVIS</h1><p className="muted">Authentication is not connected in this foundation build.</p><button className="button button-primary" onClick={() => { window.history.replaceState({}, "", "/dashboard"); window.location.reload(); }}>Continue to preview</button></div></main>;
