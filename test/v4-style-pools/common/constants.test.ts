import { assert } from "chai";
import { V4_DYNAMIC_FEE_FLAG } from "../../../src/v4-style-pools/common/constants";

describe("constants", () => {
  it("should return the correct amount for v4 dynamic fee flag", () => {
    assert.equal(V4_DYNAMIC_FEE_FLAG, 0x800000);
  });
});
