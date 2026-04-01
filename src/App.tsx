/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useTheme } from "./hooks/useTheme";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Highlights from "./components/Highlights";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Cursor from "./components/Cursor";
import BackToTop from "./components/BackToTop";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <Cursor />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Highlights />
        <Certifications />
        <Contact theme={theme} />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
