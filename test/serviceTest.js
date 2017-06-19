import "babel-polyfill";
var chai = typeof require === "undefined" ? chai : require("chai");
//var App = typeof require === "undefined" ? "" : require("../src/client/app");
var packages = require("../api/top-packages");
import splitPackages from "../src/client/splitPackages";
import quess from "../src/client/quess";
import render from "../src/client/render";
import shiftCards from "../src/client/shiftCards";
import cardify from "../src/client/cardify";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM(
  `<!DOCTYPE html><html><head></head><body><div id="root">
    <h1>Select comparable value:</h1>

  <table class="table table-striped table-bordered table-inverse"><tbody><tr><td> Round/wins:
  0/0
  </td><td>Players cards:
  6
  </td><td>Computers cards:
  6
  </td>
    </tr></tbody></table><table class="table table-striped table-bordered table-inverse">
    <tbody><tr><td>
    <b>Players card</b>:
    <h3>webpack@2.6.1</h3>
    <select multiple="" size="9" class="form-control" id="quessList">
    <option id="opt0" value="0" style="color: red; font-weight: bold;" selected>releases: 451</option><option id="opt1" value="1" style="color: blue;">dependencies: 21</option><option id="opt2" value="2" style="color: red; font-weight: bold;">dependents: 4055</option><option id="opt3" value="3" style="color: red; font-weight: bold;">downloadsLastMonth: 6718003</option><option id="opt4" value="4" style="color: blue;">openIssues: 691</option><option id="opt5" value="5" style="color: blue;">openPullRequests: 45</option><option id="opt6" value="6" style="color: red; font-weight: bold;">quality: 93</option><option id="opt7" value="7" style="color: red; font-weight: bold;">popularity: 88</option><option id="opt8" value="8" style="color: red; font-weight: bold;">maintenance: 78</option>

    </select></td>
    <td>

    </td>
    </tr></tbody></table>
    <button class="btn btn-primary" onclick="app.quess()">P Quess</button>
    <button class="btn btn-danger" onclick="app.startGame()">Start over</button>
    </div><div id='error'></div><script></script></body></html>`
);

// let cards;
//
// fetch("http://localhost:3000/api/top-packages.json")
//   .then(response => response.json())
//   .then(file => {
//     cards = file;
//   });

describe("Services", () => {
  describe("#splitPackages()", () => {
    it("should not do anything with empty", () => {
      (typeof splitPackages()).should.equal("undefined");
    });

    it("should split packages and return even long", () => {
      splitPackages(packages).should.be.a("array");
      const [deck1, deck2] = splitPackages(packages);
      deck1.length.should.equal(deck2.length);
    });
  });

  describe("#shiftCards()", () => {
    const deck1 = packages.slice(0, packages.length / 2);
    const deck2 = [];
    const decks = [deck1, deck2];
    it("should return unchanged if one or both empty", () => {
      shiftCards(deck1, deck2).should.deep.equal(decks);
      shiftCards(deck1).should.deep.equal([deck1, undefined]);
    });

    describe("should shift right cards and put them to the bottom of winners deck", () => {
      it("when player wins", () => {
        const deck1 = packages.slice(0, packages.length / 2);
        const deck2 = packages.slice(packages.length / 2);
        const [tdeck1, tdeck2] = shiftCards(deck1, deck2, true);
        tdeck1.length.should.equal(deck1.length + 1);
        tdeck2.length.should.equal(deck2.length - 1);
        tdeck1[tdeck1.length - 2].should.equal(deck1[0]);
        tdeck1[tdeck1.length - 1].should.equal(deck2[0]);
      });
      it("when player loses", () => {
        const deck1 = packages.slice(0, packages.length / 2);
        const deck2 = packages.slice(packages.length / 2);
        const [tdeck1, tdeck2] = shiftCards(deck1, deck2, false);
        tdeck1.length.should.equal(deck1.length - 1);
        tdeck2.length.should.equal(deck2.length + 1);
        tdeck2[tdeck2.length - 2].should.equal(deck1[0]);
        tdeck2[tdeck2.length - 1].should.equal(deck2[0]);
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
          const values = [
            false,
            false,
            true,
            false,
            element.options[element.selectedIndex].value
          ];
          const returnValues = quess(deck1, deck2, false, element);
          returnValues.should.deep.equal(values);
        });

        it("and player is wrong", () => {
          const element = dom.window.document.getElementById("quessList");
          const values = [
            false,
            false,
            false,
            false,
            element.options[element.selectedIndex].value
          ];
          const returnValues = quess(deck2, deck1, false, element);
          returnValues.should.deep.equal(values);
        });

        it("same values", () => {
          deck2[0].releases = 100;
          const element = dom.window.document.getElementById("quessList");
          const values = [
            false,
            true,
            false,
            true,
            element.options[element.selectedIndex].value
          ];
          const returnValues = quess(deck1, deck2, false, element);
          returnValues.should.deep.equal(values);
        });
      });

      it("when computer is quessing", () => {
        deck2[0].releases = 10;
        const values = [false, false, true, false, 0];
        for (var i = 0; i <= 10; ++i) {
          const element = dom.window.document.getElementById(
            "opt" + Math.floor(Math.random() * 9)
          );
          const b = element.text.split(":", 1);
          const playerRight = element.value != 1 &&
            element.value != 4 &&
            element.value != 5
            ? deck1[0][b] > deck2[0][b]
            : deck1[0][b] < deck2[0][b];
          values[2] = playerRight;
          values[4] = element.value;
          const returnValues = quess(deck1, deck2, true, element);
          returnValues.should.deep.equal(values);
        }
      });
    });
  });

  describe("#cardify()", () => {
    const card = `\n    <h3>babel-cli@6.24.1</h3>\n    <select multiple size="9" class="form-control" id="quessList">\n    <option id="opt0" value="0" style=\'color: red; font-weight: bold;\' disabled selected>releases: 63</option><option id="opt1" value="1" style=\'color: blue;\' disabled >dependencies: 15</option><option id="opt2" value="2" style=\'color: red; font-weight: bold;\' disabled >dependents: 1726</option><option id="opt3" value="3" style=\'color: red; font-weight: bold;\' disabled >downloadsLastMonth: 1988789</option><option id="opt4" value="4" style=\'color: blue;\' disabled >openIssues: 294</option><option id="opt5" value="5" style=\'color: blue;\' disabled >openPullRequests: 109</option><option id="opt6" value="6" style=\'color: red; font-weight: bold;\' disabled >quality: 87</option><option id="opt7" value="7" style=\'color: red; font-weight: bold;\' disabled >popularity: 75</option><option id="opt8" value="8" style=\'color: red; font-weight: bold;\' disabled >maintenance: 99</option>\n    </select>\n  `;
    const cardPart = `<h3>babel-cli@6.24.1</h3>`;
    it("should return html", () => {
      cardify("disabled", undefined, packages[0]).should.include(cardPart);
    });
  });

  describe("#render()", () => {
    it("should");
  });
});
