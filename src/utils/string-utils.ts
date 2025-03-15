export function titleToSnakeCase(str: string) {
  let output = ""
  for (let i = 0; i < str.length; ++i) {
    if (str[i] === " ") {
      output += "_";
    }
    else {
      output += str[i].toLowerCase();
    }
  }
  return output;
}

export function titleToPascalSnakeCase(str: string) {
  let output = ""
  let doCapitalize = true;
  for (let i = 0; i < str.length; ++i) {
    if (str[i] === " ") {
      output += "_";
      doCapitalize = true;
    }
    else {
      if (doCapitalize) {
        output += str[i].toUpperCase();
        doCapitalize = false;
      }
      else {
        output += str[i].toLowerCase();
      }
    }
  }
  return output;
}