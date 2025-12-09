import assert from "assert";
import { randomInt } from "crypto";
import { AlgebraPoolData as AlgebraPoolDataEntity, Pool as PoolEntity } from "generated";
import { HandlerContext } from "generated/src/Types";
import { ALGEBRA_POOL_DYNAMIC_FEE_FLAG } from "../../../../src/algebra-pools/common/constants";
import { handleAlgebraPoolPluginConfig } from "../../../../src/algebra-pools/mappings/pool/algebra-pool-plugin-config";
import { AlgebraPoolDataMock, handlerContextCustomMock, PoolMock } from "../../../mocks";

describe("AlgebraPoolPluginConfig", () => {
  let context: HandlerContext;
  let pool: PoolEntity;
  let algebraPoolData: AlgebraPoolDataEntity;

  beforeEach(() => {
    context = handlerContextCustomMock();
    pool = new PoolMock();
    algebraPoolData = new AlgebraPoolDataMock();
  });

  it("should assign the new plugin config to algebra pool data", async () => {
    const newPluginConfig = randomInt(1000000);

    await handleAlgebraPoolPluginConfig(context, algebraPoolData, pool, newPluginConfig);

    const updatedAlgebraPoolData = await context.AlgebraPoolData.getOrThrow(algebraPoolData.id);

    assert.equal(updatedAlgebraPoolData.pluginConfig, newPluginConfig, "pluginConfig should be set to the new value");
  });

  it("should set isDynamicFee to true when plugin config contains dynamic fee flag", async () => {
    pool = { ...pool, isDynamicFee: false };
    const newPluginConfig = ALGEBRA_POOL_DYNAMIC_FEE_FLAG;

    context.Pool.set(pool);
    context.AlgebraPoolData.set(algebraPoolData);

    await handleAlgebraPoolPluginConfig(context, algebraPoolData, pool, newPluginConfig);

    const updatedPool = await context.Pool.getOrThrow(pool.id);

    assert.equal(updatedPool.isDynamicFee, true);
  });

  it("should set isDynamicFee to false when plugin config does not contain dynamic fee flag and the pool is already dynamic", async () => {
    pool = { ...pool, isDynamicFee: true };
    const newPluginConfig = 0;

    context.Pool.set(pool);
    context.AlgebraPoolData.set(algebraPoolData);

    await handleAlgebraPoolPluginConfig(context, algebraPoolData, pool, newPluginConfig);

    const updatedPool = await context.Pool.getOrThrow(pool.id);

    assert.equal(updatedPool.isDynamicFee, false, "isDynamicFee should be false when dynamic fee flag is not set");
  });

  it("should correctly identify dynamic fee flag when mixed with other flags", async () => {
    pool = { ...pool, isDynamicFee: false };
    const otherFlags = 0xff;
    const newPluginConfig = otherFlags | ALGEBRA_POOL_DYNAMIC_FEE_FLAG;

    context.Pool.set(pool);
    context.AlgebraPoolData.set(algebraPoolData);

    await handleAlgebraPoolPluginConfig(context, algebraPoolData, pool, newPluginConfig);

    const updatedPool = await context.Pool.getOrThrow(pool.id);

    assert.equal(updatedPool.isDynamicFee, true);
  });

  it("should correctly identify absence of dynamic fee flag when mixed with other flags", async () => {
    pool = { ...pool, isDynamicFee: true };
    const otherFlags = 0xff;
    const newPluginConfig = otherFlags & ~ALGEBRA_POOL_DYNAMIC_FEE_FLAG;

    context.Pool.set(pool);
    context.AlgebraPoolData.set(algebraPoolData);

    await handleAlgebraPoolPluginConfig(context, algebraPoolData, pool, newPluginConfig);

    const updatedPool = await context.Pool.getOrThrow(pool.id);

    assert.equal(updatedPool.isDynamicFee, false);
  });
});
