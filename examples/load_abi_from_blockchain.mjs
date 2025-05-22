import { Abieos } from "@eosrio/node-abieos";

// Create an instance of Abieos
const abieos = Abieos.getInstance();

// Fetch the ABI from the blockchain API
async function fetchAbi(contractName) {
    const response = await fetch("https://api.eosrio.io/v1/chain/get_abi", {
        method: "POST",
        body: JSON.stringify({ account_name: contractName }),
        headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();
    return data.abi;
}

// Load the ABI for the contract
async function loadAbiFromBlockchain(contractName) {
    const abi = await fetchAbi(contractName);
    abieos.loadAbi(contractName, abi);
}

// Define the JSON data to be converted
const json = {
    user: "john",
    action: "buy",
    amount: "100.0000 EOS"
};

// Main function to demonstrate the usage
async function main() {
    const contractName = "eosio.token";
    await loadAbiFromBlockchain(contractName);

    // Convert JSON to hex
    const hex = abieos.jsonToHex(contractName, "transfer", json);
    console.log("Hex:", hex);

    // Convert hex back to JSON
    const parsedJson = abieos.hexToJson(contractName, "transfer", hex);
    console.log("Parsed JSON:", parsedJson);
}

main().catch(console.error);
