const { JSDOM } = require("jsdom");

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const linkEl of linkElements) {
    try {
      if (linkEl.href[0] == "/") {
        const urlObj = new URL(baseURL + linkEl.href); 
        urls.push(baseURL + linkEl.href);
      } else {
        const urlObj = new URL(linkEl.href); 
        urls.push(linkEl.href);
      }
    } catch(err) {
      console.log(err);
    }
  }
  return urls;
}

function normalizeURL(urlString) {
  const urlObj = new URL(urlString);
  let hostPath = `${urlObj.host}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
    hostPath = hostPath.slice(0, -1);
  }
  return hostPath;
}

module.exports = { normalizeURL, getURLsFromHTML };