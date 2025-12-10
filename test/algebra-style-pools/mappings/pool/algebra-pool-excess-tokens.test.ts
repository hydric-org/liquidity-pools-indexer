import assert from "assert";
import { BigDecimal } from "generated";
import { handlerContext, Pool, Token } from "generated/src/Types.gen";
import sinon from "sinon";
import { handleAlgebraPoolExcessTokens } from "../../../../src/algebra-style-pools/mappings/pool/algebra-pool-excess-tokens";
import { handlerContextCustomMock, PoolMock, TokenMock } from "../../../mocks";

describe("AlgebraPoolExcessTokens", () => {
  let context: handlerContext;
  let pool: Pool;
  let token0: Token;
  let token1: Token;
  const amount0 = BigInt(123);
  const amount1 = BigInt(456);

  beforeEach(() => {
    token0 = new TokenMock("0x0000000000000000000000000000000000000001")!;
    token1 = new TokenMock("0x0000000000000000000000000000000000000002")!;
    pool = { ...new PoolMock(), token0_id: token0.id, token1_id: token1.id };

    context = handlerContextCustomMock();
    token0 = {
      ...token0,
      totalTokenPooledAmount: BigDecimal("1000"),
      totalValuePooledUsd: BigDecimal("1000"),
      usdPrice: BigDecimal("2"),
      decimals: 18,
    };

    token1 = {
      ...token1,
      totalTokenPooledAmount: BigDecimal("500"),
      totalValuePooledUsd: BigDecimal("500"),
      usdPrice: BigDecimal("3"),
      decimals: 18,
    };

    pool = {
      ...pool,
      totalValueLockedToken0: BigDecimal("1000"),
      totalValueLockedToken1: BigDecimal("500"),
      totalValueLockedUSD: BigDecimal("3500"),
    };

    context.Pool.set(pool);
    context.Token.set(token0);
    context.Token.set(token1);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should update pool.totalValueLockedToken0 when excess amount0 provided", async () => {
    const a0 = amount0 * 10n ** BigInt(token0.decimals);
    await handleAlgebraPoolExcessTokens({
      context: context as any,
      poolEntity: pool,
      token0Entity: token0,
      token1Entity: token1,
      amount0: a0,
      amount1: 0n,
    });

    const updatedPool = await context.Pool.getOrThrow(pool.id)!;
    const expectedExcess0 = BigDecimal(a0.toString()).div(BigDecimal((10 ** token0.decimals).toString()));
    const expected = pool.totalValueLockedToken0.plus(expectedExcess0);

    assert.deepEqual(updatedPool.totalValueLockedToken0, expected);
  });

  it("should update pool.totalValueLockedToken1 when excess amount1 provided", async () => {
    const a1 = amount1 * 10n ** BigInt(token1.decimals);
    await handleAlgebraPoolExcessTokens({
      context: context as any,
      poolEntity: pool,
      token0Entity: token0,
      token1Entity: token1,
      amount0: 0n,
      amount1: a1,
    });

    const updatedPool = await context.Pool.getOrThrow(pool.id)!;
    const expectedExcess1 = BigDecimal(a1.toString()).div(BigDecimal((10 ** token1.decimals).toString()));
    const expected = pool.totalValueLockedToken1.plus(expectedExcess1);

    assert.deepEqual(updatedPool.totalValueLockedToken1, expected);
  });

  it("should update pool.totalValueLockedUSD from both current amounts updated multiplied by their USD price", async () => {
    const a0 = amount0 * 10n ** BigInt(token0.decimals);
    const a1 = amount1 * 10n ** BigInt(token1.decimals);

    await handleAlgebraPoolExcessTokens({
      context: context as any,
      poolEntity: pool,
      token0Entity: token0,
      token1Entity: token1,
      amount0: a0,
      amount1: a1,
    });

    const updatedPool = await context.Pool.getOrThrow(pool.id)!;

    const expectedExcess0 = BigDecimal(a0.toString()).div(BigDecimal((10 ** token0.decimals).toString()));
    const expectedExcess1 = BigDecimal(a1.toString()).div(BigDecimal((10 ** token1.decimals).toString()));

    const expectedTotalValueLockedToken0 = pool.totalValueLockedToken0.plus(expectedExcess0);
    const expectedTotalValueLockedToken1 = pool.totalValueLockedToken1.plus(expectedExcess1);
    const expectedUSD = expectedTotalValueLockedToken0
      .times(token0.usdPrice)
      .plus(expectedTotalValueLockedToken1.times(token1.usdPrice));

    assert.deepEqual(updatedPool.totalValueLockedUSD, expectedUSD);
  });

  it("should update token0.totalTokenPooledAmount from excess amount0", async () => {
    const a0 = amount0 * 10n ** BigInt(token0.decimals);
    await handleAlgebraPoolExcessTokens({
      context: context as any,
      poolEntity: pool,
      token0Entity: token0,
      token1Entity: token1,
      amount0: a0,
      amount1: 0n,
    });

    const updatedToken0 = await context.Token.getOrThrow(token0.id)!;
    const expectedExcess0 = BigDecimal(a0.toString()).div(BigDecimal((10 ** token0.decimals).toString()));
    const expected = token0.totalTokenPooledAmount.plus(expectedExcess0);

    assert.deepEqual(updatedToken0.totalTokenPooledAmount, expected);
  });

  it("should update token1.totalTokenPooledAmount from excess amount1", async () => {
    const a1 = amount1 * 10n ** BigInt(token1.decimals);
    await handleAlgebraPoolExcessTokens({
      context: context as any,
      poolEntity: pool,
      token0Entity: token0,
      token1Entity: token1,
      amount0: 0n,
      amount1: a1,
    });

    const updatedToken1 = await context.Token.getOrThrow(token1.id)!;
    const expectedExcess1 = BigDecimal(a1.toString()).div(BigDecimal((10 ** token1.decimals).toString()));
    const expected = token1.totalTokenPooledAmount.plus(expectedExcess1);

    assert.deepEqual(updatedToken1.totalTokenPooledAmount, expected);
  });

  it("should update token0.totalValuePooledUsd from current pooled amount updated multiplied by the USD price", async () => {
    const a0 = amount0 * 10n ** BigInt(token0.decimals);
    await handleAlgebraPoolExcessTokens({
      context: context as any,
      poolEntity: pool,
      token0Entity: token0,
      token1Entity: token1,
      amount0: a0,
      amount1: 0n,
    });

    const updatedToken0 = await context.Token.getOrThrow(token0.id)!;
    const expectedExcess0 = BigDecimal(a0.toString()).div(BigDecimal((10 ** token0.decimals).toString()));
    const expected = token0.totalTokenPooledAmount.plus(expectedExcess0).times(token0.usdPrice);

    assert.deepEqual(updatedToken0.totalValuePooledUsd, expected);
  });

  it("should update token1.totalValuePooledUsd from current pooled amount updated multiplied by the USD price", async () => {
    const a1 = amount1 * 10n ** BigInt(token1.decimals);
    await handleAlgebraPoolExcessTokens({
      context: context as any,
      poolEntity: pool,
      token0Entity: token0,
      token1Entity: token1,
      amount0: 0n,
      amount1: a1,
    });

    const updatedToken1 = await context.Token.getOrThrow(token1.id)!;
    const expectedExcess1 = BigDecimal(a1.toString()).div(BigDecimal((10 ** token1.decimals).toString()));
    const expected = token1.totalTokenPooledAmount.plus(expectedExcess1).times(token1.usdPrice);

    assert.deepEqual(updatedToken1.totalValuePooledUsd, expected);
  });
});
