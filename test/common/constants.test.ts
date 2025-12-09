import assert from "assert";
import { BigDecimal } from "generated";
import {
  DEFI_POOL_DATA_ID,
  MAX_UINT256,
  ONE_BIG_INT,
  ONE_DAY_IN_SECONDS,
  ONE_HOUR_IN_SECONDS,
  OUTLIER_POOL_TVL_PERCENT_THRESHOLD,
  OUTLIER_TOKEN_PRICE_PERCENT_THRESHOLD,
  OUTLIER_TOKEN_VOLUME_PERCENT_THRESHOLD,
  ZERO_ADDRESS,
  ZERO_BIG_DECIMAL,
  ZERO_BIG_INT,
} from "../../src/common/constants";

describe("Constants", () => {
  it("Zero big decimal should return zero as Big Decimal", () => {
    assert(ZERO_BIG_DECIMAL.eq(BigDecimal("0")));
  });

  it("Zero big int should return zero as big int", () => {
    assert.equal(ZERO_BIG_INT, BigInt(0));
  });

  it("MAX_UINT256 should return the correct value", () => {
    assert.equal(
      BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935").toString(),
      MAX_UINT256.toString()
    );
  });

  it("ZERO_ADDRESS should return the correct value", () => {
    assert.equal("0x0000000000000000000000000000000000000000", ZERO_ADDRESS);
  });

  it("ONE_BIG_INT should return the correct value", () => {
    assert.equal(BigInt(1), ONE_BIG_INT);
  });

  it("Q96 should return the correct value", () => {
    assert.equal(BigInt(2) ** 96n, BigInt(2) ** 96n);
  });

  it("ONE_HOUR_IN_SECONDS should return the correct value", () => {
    assert.equal(ONE_HOUR_IN_SECONDS, BigInt(3600));
  });

  it("should return the correct value for OUTLIER_TOKEN_PRICE_PERCENT_THRESHOLD", () => {
    assert.equal(OUTLIER_TOKEN_PRICE_PERCENT_THRESHOLD, 1000);
  });

  it("should return the correct value for OUTLIER_TOKEN_VOLUME_PERCENT_THRESHOLD", () => {
    assert.equal(OUTLIER_TOKEN_VOLUME_PERCENT_THRESHOLD, 5000);
  });

  it("should return the correct value for OUTLIER_POOL_TVL_PERCENT_THRESHOLD", () => {
    assert.equal(OUTLIER_POOL_TVL_PERCENT_THRESHOLD, 20000);
  });

  it("should return the correct value for DEFI_POOL_DATA_ID", () => {
    assert.equal(DEFI_POOL_DATA_ID, "defi-pool-data");
  });

  it("should return the correct seconds for one day in seconds", () => {
    assert.equal(ONE_DAY_IN_SECONDS, 86400);
  });
});
