const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentURL, pages) {
  
  const baseURLobj = new URL(baseURL);
  const currentURLobj = new URL(currentURL);

  if (baseURLobj.hostname !== currentURLobj.hostname) {
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;  
    return pages;
  }
  
  pages[normalizedCurrentURL] = 1;
  
  console.log("Actively crawling of " + currentURL);

  try {
    const resp = await fetch(currentURL);
    
    if (resp.status >= 400) {
      console.log(`status code error: ${resp.status} on page ${currentURL}`);
      return pages;
    }

    const contentType = resp.headers.get("content-type");

    if (!contentType.includes("text/html")) {
      console.log(`non html response ${contentType}, on page ${currentURL}`);
      return pages;
    }

    const htmlBody = await resp.text();

    const nextURLs = getURLsFromHTML(htmlBody, baseURL);
    // console.log(nextURLs);
    for (const url of nextURLs) {
      pages = await crawlPage(baseURL, url, pages);
    }

  } catch(err) {
    console.log(`error: ${err.message}, on page ${currentURL}`);
  }

  return pages;
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