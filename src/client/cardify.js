export default (disabled, selected, { name, version, ...card }) => {
  let i = -1;
  const styles = [
    "style='color: blue;'",
    "style='color: red; font-weight: bold;'"
  ];
  return `
    <h3>${name}@${version}</h3>
    <select multiple size="9" class="form-control" id="quessList">
    ${Object.entries(card)
      .map(([prop, value]) => {
        i++;
        return `<option id="opt${i}" value="${i}" ${(i == selected &&
          disabled) ||
          (i != 1 && i != 4 && i != 5)
          ? styles[1]
          : styles[0]} ${disabled} ${i == selected && disabled
          ? "selected"
          : ""}>${prop}: ${value}</option>`;
      })
      .join("")}
`;
};
