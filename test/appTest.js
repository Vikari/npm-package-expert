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

chai.should();

describe("App", () => {
  describe("new game functionality", () => {
    afterEach(() => {});

    describe("value of start", () => {
      var app;

      beforeEach(() => {
        app = new App(dom.window.document.getElementById("root"));
      });

      it("should be false", () => {
        app.start.should.equal(false);
      });

      it("should be possible to change", () => {
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

    describe("#startGame()", () => {
      var app = new App(dom.window.document.getElementById("root"));

      it("should end", function(done) {
        app.startGame(done);
      });

      it("should have set values", () => {
        app.getDeck(1).should.be.a("array");
        app.getDeck(2).should.be.a("array");
        app.getDeck(1).length.should.equal(6);
        app.getDeck(2).length.should.equal(6);
        app.counter.should.equal(0);
        app.playerHW.should.equal(0);
        app.getStart().should.equal(true);
      });
    });
  });
});