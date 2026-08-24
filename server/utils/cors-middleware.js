export function corsMiddleware(options = {}) {
  const {
    origins = [],
    credentials = true,
    methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    headers = ["Content-Type", "Authorization", "X-Requested-With"],
    maxAge = 86400,
  } = options;

  return function (req, res, next) {
    const origin = req.headers.origin;

    // Validate origin
    if (origins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Vary", "Origin");

      if (credentials) {
        res.header("Access-Control-Allow-Credentials", "true");
      }
    }

    res.header("Access-Control-Allow-Methods", methods.join(", "));
    res.header("Access-Control-Allow-Headers", headers.join(", "));

    // Handle preflight
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Max-Age", maxAge.toString());
      return res.sendStatus(204);
    }

    next();
  };
}
