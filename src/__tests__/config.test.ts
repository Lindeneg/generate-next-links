import fs from "fs";
import { getConfig, isDirectory } from "../config";

const name = `__mockdir__${Date.now()}__`;

describe("Config Test Suite", () => {
  test("can find exiting directory", () => {
    fs.mkdir(name, (err) => {
      expect(isDirectory(name, "./", false)).toBe(true);
    });
  });

  test("can not find non-exiting directory", () => {
    try {
      fs.rm(name, { recursive: true, force: true }, (err) => {
        expect(isDirectory(name, "./", false)).toBe(false);
      });
    } catch (err) {
      expect(isDirectory(name, "./", false)).toBe(false);
    }
  });

  test("get config throws on root path not having a `pages` folder", () => {
    expect(() => getConfig("./", [])).toThrow(
      "`pages` folder not found.. exiting.."
    );
  });

  test("can get default config", () => {
    const rootPath = "./__mock__";
    const config = getConfig(rootPath, []);
    expect(config).toEqual({
      path: rootPath + "/pages",
      out: rootPath,
      name: "links",
      dry: false,
      verbose: false,
    });
  });

  test("can get parse single config arg", () => {
    const rootPath = "./";
    const config = getConfig(rootPath, ["", "", "--path", "__mock__"]);
    expect(config).toEqual({
      path: rootPath + "/__mock__/pages",
      out: rootPath,
      name: "links",
      dry: false,
      verbose: false,
    });
  });

  test("can get parse multiple config args", () => {
    const rootPath = "./";
    const config = getConfig(rootPath, [
      "",
      "",
      "--path",
      "__mock__",
      "--dry",
      "--name",
      "PageLinks",
      "--verbose",
      "--out",
      "src/shared",
    ]);
    expect(config).toEqual({
      path: rootPath + "/__mock__/pages",
      out: rootPath + "/src/shared",
      name: "PageLinks",
      dry: true,
      verbose: true,
    });
  });
});
