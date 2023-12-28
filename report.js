function printReport(pages) {
  console.log("=========");
  console.log("REPORT");
  console.log("=========");
  const sortedPages = sortPages(pages);
  for (const [url, hits] of sortedPages) {
    console.log(`${hits} hits on page ${url}`);
  }
}

function sortPages(pages) {
  const pagesArr = Object.entries(pages);
  pagesArr.sort((a,b) => {
    return b[1] - a[1];
  });
  return pagesArr;
}

module.exports = { sortPages, printReport};