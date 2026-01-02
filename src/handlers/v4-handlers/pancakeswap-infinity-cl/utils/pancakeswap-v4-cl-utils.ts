import { bytesToNumber, hexToBytes } from "viem";

export const PancakeSwapV4CLUtils = {
  getPoolTickSpacingFromParameters,
};

function getPoolTickSpacingFromParameters(parameters: `0x${string}`): number {
  const bytes = hexToBytes(parameters);

  const tickSpacingBytes = bytes.slice(27, 30);
  return bytesToNumber(tickSpacingBytes, { signed: false });
}
