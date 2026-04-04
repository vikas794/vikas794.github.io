import { motion } from "motion/react";
import { useState, useEffect } from "react";

interface GithubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  has_pages: boolean;
  language: string;
}

export default function OtherProjects() {
  const [githubProjects, setGithubProjects] = useState<GithubRepo[]>([]);

  useEffect(() => {
    fetch('https://api.github.com/users/vikas794/repos')
      .then(response => response.json())
      .then((repos: GithubRepo[]) => {
        const filteredRepos = repos.filter(repo => repo.has_pages && repo.name !== 'vikas794.github.io');
        setGithubProjects(filteredRepos);
      })
      .catch(error => console.error('Error fetching github repos:', error));
  }, []);

  if (githubProjects.length === 0) {
    return null;
  }

  return (
    <section id="other-projects" className="section highlights-section" style={{ paddingTop: 0 }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65 }}
          className="section-header"
        >
          <div className="section-eyebrow">// github pages</div>
          <h2 className="section-title">Other Live Projects</h2>
        </motion.div>

        <div className="highlights-grid">
          {githubProjects.map((repo, i) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: i * 0.1 }}
              className="highlight-card"
            >
              <div className="hl-icon">🔗</div>
              <h3 className="hl-title">{repo.name.replace(/-/g, ' ')}</h3>
              <p className="hl-desc">{repo.description || 'A Spring Boot backend project.'}</p>

              <div style={{ marginTop: '1.2rem', display: 'flex', gap: '0.8rem' }}>
                <a
                  href={`https://vikas794.github.io/${repo.name}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                >
                  View Live
                </a>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                >
                  Source Code
                </a>
              </div>

              {repo.language && (
                <div className="hl-stack">{repo.language}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
