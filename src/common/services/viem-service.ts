import * as viem from "viem";
import { IndexerNetwork } from "../enums/indexer-network";

export class ViemService {
  constructor(readonly viemModule: typeof viem) {}
  private static _instance: ViemService;

  static get shared() {
    if (!this._instance) {
      this._instance = new ViemService(viem);
    }

    return this._instance;
  }

  private clients: Record<IndexerNetwork, viem.PublicClient> = {} as Record<IndexerNetwork, viem.PublicClient>;

  getClient(forNetwork: IndexerNetwork): viem.PublicClient {
    let client = this.clients[forNetwork];
    if (client) return client;

    client = this.viemModule.createPublicClient({
      batch: {
        multicall: true,
      },
      transport: this.viemModule.fallback(
        [
          this.viemModule.http(IndexerNetwork.getPaidRPCUrl(forNetwork), { batch: true }),
          this.viemModule.http(IndexerNetwork.getFreeRPCUrl(forNetwork), { batch: true }),
        ],
        {
          rank: false,
          retryCount: 5,
          retryDelay: 2000,
        }
      ),
    });

    this.clients[forNetwork] = client;
    return client;
  }
}
