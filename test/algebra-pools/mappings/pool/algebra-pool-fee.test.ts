import assert from "assert";
import { randomInt } from "crypto";
import { Pool as PoolEntity } from "generated";
import { HandlerContext } from "generated/src/Types";
import { handleAlgebraPoolFee } from "../../../../src/algebra-pools/mappings/pool/algebra-pool-fee";
import { handlerContextCustomMock, PoolMock } from "../../../mocks";

describe("AlgebraPoolFee", () => {
  let context: HandlerContext;
  let pool: PoolEntity;

  beforeEach(() => {
    context = handlerContextCustomMock();
    pool = new PoolMock();
  });

  it(`should set the new fee in the pool entity in the current fee tier
     with the new fee passed and save it. The initial fee tier should remain unchanged`, async () => {
    const newFee: number = randomInt(10000000);

    await handleAlgebraPoolFee(context, pool, newFee);

    const updatedPool = await context.Pool.getOrThrow(pool.id);

    assert.equal(updatedPool.currentFeeTier, newFee, "currentFeeTier should be set to the new fee");
    assert.equal(updatedPool.initialFeeTier, pool.initialFeeTier, "initialFeeTier should remain unchanged");
  });
});
