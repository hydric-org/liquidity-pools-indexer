import assert from "assert";
import { AlgebraPoolData, handlerContext, Pool } from "generated";
import sinon from "sinon";
import { handleAlgebraPoolInitialize } from "../../../../src/algebra-pools/mappings/pool/algebra-pool-initialize";
import { AlgebraPoolDataMock, handlerContextCustomMock, PoolMock } from "../../../mocks";

describe("AlgebraPoolInitializeHandler", () => {
  let context: handlerContext;
  let pool: Pool;
  let algebraPoolData: AlgebraPoolData;

  beforeEach(() => {
    context = handlerContextCustomMock();
    pool = new PoolMock();
    algebraPoolData = new AlgebraPoolDataMock(pool.id);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("When the handler is called, it should assign the sqrtPriceX96 to the algebra pool", async () => {
    let sqrtPriceX96 = BigInt(1000);
    let tick = BigInt(989756545);

    context.AlgebraPoolData.set(algebraPoolData);

    await handleAlgebraPoolInitialize({ context, algebraPoolData, sqrtPriceX96, tick });

    const updatedAlgebraPoolData = await context.AlgebraPoolData.getOrThrow(pool.id)!;
    assert.deepEqual(updatedAlgebraPoolData.sqrtPriceX96, sqrtPriceX96);
  });

  it("should assign the tick to the algebra pool", async () => {
    let pool = new PoolMock();

    let sqrtPriceX96 = BigInt(1000);
    let tick = BigInt(989756545);

    context.AlgebraPoolData.set(algebraPoolData);

    await handleAlgebraPoolInitialize({ context, algebraPoolData, sqrtPriceX96, tick });

    const updatedAlgebraPoolData = await context.AlgebraPoolData.getOrThrow(pool.id)!;

    assert.equal(updatedAlgebraPoolData.tick, tick);
  });
});
