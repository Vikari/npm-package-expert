export default packages => {
  let deck1;
  let deck2;
  return [
    (deck1 = packages.slice(0, packages.length / 2)),
    (deck2 = packages.slice(packages.length / 2))
  ];
};
