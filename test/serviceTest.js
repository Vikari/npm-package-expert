import "babel-polyfill";
//var chai = typeof require === "undefined" ? chai : require("chai");
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import "whatwg-fetch";
//var App = typeof require === "undefined" ? "" : require("../src/client/app");
import packages from "../api/top-packages";
import splitPackages from "../src/client/splitPackages";
import quess from "../src/client/quess";
import render from "../src/client/render";
import shiftCards from "../src/client/shiftCards";
import cardify from "../src/client/cardify";

chai.use(chaiAsPromised);
chai.should();

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM(
  `<div id="root">
    <select multiple="" size="9" class="form-control" id="quessList">
    <option id="opt0" value="0" style="color: red; font-weight: bold;" selected>releases: 451</option><option id="opt1" value="1" style="color: blue;">dependencies: 21</option><option id="opt2" value="2" style="color: red; font-weight: bold;">dependents: 4055</option><option id="opt3" value="3" style="color: red; font-weight: bold;">downloadsLastMonth: 6718003</option><option id="opt4" value="4" style="color: blue;">openIssues: 691</option><option id="opt5" value="5" style="color: blue;">openPullRequests: 45</option><option id="opt6" value="6" style="color: red; font-weight: bold;">quality: 93</option><option id="opt7" value="7" style="color: red; font-weight: bold;">popularity: 88</option><option id="opt8" value="8" style="color: red; font-weight: bold;">maintenance: 78</option>
    </select></div>`
);

