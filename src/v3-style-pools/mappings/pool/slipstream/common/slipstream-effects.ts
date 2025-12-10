import { createEffect, S } from "envio";
import { ViemService } from "../../../../../common/services/viem-service";
import { SLIPSTREAM_POOL_SWAP_FEE_ABI } from "./abis";

export class SlipsteamEffects {
  static swapFeeEffect = createEffect(
    {
      name: "slipstream-pool-swap-fee",
      input: {
        poolAddress: S.string,
        chainId: S.number,
      },
      output: S.number,
      rateLimit: false,
      cache: true,
    },
    async ({ input }) => {
      const client = ViemService.shared.getClient(input.chainId);

      const { result } = await client.simulateContract({
        abi: SLIPSTREAM_POOL_SWAP_FEE_ABI,
        address: input.poolAddress as `0x${string}`,
        functionName: "fee",
      });

      return Number(result);
    }
  );
}
