import { Routes, Route } from "react-router";
import AppShell from "../components/AppShell";
import { routes } from "./manifest";

// Single route tree shared by the client (BrowserRouter) and the
// prerender entry (StaticRouter) — they cannot drift apart.
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {routes.map((r) =>
          r.path === "*" ? (
            <Route key={r.path} path="*" element={r.element} />
          ) : (
            <Route key={r.path} path={r.path} element={r.element} />
          )
        )}
      </Route>
    </Routes>
  );
}
