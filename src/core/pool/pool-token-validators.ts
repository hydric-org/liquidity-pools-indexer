import { Token as TokenEntity } from "generated";
import { String } from "../../lib/string-utils";
import { ZERO_ADDRESS } from "../constants";
import { IndexerNetwork } from "../network";

export function isVariableWithStablePool(token0: TokenEntity, token1: TokenEntity, network: IndexerNetwork): boolean {
  const stablecoinsAddressesLowercased = IndexerNetwork.stablecoinsAddresses[network].map<string>((address) =>
    address.toLowerCase()
  );

  const isToken0Stable = stablecoinsAddressesLowercased.includes(token0.tokenAddress.toLowerCase());
  const isToken1Stable = stablecoinsAddressesLowercased.includes(token1.tokenAddress.toLowerCase());

  if ((isToken0Stable && !isToken1Stable) || (!isToken0Stable && isToken1Stable)) return true;

  return false;
}

export function isStableOnlyPool(token0: TokenEntity, token1: TokenEntity, network: IndexerNetwork): boolean {
  const stablecoinsAddressesLowercased = IndexerNetwork.stablecoinsAddresses[network].map<string>((address) =>
    address.toLowerCase()
  );

  const isToken0Stable = stablecoinsAddressesLowercased.includes(token0.tokenAddress.toLowerCase());
  const isToken1Stable = stablecoinsAddressesLowercased.includes(token1.tokenAddress.toLowerCase());

  if (isToken0Stable && isToken1Stable) return true;

  return false;
}

export function isWrappedNativePool(token0: TokenEntity, token1: TokenEntity, network: IndexerNetwork): boolean {
  const isToken0WrappedNative = String.lowercasedEquals(
    token0.tokenAddress,
    IndexerNetwork.wrappedNativeAddress[network]
  );

  const isToken1WrappedNative = String.lowercasedEquals(
    token1.tokenAddress,
    IndexerNetwork.wrappedNativeAddress[network]
  );

  if (isToken0WrappedNative || isToken1WrappedNative) return true;

  return false;
}

export function isNativePool(token0: TokenEntity, token1: TokenEntity): boolean {
  const isToken0Native = String.lowercasedEquals(token0.tokenAddress, ZERO_ADDRESS);
  const isToken1Native = String.lowercasedEquals(token1.tokenAddress, ZERO_ADDRESS);

  if (isToken0Native || isToken1Native) return true;

  return false;
}
