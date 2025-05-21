import test from 'node:test';
import assert from 'node:assert/strict';
import { assertThrows, setupAbieos } from './test-helpers.js';

test.describe('ABI Management', () => {
    let abieos;

    test.beforeEach(() => {
        abieos = setupAbieos();
    });

    // Note: The inner 'test.describe' from the original file becomes the main content here.
    // Constants like simpleABI and contractAccount are relevant to these tests.
    const simpleABI = {
        version: "eosio::abi/1.1",
        types: [{ new_type_name: "account_name", type: "name" }],
        structs: [{
            name: "transfer",
            base: "",
            fields: [
                { name: "from", type: "account_name" },
                { name: "to", type: "account_name" },
                { name: "quantity", type: "asset" },
                { name: "memo", type: "string" }
            ]
        }],
        actions: [{ name: "transfer", type: "transfer", ricardian_contract: "" }],
        tables: [],
        variants: [],
        abi_extensions: [],
    };
    const contractAccount = "eosio.token";

    test('should load an ABI for a contract', () => {
        const result = abieos.loadAbi(contractAccount, simpleABI);
        assert.ok(result, 'loadAbi should return true on success');
        const loadedAbis = abieos.getLoadedAbis();
        assert.ok(loadedAbis.includes(contractAccount), 'Contract ABI should be in loaded ABIs');
    });

    test('should return false when loading an already loaded ABI for the same contract', () => {
        abieos.loadAbi(contractAccount, simpleABI); // First load
        const result = abieos.loadAbi(contractAccount, simpleABI); // Attempt to load again
        assert.strictEqual(result, false, 'loadAbi should return false for an already loaded ABI');
    });

    test('should throw an error when loading an invalid ABI structure (e.g. non-object ABI)', () => {
        assertThrows(
            () => abieos.loadAbi("testcontract", "not an object"),
            (err) => {
                return /Failed to load ABI|Invalid ABI format/i.test(err.message);
            },
            'Should throw for invalid ABI structure'
        );
    });

    test('should throw an error when loading an ABI with invalid fields (e.g. structs not an array)', () => {
        const invalidABI = { version: "eosio::abi/1.1", structs: "not an array" };
        assertThrows(
            () => abieos.loadAbi("testcontract.invalid", invalidABI),
            /Failed to load ABI|Invalid ABI structure/i,
            'Should throw for ABI with invalid field types'
        );
    });

    test('should get all loaded ABIs', () => {
        abieos.loadAbi(contractAccount, simpleABI);
        const anotherAbi = {
            version: "eosio::abi/1.1",
            types: [],
            structs: [{
                name: "transfer", // Changed name to avoid conflict if ABI content matters for loading
                base: "",
                fields: [
                    { name: "from", type: "name" },
                    { name: "to", type: "name" },
                    { name: "amount", type: "asset" },
                    { name: "memo", type: "string" }
                ]
            }],
            actions: [{ name: "testaction", type: "transfer", ricardian_contract: "" }],
            tables: [], variants: [], abi_extensions: [],
        };
        abieos.loadAbi("another.acc", anotherAbi);
        const loadedAbis = abieos.getLoadedAbis();
        assert.deepStrictEqual(loadedAbis.sort(), [contractAccount, "another.acc"].sort(), 'getLoadedAbis should return all loaded contract names');
    });

    test('should clear all loaded ABIs', () => {
        abieos.loadAbi(contractAccount, simpleABI);
        abieos.clearLoadedAbis();
        const loadedAbis = abieos.getLoadedAbis();
        assert.strictEqual(loadedAbis.length, 0, 'clearLoadedAbis should remove all ABIs');
    });
});
