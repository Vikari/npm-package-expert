const chai = typeof require === "undefined" ? chai : require("chai");
const expect = typeof require === "undefined"
  ? chai.expect
  : require("chai").expect;
const chaiAsPromised = require("chai-as-promised");
const App = typeof require === "undefined" ? "" : require("../src/client/app");

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM(
  `<!DOCTYPE html><html><head></head><body><div id='root'></div><div id='error'></div><script></script></body></html>`
);

chai.use(chaiAsPromised);
chai.should();

describe("App", () => {
  // afterEach(() => {});
  describe("value of start", () => {
    var app;

    beforeEach(() => {
      app = new App(dom.window.document.getElementById("root"));
    });

    it("should be false", () => {
      app.start.should.equal(false);
    });

    it("should be possible to change with setters", () => {
      app.setStart(true);
      app.start.should.equal(true);
      app.setStart(false);
      app.start.should.equal(false);
    });

    it("should only accept booleans", () => {
      expect(() => {
        app.setStart("foo");
      }).to.throw(Error, '"start" must be a boolean.');
    });
  });

  describe("#startGame()", function() {
    var app = new App(dom.window.document.getElementById("root"));

    it("should notify done", function(done) {
      app.startGame().should.notify(done); //.be.a("array");
    });

    it("should have set values", () => {
      app.getDeck(1).should.be.a("array");
      app.getDeck(2).should.be.a("array");
      app.getDeck(1).length.should.equal(6);
      app.getDeck(2).length.should.equal(6);
      app.getCounter().should.equal(0);
      app.getWins().should.equal(0);
      app.getStart().should.equal(true);
    });
  });
});
