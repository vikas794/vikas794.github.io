import { useLocation } from "react-router";
import Seo from "../seo/Seo";
import ErrorPage from "../components/doc/ErrorPage";

export default function NotFoundPage() {
  const { pathname } = useLocation();
  return (
    <>
      <Seo title="Not found | Vikas Jaiswal" description="This page does not exist." path="/404/" noindex />
      <ErrorPage
        code="404"
        eyebrow="Error 404 · Not found"
        title="This page doesn't exist."
        message="The link may be outdated, or the page moved. Check the address, or head back to the home page."
        detail={pathname}
      />
    </>
  );
}
