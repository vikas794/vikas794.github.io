import { useLocation, useParams } from "react-router";
import Seo from "../seo/Seo";
import ErrorPage from "../components/doc/ErrorPage";
import { getErrorInfo } from "../lib/errorCodes";

interface CustomErrorPageProps {
  code?: string;
}

export default function CustomErrorPage({ code: codeProp }: CustomErrorPageProps) {
  const params = useParams<{ code?: string }>();
  const location = useLocation();

  const code = codeProp || params.code || "500";
  const errorInfo = getErrorInfo(code);

  return (
    <>
      <Seo
        title={`${errorInfo.title} (${errorInfo.code}) | Vikas Jaiswal`}
        description={errorInfo.message}
        path={`/error/${errorInfo.code}/`}
        noindex
      />
      <ErrorPage
        code={errorInfo.code}
        eyebrow={errorInfo.eyebrow}
        title={errorInfo.title}
        message={errorInfo.message}
        detail={location.pathname}
      />
    </>
  );
}
