var chai = typeof require === "undefined" ? chai : require("chai");
var expect = typeof require === "undefined"
  ? chai.expect
  : require("chai").expect;
var App = typeof require === "undefined" ? "" : require("../src/client/app");

chai.should();

describe("App", () => {
  describe("#New Game", () => {
    // if (typeof require !== "undefined") {
    //   var app;
    // }

    beforeEach(() => {
      // if (typeof require !== "undefined") {
      //   app = new App(document.getElementById("root"));
      // }
    });

    afterEach(() => {});

    it("haven't started", () => {
      app.start.should.equal(false);
      app.root.should.equal(document.getElementById("root"));
      app.playerRight.should.equal(false);
      app.playerWon.should.equal(false);
    });

    it("can be changed", () => {
      app.setStart(true);
      app.start.should.equal(true);
      app.setStart(false);
    });

    it("only accepts booleans", () => {
      expect(() => {
        app.setStart("foo");
      }).to.throw(Error, '"start" must be a boolean.');
    });

    it("#startGame()", function(done) {
      app.startGame(done);
      done();
      app.sameValue.should.equal(undefined);
      expect(app.deck1).to.be.an("object");
      app.counter.should.equal(0);
      app.playerHW.should.equal(0);
      app.playersTurn.should.equal(true);
      console.log("wog");
    });

    it("startGame has set values", () => {
      //app.sameValue.should.equal(undefined);
      //expect(app.deck1).to.be.an(undefined);
      app.counter.should.equal(0);
      app.playerHW.should.equal(0);
      //app.playersTurn.should.equal(true);
    });
  });
});
