var chai = typeof require === "undefined" ? chai : require("chai");
var expect = typeof require === "undefined"
  ? chai.expect
  : require("chai").expect;
var App = typeof require === "undefined" ? "" : require("../src/client/app");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM(
  `<!DOCTYPE html><html><head></head><body><div id='root'></div><div id='error'></div><script></script></body></html>`
);

describe("Service tests", () => {
  describe();
});
