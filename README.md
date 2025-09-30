
# node-abieos

![CI](https://github.com/pixelgenius-id/node-abieos/actions/workflows/build.yml/badge.svg)
![Node-API v9 Badge](https://raw.githubusercontent.com/nodejs/abi-stable-node/doc/assets/Node-API%20v9%20Badge.svg)
[![NPM version](https://img.shields.io/npm/v/@pixelgeniusid/node-abieos.svg?style=flat)](https://www.npmjs.com/package/@pixelgeniusid/node-abieos)
[![GitHub forks](https://img.shields.io/github/forks/pixelgenius-id/node-abieos?style=social)](https://github.com/pixelgenius-id/node-abieos/network/members)
[![GitHub stars](https://img.shields.io/github/stars/pixelgenius-id/node-abieos?style=social)](https://github.com/pixelgenius-id/node-abieos/stargazers)

---

## Overview

`node-abieos` is a Node.js native binding for [abieos](https://github.com/AntelopeIO/abieos).  
This fork is maintained by [pixelgenius-id](https://github.com/pixelgenius-id) to support the **Vexanium Blockchain**, while keeping compatibility with the original project.

✨ Improvements / Features:
- Internal loaded contract map  
- `deleteContract`: remove the loaded contract from memory (also available in vanilla abieos)  
- Extended support for Vexanium use cases  

---

## Attribution

This project was **originally created by [EOS Rio](https://eosrio.io/)** under [eosrio/node-abieos](https://github.com/eosrio/node-abieos).  
All credit to the original authors — this fork builds on their excellent work. ❤️  

---

## ⚡ Platform Support

- **Linux only** (for now)  
- TypeScript typings included  
- Prebuilt binaries included (Clang 18 required to build from source)  

---

## 📦 Installation

```bash
npm i @pixelgeniusid/node-abieos --save
```

----------

## **🛠 Usage**

  

### **CommonJS**

```
const nodeAbieos = require('@pixelgeniusid/node-abieos');
```

### **ES Modules**

```
import { Abieos } from "@pixelgeniusid/node-abieos";
const abieos = Abieos.getInstance();
```

Check the  [/examples](https://github.com/eosrio/node-abieos/tree/master/examples)  folder from the original repo for implementation examples.

----------

## **🔨 Building from Source**

  

Make sure you have  **Clang 18**  installed:

```
wget https://apt.llvm.org/llvm.sh
chmod +x llvm.sh
sudo ./llvm.sh 18
```

Clone and build:

```
git clone https://github.com/pixelgenius-id/node-abieos.git --recursive
cd node-abieos
npm install
npm run build:linux
npm run build
```

----------

## **📖 Documentation**

  

For detailed documentation (installation, usage, API reference, error handling, debugging, and examples), see:

-   [Documentation](docs/README.md)
    
-   [Contribution Guidelines](docs/CONTRIBUTING.md)
    

----------

## **❤️ Credits**

-   Original work:  [eosrio/node-abieos](https://github.com/eosrio/node-abieos)  by  [EOS Rio](https://eosrio.io/)
    
-   Fork & Vexanium Support:  [pixelgenius-id](https://github.com/pixelgenius-id)
