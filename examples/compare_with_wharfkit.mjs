import { Abieos } from "@eosrio/node-abieos";
import { ABI, Serializer } from "@wharfkit/antelope";
import { readFileSync } from "node:fs";

// Abieos Example
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
console.log("Hex (Abieos):", hex);

const parsedJson = abieos.hexToJson("yourcontract", "youraction", hex);
console.log("Parsed JSON (Abieos):", parsedJson);

// Wharfkit Antelope Example
const wharfkitAbi = ABI.from(JSON.parse(readFileSync(abiPath, "utf8")));

const wharfkitSerializedData = Serializer.encode({
    abi: wharfkitAbi,
    type: "youraction",
    object: json
});

const wharfkitHex = wharfkitSerializedData.toString('hex');
console.log("Hex (Wharfkit):", wharfkitHex);

const wharfkitDeserializedData = Serializer.decode({
    abi: wharfkitAbi,
    type: 'youraction',
    data: wharfkitHex
});

console.log("Parsed JSON (Wharfkit):", Serializer.objectify(wharfkitDeserializedData));
