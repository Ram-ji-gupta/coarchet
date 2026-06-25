/**
 * Prevent leaking admin_password to the client.
 */
module.exports = function sanitizeSettings(row) {
  if (!row) return row;
  const copy = { ...row };
  delete copy.admin_password;
  return copy;
};

