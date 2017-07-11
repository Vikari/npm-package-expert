export default packages => {
  if (packages) {
    const values = {
      releases: { min: undefined, max: undefined, avg: 0 },
      dependencies: { min: undefined, max: undefined, avg: 0 },
      dependents: { min: undefined, max: undefined, avg: 0 },
      downloadsLastMonth: { min: undefined, max: undefined, avg: 0 },
      openIssues: { min: undefined, max: undefined, avg: 0 },
      openPullRequests: { min: undefined, max: undefined, avg: 0 },
      quality: { min: undefined, max: undefined, avg: 0 },
      popularity: { min: undefined, max: undefined, avg: 0 },
      maintenance: { min: undefined, max: undefined, avg: 0 }
    };
    const keys = Object.keys(values);
    packages.forEach(card => {
      for (var i = 0; i < keys.length; ++i) {
        values[keys[i]].avg += card[keys[i]];
        if (
          card[keys[i]] < values[keys[i]].min ||
          values[keys[i]].min == undefined
        ) {
          values[keys[i]].min = card[keys[i]];
        }
        if (
          card[keys[i]] > values[keys[i]].max ||
          values[keys[i]].max == undefined
        ) {
          values[keys[i]].max = card[keys[i]];
        }
      }
    });
    for (var i = 0; i < keys.length; ++i) {
      values[keys[i]].avg /= packages.length;
    }
    return values;
  }
};
