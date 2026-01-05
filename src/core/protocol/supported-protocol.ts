import type { ProtocolMetadata } from "../types";

export enum SupportedProtocol {
  UNISWAP_V2 = "uniswap-v2",
  AERODROME_V3 = "aerodrome-v3",
  ALIENBASE_V3 = "alienbase-v3",
  HONEYPOP_V3 = "honeypop-v3",
  OKU_TRADE_V3 = "oku-trade-v3",
  PANCAKE_SWAP_V3 = "pancakeswap-v3",
  SUSHI_SWAP_V3 = "sushi-swap-v3",
  UNISWAP_V3 = "uniswap-v3",
  VELODROME_V3 = "velodrome-v3",
  PANCAKESWAP_INFINITY_CL = "pancakeswap-infinity-cl",
  UNISWAP_V4 = "uniswap-v4",
  HYPER_SWAP_V3 = "hyperswap-v3",
  PROJECT_X_V3 = "projectx-v3",
  HYBRA_V3 = "hybra-v3",
  HYBRA_SLIPSTREAM = "hybra-slipstream",
  KITTENSWAP_ALGEBRA = "kittenswap-v3",
  ULTRASOLID_V3 = "ultrasolid-v3",
  UPHEAVAL_V3 = "upheaval-v3",
  AETHONSWAP_ALGEBRA = "aethonswap-algebra",
  ATLANTIS_ALGEBRA = "atlantis-algebra",
  RAMSES_V3 = "ramses-v3",
  OCTOSWAP_CL = "octoswap-cl",
  PINOT_FINANCE_V3 = "pinot-finance-v3",
  CAPRICORN_CL = "capricorn-cl",
}

