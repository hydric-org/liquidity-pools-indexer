import assert from "assert";
import { ALGEBRA_COMMUNITY_FEE_DENOMINATOR } from "../../../src/algebra-style-pools/common/constants";

describe("AlgebraPoolConstants", () => {
  it("should return the correct amount for algebra community fee denominator", () => {
    assert.equal(ALGEBRA_COMMUNITY_FEE_DENOMINATOR, 1000n);
  });
});
