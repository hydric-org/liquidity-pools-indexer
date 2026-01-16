# Liquidity Pools Indexer

**hydric**

The **Liquidity Pools Indexer** is one of the indexers from the hydric indexing layer. It aggregates, normalizes, and indexes liquidity pool data across all supported blockchains and protocols to power liquidity pool analytics and data.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
  - [Adding a New Network](#adding-a-new-network)
- [Protocol Integration](#protocol-integration)
  - [Uniswap V3 Standard](#uniswap-v3-standard)
  - [Uniswap V3 Custom](#uniswap-v3-custom)
  - [Algebra Integral](#algebra-integral)
  - [Slipstream](#slipstream)
  - [Uniswap V4](#uniswap-v4)
- [Testing](#testing)

---

## Prerequisites

Ensure your environment meets the following requirements before proceeding.

| Dependency  | Verification Command | Installation Guide                                                | Note                            |
| :---------- | :------------------- | :---------------------------------------------------------------- | :------------------------------ |
| **Node.js** | `node --version`     | https://nodejs.org/en/learn/getting-started/how-to-install-nodejs | Latest LTS recommended          |
| **pnpm**    | `pnpm --version`     | https://pnpm.io/installation                                      | Used for package management     |
| **Docker**  | `docker --version`   | https://docs.docker.com/get-docker/                               | **Required** for local indexing |

---

## Quick Start

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd <repo-name>
pnpm install
```

### 2. Environment Setup

Configure your RPC providers.

- Modify `getPaidRPCUrl` in [src/core/network/indexer-network.ts](src/core/network/indexer-network.ts).

### 3. Local Execution

Start the local indexer using Docker and Envio:

```bash
pnpm dev
```

The service will sync immediately and stream logs to the terminal.

---

## Configuration

### Adding a New Network

To support a new blockchain, update the configuration in the following order:

#### 1. Update `config.yaml`

Append the network details to the `chains` section:

- `id`: Must match the network's Chain ID (refer to Chainlist)
- `start_block`: Deployment block of the oldest contract to be indexed
- `max_reorg_depth`: Safe reorg depth (typically ~3 minutes of blocks)

#### 2. Register Network Enum

Add the network to the `IndexerNetwork` enum in  
`src/core/network/indexer-network.ts`.

The value **must** match the `id` defined in `config.yaml`.

#### 3. Configure Network Constants

In the `IndexerNetwork` namespace ([src/core/network/indexer-network.ts](src/core/network/indexer-network.ts)), add:

- RPC URLs
- Stablecoin addresses
- Wrapped native token addresses

#### 4. Update Address Maps

Modify the following files to include addresses for the new network:

- Position Managers: [src/core/address/position-manager-address.ts](src/core/address/position-manager-address.ts)
- Permit2: [src/core/address/permit2-address.ts](src/core/address/permit2-address.ts) (if supported)
- V4 State View: [src/processors/v4-processors/utils/addresses/v4-state-view-address.ts](src/processors/v4-processors/utils/addresses/v4-state-view-address.ts) (if V4 is present)

---

## Protocol Integration

Follow the specific guide below based on the DEX architecture.

---

### Uniswap V3 Standard

For pure clones using identical ABIs and bytecode.

- **Config**: Register the factory in [config.yaml](./config.yaml) using the [`abis/factories/UniswapV3Factory.json`](./abis/factories/UniswapV3Factory.json) ABI.
- **Required Event**:  
  `PoolCreated(address indexed token0, address indexed token1, uint24 indexed fee, int24 tickSpacing, address pool)`
- **Metadata**: Register the protocol in Supported Protocols (name, logo, etc.).
- **Handler**: Create a factory handler in [src/handlers/v3-handlers/factory](src/handlers/v3-handlers/factory).
- **Addresses**: Update [Position Manager addresses](src/core/address/position-manager-address.ts).

---

### Uniswap V3 Custom

For DEXs with V3-like logic but modified ABIs.

- **ABIs**:
  - Add Factory ABI to [`./abis/factories/`](./abis/factories/)
  - Add Pool ABI to `./abis/pools/`
- **Config**:
  - Register the Factory in `config.yaml` (reference new ABI)
  - Register the Pool in `contracts` (reference new ABI)
  - Add the Pool as a dynamic contract in the `chains` section
- **Metadata**: Register in Supported Protocols
- **Handlers**:
  - Create a Factory Handler in [src/handlers/v3-handlers/factory](src/handlers/v3-handlers/factory)
  - Ensure you register the dynamic pool contract:

```ts
UniswapV3Factory.PairCreated.contractRegister(({ event, context }) => {
  context.addUniswapV3Pool(event.params.pair);
});
```

- Create a Pool Handler folder in [src/handlers/v3-handlers/pool](src/handlers/v3-handlers/pool) containing all necessary logic.
- **Addresses**: Update [Position Manager addresses](src/core/address/position-manager-address.ts).

---

### Algebra Integral

Supported versions: **v1.2.0**, **v1.2.2**

- **Config**: Register the factory in `config.yaml`
- **ABI**: Use [`abis/factories/AlgebraFactory_1_2_2.json`](./abis/factories/AlgebraFactory_1_2_2.json) or [`abis/factories/AlgebraFactory_1_2_0.json`](./abis/factories/AlgebraFactory_1_2_0.json)
- **Required Events**:
  - `Pool(address indexed token0, address indexed token1, address pool)`
  - `CustomPool(address indexed deployer, address indexed token0, address indexed token1, address pool)`
- **Metadata**: Register in Supported Protocols
- **Handler**: Create a factory handler in [src/handlers/algebra-handlers/factory](src/handlers/algebra-handlers/factory)
- **Addresses**: Update [Position Manager addresses](src/core/address/position-manager-address.ts)

---

### Slipstream

- **Config**: Register the factory in `config.yaml`
- **ABI**: `SlipstreamFactory.json`
- **Required Event**:  
  `PoolCreated(address indexed token0, address indexed token1, int24 indexed tickSpacing, address pool)`
- **Metadata**: Register in Supported Protocols
- **Handler**: Create a factory handler in [src/handlers/slipstream-handlers/factory](src/handlers/slipstream-handlers/factory)
- **Addresses**: Update [Position Manager addresses](src/core/address/position-manager-address.ts)

---

### Uniswap V4

- **Config**: Register the Pool Manager in `config.yaml` with the correct ABI and event signatures
- **Metadata**: Register in Supported Protocols
- **Handlers**: Create handlers in [src/handlers/v4-handlers](src/handlers/v4-handlers)
- **Addresses**:
  - Update [Position Manager addresses](src/core/address/position-manager-address.ts)
  - Update [V4 State View address](src/processors/v4-processors/utils/addresses/v4-state-view-address.ts)
  - Update [Permit2 address](src/core/address/permit2-address.ts)

---

## Testing

**Note**: Comprehensive test suite coverage is currently pending implementation.

Run the test suite:

```bash
pnpm test
```
