export interface ErrorInfo {
  code: string;
  eyebrow: string;
  title: string;
  message: string;
}

export const ERROR_CODES: Record<string, ErrorInfo> = {
  // 4xx Client Errors
  "400": {
    code: "400",
    eyebrow: "Error 400 · Bad Request",
    title: "Bad Request",
    message: "The server could not understand the request due to invalid syntax or malformed request parameters.",
  },
  "401": {
    code: "401",
    eyebrow: "Error 401 · Unauthorized",
    title: "Authentication Required",
    message: "You must be authenticated to access this resource. Please log in or check your credentials.",
  },
  "402": {
    code: "402",
    eyebrow: "Error 402 · Payment Required",
    title: "Payment Required",
    message: "This content or resource requires payment or active subscription to access.",
  },
  "403": {
    code: "403",
    eyebrow: "Error 403 · Forbidden",
    title: "Access Forbidden",
    message: "You do not have permission to view or access this resource.",
  },
  "404": {
    code: "404",
    eyebrow: "Error 404 · Not Found",
    title: "This page doesn't exist.",
    message: "The link may be outdated, or the page moved. Check the address, or head back to the home page.",
  },
  "405": {
    code: "405",
    eyebrow: "Error 405 · Method Not Allowed",
    title: "Method Not Allowed",
    message: "The request method is not supported for the requested resource.",
  },
  "406": {
    code: "406",
    eyebrow: "Error 406 · Not Acceptable",
    title: "Not Acceptable",
    message: "The requested resource is capable of generating only content not acceptable according to the Accept headers.",
  },
  "407": {
    code: "407",
    eyebrow: "Error 407 · Proxy Auth Required",
    title: "Proxy Authentication Required",
    message: "Authentication with the proxy is required before proceeding.",
  },
  "408": {
    code: "408",
    eyebrow: "Error 408 · Request Timeout",
    title: "Request Timeout",
    message: "The server timed out waiting for the request. Please try again.",
  },
  "409": {
    code: "409",
    eyebrow: "Error 409 · Conflict",
    title: "Request Conflict",
    message: "The request could not be completed due to a conflict with the current state of the target resource.",
  },
  "410": {
    code: "410",
    eyebrow: "Error 410 · Gone",
    title: "Resource Gone",
    message: "The target resource is no longer available at the origin server and this condition is likely permanent.",
  },
  "429": {
    code: "429",
    eyebrow: "Error 429 · Too Many Requests",
    title: "Rate Limit Exceeded",
    message: "You have sent too many requests in a given amount of time. Please slow down and try again later.",
  },

  // 5xx Server Errors
  "500": {
    code: "500",
    eyebrow: "Error 500 · Internal Server Error",
    title: "Something went wrong.",
    message: "An unexpected server error occurred. Please try again later or contact support if the problem persists.",
  },
  "501": {
    code: "501",
    eyebrow: "Error 501 · Not Implemented",
    title: "Not Implemented",
    message: "The server does not support the functionality required to fulfill the request.",
  },
  "502": {
    code: "502",
    eyebrow: "Error 502 · Bad Gateway",
    title: "Bad Gateway",
    message: "The server received an invalid response from an upstream server while processing the request.",
  },
  "503": {
    code: "503",
    eyebrow: "Error 503 · Service Unavailable",
    title: "Service Unavailable",
    message: "The server is currently unable to handle the request due to temporary overloading or maintenance.",
  },
  "504": {
    code: "504",
    eyebrow: "Error 504 · Gateway Timeout",
    title: "Gateway Timeout",
    message: "The server did not receive a timely response from an upstream server.",
  },
};

export function getErrorInfo(codeStr?: string): ErrorInfo {
  const code = codeStr?.trim() || "500";
  if (ERROR_CODES[code]) {
    return ERROR_CODES[code];
  }

  const numCode = parseInt(code, 10);
  if (!isNaN(numCode)) {
    if (numCode >= 400 && numCode < 500) {
      return {
        code,
        eyebrow: `Error ${code} · Client Error`,
        title: `Client Error (${code})`,
        message: "The request could not be completed due to a client-side error.",
      };
    }
    if (numCode >= 500 && numCode < 600) {
      return {
        code,
        eyebrow: `Error ${code} · Server Error`,
        title: `Server Error (${code})`,
        message: "An internal server error occurred while processing your request.",
      };
    }
  }

  return {
    code: "Error",
    eyebrow: `Error ${code}`,
    title: "Unexpected Error",
    message: "An unexpected error occurred. Please navigate back to safety.",
  };
}
