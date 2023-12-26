const { normalizeURL } = require("./crawl.js");
const { test, expect } = require("@jest/globals");

test("normalizeURL strip protocol", () => {
  const input = "https://boot.dev.blog/path/";
  const actual = normalizeURL(input);
  const expected = "boot.dev.blog/path";
  expect(actual).toEqual(expected);
});