import { assert } from "chai";
import { AlgebraVersion } from "../../../../src/algebra-pools/common/enums/algebra-version";

describe("AlgebraVersion", () => {
  it("should return 1.2.0", () => {
    assert.equal(AlgebraVersion.V1_2_0, "1.2.0");
  });

  it("should return 1.2.1", () => {
    assert.equal(AlgebraVersion.V1_2_1, "1.2.1");
  });

  it("should return 1.2.2", () => {
    assert.equal(AlgebraVersion.V1_2_2, "1.2.2");
  });
});
