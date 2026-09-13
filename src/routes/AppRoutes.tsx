import { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation, type Location } from "react-router";
import AppShell from "../components/AppShell";
import ErrorBoundary from "../components/ErrorBoundary";
import { routes } from "./manifest";
import { runViewTransition } from "../lib/viewTransition";

// Single route tree shared by the client (BrowserRouter) and the
// prerender entry (StaticRouter) — they cannot drift apart.
export default function AppRoutes() {
  const location = useLocation();
  const [displayedLocation, setDisplayedLocation] = useState<Location>(location);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (location.pathname === displayedLocation.pathname) {
      setDisplayedLocation(location);
      return;
    }
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayedLocation(location);
      return;
    }
    runViewTransition("route", () => setDisplayedLocation(location));
  }, [location, displayedLocation.pathname]);

  return (
    <ErrorBoundary>
      <Routes location={displayedLocation}>
        <Route element={<AppShell />}>
          {routes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
