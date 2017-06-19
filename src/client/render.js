import cardify from "./cardify";

const button = (onClick, children, type) =>
  `<button class="btn btn-${type}" onClick="${onClick}">${children}</button>`;

const h1 = children => `<h1>${children}</h1>`;

const card = (owner, card) => `${owner}: </th>${card}`;

const text = (text, style) => `<div ${style}>${text}</div>`;

const infoTable = (counter, wins, deck1, deck2) => `
  <table class='table table-striped table-bordered table-inverse'><td> Round/wins:
  ${counter}/${wins}
  </td><td>Players cards:
  ${deck1}
  </td><td>Computers cards:
  ${deck2}
  </td>`;

// Handles drawing web page by using given values
export default (
  won,
  same,
  right,
  turn,
  selected,
  start,
  counter,
  wins,
  deck1,
  deck2
) => {
  if (!start) {
    //this.setStart(true);
    return `
    ${counter == 0
      ? h1("Start New Top Trumps Game")
      : won ? h1("Player Won!") : h1("Player Lost!")}
      ${text("When choosing a value,")}
      ${text(
        "red means that bigger is better",
        "style='color:red; font-weight: bold;'"
      )}
      ${text(
        " and blue means that smaller is better.<br><br>",
        "style='color:blue;'"
      )}
    ${button("app.startGame()", "Start New Game", "primary")}
  `;
  } else {
    return `
    ${same === undefined
      ? turn ? h1("Select comparable value:") : h1("Computers turn")
      : same
        ? h1("Same values, quess again!")
        : h1(right ? "Player Won the round!" : "Player Lost the round!")}
    ${same === undefined || same
      ? infoTable(counter, wins, deck1.length, deck2.length)
      : right
        ? infoTable(counter, wins, deck1.length + 1, deck2.length - 1)
        : infoTable(counter, wins, deck1.length - 1, deck2.length + 1)}
    <table class="table table-striped table-bordered table-inverse">
    <td>
    ${card(
      "<b>Players card</b>",
      cardify(
        (!same && same !== undefined) || !turn ? "disabled" : "",
        (!turn && same !== undefined) || turn ? selected : undefined,
        deck1[0]
      )
    )}
    </td>
    <td>
    ${!same && same !== undefined
      ? card("<b>Computers card</b>", cardify("disabled", selected, deck2[0]))
      : ""}
    </td>
    </table>
    ${same === undefined
      ? turn
        ? button("app.quess()", "P Quess", "primary")
        : button("app.quessAI()", "AI Quess", "primary")
      : same
        ? button("app.quess()", "P Quess", "primary")
        : button("app.shiftCards(" + right + ")", "Continue", "primary")}
    ${button("app.startGame()", "Start over", "danger")}
    `;
  }
};
