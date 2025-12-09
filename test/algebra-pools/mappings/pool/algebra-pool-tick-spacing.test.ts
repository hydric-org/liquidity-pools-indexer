import assert from "assert";
import { randomInt } from "crypto";
import { AlgebraPoolData } from "generated";
import { HandlerContext } from "generated/src/Types";
import { handleAlgebraPoolTickSpacing } from "../../../../src/algebra-pools/mappings/pool/algebra-pool-tick-spacing";
import { AlgebraPoolDataMock, handlerContextCustomMock } from "../../../mocks";

describe("AlgebraPoolTickSpacing", () => {
  let context: HandlerContext;
  let algebraPoolData: AlgebraPoolData;

  beforeEach(() => {
    context = handlerContextCustomMock();
    algebraPoolData = new AlgebraPoolDataMock();
  });

  it(`should set the new tick spacing in the algebra pool data
    with the one passed in the event`, async () => {
    const newTickSpacing: number = randomInt(10000000);

    await handleAlgebraPoolTickSpacing(context, algebraPoolData, newTickSpacing);
    const updatedAlgebraPoolData = await context.AlgebraPoolData.getOrThrow(algebraPoolData.id);

    assert.equal(updatedAlgebraPoolData.tickSpacing, newTickSpacing);
  });
});
