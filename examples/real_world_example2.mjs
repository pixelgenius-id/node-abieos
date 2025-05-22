import { Abieos } from "@eosrio/node-abieos";
import { readFileSync } from "node:fs";

// Create an instance of Abieos
const abieos = Abieos.getInstance();

// Load the ABI for the contract
const abiPath = "./path/to/your/contract.abi";
const abi = JSON.parse(readFileSync(abiPath, "utf8"));
abieos.loadAbi("yourcontract", abi);

// Define the JSON data to be converted
const json = {
    user: "jane",
    action: "sell",
    amount: "50.0000 EOS"
};

// Convert JSON to hex
const hex = abieos.jsonToHex("yourcontract", "youraction", json);
console.log("Hex:", hex);

// Convert hex back to JSON
const parsedJson = abieos.hexToJson("yourcontract", "youraction", hex);
console.log("Parsed JSON:", parsedJson);
