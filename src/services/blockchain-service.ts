import { createPublicClient, fallback, http, PublicClient } from "viem";
import { IndexerNetwork } from "../core/network";

const clients: Partial<Record<IndexerNetwork, PublicClient>> = {};

export const BlockchainService = {
  getClient(network: IndexerNetwork): PublicClient {
    if (!clients[network]) {
      clients[network] = createPublicClient({
        batch: { multicall: true },
        transport: fallback(
          [
            http(IndexerNetwork.paidRPCUrl[network], { batch: true }),
            http(IndexerNetwork.freeRPCUrl[network], { batch: true }),
          ],
          {
            rank: false,
            retryCount: 5,
            retryDelay: 2000,
          }
        ),
      });
    }

    return clients[network]!;
  },
};
