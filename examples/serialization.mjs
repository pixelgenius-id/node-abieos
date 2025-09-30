const {Abieos} = require('@pixelgeniusid/node-abieos');

// Create an instance of Abieos
const abieos = Abieos.getInstance();

// Fetch the ABI from the blockchain API
async function fetchAbi(contractName) {
    const response = await fetch("https://api.nodespark.funß/v1/chain/get_abi", {
        method: "POST",
        body: JSON.stringify({ account_name: contractName }),
        headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();ß
    return data.abi;
}

// Load the ABI for the contract
async function loadAbiFromBlockchain(contractName) {
    const abi = await fetchAbi(contractName);
    abieos.loadAbi(contractName, abi);
}

// Define the JSON data to be converted
const json = {
    from: "alice",
    to: "bob",
    quantity: "10.0000 VEX",
    memo: "Test transfer"
};

// Main function to demonstrate the usage
async function main() {
    const contractName = "vex.token";
    await loadAbiFromBlockchain(contractName);

    // Convert JSON to hex
    const hex = abieos.jsonToHex(contractName, "transfer", json);
    console.log("Hex:", hex);

    // Convert hex back to JSON
    const parsedJson = abieos.hexToJson(contractName, "transfer", hex);
    console.log("Parsed JSON:", parsedJson);
}

main().catch(console.error);
