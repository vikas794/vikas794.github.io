/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useEffect } from "react";
import { useTheme } from "./hooks/useTheme";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Cursor from "./components/Cursor";
import BackToTop from "./components/BackToTop";

const About = lazy(() => import("./components/About"));
const Skills = lazy(() => import("./components/Skills"));
const Experience = lazy(() => import("./components/Experience"));
const Highlights = lazy(() => import("./components/Highlights"));
const OtherProjects = lazy(() => import("./components/OtherProjects"));
const Certifications = lazy(() => import("./components/Certifications"));
const Contact = lazy(() => import("./components/Contact"));

export default function App() {
  const { theme, toggleTheme } = useTheme();

  // Optimized: Prefetch non-critical components after initial load
  useEffect(() => {
    const prefetch = () => {
      import("./components/About");
      import("./components/Skills");
      import("./components/Experience");
      import("./components/Highlights");
      import("./components/OtherProjects");
      import("./components/Certifications");
      import("./components/Contact");
    };
    // Idle time prefetch
    const timer = setTimeout(prefetch, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Cursor />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main role="main" aria-label="Vikas Jaiswal Portfolio - Java Spring Boot Developer">
        <Hero />
        <Suspense fallback={<div className="h-20" />}>
          <About />
          <Skills />
          <Experience />
          <Highlights />
          <OtherProjects />
          <Certifications />
          <Contact theme={theme} />
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
