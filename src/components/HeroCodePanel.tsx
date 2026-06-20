import { motion } from "motion/react";

export default function HeroCodePanel() {
  return (
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
          <div className="code-line"><span className="c-comment">{"// Java 17 + Spring Boot 3.x"}</span></div>
          <div className="code-line"><span className="c-kw">@RestController</span></div>
          <div className="code-line"><span className="c-kw">@RequestMapping</span>(<span className="c-str">"/api/v1/dev"</span>)</div>
          <div className="code-line"><span className="c-kw">{"public class "}</span><span className="c-cls">VikasJaiswal</span>{" {"}</div>
          <div className="code-line">{""}</div>
          <div className="code-line">{"  "}<span className="c-comment">{"// Professional Profile"}</span></div>
          <div className="code-line">{"  "}<span className="c-kw">{"private final "}</span><span className="c-cls">String</span>{" role "}<span className="c-op">=</span>{" "}<span className="c-str">"Backend Engineer"</span>{";"}</div>
          <div className="code-line">{"  "}<span className="c-kw">{"private final "}</span><span className="c-cls">int</span>{" exp "}<span className="c-op">=</span>{" "}<span className="c-num">4</span>{";"}</div>
          <div className="code-line">{"  "}<span className="c-kw">{"private final "}</span><span className="c-cls">String</span>{" loc "}<span className="c-op">=</span>{" "}<span className="c-str">{"\"Mumbai, IN 🇮🇳\""}</span>{";"}</div>
          <div className="code-line">{""}</div>
          <div className="code-line">{"  "}<span className="c-comment">{"// Technical Stack"}</span></div>
          <div className="code-line">{"  "}<span className="c-kw">{"private final "}</span><span className="c-cls">List</span>{"<"}<span className="c-cls">String</span>{">"}{" stack "}<span className="c-op">=</span>{" "}<span className="c-cls">List</span>{".of("}</div>
          <div className="code-line">{"    "}<span className="c-str">"Java"</span>{", "}<span className="c-str">"Spring Boot"</span>{", "}<span className="c-str">"SQL"</span>{","}</div>
          <div className="code-line">{"    "}<span className="c-str">"JWT"</span>{", "}<span className="c-str">"OAuth2"</span>{", "}<span className="c-str">"AWS"</span></div>
          <div className="code-line">{"  );"}</div>
          <div className="code-line">{""}</div>
          <div className="code-line">{"  "}<span className="c-kw">@GetMapping</span>(<span className="c-str">"/status"</span>)</div>
          <div className="code-line">{"  "}<span className="c-kw">{"public "}</span><span className="c-cls">ResponseEntity</span>{"<"}<span className="c-cls">String</span>{">"}{" getStatus() {"}</div>
          <div className="code-line">{"    "}<span className="c-kw">{"return "}</span><span className="c-cls">ResponseEntity</span>{".ok()"}</div>
          <div className="code-line">{"      .body("}<span className="c-str">{"\"Open to new challenges! ✅\""}</span>{");"}</div>
          <div className="code-line">{"  }"}</div>
          <div className="code-line">{"}"}</div>
        </div>
      </div>
    </motion.div>
  );
}
