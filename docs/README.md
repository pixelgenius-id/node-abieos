# node-abieos Documentation

## Overview

`node-abieos` is a Node.js native binding for [abieos](https://github.com/AntelopeIO/abieos), providing binary to JSON conversion using ABIs. This documentation provides detailed information on installation, usage, API reference, error handling, debugging, and examples.

## Installation

To install `node-abieos`, use the following command:

```shell
npm i @eosrio/node-abieos --save
```

## Usage

### CommonJS

```js
const nodeAbieos = require('@eosrio/node-abieos');
```

### ES Modules

```typescript
import { Abieos } from "@eosrio/node-abieos";
const abieos = Abieos.getInstance();
```

## API Reference

### Abieos Class

The `Abieos` class provides a singleton instance for interacting with the native abieos module. This pattern ensures a single global context for the underlying C++ abieos library, which manages internal state and resources.

#### Methods

- **getInstance()**: Returns the singleton instance of the `Abieos` class.
- **getLoadedAbis()**: Returns an array of loaded ABI contract names.
- **cleanup()**: Cleans up all loaded contracts by deleting them from the native context.
- **stringToName(nameString: string)**: Converts a string name to its corresponding 64-bit unsigned integer representation (BigInt).
- **jsonToHex(contractName: string, type: string, json: string | object)**: Converts a JSON string or object to its hexadecimal binary representation.
- **hexToJson(contractName: string, type: string, hex: string)**: Converts a hexadecimal binary string to its JSON representation.
- **binToJson(contractName: string, type: string, buffer: Buffer)**: Converts a binary buffer to its JSON representation.
- **loadAbi(contractName: string, abi: string | object)**: Loads an ABI for a given contract.
- **loadAbiHex(contractName: string, abihex: string)**: Loads an ABI for a given contract from its hexadecimal representation.
- **getTypeForAction(contractName: string, actionName: string)**: Retrieves the type name for a specific action within a contract's ABI.
- **getTypeForTable(contractName: string, table_name: string)**: Retrieves the type name for a specific table within a contract's ABI.
- **deleteContract(contractName: string)**: Deletes a contract's ABI from the abieos context.

## Error Handling

Errors in `node-abieos` are thrown as JavaScript exceptions. Each method that interacts with the native abieos module includes error handling to provide meaningful error messages.

## Debugging

To enable debugging, set the `Abieos.debug` property to `true`. This will log additional information to the console.

```typescript
Abieos.debug = true;
```

## Examples

### Basic Example

```typescript
import { Abieos } from "@eosrio/node-abieos";
const abieos = Abieos.getInstance();

const abi = {
    "version": "eosio::abi/1.1",
    "structs": [
        {
            "name": "transfer",
            "base": "",
            "fields": [
                {"name": "from", "type": "name"},
                {"name": "to", "type": "name"},
                {"name": "quantity", "type": "asset"},
                {"name": "memo", "type": "string"}
            ]
        }
    ],
    "actions": [
        {
            "name": "transfer",
            "type": "transfer",
            "ricardian_contract": ""
        }
    ]
};

abieos.loadAbi("eosio.token", abi);

const json = {
    from: "alice",
    to: "bob",
    quantity: "10.0000 EOS",
    memo: "Test transfer"
};

const hex = abieos.jsonToHex("eosio.token", "transfer", json);
console.log("Hex:", hex);

const parsedJson = abieos.hexToJson("eosio.token", "transfer", hex);
console.log("Parsed JSON:", parsedJson);
```

### Real World Example

```typescript
import { Abieos } from "@eosrio/node-abieos";
import { readFileSync } from "node:fs";

const abieos = Abieos.getInstance();

const abiPath = "./path/to/your/contract.abi";
const abi = JSON.parse(readFileSync(abiPath, "utf8"));

abieos.loadAbi("yourcontract", abi);

const json = {
    user: "john",
    action: "buy",
    amount: "100.0000 EOS"
};

const hex = abieos.jsonToHex("yourcontract", "youraction", json);
console.log("Hex:", hex);

const parsedJson = abieos.hexToJson("yourcontract", "youraction", hex);
console.log("Parsed JSON:", parsedJson);
```

### Side-by-Side Usage Comparison with Wharfkit Antelope Library

#### Abieos Example

```typescript
import { Abieos } from "@eosrio/node-abieos";
import { readFileSync } from "node:fs";

const abieos = Abieos.getInstance();

const abiPath = "./path/to/your/contract.abi";
const abi = JSON.parse(readFileSync(abiPath, "utf8"));

abieos.loadAbi("yourcontract", abi);

const json = {
    user: "john",
    action: "buy",
    amount: "100.0000 EOS"
};

const hex = abieos.jsonToHex("yourcontract", "youraction", json);
console.log("Hex:", hex);

const parsedJson = abieos.hexToJson("yourcontract", "youraction", hex);
console.log("Parsed JSON:", parsedJson);
```

#### Wharfkit Antelope Example

```typescript
import { ABI, Serializer } from "@wharfkit/antelope";
import { readFileSync } from "node:fs";

const abiPath = "./path/to/your/contract.abi";
const abi = ABI.from(JSON.parse(readFileSync(abiPath, "utf8")));

const json = {
    user: "john",
    action: "buy",
    amount: "100.0000 EOS"
};

const serializedData = Serializer.encode({
    abi,
    type: "youraction",
    object: json
});

const hex = serializedData.toString('hex');
console.log("Hex:", hex);

const deserializedData = Serializer.decode({
    abi,
    type: 'youraction',
    data: hex
});

console.log("Parsed JSON:", Serializer.objectify(deserializedData));
```

Check the [/examples](https://github.com/eosrio/node-abieos/tree/master/examples) folder for more implementation examples.

## Build Process and Dependencies

Make sure you have Clang installed on your system. We recommend using Clang 18 to build the `abieos` C++ library.

```bash
wget https://apt.llvm.org/llvm.sh
chmod +x llvm.sh
sudo ./llvm.sh 18
```

Clone and Build

```shell
git clone https://github.com/eosrio/node-abieos.git --recursive
cd node-abieos
npm install
npm run build:linux
npm run build
```

## Contribution Guidelines

For contribution guidelines and developer documentation, refer to the `docs/CONTRIBUTING.md` file.
