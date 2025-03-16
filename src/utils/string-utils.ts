export function toSnakeCase(s: string, doCapitalize: boolean = false): string {
  let result = "";

  let doUpper = true;

  for (const c of s) {
    if (c == ' ' || c == '_') {
      result += '_';
      doUpper = true;
    }
    else if (doCapitalize && doUpper) {
      result += c.toUpperCase();
      doUpper = false;
    }
    else if (c === c.toUpperCase()) {
      result += '_';
      result += doCapitalize ? c : c.toLowerCase();
    }
    else {
      result += c.toLowerCase();
    }
  }
  return result;
}