export function formatWeight(w, settings) {
  //prob needs work
  let nextValue = String(w.value);
  if (settings.units === w.units) {
    nextValue = settings.forceDecimals
      ? Number(w.value).toFixed(settings.decimals)
      : w.value;
  } else {
    const currDecimals = settings.forceDecimals ? settings.decimals : null;
    //assumes getting a string value
    const multiplier = {
      lb: {
        kg: 0.453592,
        st: 0.0714286,
      },
      kg: {
        lb: 2.20462,
        st: 0.157473,
      },
      st: {
        kg: 6.35029,
        lb: 14,
      },
    };
    let decimals;
    if (currDecimals !== null) {
      decimals = currDecimals;
    } else if (!String(w.value).includes(".")) {
      decimals = settings.units === "st" ? 1 : 0;
    } else {
      decimals = nextValue.split(".")[1].length;
    }
    nextValue = nextValue * multiplier[w.units][settings.units];
    nextValue = Number(nextValue).toFixed(decimals);
  }
  return nextValue;
}

export function formatDate(date, timeBool) {
  let options = {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
    hour12: true,
  };
  if (timeBool) {
    options.hour = "numeric";
    options.minute = "numeric";
  }
  const seconds = Date.parse(date);
  return new Intl.DateTimeFormat(undefined, options).format(seconds);
}
