import assert from "assert";
import { KittenSwapAlgebraFactory_CustomPool_event, KittenSwapAlgebraFactory_Pool_event } from "generated";
import { KittenSwapAlgebraFactory, MockDb } from "generated/src/TestHelpers.gen";
import sinon from "sinon";
import { AlgebraVersion } from "../../../../../src/algebra-style-pools/common/enums/algebra-version";
import * as algebraFactory from "../../../../../src/algebra-style-pools/mappings/factory/algebra-factory";
import { ZERO_ADDRESS } from "../../../../../src/common/constants";
import { IndexerNetwork } from "../../../../../src/common/enums/indexer-network";
import { SupportedProtocol } from "../../../../../src/common/enums/supported-protocol";

describe("KittenSwapAlgebraFactory", () => {
  const mockDb = MockDb.createMockDb();
  let network: IndexerNetwork;
  let poolEvent: KittenSwapAlgebraFactory_Pool_event;
  let customPoolEvent: KittenSwapAlgebraFactory_CustomPool_event;

  beforeEach(() => {
    sinon.stub(algebraFactory, "handleAlgebraPoolCreated").callsFake(async (..._args: any[]) => Promise.resolve());
    network = IndexerNetwork.HYPER_EVM;

    poolEvent = KittenSwapAlgebraFactory.Pool.createMockEvent({
      mockEventData: {
        chainId: network,
      },
      pool: "0x0000000000000000000000000000000000000221",
      token0: "0x0000000000000000000000000000000000000002",
      token1: "0x0000000000000000000000000000000000000003",
    });

    customPoolEvent = KittenSwapAlgebraFactory.CustomPool.createMockEvent({
      mockEventData: {
        chainId: network,
      },
      pool: "0x0000000000000000000000000000000000000221",
      token0: "0x0000000000000000000000000000000000000002",
      token1: "0x0000000000000000000000000000000000000003",
      deployer: "0x0000000000000000000000000000000000000999",
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("Pool Handler", () => {
    it("should pass the correct pool address from event to handler", async () => {
      let passedPoolAddress: string | undefined;

      sinon.restore();
      sinon.stub(algebraFactory, "handleAlgebraPoolCreated").callsFake(async (params: any) => {
        passedPoolAddress = params.poolAddress;
        return Promise.resolve();
      });

      await mockDb.processEvents([poolEvent]);

      assert.equal(passedPoolAddress, poolEvent.params.pool);
    });

    it("should pass the correct token0 address from event to handler", async () => {
      let passedToken0Address: string | undefined;
      sinon.restore();
      sinon.stub(algebraFactory, "handleAlgebraPoolCreated").callsFake(async (params: any) => {
        passedToken0Address = params.token0Address;
        return Promise.resolve();
      });

      await mockDb.processEvents([poolEvent]);

      assert.equal(passedToken0Address, poolEvent.params.token0);
    });

    it("should pass the correct token1 address from event to handler", async () => {
      let passedToken1Address: string | undefined;
      sinon.restore();
      sinon.stub(algebraFactory, "handleAlgebraPoolCreated").callsFake(async (params: any) => {
        passedToken1Address = params.token1Address;
        return Promise.resolve();
      });

      await mockDb.processEvents([poolEvent]);

      assert.equal(passedToken1Address, poolEvent.params.token1);
    });

    it("should pass the event timestamp as event timestamp to handler", async () => {
      let passedEventTimestamp: bigint | undefined;
      sinon.restore();
      sinon.stub(algebraFactory, "handleAlgebraPoolCreated").callsFake(async (params: any) => {
        passedEventTimestamp = params.eventTimestamp;
        return Promise.resolve();
      });

      await mockDb.processEvents([poolEvent]);

      assert.equal(passedEventTimestamp, BigInt(poolEvent.block.timestamp));
    });

    it("should pass the correct chain id from event to handler", async () => {
      let passedChainId: IndexerNetwork | undefined;
      sinon.restore();
      sinon.stub(algebraFactory, "handleAlgebraPoolCreated").callsFake(async (params: any) => {
        passedChainId = params.chainId;
        return Promise.resolve();
      });

      await mockDb.processEvents([poolEvent]);

      assert.equal(passedChainId, poolEvent.chainId);
    });

    it("should pass ZERO_ADDRESS as deployer to handler for Pool event", async () => {
      let passedDeployer: string | undefined;
      sinon.restore();
      sinon.stub(algebraFactory, "handleAlgebraPoolCreated").callsFake(async (params: any) => {
        passedDeployer = params.deployer;
        return Promise.resolve();
      });

      await mockDb.processEvents([poolEvent]);

      assert.equal(passedDeployer, ZERO_ADDRESS);
    });

    it("should pass KITTENSWAP_ALGEBRA as protocol to handler", async () => {
      let passedProtocol: SupportedProtocol | undefined;
      sinon.restore();
      sinon.stub(algebraFactory, "handleAlgebraPoolCreated").callsFake(async (params: any) => {
        passedProtocol = params.protocol;
        return Promise.resolve();
      });

      await mockDb.processEvents([poolEvent]);

      assert.equal(passedProtocol, SupportedProtocol.KITTENSWAP_ALGEBRA);
    });

    it("should pass V1_2_2 as version to handler", async () => {
      let passedVersion: AlgebraVersion | undefined;
      sinon.restore();
      sinon.stub(algebraFactory, "handleAlgebraPoolCreated").callsFake(async (params: any) => {
        passedVersion = params.version;
        return Promise.resolve();
      });

      await mockDb.processEvents([poolEvent]);

      assert.equal(passedVersion, AlgebraVersion.V1_2_2);
    });

    it("should register the pool in the dynamic contract registry", async () => {
      const updatedMockDB = await mockDb.processEvents([poolEvent]);
      const registeredContracts = updatedMockDB.dynamicContractRegistry.getAll();

      assert.equal(registeredContracts[0].contract_address, poolEvent.params.pool);
    });
  });

  describe("CustomPool Handler", () => {
    it("should pass the correct pool address from event to handler", async () => {
      let passedPoolAddress: string | undefined;
      sinon.restore();
      sinon.stub(algebraFactory, "handleAlgebraPoolCreated").callsFake(async (params: any) => {
        passedPoolAddress = params.poolAddress;
        return Promise.resolve();
      });

      await mockDb.processEvents([customPoolEvent]);

      assert.equal(passedPoolAddress, customPoolEvent.params.pool);
    });

    it("should pass the correct token0 address from event to handler", async () => {
      let passedToken0Address: string | undefined;
      sinon.restore();
      sinon.stub(algebraFactory, "handleAlgebraPoolCreated").callsFake(async (params: any) => {
        passedToken0Address = params.token0Address;
        return Promise.resolve();
      });

      await mockDb.processEvents([customPoolEvent]);

      assert.equal(passedToken0Address, customPoolEvent.params.token0);
    });

    it("should pass the correct token1 address from event to handler", async () => {
      let passedToken1Address: string | undefined;
      sinon.restore();
      sinon.stub(algebraFactory, "handleAlgebraPoolCreated").callsFake(async (params: any) => {
        passedToken1Address = params.token1Address;
        return Promise.resolve();
      });

      await mockDb.processEvents([customPoolEvent]);

      assert.equal(passedToken1Address, customPoolEvent.params.token1);
    });

    it("should pass the event timestamp as event timestamp to handler", async () => {
      let passedEventTimestamp: bigint | undefined;
      sinon.restore();
      sinon.stub(algebraFactory, "handleAlgebraPoolCreated").callsFake(async (params: any) => {
        passedEventTimestamp = params.eventTimestamp;
        return Promise.resolve();
      });

      await mockDb.processEvents([customPoolEvent]);

      assert.equal(passedEventTimestamp, BigInt(customPoolEvent.block.timestamp));
    });

    it("should pass the correct chain id from event to handler", async () => {
      let passedChainId: IndexerNetwork | undefined;
      sinon.restore();
      sinon.stub(algebraFactory, "handleAlgebraPoolCreated").callsFake(async (params: any) => {
        passedChainId = params.chainId;
        return Promise.resolve();
      });

      await mockDb.processEvents([customPoolEvent]);

      assert.equal(passedChainId, customPoolEvent.chainId);
    });

    it("should pass the deployer from event params to handler for CustomPool event", async () => {
      let passedDeployer: string | undefined;
      sinon.restore();
      sinon.stub(algebraFactory, "handleAlgebraPoolCreated").callsFake(async (params: any) => {
        passedDeployer = params.deployer;
        return Promise.resolve();
      });

      await mockDb.processEvents([customPoolEvent]);

      assert.equal(passedDeployer, customPoolEvent.params.deployer);
    });

    it("should pass KITTENSWAP_ALGEBRA as protocol to handler", async () => {
      let passedProtocol: SupportedProtocol | undefined;
      sinon.restore();
      sinon.stub(algebraFactory, "handleAlgebraPoolCreated").callsFake(async (params: any) => {
        passedProtocol = params.protocol;
        return Promise.resolve();
      });

      await mockDb.processEvents([customPoolEvent]);

      assert.equal(passedProtocol, SupportedProtocol.KITTENSWAP_ALGEBRA);
    });

    it("should pass V1_2_2 as version to handler", async () => {
      let passedVersion: AlgebraVersion | undefined;
      sinon.restore();
      sinon.stub(algebraFactory, "handleAlgebraPoolCreated").callsFake(async (params: any) => {
        passedVersion = params.version;
        return Promise.resolve();
      });

      await mockDb.processEvents([customPoolEvent]);

      assert.equal(passedVersion, AlgebraVersion.V1_2_2);
    });

    it("should register the pool in the dynamic contract registry", async () => {
      const updatedMockDB = await mockDb.processEvents([customPoolEvent]);
      const registeredContracts = updatedMockDB.dynamicContractRegistry.getAll();

      assert.equal(registeredContracts[0].contract_address, customPoolEvent.params.pool);
    });
  });
});
