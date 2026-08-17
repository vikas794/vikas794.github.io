import { motion } from "motion/react";
import { experiences } from "../data/experiences";

export default function Experience() {
  return (
    <section id="experience" className="section exp-section">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65 }}
          className="section-header"
        >
          <div className="section-eyebrow">// career</div>
          <h2 className="section-title">Professional Experience</h2>
        </motion.div>

        <div className="exp-timeline">
          {experiences.map((exp, i) => (
            <motion.div 
              key={`${exp.company}-${exp.role}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: i * 0.1 }}
              className="exp-item"
            >
              <div className="exp-dot"></div>
              <div className="exp-card">
                <div className="exp-card-top">
                  <div>
                    <div className="exp-period">{exp.period}</div>
                    <h3 className="exp-role">{exp.role}</h3>
                    <div className="exp-company">{exp.company}</div>
                  </div>
                  {exp.current && <span className="exp-badge current">Current</span>}
                </div>
                <ul className="exp-list">
                  {exp.points.map((point) => (<li key={point}>{point}</li>))}
                </ul>
                <div className="exp-tech">
                  {exp.tech.map((tech) => (<span key={tech} className="tech">{tech}</span>))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
