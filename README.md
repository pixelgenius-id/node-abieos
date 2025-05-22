# node-abieos

![CI](https://github.com/eosrio/node-abieos/actions/workflows/build.yml/badge.svg)
![Node-API v9 Badge](https://github.com/nodejs/abi-stable-node/blob/doc/assets/Node-API%20v9%20Badge.svg)
[![NPM version](https://img.shields.io/npm/v/@eosrio/node-abieos.svg?style=flat)](https://www.npmjs.com/package/@eosrio/node-abieos)

Node.js native binding for [abieos](https://github.com/AntelopeIO/abieos), with some improvements:

- Internal loaded contract map
- deleteContract: to remove the loaded contract from memory (now in vanilla abieos too)

Made with ♥ by [EOS Rio](https://eosrio.io/)

----
**Only Linux is supported for now**

- Typescript typings included
- Prebuilt binary included (Clang 18 required to build)
- Now supports NodeJS, Deno, and Bun runtimes.

## Install

```shell script
npm i @eosrio/node-abieos --save
```

## Usage

CommonJS

```js
const nodeAbieos = require('@eosrio/node-abieos');
```

ES Modules (NodeJS, Bun)

```typescript
import {Abieos} from "@eosrio/node-abieos";
const abieos = Abieos.getInstance();
```

Deno

```typescript
// examples/basic.cjs can be run with:
// deno run --allow-ffi --allow-read examples/basic.cjs

// For an example using the published npm package with Deno:
// Check the examples/deno-abieos-test folder
// cd examples/deno-abieos-test
// deno run --allow-ffi --allow-read main.ts
```

Bun

```shell script
# examples/basic.mjs can be run with:
bun run examples/basic.mjs
```

Check the [/examples](https://github.com/eosrio/node-abieos/tree/master/examples) folder for implementation examples

## Building

Make sure you have Clang installed on your system:
We recommend using Clang 18 to build the `abieos` C++ library.

```bash
wget https://apt.llvm.org/llvm.sh
chmod +x llvm.sh
sudo ./llvm.sh 18
```

Clone and Build

```shell script
git clone https://github.com/eosrio/node-abieos.git --recursive
cd node-abieos
npm install
npm run build:linux
npm run build
```

### Documentation

For detailed and user-friendly documentation, including installation, usage, API reference, error handling, debugging, and examples, please refer to the [documentation](docs/README.md).

For contribution guidelines and developer documentation, refer to the [contribution guidelines](docs/CONTRIBUTING.md).
