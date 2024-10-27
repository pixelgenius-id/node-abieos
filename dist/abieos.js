// lib/abieos.ts
import { createRequire } from "module";
var abieos = createRequire(import.meta.url)("./abieos.node");
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
export {
  Abieos
};
