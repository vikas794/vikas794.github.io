import { ReactNode, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Github, Linkedin, Mail } from "lucide-react";

const codeLines: ReactNode[] = [
  <span className="c-comment">{"// Java 17 + Spring Boot 3.x"}</span>,
  <span className="c-kw">@RestController</span>,
  <><span className="c-kw">@RequestMapping</span>(<span className="c-str">"/api/v1/dev"</span>)</>,
  <><span className="c-kw">{"public class "}</span><span className="c-cls">VikasJaiswal</span>{" {"}</>,
  "",
  <>{"  "}<span className="c-comment">{"// Professional Profile"}</span></>,
  <>{"  "}<span className="c-kw">{"private final "}</span><span className="c-cls">String</span>{" role "}<span className="c-op">=</span>{" "}<span className="c-str">"Backend Engineer"</span>{";"}</>,
  <>{"  "}<span className="c-kw">{"private final "}</span><span className="c-cls">int</span>{" exp "}<span className="c-op">=</span>{" "}<span className="c-num">4</span>{";"}</>,
  <>{"  "}<span className="c-kw">{"private final "}</span><span className="c-cls">String</span>{" loc "}<span className="c-op">=</span>{" "}<span className="c-str">{"\"Mumbai, IN 🇮🇳\""}</span>{";"}</>,
  "",
  <>{"  "}<span className="c-comment">{"// Technical Stack"}</span></>,
  <>{"  "}<span className="c-kw">{"private final "}</span><span className="c-cls">List</span>{"<"}<span className="c-cls">String</span>{">"}{" stack "}<span className="c-op">=</span>{" "}<span className="c-cls">List</span>{".of("}</>,
  <>{"    "}<span className="c-str">"Java"</span>{", "}<span className="c-str">"Spring Boot"</span>{", "}<span className="c-str">"SQL"</span>{","}</>,
  <>{"    "}<span className="c-str">"JWT"</span>{", "}<span className="c-str">"OAuth2"</span>{", "}<span className="c-str">"AWS"</span></>,
  "  );",
  "",
  <>{"  "}<span className="c-kw">@GetMapping</span>(<span className="c-str">"/status"</span>)</>,
  <>{"  "}<span className="c-kw">{"public "}</span><span className="c-cls">ResponseEntity</span>{"<"}<span className="c-cls">String</span>{">"}{" getStatus() {"}</>,
  <>{"    "}<span className="c-kw">{"return "}</span><span className="c-cls">ResponseEntity</span>{".ok()"}</>,
  <>{"      .body("}<span className="c-str">{"\"Open to new challenges! ✅\""}</span>{");"}</>,
  "  }",
  "}"
];

const metrics = [
  { num: "4",  unit: "+", label: "Years Experience"     },
  { num: "15", unit: "+", label: "REST APIs Built"       },
  { num: "40", unit: "%", label: "Integration Time Cut"  },
  { num: "80", unit: "%", label: "Manual Effort Cut"     },
];

const phrases = [
  "Java Backend Developer",
  "Spring Boot Specialist",
  "REST API Engineer",
  "JWT & OAuth2 Expert",
  "AWS Certified Builder",
];

export default function Hero() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[phraseIdx];
    let timeout: NodeJS.Timeout;

    if (deleting) {
      if (charIdx > 0) {
        timeout = setTimeout(() => setCharIdx((c) => c - 1), 45);
      } else {
        setDeleting(false);
        setPhraseIdx((p) => (p + 1) % phrases.length);
      }
    } else {
      if (charIdx < phrase.length) {
        timeout = setTimeout(() => setCharIdx((c) => c + 1), 80);
      } else {
        timeout = setTimeout(() => setDeleting(true), 1800);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx]);

  return (
    <section id="hero" className="hero" aria-label="Vikas Jaiswal — Java Spring Boot Backend Developer Portfolio">
      <div className="hero-bg-grid"></div>
      <div className="hero-orb hero-orb-1"></div>
      <div className="hero-orb hero-orb-2"></div>

      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0 }}
          className="hero-eyebrow"
        >
          <span className="dot-pulse"></span>
          Available for opportunities · Mumbai, India
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="hero-name"
        >
          <span className="name-line">Vikas</span>
          <span className="name-line outline">Jaiswal</span>
          <span className="sr-only"> — Java Spring Boot Developer | Backend Engineer | Full Stack Developer</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="hero-role"
        >
          <span className="role-prefix">&lt;</span>
          <span className="typed-text">
            {phrases[phraseIdx].slice(0, charIdx)}
          </span>
          <span className="type-cursor">|</span>
          <span className="role-suffix">/&gt;</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.3 }}
          className="hero-desc"
        >
          Vikas Jaiswal is a <strong>Java Spring Boot Backend Developer</strong> with <strong>4+ years</strong> of 
          professional experience building secure, scalable enterprise systems 
          across <em>FinTech, Healthcare, EdTech &amp; Logistics</em>. 
          He builds high-performance REST APIs with Spring Security, JWT authentication, and AWS cloud — 
          delivering full stack solutions with Java and React.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.4 }}
          className="hero-actions"
        >
          <a
            href="https://www.linkedin.com/in/vikasjaiswall/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <Linkedin size={16} />
            LinkedIn
          </a>
          <a href="mailto:vikasjaiswal794@gmail.com" className="btn btn-ghost">
            <Mail size={16} />
            Get in Touch
          </a>
          <a
            href="https://github.com/vikas794"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-icon"
            title="GitHub"
          >
            <Github size={18} />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.5 }}
          className="hero-metrics"
        >
          {metrics.map((m, i) => (
            <div className="metric" key={i}>
              <div className="metric-value">
                <span className="metric-num">{m.num}</span>
                <span className="metric-unit">{m.unit}</span>
              </div>
              <span className="metric-label">{m.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65, delay: 0.3 }}
        className="hero-code-panel"
      >
        <div className="code-window">
          <div className="code-titlebar">
            <div className="code-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <span className="code-filename">VikasJaiswal.java</span>
          </div>
          <div className="code-body">
            {codeLines.map((line, i) => (
              <div key={i} className="code-line">
                {line}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
