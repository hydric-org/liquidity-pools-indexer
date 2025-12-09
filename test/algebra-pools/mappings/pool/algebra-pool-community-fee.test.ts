import assert from "assert";
import { randomInt } from "crypto";
import { AlgebraPoolData } from "generated";
import { HandlerContext } from "generated/src/Types";
import { handleAlgebraCommunityFee } from "../../../../src/algebra-pools/mappings/pool/algebra-pool-community-fee";
import { AlgebraPoolDataMock, handlerContextCustomMock } from "../../../mocks";

describe("AlgebraPoolCommunityFee", () => {
  let context: HandlerContext;
  let algebraPoolData: AlgebraPoolData;

  beforeEach(() => {
    context = handlerContextCustomMock();
    algebraPoolData = new AlgebraPoolDataMock();
  });

  it(`should set the new community fee in the algebra
    pool data entity with the new community fee passed and save it`, async () => {
    const newFee: number = randomInt(100000);

    await handleAlgebraCommunityFee(context, algebraPoolData, newFee);

    const updatedAlgebraPoolData = await context.AlgebraPoolData.getOrThrow(algebraPoolData.id);
    assert.equal(updatedAlgebraPoolData.communityFee, newFee);
  });
});
