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
  describe("#New Game", () => {
    afterEach(() => {});

    describe("Value of start", () => {
      var app;

      beforeEach(() => {
        app = new App(dom.window.document.getElementById("root"));
      });

      it("is false", () => {
        app.start.should.equal(false);
      });

      it("can be changed", () => {
        app.setStart(true);
        app.start.should.equal(true);
        app.setStart(false);
        app.start.should.equal(false);
      });

      it("only accepts booleans", () => {
        expect(() => {
          app.setStart("foo");
        }).to.throw(Error, '"start" must be a boolean.');
      });
    });

    describe("Start Game", () => {
      var app = new App(dom.window.document.getElementById("root"));

      it("#startGame()", function(done) {
        app.startGame(done);
      });

      it("startGame has set values", () => {
        app.getDeck(1).should.be.a("array");
        app.counter.should.equal(0);
        app.playerHW.should.equal(0);
        app.getStart().should.equal(true);
      });
    });
  });
});