describe("Services", () => {
  describe("#splitPackages()", () => {
    it("should not do anything with empty", () => {
      (typeof splitPackages()).should.equal("undefined");
    });

    it("should split packages and return even long", () => {
      splitPackages(packages).should.be.a("array");
      const [deck1, deck2] = splitPackages(packages);
      (deck1.length + deck2.length).should.equal(packages.length);
      deck1.length.should.equal(deck2.length);
    });
  });

  describe("#shiftCards()", () => {
    it("should return unchanged if one or both empty", () => {
      const deck1 = packages.slice(0, packages.length / 2);
      const deck2 = [];
      const expected = [deck1, deck2];

      shiftCards(deck1, deck2).should.deep.equal(expected);
      shiftCards(deck1).should.deep.equal([deck1, undefined]);
    });

    describe("should shift right cards and put them to the bottom of winners deck", () => {
      it("when player wins", () => {
        const deck1 = packages.slice(0, packages.length / 2);
        const deck2 = packages.slice(packages.length / 2);
        const [rdeck1, rdeck2] = shiftCards(deck1, deck2, true);

        rdeck1.length.should.equal(deck1.length + 1);
        rdeck2.length.should.equal(deck2.length - 1);
        rdeck1[rdeck1.length - 2].should.equal(deck1[0]);
        rdeck1[rdeck1.length - 1].should.equal(deck2[0]);
      });

      it("when player loses", () => {
        const deck1 = packages.slice(0, packages.length / 2);
        const deck2 = packages.slice(packages.length / 2);
        const [rdeck1, rdeck2] = shiftCards(deck1, deck2, false);

        rdeck1.length.should.equal(deck1.length - 1);
        rdeck2.length.should.equal(deck2.length + 1);
        rdeck2[rdeck2.length - 2].should.equal(deck1[0]);
        rdeck2[rdeck2.length - 1].should.equal(deck2[0]);
      });
    });
  });

  describe("#quess()", () => {
    const deck1 = [
      {
        name: "lodash",
        version: "4.17.4",
        releases: 100,
        dependencies: 0,
        dependents: 46210,
        downloadsLastMonth: 44562576,
        openIssues: 0,
        openPullRequests: 0,
        quality: 76,
        popularity: 97,
        maintenance: 100
      }
    ];
    const deck2 = [
      {
        name: "babel-cli",
        version: "6.24.1",
        releases: 63,
        dependencies: 15,
        dependents: 1726,
        downloadsLastMonth: 1988789,
        openIssues: 294,
        openPullRequests: 109,
        quality: 87,
        popularity: 75,
        maintenance: 99
      }
    ];

    describe("should return right values", () => {
      describe("when player is quessing", () => {
        it("and player is right", () => {
          const element = dom.window.document.getElementById("quessList");
          const expected = [
            false,
            false,
            true,
            false,
            element.options[element.selectedIndex].value
          ];

          const res = quess(deck1, deck2, false, element);
          res.should.deep.equal(expected);
        });

        it("and player is wrong", () => {
          const element = dom.window.document.getElementById("quessList");
          const expected = [
            false,
            false,
            false,
            false,
            element.options[element.selectedIndex].value
          ];

          const res = quess(deck2, deck1, false, element);
          res.should.deep.equal(expected);
        });

        it("same values", () => {
          deck2[0].releases = 100;
          const element = dom.window.document.getElementById("quessList");
          const expected = [
            false,
            true,
            false,
            true,
            element.options[element.selectedIndex].value
          ];

          const res = quess(deck1, deck2, false, element);
          res.should.deep.equal(expected);
        });
      });

      it("when computer is quessing", () => {
        deck2[0].releases = 10;
        const expected = [false, false, true, false, 0];

        for (var i = 0; i <= 10; ++i) {
          const element = dom.window.document.getElementById(
            "opt" + Math.floor(Math.random() * 9)
          );
          const b = element.text.split(":", 1);
          const c = element.value;
          const right = c != 1 && c != 4 && c != 5
            ? deck1[0][b] > deck2[0][b]
            : deck1[0][b] < deck2[0][b];
          expected[2] = right;
          expected[4] = c;

          const res = quess(deck1, deck2, true, element);
          res.should.deep.equal(expected);
        }
      });
    });
  });

  describe("#cardify()", () => {
    it("should return properly formatted card", () => {
      const expected = `\n    <h3>babel-cli@6.24.1</h3>\n    <select multiple size="9" class="form-control" id="quessList">\n    <option id="opt0" value="0" style=\'color: red; font-weight: bold;\' disabled >releases: 63</option><option id="opt1" value="1" style=\'color: blue;\' disabled >dependencies: 15</option><option id="opt2" value="2" style=\'color: red; font-weight: bold;\' disabled >dependents: 1726</option><option id="opt3" value="3" style=\'color: red; font-weight: bold;\' disabled >downloadsLastMonth: 1988789</option><option id="opt4" value="4" style=\'color: blue;\' disabled >openIssues: 294</option><option id="opt5" value="5" style=\'color: blue;\' disabled >openPullRequests: 109</option><option id="opt6" value="6" style=\'color: red; font-weight: bold;\' disabled >quality: 87</option><option id="opt7" value="7" style=\'color: red; font-weight: bold;\' disabled >popularity: 75</option><option id="opt8" value="8" style=\'color: red; font-weight: bold;\' disabled >maintenance: 99</option>\n    </select>\n  `;

      cardify("disabled", undefined, packages[0]).should.equal(expected);
    });
  });

  describe("#render()", () => {
    it("should return properly formatted page", function() {
      const args = [
        false,
        false,
        false,
        false,
        0,
        true,
        1,
        1,
        packages.slice(0, packages.length / 2),
        packages.slice(packages.length / 2)
      ];
      const expected = `\n    <h1>Player Lost the round!</h1>\n    \n  <table class=\'table table-striped table-bordered table-inverse\'><td> Round/wins:\n  1/1\n  </td><td>Players cards:\n  5\n  </td><td>Computers cards:\n  7\n  </td>\n    <table class="table table-striped table-bordered table-inverse">\n    <td>\n    <b>Players card</b>: </th>\n    <h3>babel-cli@6.24.1</h3>\n    <select multiple size="9" class="form-control" id="quessList">\n    <option id="opt0" value="0" style=\'color: red; font-weight: bold;\' disabled selected>releases: 63</option><option id="opt1" value="1" style=\'color: blue;\' disabled >dependencies: 15</option><option id="opt2" value="2" style=\'color: red; font-weight: bold;\' disabled >dependents: 1726</option><option id="opt3" value="3" style=\'color: red; font-weight: bold;\' disabled >downloadsLastMonth: 1988789</option><option id="opt4" value="4" style=\'color: blue;\' disabled >openIssues: 294</option><option id="opt5" value="5" style=\'color: blue;\' disabled >openPullRequests: 109</option><option id="opt6" value="6" style=\'color: red; font-weight: bold;\' disabled >quality: 87</option><option id="opt7" value="7" style=\'color: red; font-weight: bold;\' disabled >popularity: 75</option><option id="opt8" value="8" style=\'color: red; font-weight: bold;\' disabled >maintenance: 99</option>\n    </select>\n  \n    </td>\n    <td>\n    <b>Computers card</b>: </th>\n    <h3>yargs@8.0.1</h3>\n    <select multiple size="9" class="form-control" id="quessList">\n    <option id="opt0" value="0" style=\'color: red; font-weight: bold;\' disabled selected>releases: 138</option><option id="opt1" value="1" style=\'color: blue;\' disabled >dependencies: 13</option><option id="opt2" value="2" style=\'color: red; font-weight: bold;\' disabled >dependents: 5849</option><option id="opt3" value="3" style=\'color: red; font-weight: bold;\' disabled >downloadsLastMonth: 28522602</option><option id="opt4" value="4" style=\'color: blue;\' disabled >openIssues: 108</option><option id="opt5" value="5" style=\'color: blue;\' disabled >openPullRequests: 3</option><option id="opt6" value="6" style=\'color: red; font-weight: bold;\' disabled >quality: 100</option><option id="opt7" value="7" style=\'color: red; font-weight: bold;\' disabled >popularity: 86</option><option id="opt8" value="8" style=\'color: red; font-weight: bold;\' disabled >maintenance: 99</option>\n    </select>\n  \n    </td>\n    </table>\n    <button class="btn btn-primary" onClick="app.shiftCards(false)">Continue</button>\n    <button class="btn btn-danger" onClick="app.startGame()">Start over</button>\n    `;

      render(...args).should.equal(expected);
    });
  });

  describe("/api/top-packages.json", () => {
    let cards;

    beforeEach(() => {
      sinon.stub(window, "fetch");
      var res = new window.Response(JSON.stringify(packages), {
        status: 200,
        headers: {
          "Content-type": "application/json"
        }
      });

      window.fetch.returns(Promise.resolve(res));
    });

    afterEach(() => {
      window.fetch.restore();
    });

    it("should be an array", done => {
      window
        .fetch("/api/top-packages.json")
        .then(response => response.json())
        .then(file => {
          cards = file;
          cards.should.deep.equal(packages);
          return file;
        })
        .catch(console.log.bind(console))
        .should.eventually.be.a("array")
        .notify(done);
    });

    it("should contain objects", () => {
      cards.should.not.be.empty;
      cards.forEach(card => card.should.be.a("object"));
    });
  });
});
