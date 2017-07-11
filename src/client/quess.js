// Handles comparing "cards" from two decks for player and "AI"
// "AI" just selects randomly one value
export default (deck1, deck2, isAI, values, difficulty, element) => {
  if (deck1 && deck2) {
    if (isAI) {
      if (values) {
        if (!difficulty) difficulty = 0.5;
        let a, b;
        let c = [],
          i = 0;
        do {
          if (element) a = element;
          else
            do {
              a = document.getElementById(
                "opt" + Math.floor(Math.random() * 9)
              );
            } while (c.includes(a));
          c.push(a);
          b = a.text.split(":", 1);
          i++;
        } while (
          deck1[0][b] === deck2[0][b] ||
          ((a.value == 1 || a.value == 4 || a.value == 5
            ? deck2[0][b] >
              (values[b].avg - values[b].min) * difficulty + values[b].min
            : deck2[0][b] <
              values[b].max - (values[b].max - values[b].avg) * difficulty) &&
            i < 9)
        );
        const playerRight =
          a.value != 1 && a.value != 4 && a.value != 5
            ? deck1[0][b] > deck2[0][b]
            : deck1[0][b] < deck2[0][b];
        return [false, false, playerRight, false, a.value];
      }
    } else {
      let a;
      if (element) a = element;
      else a = document.getElementById("quessList");
      const b = a.options[a.selectedIndex].text.split(":", 1);
      const selected = a.options[a.selectedIndex].value;
      if (deck1[0][b] === deck2[0][b]) {
        return [false, true, false, true, selected];
      } else {
        const playerRight =
          selected != 1 && selected != 4 && selected != 5
            ? deck1[0][b] > deck2[0][b]
            : deck1[0][b] < deck2[0][b];
        return [false, false, playerRight, false, selected];
      }
    }
  }
};
