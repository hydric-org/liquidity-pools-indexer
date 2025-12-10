import { IndexerNetwork } from "../../common/enums/indexer-network";

export class V3PositionManagerAddress {
  static aerodrome(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.BASE:
        return "0x827922686190790b37229fd06084350E74485b72";
      default:
        throw Error(`Aerodrome is not supported on ${network}`);
    }
  }

  static uniswap(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.BASE:
        return "0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1";
      case IndexerNetwork.ETHEREUM:
        return "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
      case IndexerNetwork.UNICHAIN:
        return "0x943e6e07a7e8e791dafc44083e54041d743c46e9";
      case IndexerNetwork.SCROLL:
        return "0xB39002E4033b162fAc607fc3471E205FA2aE5967";
      case IndexerNetwork.SEPOLIA:
        return "0x1238536071E1c677A632429e3655c799b22cDA52";
      case IndexerNetwork.HYPER_EVM:
        throw Error(`Uniswap is not supported on HyperEVM`);
      case IndexerNetwork.PLASMA:
        return "0x743E03cceB4af2efA3CC76838f6E8B50B63F184c";
      case IndexerNetwork.MONAD:
        return "0x7197e214c0b767cfb76fb734ab638e2c192f4e53";
    }
  }

  static pancakeSwap(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.BASE:
        return "0x46A15B0b27311cedF172AB29E4f4766fbE7F4364";
      case IndexerNetwork.ETHEREUM:
        return "0x46A15B0b27311cedF172AB29E4f4766fbE7F4364";
      case IndexerNetwork.UNICHAIN:
        throw Error(`PancakeSwap is not supported on Unichain`);
      case IndexerNetwork.SCROLL:
        return "0x46A15B0b27311cedF172AB29E4f4766fbE7F4364";
      case IndexerNetwork.SEPOLIA:
        return "0x46A15B0b27311cedF172AB29E4f4766fbE7F4364";
      case IndexerNetwork.HYPER_EVM:
        throw Error(`PancakeSwap is not supported on HyperEVM`);
      case IndexerNetwork.PLASMA:
        throw Error(`PancakeSwap is not supported on Plasma`);
      case IndexerNetwork.MONAD:
        return "0x46A15B0b27311cedF172AB29E4f4766fbE7F4364";
    }
  }

  static sushiSwap(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.BASE:
        return "0x80C7DD17B01855a6D2347444a0FCC36136a314de";
      case IndexerNetwork.ETHEREUM:
        return "0x2214A42d8e2A1d20635c2cb0664422c528B6A432";
      case IndexerNetwork.UNICHAIN:
        throw Error(`SushiSwap is not supported on Unichain`);
      case IndexerNetwork.SCROLL:
        return "0x0389879e0156033202C44BF784ac18fC02edeE4f";
      case IndexerNetwork.SEPOLIA:
        throw Error(`SushiSwap is not supported on Sepolia`);
      case IndexerNetwork.HYPER_EVM:
        throw Error(`SushiSwap is not supported on HyperEVM`);
      case IndexerNetwork.PLASMA:
        throw Error(`SushiSwap is not supported on Plasma`);
      case IndexerNetwork.MONAD:
        throw Error(`SushiSwap is not supported on Monad`);
    }
  }

  static zebra(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.SCROLL:
        return "0x349B654dcbce53943C8e87F914F62ae9526C6681";
      default:
        throw Error(`Zebra is not supported on ${network}`);
    }
  }

  static baseSwap(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.BASE:
        return "0xDe151D5c92BfAA288Db4B67c21CD55d5826bCc93";
      default:
        throw Error(`BaseSwap is not supported on ${network}`);
    }
  }

  static alienBase(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.BASE:
        return "0xB7996D1ECD07fB227e8DcA8CD5214bDfb04534E5";
      default:
        throw Error(`AlienBase is not supported on ${network}`);
    }
  }

  static velodrome(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.UNICHAIN:
        return "0x991d5546C4B442B4c5fdc4c8B8b8d131DEB24702";
      case IndexerNetwork.ETHEREUM:
        throw Error(`Velodrome is not supported on Mainnet`);
      case IndexerNetwork.BASE:
        throw Error(`Velodrome is not supported on Base`);
      case IndexerNetwork.SCROLL:
        throw Error(`Velodrome is not supported on Scroll`);
      case IndexerNetwork.SEPOLIA:
        throw Error(`Velodrome is not supported on Sepolia`);
      case IndexerNetwork.HYPER_EVM:
        throw Error(`Velodrome is not supported on HyperEVM`);
      case IndexerNetwork.PLASMA:
        throw Error(`Velodrome is not supported on Plasma`);
      case IndexerNetwork.MONAD:
        throw Error(`Velodrome is not supported on Monad`);
    }
  }
  static honeypop(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.SCROLL:
        return "0xB6F8D24e28bF5b8AdD2e7510f84F3b9ef03B3435";
      default:
        throw Error(`Honeypop is not supported on ${network}`);
    }
  }

  static gliquid(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.HYPER_EVM:
        return "0x69D57B9D705eaD73a5d2f2476C30c55bD755cc2F";
      default:
        throw Error(`Gliquid is not supported on ${network}`);
    }
  }

  static hyperSwap(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.HYPER_EVM:
        return "0x6eDA206207c09e5428F281761DdC0D300851fBC8";
      default:
        throw Error(`HyperSwap is not supported on ${network}`);
    }
  }

  static projectX(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.HYPER_EVM:
        return "0xeaD19AE861c29bBb2101E834922B2FEee69B9091";
      default:
        throw Error(`Project X is not supported on ${network}`);
    }
  }

  static hybraV3(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.HYPER_EVM:
        return "0x934C4f47B2D3FfcA0156A45DEb3A436202aF1efa";
      default:
        throw Error(`Hybra is not supported on ${network}`);
    }
  }

  static hybraSlipstream(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.HYPER_EVM:
        return "0xcc9E3991360229Fd13694022b9456D371f1a2568";
      default:
        throw Error(`Hybra is not supported on ${network}`);
    }
  }

  static kittenSwap(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.HYPER_EVM:
        return "0x9ea4459c8DefBF561495d95414b9CF1E2242a3E2";
      default:
        throw Error(`KittenSwap is not supported on ${network}`);
    }
  }

  static ultraSolid(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.HYPER_EVM:
        return "0xE7ffA0ee20Deb1613489556062Fa8cec690C3c02";
      default:
        throw Error(`UltraSolid is not supported on ${network}`);
    }
  }

  static upheaval(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.HYPER_EVM:
        return "0xC8352A2EbA29F4d9BD4221c07D3461BaCc779088";
      default:
        throw Error(`Upheaval is not supported on ${network}`);
    }
  }

  static hxFinance(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.HYPER_EVM:
        return "0x578D8A2D07B60b12993559f1DDF90EB2af3eA496";
      default:
        throw Error(`HX Finance is not supported on ${network}`);
    }
  }

  static aethonSwap(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.MONAD:
        return "0xB879564EE31F841d8049c21227c6109856409bc7";
      default:
        throw Error(`AethonSwap is not supported on ${network}`);
    }
  }

  static atlantis(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.MONAD:
        return "0x69D57B9D705eaD73a5d2f2476C30c55bD755cc2F";
      default:
        throw Error(`Atlantis is not supported on ${network}`);
    }
  }

  static ramses(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.HYPER_EVM:
        return "0xB3F77C5134D643483253D22E0Ca24627aE42ED51";
      default:
        throw Error(`Ramses is not supported on ${network}`);
    }
  }
  static octoSwap(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.MONAD:
        return "0x16eb676BbBe51EB6E4E9DDF57BfBEe0537aA4d7B";
      default:
        throw Error(`OctoSwap is not supported on ${network}`);
    }
  }

  static pinotFinance(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.MONAD:
        return "0xb8058cDbC6CdC4b0aA0Aa00A7Ecf7CAAF1441392";
      default:
        throw Error(`Pinot Finance is not supported on ${network}`);
    }
  }
}
