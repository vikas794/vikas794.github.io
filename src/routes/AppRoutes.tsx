import { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation, type Location } from "react-router";
import AppShell from "../components/AppShell";
import { routes } from "./manifest";
import { runViewTransition } from "../lib/viewTransition";

// Single route tree shared by the client (BrowserRouter) and the
// prerender entry (StaticRouter) — they cannot drift apart.
//
// <Routes> renders `displayedLocation`, not the live router location: on a
// pathname change we hold the old page on screen for one more paint,
// flip `displayedLocation` inside a View Transition, and let the browser
// cross-fade old → new. Without this indirection, <Outlet> would already
// show the new page by the time the transition took its "before" snapshot,
// and there'd be nothing to animate between.
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
    <Routes location={displayedLocation}>
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
