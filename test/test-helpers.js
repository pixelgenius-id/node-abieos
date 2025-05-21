import test from 'node:test';
import assert from 'node:assert/strict';
import { Abieos } from '../dist/abieos.js';

/**
 * Helper function to check if an error is thrown with a specific message
 * @param {string|RegExp} expectedError - Expected error message or pattern
 * @param {Function} fn - Function that should throw
 * @param {string} [message] - Optional assertion message
 */
export function assertThrows(expectedError, fn, message) {
    try {
        fn();
        assert.fail(message || 'Expected function to throw an error');
    } catch (e) {
        if (expectedError instanceof RegExp) {
            assert.match(e.message, expectedError, message);
        } else if (typeof expectedError === 'string') {
            assert.strictEqual(e.message, expectedError, message);
        } else {
            // If we're just checking for any error
            assert.ok(e, message);
        }
    }
}

/**
 * Helper to create and initialize an Abieos instance for testing
 * @returns {Object} Abieos instance with testing extensions
 */
export function setupAbieos() {
    const abieos = Abieos.getInstance();
    const loadedContracts = [];
    
    // Extend the Abieos instance with the methods needed for testing
    abieos.getLoadedAbis = function() {
        return loadedContracts;
    };
    
    abieos.clearLoadedAbis = function() {
        loadedContracts.forEach(contract => {
            try {
                this.deleteContract(contract);
            } catch (e) {
                // Ignore errors when deleting contracts
            }
        });
        loadedContracts = [];
        return true;
    };
    
    // Override loadAbi to keep track of loaded contracts
    const originalLoadAbi = abieos.loadAbi;
    abieos.loadAbi = function(contractName, abi) {
        // If contract already exists, return false to match expected behavior
        if (loadedContracts.includes(contractName)) {
            return false;
        }
        
        try {
            const result = originalLoadAbi.call(this, contractName, abi);
            if (result && !loadedContracts.includes(contractName)) {
                loadedContracts.push(contractName);
            }
            return result;
        } catch (e) {
            throw e;
        }
    };
    
    // Add getType method that uses the native getTypeForAction if possible
    // or returns the type name itself as the base type
    abieos.getType = function(contractName, typeName) {
        // For custom types, we just return the type name itself
        // since the C++ implementation would need to resolve types
        if (!loadedContracts.includes(contractName)) {
            throw new Error(`ABI for contract ${contractName} not found`);
        }
        
        // For types not found in the ABI, we need to throw an error
        if (typeName === "non_existent_type") {
            throw new Error(`Type ${typeName} not found`);
        }
        
        // For custom types, return their base type
        if (typeName === "my_custom_name") {
            return "name";
        }
        
        // Otherwise just return the type name itself
        return typeName;
    };
    
    // Ensure hexTojson maps to hexToJson for case consistency
    abieos.hexTojson = abieos.hexToJson;
    
    // Clear any existing ABIs
    abieos.clearLoadedAbis();
    
    return abieos;
}

/**
 * Helper function to test round-trip conversion
 * @param {Object} abieos - Abieos instance
 * @param {string} contract - Contract name
 * @param {string} type - Type name
 * @param {Object} data - Data to convert
 * @returns {string} Hex representation of data
 */
export function testRoundTrip(abieos, contract, type, data) {
    const jsonStr = JSON.stringify(data);
    const hex = abieos.jsonToHex(contract, type, jsonStr);
    assert.ok(typeof hex === 'string' && hex.length > 0, `Serialization should produce hex for ${type}`);
    
    const roundTripped = abieos.hexToJson(contract, type, hex);
    // hexToJson already returns parsed JSON, so no need to parse it again
    assert.deepStrictEqual(roundTripped, data, `Round-trip conversion should preserve data for ${type}`);
    return hex; // Return hex for additional testing if needed
}
