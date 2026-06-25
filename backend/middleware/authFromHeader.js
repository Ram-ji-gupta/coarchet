/**
 * Extracts Bearer token if present.
 */
module.exports = function authFromHeader(req) {
  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return null;
};

