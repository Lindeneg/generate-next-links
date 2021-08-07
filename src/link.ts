export type Link = [string, string];

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
  return name
    .replace(/^\//, "")
    .replace(/(\/|\-)/g, "_")
    .replace(/\[|\]/g, "")
    .toUpperCase()
    .trim();
}
