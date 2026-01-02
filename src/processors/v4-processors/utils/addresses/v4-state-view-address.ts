import { IndexerNetwork } from "../../../../core/network";
import { SupportedProtocol } from "../../../../core/protocol";

export class V4StateViewAddress {
  static forProtocol(params: { network: IndexerNetwork; protocol: SupportedProtocol }): string {
    switch (params.protocol) {
      case SupportedProtocol.UNISWAP_V4:
        return V4StateViewAddress.uniswap(params.network);
      default:
        throw Error(`Protocol ${params.protocol} is not supported for V4 state view`);
    }
  }

  static uniswap(network: IndexerNetwork): string {
    switch (network) {
      case IndexerNetwork.ETHEREUM:
        return "0x7ffe42c4a5deea5b0fec41c94c136cf115597227";
      case IndexerNetwork.BASE:
        return "0xa3c0c9b65bad0b08107aa264b0f3db444b867a71";
      case IndexerNetwork.UNICHAIN:
        return "0x86e8631a016f9068c3f085faf484ee3f5fdee8f2";
      case IndexerNetwork.SCROLL:
        throw Error(`Uniswap V4 state view is not implemented on Scroll`);
      case IndexerNetwork.SEPOLIA:
        return "0xe1dd9c3fa50edb962e442f60dfbc432e24537e4c";
      case IndexerNetwork.HYPER_EVM:
        throw Error(`Uniswap V4 state view is not implemented on HyperEVM`);
      case IndexerNetwork.PLASMA:
        throw Error(`Uniswap V4 state view is not implemented on Plasma`);
      case IndexerNetwork.MONAD:
        return "0x77395F3b2E73aE90843717371294fa97cC419D64";
    }
  }
}
