import { NativeToken } from "../types";

export enum NetworkToken {
  ETH,
  HYPE,
  XPL,
  MON,
}

export namespace NetworkToken {
  export function metadata(value: NetworkToken): NativeToken {
    switch (value) {
      case NetworkToken.ETH:
        return {
          decimals: 18,
          name: "Ether",
          symbol: "ETH",
        };
      case NetworkToken.HYPE:
        return {
          decimals: 18,
          name: "Hyperliquid",
          symbol: "HYPE",
        };
      case NetworkToken.XPL:
        return {
          decimals: 18,
          name: "Plasma",
          symbol: "XPL",
        };
      case NetworkToken.MON:
        return {
          decimals: 18,
          name: "Monad",
          symbol: "MON",
        };
    }
  }
}
