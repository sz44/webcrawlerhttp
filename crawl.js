function normalizeURL(urlString) {
  const urlObj = new URL(urlString);
  let hostPath = `${urlObj.host}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
    hostPath = hostPath.slice(0, -1);
  }
  return hostPath;
}

module.exports = { normalizeURL };