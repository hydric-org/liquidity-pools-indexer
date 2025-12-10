import assert from "assert";
import { ERC20_ABI } from "../../src/common/abis";

describe("ABIs", () => {
  it("Should return the correct abi when calling ERC20_ABI", () => {
    const expectedAbi = [
      {
        inputs: [],
        name: "name",
        outputs: [{ type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "NAME",
        outputs: [{ type: "bytes32" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{ type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "SYMBOL",
        outputs: [{ type: "bytes32" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [{ type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
    ] as const;

    assert.deepEqual(ERC20_ABI, expectedAbi);
  });
});
