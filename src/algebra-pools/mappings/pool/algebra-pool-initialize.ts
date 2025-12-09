import { AlgebraPoolData, handlerContext } from "generated";

export async function handleAlgebraPoolInitialize(params: {
  context: handlerContext;
  algebraPoolData: AlgebraPoolData;
  sqrtPriceX96: bigint;
  tick: bigint;
}): Promise<void> {
  params.algebraPoolData = {
    ...params.algebraPoolData,
    sqrtPriceX96: params.sqrtPriceX96,
    tick: params.tick,
  };

  params.context.AlgebraPoolData.set(params.algebraPoolData);
}
