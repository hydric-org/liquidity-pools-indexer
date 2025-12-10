import assert from "assert";
import { AlgebraPoolData as AlgebraPoolDataEntity } from "generated";
import { HandlerContext } from "generated/src/Types";
import { handleAlgebraPoolPlugin } from "../../../../src/algebra-style-pools/mappings/pool/algebra-pool-plugin";
import { AlgebraPoolDataMock, handlerContextCustomMock } from "../../../mocks";

describe("AlgebraPoolPlugin", () => {
  let context: HandlerContext;
  let algebraPoolData: AlgebraPoolDataEntity;

  beforeEach(() => {
    context = handlerContextCustomMock();
    algebraPoolData = new AlgebraPoolDataMock();
  });

  it("should set the new plugin address in algebra pool data", async () => {
    const newPluginAddress = "0x1234567890123456789012345678901234567890";

    await handleAlgebraPoolPlugin(context, algebraPoolData, newPluginAddress);
    const updatedAlgebraPoolData = await context.AlgebraPoolData.getOrThrow(algebraPoolData.id);

    assert.equal(updatedAlgebraPoolData.plugin, newPluginAddress);
  });

  it("should update plugin address from one address to another", async () => {
    const oldPluginAddress = "0x0000000000000000000000000000000000000001";
    algebraPoolData = { ...algebraPoolData, plugin: oldPluginAddress };

    const newPluginAddress = "0x0000000000000000000000000000000000000002";

    context.AlgebraPoolData.set(algebraPoolData);

    await handleAlgebraPoolPlugin(context, algebraPoolData, newPluginAddress);
    const updatedAlgebraPoolData = await context.AlgebraPoolData.getOrThrow(algebraPoolData.id);

    assert.equal(updatedAlgebraPoolData.plugin, newPluginAddress, "plugin should be updated to new address");
    assert.notEqual(updatedAlgebraPoolData.plugin, oldPluginAddress, "plugin should no longer be the old address");
  });
});
