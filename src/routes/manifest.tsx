import type { ReactNode } from "react";
import { profile } from "../content/profile";
import { caseStudies } from "../content/projects";
import Home from "../pages/Home";
import AboutPage from "../pages/AboutPage";
import ExperiencePage from "../pages/ExperiencePage";
import ProjectsPage from "../pages/ProjectsPage";
import ProjectDetailPage from "../pages/ProjectDetailPage";
import ResumePage from "../pages/ResumePage";
import ContactPage from "../pages/ContactPage";
import NotFoundPage from "../pages/NotFoundPage";

export interface RouteMeta {
  title: string;
  description: string;
  noindex?: boolean;
}

export interface AppRoute {
  path: string;
  element: ReactNode;
  meta: RouteMeta;
}

const base = profile.name;
const role = profile.titleLong;

export const routes: AppRoute[] = [
  {
    path: "/",
    element: <Home />,
    meta: {
      title: `${base} | ${role} · Backend Engineer`,
      description: `${base} is a ${role} with ${profile.experienceYears}+ years building secure, scalable enterprise systems. Java 17, Spring Boot 3, REST APIs, JWT, Spring Security. Based in ${profile.location}.`,
    },
  },
  {
    path: "/about/",
    element: <AboutPage />,
    meta: {
      title: `About | ${base} · ${role}`,
      description: `How ${base} works: API design, security, performance, and team opinions from ${profile.experienceYears}+ years of backend engineering, plus Azure certifications.`,
    },
  },
  {
    path: "/experience/",
    element: <ExperiencePage />,
    meta: {
      title: `Experience | ${base} · ${role}`,
      description: `Professional experience: WEQ Technologies, Medify Nexus, and Wipro — real-time trading, healthcare data, and enterprise backends.`,
    },
  },
  {
    path: "/projects/",
    element: <ProjectsPage />,
    meta: {
      title: `Projects | ${base} · Case Studies`,
      description: `Three deep backend case studies: market-tick fan-out, healthcare performance, SQL-injection hardening — plus also-shipped one-liners.`,
    },
  },
  ...caseStudies.map(
    (c): AppRoute => ({
      path: `/projects/${c.slug}/`,
      element: <ProjectDetailPage slug={c.slug} />,
      meta: {
        title: `${c.title} | ${base}`,
        description: c.summary,
      },
    })
  ),
  {
    path: "/resume/",
    element: <ResumePage />,
    meta: {
      title: `Résumé | ${base} · ${role}`,
      description: `Résumé of ${base}, ${role} (${profile.experienceYears}+ years). Download PDF or read the accessible HTML version.`,
    },
  },
  {
    path: "/contact/",
    element: <ContactPage />,
    meta: {
      title: `Contact | ${base} · Open to Work`,
      description: `${base} is open to backend engineering roles (remote/hybrid, Mumbai). Email, LinkedIn, GitHub, WhatsApp, Telegram.`,
    },
  },
  {
    path: "*",
    element: <NotFoundPage />,
    meta: {
      title: `Not found | ${base}`,
      description: "This page does not exist.",
      noindex: true,
    },
  },
];

// Feeds the SSG script AND the sitemap generator — adding a route is a one-array edit.
export function expandRoutes(): string[] {
  return routes.filter((r) => r.path !== "*").map((r) => r.path);
}

export function resolveMeta(path: string): RouteMeta {
  const exact = routes.find((r) => r.path === path);
  if (exact) return exact.meta;
  const fallback = routes.find((r) => r.path === "*");
  return fallback!.meta;
}
