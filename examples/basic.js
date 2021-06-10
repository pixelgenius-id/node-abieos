const nodeAbieos = require('../abieos');
const eosio_abi = require('../eosio.json');

// abort if not on linux
if (!nodeAbieos) {
    console.log('platform not supported');
    process.exit();
}

// Load contract based on contract name
if (nodeAbieos.load_abi("eosio", JSON.stringify(eosio_abi))) {
    console.log('abi loaded');
} else {
    console.log('error loading abi')
}

// check action type
const type = nodeAbieos.get_type_for_action("eosio", "voteproducer");
if (type) {
    // action present on the contract
    console.log(type);
} else {
    // action not present
    console.log('Action type not found!');
}

const exampleAction = {
    voter: "voteracct111",
    proxy: "",
    producers: ["prod1", "prod2", "prod3"]
}

// seriallize action data
let actionHexData;
try {
    actionHexData = nodeAbieos.json_to_hex("eosio", type, exampleAction);
    console.log(actionHexData);
} catch (e) {
    console.log(e);
    return;
}

// deserializer action data
let actionDataJson;
try {
    actionDataJson = nodeAbieos.hex_to_json("eosio", type, actionHexData);
    console.log(actionDataJson);
} catch (e) {
    console.log(e);
    return;
}

// delete contract from cache, returns true or false
const status = nodeAbieos.delete_contract("eosio");
if (status) {
    console.log('contract deleted');
} else {
    console.log('contract not found');
}

// check whether the contract was deleted
try {
    const result = nodeAbieos.get_type_for_action("eosio", "voteproducer");
    console.log(result);
} catch (e) {
    console.log(e.message);
}
