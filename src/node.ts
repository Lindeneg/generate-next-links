import { Id } from "./id";
import { LogLevel, Logger } from "./log";

export type MapKey = number;
export type MapValue = {
  name: string;
  parentId: number | null;
  isDir: boolean;
};
export type Parents = { [key: string]: MapValue["parentId"] };

export class NodeMap {
  private map: Map<MapKey, MapValue>;
  private parents: Parents;
  private log: Logger;
  constructor(logger?: Logger) {
    this.map = new Map();
    this.parents = {};
    this.log = logger || (() => null);
  }

  public setNode(value: MapValue): MapKey {
    let key = Id.next();
    if (this.map.has(key)) {
      key = Id.next();
    }
    this.log(LogLevel.Debug, `setting node '${value.name}#${key}'`);
    this.map.set(key, value);
    return key;
  }

  public getNode(key: number): MapValue | undefined {
    return this.map.get(key);
  }

  public keys(): IterableIterator<number> {
    return this.map.keys();
  }

  public handleChild(child: string, parentId: MapValue["parentId"]) {
    if (child !== "") {
      this.log(LogLevel.Debug, `handling child '#${child}'`);
      this.setNode({
        name: child === "index" ? "" : child,
        isDir: false,
        parentId,
      });
    }
  }

  public handleParent(targets: string[], parentId: number | null) {
    if (targets.length > 1) {
      const [parentName, parentPath] = this.getParentPath(targets);
      const parent = this.getParent(parentPath);
      if (parent === null) {
        parentId = this.setNode({
          name: parentName,
          isDir: true,
          parentId: this.getGrandParentId(parentPath),
        });
        this.setParent(parentPath, parentId);
      } else {
        parentId = parent;
        this.log(LogLevel.Debug, `used parent '${parentName}#${parentId}'`);
      }
    }
    return parentId;
  }

  private setParent(key: string, value: number) {
    if (this.getParent(key) === null) {
      this.parents[key] = value;
    }
  }

  private getParent(key: string): MapValue["parentId"] {
    const entry = this.parents[key];
    if (typeof entry !== "undefined") {
      return entry;
    }
    return null;
  }

  private getParentPath(targets: string[]): [string, string] {
    const parent = targets.slice(0, targets.length - 1);
    const parentName = parent[parent.length - 1];
    const parentPath = parent.join("/");
    return [parentName, parentPath];
  }

  private getGrandParentId(path: string): number {
    const parentPath = path.split("/");
    if (parentPath.length <= 1) {
      return 0;
    }
    const grandParentPath = parentPath
      .slice(0, parentPath.length - 1)
      .join("/");
    if (this.getParent(grandParentPath) === null) {
      const name = grandParentPath.split("/");
      this.setParent(
        grandParentPath,
        this.setNode({
          name: name[name.length - 1],
          isDir: true,
          parentId: this.getGrandParentId(path),
        })
      );
    }
    return this.getParent(grandParentPath) || 0;
  }
}
