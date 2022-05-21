import path from "path";
import { getConfig, getNativeSeparator, isDirectory } from "../config";

describe("Config Test Suite", () => {
  test("can find exiting directory", () => {
    expect(isDirectory("./src/__tests__/__mockdir__", false)).toBe(true);
  });

  test("can not find non-exiting directory", () => {
    expect(isDirectory("./src/__tests__/__mockdir__" + Date.now(), false)).toBe(
      false
    );
  });

  test("get config throws on root path not having a `pages` folder", () => {
    expect(() => getConfig([], "./")).toThrow(
      "`pages` folder not found.. exiting.."
    );
  });

  test("can get default config", () => {
    const rootPath = "./__mock__";
    const config = getConfig([], rootPath);
    expect(config).toEqual({
      path: path.join(rootPath, "pages"),
      nativeSeparator: getNativeSeparator(),
      out: rootPath,
      name: "links",
      base: "/",
      dry: false,
      api: false,
      root: false,
      verbose: false,
      omitTimestamp: false,
      convertCamelCase: false,
      exportJson: false,
      start: config.start,
    });
  });

  test("can parse single config arg", () => {
    const rootPath = "./";
    const config = getConfig(["--path", "__mock__"], rootPath);
    expect(config).toEqual({
      path: path.join(rootPath, "__mock__", "pages"),
      out: rootPath,
      name: "links",
      nativeSeparator: getNativeSeparator(),
      base: "/",
      dry: false,
      api: false,
      root: false,
      verbose: false,
      omitTimestamp: false,
      convertCamelCase: false,
      exportJson: false,
      start: config.start,
    });
  });

  test("can parse multiple config args", () => {
    const rootPath = "./";
    const config = getConfig(
      [
        "--path",
        "__mock__",
        "--dry",
        "--api",
        "--name",
        "PageLinks",
        "--verbose",
        "--out",
        "src/shared",
      ],
      rootPath
    );
    expect(config).toEqual({
      path: path.join(rootPath, "__mock__", "pages"),
      out: rootPath + "/src/shared",
      name: "PageLinks",
      base: "/",
      nativeSeparator: getNativeSeparator(),
      dry: true,
      api: true,
      root: false,
      verbose: true,
      omitTimestamp: false,
      convertCamelCase: false,
      exportJson: false,
      start: config.start,
    });
  });
});
