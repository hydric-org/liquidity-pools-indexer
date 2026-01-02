import { ONE_BIG_INT } from "../../core/constants";

export function mulDivRoundingUp(a: bigint, b: bigint, denominator: bigint): bigint {
  const product = a * b;
  let result = product / denominator;

  if (!(product % denominator == BigInt(0))) result = result + ONE_BIG_INT;
  return result;
}

export function mulShift128(val: bigint, mulBy: bigint): bigint {
  return (val * mulBy) >> BigInt(128);
}
