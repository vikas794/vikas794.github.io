import { describe, it, expect } from "vitest";
import { personJsonLd, websiteJsonLd, breadcrumbJsonLd, faqPageJsonLd, projectListJsonLd } from "./jsonld";
import { canonicalUrl, SITE_URL } from "./site";

describe("SEO & JSON-LD schema utilities", () => {
  it("formats canonical URL correctly with trailing slashes", () => {
    expect(canonicalUrl("/")).toBe(`${SITE_URL}/`);
    expect(canonicalUrl("/about")).toBe(`${SITE_URL}/about/`);
    expect(canonicalUrl("/projects/market-ticks-fanout/")).toBe(`${SITE_URL}/projects/market-ticks-fanout/`);
  });

  it("generates valid Person JSON-LD schema", () => {
    const person = personJsonLd();
    expect(person["@context"]).toBe("https://schema.org");
    expect(person["@type"]).toBe("Person");
    expect(person.name).toBe("Vikas Jaiswal");
    expect(Array.isArray(person.knowsAbout)).toBe(true);
    expect(person.knowsAbout).toContain("Spring Boot");
  });

  it("generates valid WebSite JSON-LD with speakable specification", () => {
    const website = websiteJsonLd();
    expect(website["@type"]).toBe("WebSite");
    expect(website.speakable).toBeDefined();
    expect(website.speakable.cssSelector).toEqual(["h1", ".label", ".prose"]);
  });

  it("generates valid BreadcrumbList JSON-LD", () => {
    const items = [
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects/" },
    ];
    const breadcrumb = breadcrumbJsonLd(items);
    expect(breadcrumb["@type"]).toBe("BreadcrumbList");
    expect(breadcrumb.itemListElement).toHaveLength(2);
    expect(breadcrumb.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${SITE_URL}/`,
    });
    expect(breadcrumb.itemListElement[1]).toEqual({
      "@type": "ListItem",
      position: 2,
      name: "Projects",
      item: `${SITE_URL}/projects/`,
    });
  });

  it("generates valid FAQPage JSON-LD", () => {
    const faqs = [{ question: "What stack?", answer: "Java & Spring Boot" }];
    const faq = faqPageJsonLd(faqs);
    expect(faq["@type"]).toBe("FAQPage");
    expect(faq.mainEntity[0].name).toBe("What stack?");
    expect(faq.mainEntity[0].acceptedAnswer.text).toBe("Java & Spring Boot");
  });

  it("generates valid ItemList JSON-LD for projects", () => {
    const list = projectListJsonLd();
    expect(list["@type"]).toBe("ItemList");
    expect(list.itemListElement.length).toBeGreaterThan(0);
  });
});
