// Splits given array to two even long arrays
export default packages => {
  if (packages) {
    return [
      packages.slice(0, packages.length / 2),
      packages.slice(packages.length / 2)
    ];
  }
};