export namespace SupportedProtocol {
  export const metadata: Record<SupportedProtocol, ProtocolMetadata> = {
    [SupportedProtocol.UNISWAP_V2]: {
      name: "Uniswap V2",
      url: "https://uniswap.org/",
      logoUrl: "https://assets-cdn.trustwallet.com/dapps/app.uniswap.org.png",
    },

    [SupportedProtocol.AERODROME_V3]: {
      name: "Aerodrome Slipstream",
      url: "https://aerodrome.finance/",
      logoUrl: "https://assets-cdn.trustwallet.com/dapps/aerodrome.finance.png",
    },

    [SupportedProtocol.ALIENBASE_V3]: {
      name: "Alien Base V3",
      url: "https://app.alienbase.xyz/",
      logoUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/30543.png",
    },

    [SupportedProtocol.HONEYPOP_V3]: {
      name: "Honeypop V3",
      url: "https://honeypop.finance/",
      logoUrl: "https://assets.coingecko.com/markets/images/22073/large/honeypop.jpg",
    },

    [SupportedProtocol.OKU_TRADE_V3]: {
      name: "Oku V3",
      url: "https://oku.trade/",
      logoUrl: "https://img.cryptorank.io/exchanges/150x150.oku_plasma1759142972702.png",
    },

    [SupportedProtocol.PANCAKE_SWAP_V3]: {
      name: "PancakeSwap V3",
      url: "https://pancakeswap.finance/",
      logoUrl: "https://assets-cdn.trustwallet.com/dapps/pancakeswap.finance.png",
    },

    [SupportedProtocol.SUSHI_SWAP_V3]: {
      name: "SushiSwap V3",
      url: "https://app.sushi.com/",
      logoUrl: "https://assets-cdn.trustwallet.com/dapps/app.sushi.com.png",
    },

    [SupportedProtocol.UNISWAP_V3]: {
      name: "Uniswap V3",
      url: "https://uniswap.org/",
      logoUrl: "https://assets-cdn.trustwallet.com/dapps/app.uniswap.org.png",
    },

    [SupportedProtocol.VELODROME_V3]: {
      name: "Velodrome Slipstream",
      url: "https://velodrome.finance/",
      logoUrl: "https://img.cryptorank.io/coins/velodrome_finance1662552933961.png",
    },

    [SupportedProtocol.PANCAKESWAP_INFINITY_CL]: {
      name: "PancakeSwap Infinity CL",
      url: "https://pancakeswap.finance/",
      logoUrl: "https://assets-cdn.trustwallet.com/dapps/pancakeswap.finance.png",
    },

    [SupportedProtocol.UNISWAP_V4]: {
      name: "Uniswap V4",
      url: "https://uniswap.org/",
      logoUrl: "https://assets-cdn.trustwallet.com/dapps/app.uniswap.org.png",
    },

    [SupportedProtocol.HYPER_SWAP_V3]: {
      name: "HyperSwap V3",
      url: "https://hyperswap.exchange/",
      logoUrl: "https://img.cryptorank.io/exchanges/150x150.hyper_swap_v_21740409894268.png",
    },

    [SupportedProtocol.PROJECT_X_V3]: {
      name: "Project X V3",
      url: "https://prjx.com/",
      logoUrl: "https://img.cryptorank.io/coins/project_x_prjx_1662552933961.png",
    },

    [SupportedProtocol.HYBRA_V3]: {
      name: "Hybra V3",
      url: "https://hybra.finance/",
      logoUrl: "https://img.cryptorank.io/exchanges/150x150.hybra_finance1752836948767.png",
    },

    [SupportedProtocol.KITTENSWAP_ALGEBRA]: {
      name: "Kittenswap Algebra",
      url: "https://kittenswap.finance/",
      logoUrl: "https://img.cryptorank.io/exchanges/150x150.kittenswap1744291199109.png",
    },

    [SupportedProtocol.ULTRASOLID_V3]: {
      name: "UltraSolid V3",
      url: "https://ultrasolid.xyz/",
      logoUrl: "https://img.cryptorank.io/exchanges/150x150.ultra_solid_v_31759320847099.png",
    },

    [SupportedProtocol.UPHEAVAL_V3]: {
      name: "Upheaval V3",
      url: "https://upheaval.fi/",
      logoUrl: "https://assets.coingecko.com/markets/images/22071/large/upheaval-finance.jpg",
    },

    [SupportedProtocol.AETHONSWAP_ALGEBRA]: {
      name: "AethonSwap Algebra",
      url: "https://aethonswap.com/",
      logoUrl: "https://assets.coingecko.com/coins/images/70760/large/AethonSwap_Logo_icon.png",
    },

    [SupportedProtocol.ATLANTIS_ALGEBRA]: {
      name: "Atlantis Algebra",
      url: "https://atlantisdex.xyz/",
      logoUrl: "https://assets.coingecko.com/markets/images/22165/large/Atlantis_Icon_Circle.png",
    },

    [SupportedProtocol.RAMSES_V3]: {
      name: "Ramses V3",
      url: "https://ramses.xyz/",
      logoUrl: "https://img.cryptorank.io/exchanges/150x150.ramses_hyper_evm1763466701004.png",
    },

    [SupportedProtocol.HYBRA_SLIPSTREAM]: {
      name: "Hybra Slipstream",
      url: "https://hybra.finance/",
      logoUrl: "https://img.cryptorank.io/exchanges/150x150.hybra_finance1752836948767.png",
    },

    [SupportedProtocol.OCTOSWAP_CL]: {
      name: "Octoswap CL",
      url: "https://octo.exchange/",
      logoUrl: "https://octo.exchange/assets/img/logo/logo.png",
    },

    [SupportedProtocol.PINOT_FINANCE_V3]: {
      name: "Pinot V3",
      url: "https://pinot.finance/",
      logoUrl: "https://assets.coingecko.com/markets/images/22166/large/Pinot_Twitter_Profile.png",
    },
    [SupportedProtocol.CAPRICORN_CL]: {
      name: "Capricorn CL",
      url: "https://www.capricorn.exchange/",
      logoUrl: "https://icons.llamao.fi/icons/protocols/capricorn.jpg",
    },
  };
}
