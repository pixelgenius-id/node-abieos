# **node-abieos (Vexanium Edition)**

  

## **Overview**

  

node-abieos  is a Node.js native binding for  [abieos](https://github.com/AntelopeIO/abieos), providing binary ↔ JSON conversion using ABIs.

  

This fork is maintained by  [pixelgenius-id](https://github.com/pixelgenius-id)  and has been  **adapted to support the Vexanium Blockchain**.

  

Originally based on  [eosrio/node-abieos](https://github.com/eosrio/node-abieos).

----------

## **Installation**

  

Install from npm:

```
npm i @pixelgeniusid/node-abieos --save
```

----------

## **Usage**

  

### **CommonJS**

```
const nodeAbieos = require('@pixelgeniusid/node-abieos');
```

### **ES Modules / TypeScript**

```
import { Abieos } from "@pixelgeniusid/node-abieos";
const abieos = Abieos.getInstance();
```

----------

## **API Reference**

  

### **Abieos**

### **Class**

  

A singleton class for interacting with the native  abieos  module.

This ensures a single global context for the underlying C++ library.

  

#### **Methods**

-   **getInstance()**  → Returns the singleton instance.
    
-   **getLoadedAbis()**  → Returns an array of loaded contract ABIs.
    
-   **cleanup()**  → Clears all loaded ABIs from the context.
    
-   **stringToName(name: string)**  → Converts a string to its 64-bit  name  representation.
    
-   **jsonToHex(contract, type, json)** → Converts JSON → Hex.
    
-   **hexToJson(contract, type, hex)** → Converts Hex → JSON.
    
-   **binToJson(contract, type, buffer)** → Converts binary → JSON.
    
-   **loadAbi(contract, abi)**  → Loads an ABI from JSON.
    
-   **loadAbiHex(contract, abihex)** → Loads an ABI from Hex.
    
-   **getTypeForAction(contract, action)**  → Gets the type for a contract action.
    
-   **getTypeForTable(contract, table)**  → Gets the type for a contract table.
    
-   **deleteContract(contract)**  → Deletes a loaded contract ABI.
    

----------

## **Error Handling**

  

Errors are thrown as JavaScript exceptions with descriptive messages when the native module encounters issues.

----------

## **Debugging**

  

Enable debug logging:

```
Abieos.debug = true;
```

----------

## **Examples**

  

### **Basic Example**

```
import { Abieos } from "@pixelgeniusid/node-abieos";

const abieos = Abieos.getInstance();

const abi = {
  version: "eosio::abi/1.1",
  structs: [
    {
      name: "transfer",
      base: "",
      fields: [
        { name: "from", type: "name" },
        { name: "to", type: "name" },
        { name: "quantity", type: "asset" },
        { name: "memo", type: "string" }
      ]
    }
  ],
  actions: [
    {
      name: "transfer",
      type: "transfer",
      ricardian_contract: ""
    }
  ]
};

abieos.loadAbi("vex.token", abi);

const json = {
  from: "alice",
  to: "bob",
  quantity: "10.0000 VEX",
  memo: "Test transfer"
};

const hex = abieos.jsonToHex("vex.token", "transfer", json);
console.log("Hex:", hex);

const parsed = abieos.hexToJson("vex.token", "transfer", hex);
console.log("Parsed JSON:", parsed);
```

> For more, check the  [/examples](examples)  folder.

----------

## **Build Process**

  

Make sure you have **Clang (v18 recommended)**:

```
wget https://apt.llvm.org/llvm.sh
chmod +x llvm.sh
sudo ./llvm.sh 18
```

### **Clone & Build**

```
git clone https://github.com/pixelgenius-id/node-abieos.git --recursive
cd node-abieos
npm install
npm run build:linux
npm run build
```

----------

## **Contributing**

  

See the  [CONTRIBUTING.md](docs/CONTRIBUTING.md)  guide for details.

----------

## **License**

  

Licensed under the  [MIT License](LICENSE).

----------

## **Attribution**

  

This project is  **originally based on**  [eosrio/node-abieos](https://github.com/eosrio/node-abieos)  and adapted by  [pixelgenius-id](https://github.com/pixelgenius-id)  to support the  **Vexanium Blockchain**.