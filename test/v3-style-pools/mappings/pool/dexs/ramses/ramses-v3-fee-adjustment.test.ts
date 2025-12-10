import assert from "assert";
import { Pool, RamsesV3Pool_FeeAdjustment_event } from "generated";
import { MockDb, RamsesV3Pool } from "generated/src/TestHelpers.gen";
import sinon from "sinon";
import { IndexerNetwork } from "../../../../../../src/common/enums/indexer-network";
import { PoolMock } from "../../../../../mocks";

describe("RamsesV3FeeAdjustment", () => {
  let mockDb = MockDb.createMockDb();
  let network: IndexerNetwork;
  let event: RamsesV3Pool_FeeAdjustment_event;

  beforeEach(() => {
    network = IndexerNetwork.HYPER_EVM;

    event = RamsesV3Pool.FeeAdjustment.createMockEvent({
      mockEventData: {
        srcAddress: "0x123",
        chainId: network,
      },
      newFee: 91919199191n,
      oldFee: 212121n,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should set the new fee tier gettin from the event in the pool", async () => {
    console.log("set id", IndexerNetwork.getEntityIdFromAddress(network, event.srcAddress));
    let poolSet: Pool = {
      ...new PoolMock(),
      id: IndexerNetwork.getEntityIdFromAddress(network, event.srcAddress),
    };

    mockDb = mockDb.entities.Pool.set(poolSet);
    mockDb = await mockDb.processEvents([event]);

    let pool = mockDb.entities.Pool.get(IndexerNetwork.getEntityIdFromAddress(network, event.srcAddress))!;

    assert.equal(pool.currentFeeTier, event.params.newFee);
  });
});
