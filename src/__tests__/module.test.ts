import { main } from "../";
import { getConfig } from "../config";
import { MOCK_LINKS_ARRAY, MOCK_API_LINKS_ARRAY } from "./test-util";

describe("Module Test Suite", () => {
  test("can do a dry run without api links", (done) => {
    const config = getConfig(["--dry", "--convert-camel-case"], "./__mock__");
    main(config, (result) => {
      expect(result[1]).toEqual(MOCK_LINKS_ARRAY());
      done();
    });
  });
  test("can do a dry run with api links", (done) => {
    const config = getConfig(
      ["--dry", "--api", "--convert-camel-case"],
      "./__mock__"
    );
    main(config, (result) => {
      expect(result[1]).toEqual(MOCK_LINKS_ARRAY(MOCK_API_LINKS_ARRAY()));
      done();
    });
  });
});
