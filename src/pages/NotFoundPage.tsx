import { Link } from "react-router";
import Seo from "../seo/Seo";

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Not found | Vikas Jaiswal" description="This page does not exist." path="/404/" noindex />
      <div className="container" style={{ padding: "5rem 0", textAlign: "center" }}>
        <p className="section-eyebrow">— 404</p>
        <h1>Page not found</h1>
        <p>The page you requested does not exist.</p>
        <p>
          <Link to="/">Back to home</Link>
        </p>
      </div>
    </>
  );
}
