import assert from "assert";
import { calculateAlgebraNonLPFeesAmount } from "../../../src/algebra-style-pools/common/algebra-pool-common";
import { ALGEBRA_COMMUNITY_FEE_DENOMINATOR } from "../../../src/algebra-style-pools/common/constants";
import { getRawFeeFromTokenAmount } from "../../../src/common/pool-commons";
import { formatFromTokenAmount } from "../../../src/common/token-commons";
import { PoolMock, TokenMock } from "../../mocks";

describe("AlgebraPoolCommon", () => {
  beforeEach(() => {});

  it(`should calculate the token 1 non LP fees when swaping from token 1 to token 0
    and return it the non LP fees amount. In this case the token0 amount should be
    zero`, () => {
    const amount0SwapAmount = BigInt(-100);
    const amount1SwapAmount = BigInt(12000000);
    const communityFee = 39;
    const pluginFee = 321;
    const swapFee = 3000;
    const token0 = new TokenMock();
    const token1 = new TokenMock();
    let currentPoolEntity = new PoolMock();

    currentPoolEntity = {
      ...currentPoolEntity,
      currentFeeTier: swapFee,
    };

    const nonLPFeesAmount = calculateAlgebraNonLPFeesAmount({
      swapAmount0: amount0SwapAmount,
      swapAmount1: amount1SwapAmount,
      communityFee,
      poolEntity: currentPoolEntity,
      swapFee,
      pluginFee,
      token0,
      token1,
    });

    const swapFeeForAmount1 = getRawFeeFromTokenAmount(amount1SwapAmount, swapFee);
    const pluginFeeForAmount1 = getRawFeeFromTokenAmount(amount1SwapAmount, pluginFee);
    const communityFeeForAmount1 = (swapFeeForAmount1 * BigInt(communityFee)) / ALGEBRA_COMMUNITY_FEE_DENOMINATOR;
    const expectedAmount1 = formatFromTokenAmount(pluginFeeForAmount1 + communityFeeForAmount1, token1);

    assert.deepEqual(nonLPFeesAmount.token1FeeAmount, expectedAmount1);
  });

  it(`should calculate the token 0 non LP fees when swaping from token 0 to token 1
    and return it the non LP fees amount. In this case the token1 amount should be
    zero`, () => {
    const amount0SwapAmount = BigInt(100);
    const amount1SwapAmount = BigInt(-12000000);
    const communityFee = 400;
    const pluginFee = 4210;
    const swapFee = 9000;
    const token0 = new TokenMock();
    const token1 = new TokenMock();
    let currentPoolEntity = new PoolMock();

    currentPoolEntity = {
      ...currentPoolEntity,
      currentFeeTier: swapFee,
    };

    const nonLPFeesAmount = calculateAlgebraNonLPFeesAmount({
      swapAmount0: amount0SwapAmount,
      swapAmount1: amount1SwapAmount,
      communityFee,
      poolEntity: currentPoolEntity,
      swapFee,
      pluginFee,
      token0,
      token1,
    });

    const swapFeeForAmount0 = getRawFeeFromTokenAmount(amount0SwapAmount, swapFee);
    const pluginFeeForAmount0 = getRawFeeFromTokenAmount(amount0SwapAmount, pluginFee);
    const communityFeeForAmount0 = (swapFeeForAmount0 * BigInt(communityFee)) / ALGEBRA_COMMUNITY_FEE_DENOMINATOR;
    const expectedAmount0 = formatFromTokenAmount(pluginFeeForAmount0 + communityFeeForAmount0, token0);

    assert.deepEqual(nonLPFeesAmount.token0FeeAmount, expectedAmount0);
  });
});
