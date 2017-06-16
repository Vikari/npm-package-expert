//import "bootstrap/dist/css/bootstrap.css";
import { shuffle } from "lodash";

import cardify from "./cardify";
import splitPackages from "./splitPackages";
/* ... */

const button = (onClick, children, type) =>
  `<button class="btn btn-${type}" onClick="${onClick}">${children}</button>`;

const h1 = children => `<h1>${children}</h1>`;

const card = (owner, card) => `${owner}: </th>${card}`;

const text = text => `<p>${text}</p>`;

const infoTable = (counter, playerHW, deck1, deck2) => `
  <table class='table table-striped table-bordered table-inverse'><td> Round/wins:
  ${counter}/${playerHW}
  </td><td>Players cards:
  ${deck1}
  </td><td>Computers cards:
  ${deck2}
  </td>`;

class App {
  constructor(root) {
    this.root = root;
    //this.playerRight = false;
    this.start = false;
    //this.playerWon = false;
    this.startGame();
  }

  getStart() {
    return this.start;
  }

  setStart(value) {
    if (typeof value !== "boolean") {
      throw new Error('"start" must be a boolean.');
    }
    this.start = value;
  }

  update(start, playerWon, sameValue, playerRight, playersTurn) {
    document.getElementById("error").innerHTML = "";
    this.root.innerHTML = this.render(
      start,
      playerWon,
      sameValue,
      playerRight,
      playersTurn
    );
  }

  render(start, playerWon, sameValue, playerRight, playersTurn) {
    if (!this.getStart()) {
      this.setStart(true);
      return `
      ${this.counter == 0
        ? h1("Start New Top Trumps Game")
        : playerWon ? h1("Player Won!") : h1("Player Lost!")}
      ${button("app.startGame()", "Start New Game", "primary")}
    `;
    } else {
      return `
      ${sameValue === undefined
        ? playersTurn ? h1("Select comparable value:") : h1("Computers turn")
        : sameValue
          ? h1("Same values, quess again!")
          : h1(
              playerRight ? "Player Won the round!" : "Player Lost the round!"
            )}
      ${sameValue === undefined || sameValue
        ? infoTable(
            this.counter,
            this.playerHW,
            this.deck1.length,
            this.deck2.length
          )
        : playerRight
          ? infoTable(
              this.counter,
              this.playerHW,
              this.deck1.length + 1,
              this.deck2.length - 1
            )
          : infoTable(
              this.counter,
              this.playerHW,
              this.deck1.length - 1,
              this.deck2.length + 1
            )}
      <table class="table table-striped table-bordered table-inverse">
      <td>
      ${card(
        "<b>Players card</b>",
        cardify(
          (!sameValue && sameValue !== undefined) || !playersTurn
            ? "disabled"
            : "",
          (!playersTurn && sameValue !== undefined) || playersTurn
            ? this.selected
            : undefined,
          this.deck1[0]
        )
      )}
      </td>
      <td>
      ${!sameValue && sameValue !== undefined
        ? card(
            "<b>Computers card</b>",
            cardify("disabled", this.selected, this.deck2[0])
          )
        : ""}
      </td>
      </table>
      ${sameValue === undefined
        ? playersTurn
          ? button("app.quess()", "P Quess", "primary")
          : button("app.quessAI()", "AI Quess", "primary")
        : sameValue
          ? button("app.quess()", "P Quess", "primary")
          : button(
              "app.shiftCards(" + playerRight + ")",
              "Continue",
              "primary"
            )}
      ${button("app.startGame()", "Start over", "danger")}
      `;
    }
  }

  startGame() {
    fetch("http://localhost:3000/api/top-packages.json")
      .then(response => response.json())
      .then(file => {
        const decks = splitPackages(shuffle(file));
        (this.deck1 = decks[0]), (this.deck2 = decks[1]);
        //this.sameValue = undefined;
        this.counter = 0;
        this.playerHW = 0;
        //this.PlayersTurn = true;
        this.update(this.start, false, undefined, false, true);
      });
  }

  quess() {
    const a = document.getElementById("quessList");
    try {
      const b = a.options[a.selectedIndex].text.split(":", 1);
      this.selected = a.options[a.selectedIndex].value;
      this.counter++;
      if (this.deck1[0][b] === this.deck2[0][b]) {
        this.update(true, false, true, this.playerRight);
      } else {
        const playerRight = this.selected != 1 &&
          this.selected != 4 &&
          this.selected != 5
          ? this.deck1[0][b] > this.deck2[0][b]
          : this.deck1[0][b] < this.deck2[0][b];
        if (playerRight) this.playerHW++;
        this.update(true, false, false, playerRight);
      }
    } catch (err) {
      console.log(err);
      document.getElementById("error").innerHTML =
        "<br>Select comparable value first!";
    }
  }

  quessAI() {
    let a, b;
    do {
      a = document.getElementById("opt" + Math.floor(Math.random() * 9));
      b = a.text.split(":", 1);
      this.selected = a.value;
      this.counter++;
    } while (this.deck1[0][b] === this.deck2[0][b]);
    const playerRight = a.value != 1 && a.value != 4 && a.value != 5
      ? this.deck1[0][b] > this.deck2[0][b]
      : this.deck1[0][b] < this.deck2[0][b];
    if (playerRight) this.playerHW++;
    this.update(true, false, false, playerRight);
  }

  shiftCards(playerRight) {
    if (playerRight) {
      this.deck1.push(this.deck1.shift());
      this.deck1.push(this.deck2.shift());
    } else {
      this.deck2.push(this.deck1.shift());
      this.deck2.push(this.deck2.shift());
    }
    if (this.deck1.length < 1 || this.deck2.length < 1) {
      this.gameEnded();
    } else if (!playerRight) {
      this.update(true, false, undefined, playerRight, false);
    } else {
      this.update(true, false, undefined, playerRight, true);
    }
  }

  gameEnded() {
    this.start = false;
    this.playerWon = this.deck2.length < 1;
    this.update(false, this.playerWon);
  }
}

module.exports = App;
