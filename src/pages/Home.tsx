import Seo from "../seo/Seo";
import { personJsonLd, websiteJsonLd, profilePageJsonLd, projectListJsonLd } from "../seo/jsonld";
import Hero from "../components/doc/Hero";
import ProofStrip from "../components/doc/ProofStrip";
import CaseRows from "../components/doc/CaseRows";
import WorkHistory from "../components/doc/WorkHistory";
import SkillsLedger from "../components/doc/SkillsLedger";
import ClosingCta from "../components/doc/ClosingCta";

const TITLE = "Vikas Jaiswal | Java Spring Boot Backend Developer · Backend Engineer";
const DESC =
  "Vikas Jaiswal is a Java Spring Boot Backend Developer with 4+ years building secure, scalable enterprise systems. Java 8-25, Spring Boot 4, REST APIs, JWT, Spring Security. Based in Mumbai, India.";

export default function Home() {
  return (
    <>
      <Seo title={TITLE} description={DESC} path="/" />
      <script type="application/ld+json">{JSON.stringify(personJsonLd())}</script>
      <script type="application/ld+json">{JSON.stringify(websiteJsonLd())}</script>
      <script type="application/ld+json">{JSON.stringify(profilePageJsonLd("/"))}</script>
      <script type="application/ld+json">{JSON.stringify(projectListJsonLd())}</script>
      <Hero />
      <ProofStrip />
      <CaseRows />
      <WorkHistory />
      <SkillsLedger />
      <ClosingCta />
    </>
  );
}
