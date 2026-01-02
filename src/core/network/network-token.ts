import { TokenMetadata } from "../types";

export enum NetworkToken {
  ETH,
  HYPE,
  XPL,
  MON,
}

export namespace NetworkToken {
  export const metadata: Record<NetworkToken, TokenMetadata> = {
    [NetworkToken.ETH]: {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
    },

    [NetworkToken.HYPE]: {
      decimals: 18,
      name: "Hyperliquid",
      symbol: "HYPE",
    },

    [NetworkToken.XPL]: {
      decimals: 18,
      name: "Plasma",
      symbol: "XPL",
    },

    [NetworkToken.MON]: {
      decimals: 18,
      name: "Monad",
      symbol: "MON",
    },
  };
}
