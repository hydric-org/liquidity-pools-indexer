import { createEffect, S } from "envio";
import { BlockchainService } from "../../../services/blockchain-service";
import { SLIPSTREAM_POOL_SWAP_FEE_ABI } from "./slipsteam-pool-swap-fee-abi";

export const SlipsteamEffects = {
  swapFeeEffect: createEffect(
    {
      name: "slipstream-pool-swap-fee",
      input: {
        poolAddress: S.string,
        chainId: S.number,
      },
      output: S.number,
      rateLimit: false,
      cache: false,
    },
    async ({ input }) => {
      const client = BlockchainService.getClient(input.chainId);

      const { result } = await client.simulateContract({
        abi: SLIPSTREAM_POOL_SWAP_FEE_ABI,
        address: input.poolAddress as `0x${string}`,
        functionName: "fee",
      });

      return Number(result);
    }
  ),
};
