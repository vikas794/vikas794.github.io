import Seo from "../seo/Seo";
import {
  personJsonLd,
  websiteJsonLd,
  profilePageJsonLd,
  projectListJsonLd,
  employerOrganizationJsonLd,
} from "../seo/jsonld";
import Hero from "../components/doc/Hero";
import ProofStrip from "../components/doc/ProofStrip";
import CaseRows from "../components/doc/CaseRows";
import WorkHistory from "../components/doc/WorkHistory";
import SkillsLedger from "../components/doc/SkillsLedger";
import ClosingCta from "../components/doc/ClosingCta";

const TITLE = "Vikas Jaiswal | Java Spring Boot Backend Developer";
const DESC =
  "Vikas Jaiswal is a Java Backend Developer in Mumbai with 4+ years building secure Spring Boot backends: REST APIs, JWT, Java 8-25. Azure-certified, open to work.";

export default function Home() {
  return (
    <>
      <Seo title={TITLE} description={DESC} path="/" />
      <script type="application/ld+json">{JSON.stringify(personJsonLd())}</script>
      <script type="application/ld+json">{JSON.stringify(websiteJsonLd())}</script>
      <script type="application/ld+json">{JSON.stringify(profilePageJsonLd("/"))}</script>
      <script type="application/ld+json">{JSON.stringify(projectListJsonLd())}</script>
      <script type="application/ld+json">{JSON.stringify(employerOrganizationJsonLd())}</script>
      <Hero />
      <ProofStrip />
      <CaseRows />
      <WorkHistory />
      <SkillsLedger />
      <ClosingCta />
    </>
  );
}
