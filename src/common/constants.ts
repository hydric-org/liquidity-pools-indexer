import { BigDecimal } from "generated";

export const ZERO_BIG_DECIMAL = BigDecimal(0);

export const ZERO_BIG_INT = BigInt(0);

export const MAX_UINT256 = BigInt(2) ** BigInt(256) - BigInt(1);

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const ONE_BIG_INT = BigInt(1);

export const Q96 = BigInt(2) ** BigInt(96);

export const ONE_HOUR_IN_SECONDS = 3_600;

export const ONE_DAY_IN_SECONDS = 86_400;

export const OUTLIER_TOKEN_PRICE_PERCENT_THRESHOLD = 1000;

export const OUTLIER_TOKEN_VOLUME_PERCENT_THRESHOLD = 5000;

export const OUTLIER_POOL_TVL_PERCENT_THRESHOLD = 20000;

export const DEFI_POOL_DATA_ID = "defi-pool-data";
