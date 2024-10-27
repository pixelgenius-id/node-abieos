"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/abieos.ts
var abieos_exports = {};
__export(abieos_exports, {
  Abieos: () => Abieos
});
module.exports = __toCommonJS(abieos_exports);

// node_modules/tsup/assets/cjs_shims.js
var getImportMetaUrl = () => typeof document === "undefined" ? new URL(`file:${__filename}`).href : document.currentScript && document.currentScript.src || new URL("main.js", document.baseURI).href;
var importMetaUrl = /* @__PURE__ */ getImportMetaUrl();

// lib/abieos.ts
var import_module = require("module");
var abieos = (0, import_module.createRequire)(importMetaUrl)("./abieos.node");
var Abieos = class _Abieos {
  static instance;
  static native;
  constructor() {
    if (_Abieos.instance) {
      throw new Error("This class is a Singleton!");
    }
    _Abieos.native = abieos;
  }
  static getInstance() {
    if (!_Abieos.instance) {
      _Abieos.instance = new _Abieos();
    }
    return _Abieos.instance;
  }
  stringToName(nameString) {
    return _Abieos.native.string_to_name(nameString);
  }
  jsonToHex(contractName, type, json) {
    const jsonData = typeof json === "object" ? JSON.stringify(json) : json;
    const data = _Abieos.native.json_to_hex(contractName, type, jsonData);
    if (data === "PARSING_ERROR") {
      throw new Error("failed to parse data");
    } else {
      return data;
    }
  }
  hexToJson(contractName, type, hex) {
    const data = _Abieos.native.hex_to_json(contractName, type, hex);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        throw new Error("failed to parse json string: " + data);
      }
    } else {
      throw new Error("failed to parse hex data");
    }
  }
  binToJson(contractName, type, buffer) {
    const data = _Abieos.native.bin_to_json(contractName, type, buffer);
    if (data[0] === "{" || data[0] === "[") {
      try {
        return JSON.parse(data);
      } catch (e) {
        throw new Error("json parse error");
      }
    } else {
      throw new Error(data);
    }
  }
  loadAbi(contractName, abi) {
    if (typeof abi === "string") {
      return _Abieos.native.load_abi(contractName, abi);
    } else {
      if (typeof abi === "object") {
        return _Abieos.native.load_abi(contractName, JSON.stringify(abi));
      } else {
        throw new Error("ABI must be a String or Object");
      }
    }
  }
  loadAbiHex(contractName, abihex) {
    return _Abieos.native.load_abi_hex(contractName, abihex);
  }
  getTypeForAction(contractName, actionName) {
    const result = _Abieos.native.get_type_for_action(contractName, actionName);
    if (result === "NOT_FOUND") {
      throw new Error(`[node-abieos] action ` + actionName + " not found on contract " + contractName);
    } else {
      return result;
    }
  }
  getTypeForTable(contractName, table_name) {
    const result = _Abieos.native.get_type_for_table(contractName, table_name);
    if (result === "NOT_FOUND") {
      throw new Error(`[node-abieos] table ` + table_name + " not found on contract " + contractName);
    } else {
      return result;
    }
  }
  deleteContract(contractName) {
    return _Abieos.native.delete_contract(contractName);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Abieos
});
