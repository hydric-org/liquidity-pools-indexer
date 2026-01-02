import { MAX_UINT256 } from "../../../core/constants";
import { mulShift128 } from "../math-extended";

const MIN_POOL_TICK: number = -887272;
const MAX_POOL_TICK: number = -MIN_POOL_TICK;

const Q128 = 0x100000000000000000000000000000000n;
const BIT_0 = 0xfffcb933bd6fad37aa2d162d1a594001n;
const BIT_1 = 0xfff97272373d413259a46990580e213an;
const BIT_2 = 0xfff2e50f5f656932ef12357cf3c7fdccn;
const BIT_3 = 0xffe5caca7e10e4e61c3624eaa0941cd0n;
const BIT_4 = 0xffcb9843d60f6159c9db58835c926644n;
const BIT_5 = 0xff973b41fa98c081472e6896dfb254c0n;
const BIT_6 = 0xff2ea16466c96a3843ec78b326b52861n;
const BIT_7 = 0xfe5dee046a99a2a811c461f1969c3053n;
const BIT_8 = 0xfcbe86c7900a88aedcffc83b479aa3a4n;
const BIT_9 = 0xf987a7253ac413176f2b074cf7815e54n;
const BIT_10 = 0xf3392b0822b70005940c7a398e4b70f3n;
const BIT_11 = 0xe7159475a2c29b7443b29c7fa6e889d9n;
const BIT_12 = 0xd097f3bdfd2022b8845ad8f792aa5825n;
const BIT_13 = 0xa9f746462d870fdf8a65dc1f90e061e5n;
const BIT_14 = 0x70d869a156d2a1b890bb3df62baf32f7n;
const BIT_15 = 0x31be135f97d08fd981231505542fcfa6n;
const BIT_16 = 0x9aa508b5b7a84e1c677de54f3e99bc9n;
const BIT_17 = 0x5d6af8dedb81196699c329225ee604n;
const BIT_18 = 0x2216e584f5fa1ea926041bedfe98n;
const BIT_19 = 0x48a170391f7dc42444e8fa2n;

export const ConcentratedTickMath = {
  getSqrtRatioAtTick: (tick: number): bigint => {
    if (tick < MIN_POOL_TICK || tick > MAX_POOL_TICK) throw new Error("TICK");

    const absTick = tick < 0 ? -tick : tick;

    let ratio = (absTick & 0x1) !== 0 ? BIT_0 : Q128;

    if ((absTick & 0x2) !== 0) ratio = mulShift128(ratio, BIT_1);
    if ((absTick & 0x4) !== 0) ratio = mulShift128(ratio, BIT_2);
    if ((absTick & 0x8) !== 0) ratio = mulShift128(ratio, BIT_3);
    if ((absTick & 0x10) !== 0) ratio = mulShift128(ratio, BIT_4);
    if ((absTick & 0x20) !== 0) ratio = mulShift128(ratio, BIT_5);
    if ((absTick & 0x40) !== 0) ratio = mulShift128(ratio, BIT_6);
    if ((absTick & 0x80) !== 0) ratio = mulShift128(ratio, BIT_7);
    if ((absTick & 0x100) !== 0) ratio = mulShift128(ratio, BIT_8);
    if ((absTick & 0x200) !== 0) ratio = mulShift128(ratio, BIT_9);
    if ((absTick & 0x400) !== 0) ratio = mulShift128(ratio, BIT_10);
    if ((absTick & 0x800) !== 0) ratio = mulShift128(ratio, BIT_11);
    if ((absTick & 0x1000) !== 0) ratio = mulShift128(ratio, BIT_12);
    if ((absTick & 0x2000) !== 0) ratio = mulShift128(ratio, BIT_13);
    if ((absTick & 0x4000) !== 0) ratio = mulShift128(ratio, BIT_14);
    if ((absTick & 0x8000) !== 0) ratio = mulShift128(ratio, BIT_15);
    if ((absTick & 0x10000) !== 0) ratio = mulShift128(ratio, BIT_16);
    if ((absTick & 0x20000) !== 0) ratio = mulShift128(ratio, BIT_17);
    if ((absTick & 0x40000) !== 0) ratio = mulShift128(ratio, BIT_18);
    if ((absTick & 0x80000) !== 0) ratio = mulShift128(ratio, BIT_19);

    if (tick > 0) ratio = MAX_UINT256 / ratio;

    return (ratio >> 32n) + ((ratio & 0xffffffffn) > 0n ? 1n : 0n);
  },
};
