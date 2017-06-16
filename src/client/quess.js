// Handles comparing "cards" from two decks for player and "AI"
// "AI" just selects randomly one value
export default (deck1, deck2, isAI) => {
  if (isAI) {
    let a, b;
    do {
      a = document.getElementById("opt" + Math.floor(Math.random() * 9));
      b = a.text.split(":", 1);
    } while (deck1[0][b] === deck2[0][b]);
    const playerRight = a.value != 1 && a.value != 4 && a.value != 5
      ? deck1[0][b] > deck2[0][b]
      : deck1[0][b] < deck2[0][b];
    return [false, false, playerRight, false, a.value];
  } else {
    const a = document.getElementById("quessList");
    const b = a.options[a.selectedIndex].text.split(":", 1);
    const selected = a.options[a.selectedIndex].value;
    if (deck1[0][b] === deck2[0][b]) {
      return [false, true, false, true, selected];
    } else {
      const playerRight = selected != 1 && selected != 4 && selected != 5
        ? deck1[0][b] > deck2[0][b]
        : deck1[0][b] < deck2[0][b];
      return [false, false, playerRight, false, selected];
    }
  }
};
