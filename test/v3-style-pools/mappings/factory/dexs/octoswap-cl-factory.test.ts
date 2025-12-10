import assert from "assert";
import { OctoSwapCLFactory_PoolCreated_event } from "generated";
import { MockDb, OctoSwapCLFactory } from "generated/src/TestHelpers.gen";
import sinon from "sinon";
import { IndexerNetwork } from "../../../../../src/common/enums/indexer-network";
import { SupportedProtocol } from "../../../../../src/common/enums/supported-protocol";
import * as v3Factory from "../../../../../src/v3-style-pools/mappings/factory/v3-factory";

describe("OctoswapCLFactory", () => {
  const mockDb = MockDb.createMockDb();
  let network: IndexerNetwork;
  let poolEvent: OctoSwapCLFactory_PoolCreated_event;

  beforeEach(() => {
    sinon.stub(v3Factory, "handleV3PoolCreated").callsFake(async (..._args: any[]) => Promise.resolve());
    network = IndexerNetwork.HYPER_EVM;

    poolEvent = OctoSwapCLFactory.PoolCreated.createMockEvent({
      mockEventData: {
        chainId: network,
      },
      pool: "0x0000000000000000000000000000000000000221",
      token0: "0x0000000000000000000000000000000000000002",
      token1: "0x0000000000000000000000000000000000000003",
      fee: 3000n,
      tickSpacing: 60n,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("Pool Handler", () => {
    it("should pass the correct pool address from event to handler", async () => {
      let passedPoolAddress: string | undefined;

      sinon.restore();
      sinon.stub(v3Factory, "handleV3PoolCreated").callsFake(async (params) => {
        passedPoolAddress = params.poolAddress;
        return Promise.resolve();
      });

      await mockDb.processEvents([poolEvent]);

      assert.equal(passedPoolAddress, poolEvent.params.pool);
    });

    it("should pass the correct token0 address from event to handler", async () => {
      let passedToken0Address: string | undefined;
      sinon.restore();
      sinon.stub(v3Factory, "handleV3PoolCreated").callsFake(async (params) => {
        passedToken0Address = params.token0Address;
        return Promise.resolve();
      });

      await mockDb.processEvents([poolEvent]);

      assert.equal(passedToken0Address, poolEvent.params.token0);
    });

    it("should pass the correct token1 address from event to handler", async () => {
      let passedToken1Address: string | undefined;
      sinon.restore();
      sinon.stub(v3Factory, "handleV3PoolCreated").callsFake(async (params) => {
        passedToken1Address = params.token1Address;
        return Promise.resolve();
      });

      await mockDb.processEvents([poolEvent]);

      assert.equal(passedToken1Address, poolEvent.params.token1);
    });

    it("should pass the event timestamp as event timestamp to handler", async () => {
      let passedEventTimestamp: bigint | undefined;
      sinon.restore();
      sinon.stub(v3Factory, "handleV3PoolCreated").callsFake(async (params) => {
        passedEventTimestamp = params.eventTimestamp;
        return Promise.resolve();
      });

      await mockDb.processEvents([poolEvent]);

      assert.equal(passedEventTimestamp, BigInt(poolEvent.block.timestamp));
    });

    it("should pass the event tick spacing to handler", async () => {
      let passedTickSpacing: number | undefined;
      sinon.restore();
      sinon.stub(v3Factory, "handleV3PoolCreated").callsFake(async (params) => {
        passedTickSpacing = params.tickSpacing;
        return Promise.resolve();
      });

      await mockDb.processEvents([poolEvent]);

      assert.equal(passedTickSpacing, BigInt(poolEvent.params.tickSpacing));
    });

    it("should pass the event fee tier  to handler", async () => {
      let passedFeeTier: number | undefined;
      sinon.restore();
      sinon.stub(v3Factory, "handleV3PoolCreated").callsFake(async (params) => {
        passedFeeTier = params.feeTier;
        return Promise.resolve();
      });

      await mockDb.processEvents([poolEvent]);

      assert.equal(passedFeeTier, BigInt(poolEvent.params.fee));
    });

    it("should pass the correct chain id from event to handler", async () => {
      let passedChainId: IndexerNetwork | undefined;
      sinon.restore();
      sinon.stub(v3Factory, "handleV3PoolCreated").callsFake(async (params) => {
        passedChainId = params.chainId;
        return Promise.resolve();
      });

      await mockDb.processEvents([poolEvent]);

      assert.equal(passedChainId, poolEvent.chainId);
    });

    it("should pass OCTOSWAP_CL as protocol to handler", async () => {
      let passedProtocol: SupportedProtocol | undefined;
      sinon.restore();
      sinon.stub(v3Factory, "handleV3PoolCreated").callsFake(async (params) => {
        passedProtocol = params.protocol;
        return Promise.resolve();
      });

      await mockDb.processEvents([poolEvent]);

      assert.equal(passedProtocol, SupportedProtocol.OCTOSWAP_CL);
    });

    it("should register the pool in the dynamic contract registry", async () => {
      const updatedMockDB = await mockDb.processEvents([poolEvent]);
      const registeredContracts = updatedMockDB.dynamicContractRegistry.getAll();

      assert.equal(registeredContracts[0].contract_address, poolEvent.params.pool);
    });
  });
});
