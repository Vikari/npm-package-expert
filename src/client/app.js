//import "bootstrap/dist/css/bootstrap.css";
import { shuffle } from "lodash";

import splitPackages from "./splitPackages";
import quess from "./quess";
import render from "./render";
import shiftCards from "./shiftCards";
import packageValues from "./packageValues";
/* ... */

class App {
  constructor(root) {
    this.root = root;
    this.deck1;
    this.deck2;
    this.counter = 0;
    this.wins = 0;
    this.start = false;
    this.values;
    this.difficulty;
    this.update();
  }

  getCounter() {
    return this.counter;
  }

  setCounter(value) {
    if (typeof value !== "number") {
      throw new Error('"counter" must be a number.');
    }
    this.counter = value;
  }

  getWins() {
    return this.wins;
  }

  setWins(value) {
    if (typeof value !== "number") {
      throw new Error('"wins" must be a number.');
    }
    this.wins = value;
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

  // Set deck 1 or 2 indicated by number parameter
  setDeck(deck, number) {
    number === 2 ? (this.deck2 = deck) : (this.deck1 = deck);
  }

  // Get deck 1 or 2 indicated by number parameter
  getDeck(number) {
    return number === 2 ? this.deck2 : this.deck1;
  }

  // Draws whole root on every update
  update(won, same, right, turn, selected) {
    if (document.getElementById("error")) {
      document.getElementById("error").innerHTML = "";
    }
    this.root.innerHTML = render(
      won,
      same,
      right,
      turn,
      selected,
      this.getStart(),
      this.getCounter(),
      this.getWins(),
      this.getDeck(1),
      this.getDeck(2)
    );
  }

  // Starts new game by fetching "cards" from the server and splitting and
  // shuffling them into two decks
  startGame() {
    return fetch("http://localhost:3000/api/top-packages.json")
      .then(response => response.json())
      .then(file => {
        const decks = splitPackages(shuffle(file));
        this.setDeck(decks[0], 1);
        this.setDeck(decks[1], 2);
        this.values = packageValues(file);
        this.setCounter(0);
        this.setWins(0);
        this.setStart(true);
        const a = document.getElementById("difficultyList");
        this.difficulty = a.options[a.selectedIndex].value;
        return this.update(false, undefined, false, true);
      })
      .catch(err => {
        console.log(err);
      }); // .catch(console.log.bind(console));
  }

  // Handles players quess and tells update what to do next
  quess() {
    try {
      const [won, same, right, turn, selected] = quess(
        this.getDeck(1),
        this.getDeck(2),
        false
      );
      this.setCounter(this.getCounter() + 1);
      if (right) this.setWins(this.getWins() + 1);
      this.update(won, same, right, turn, selected);
    } catch (err) {
      console.log(err);
      document.getElementById("error").innerHTML =
        "<br>Select comparable value first!";
    }
  }

  // Handles computers quess and tells update what to do next
  quessAI() {
    const [won, same, right, turn, selected] = quess(
      this.getDeck(1),
      this.getDeck(2),
      true,
      this.values,
      this.difficulty
    );
    this.setCounter(this.getCounter() + 1);
    if (right) this.setWins(this.getWins() + 1);
    this.update(won, same, right, turn, selected);
  }

  // Shifts cards to the bottom of the winners deck
  shiftCards(right) {
    const decks = shiftCards(this.getDeck(1), this.getDeck(2), right);
    this.setDeck(decks[0], 1);
    this.setDeck(decks[1], 2);
    if (this.getDeck(1).length < 1 || this.getDeck(2).length < 1) {
      this.gameEnded();
    } else if (!right) {
      this.update(false, undefined, right, false);
    } else {
      this.update(false, undefined, right, true);
    }
  }

  gameEnded() {
    this.setStart(false);
    this.update(this.deck2.length < 1);
  }

  startOver() {
    this.setStart(false);
    this.setCounter(0);
    this.update();
  }
}

module.exports = App;
