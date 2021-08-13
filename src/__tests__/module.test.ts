import { main } from "../";
import { getConfig } from "../config";
import { MOCK_LINKS_ARRAY } from "./test-util";

describe("Module Test Suite", () => {
  test("can do a dry run", (done) => {
    const config = getConfig("./__mock__", [
      "",
      "",
      "--dry",
      "--convert-camel-case",
    ]);
    main(config, (result) => {
      expect(result[1]).toEqual(MOCK_LINKS_ARRAY());
      done();
    });
  });
});
