const { JSDOM } = require("jsdom");

async function crawlPage(currentURL) {
  console.log("starting crawl of " + currentURL);

  try {
    const resp = await fetch(currentURL);
    if (resp.status >= 400) {
      console.log(`status code error: ${resp.status} on page ${currentURL}`);
      return;
    }

    const contentType = resp.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(`non html response ${contentType}, on page ${currentURL}`);
      return;
    }

    console.log(await resp.text());
  } catch(err) {
    console.log(`error: ${err.message}, on page ${currentURL}`);
  }

}

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

module.exports = { crawlPage, normalizeURL, getURLsFromHTML };