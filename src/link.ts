export type Link = [string, string];

export function convertCamelCase(target: string) {
  const result: string[] = [];
  target.split(" ").forEach((entry) => {
    if (entry != "") {
      let splitWords = entry.split(/(?=[A-Z])/).join("_");
      result.push(splitWords.charAt(0).toUpperCase() + splitWords.slice(1));
    }
  });
  return result.join(" ");
}

export function getLink(target: string): Link | null {
  const name = target.replace(/^\//, "").replace(/\.(tsx|jsx)/g, "");
  if (!name || /^(\_app|index)$/.test(name)) {
    return null;
  }
  if (/^.+\/index$/.test(name)) {
    const cleanName = name.replace(/\/index/, "");
    return [cleanLinkName(cleanName), "/" + cleanName];
  }
  return [cleanLinkName(name), "/" + name];
}

export function cleanLinkName(name: string) {
  return convertCamelCase(name)
    .replace(/^\//, "")
    .replace(/(\/|\-)/g, "_")
    .replace(/\[|\]/g, "")
    .toUpperCase()
    .trim();
}
