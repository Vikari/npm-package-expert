// Shifts cards to the bottom of winners deck
export default (deck1, deck2, playerRight) => {
  if (deck1 && deck2 && (deck1.length > 0 && deck2.length > 0)) {
    deck1 = [...deck1];
    deck2 = [...deck2];
    if (playerRight) {
      deck1.push(deck1.shift());
      deck1.push(deck2.shift());
    } else {
      deck2.push(deck1.shift());
      deck2.push(deck2.shift());
    }
  }
  return [deck1, deck2];
};
