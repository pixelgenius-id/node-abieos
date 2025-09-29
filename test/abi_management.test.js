import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { Abieos } from '../dist/abieos.js';
import { assertThrows } from './utils/test-helpers.js';

test.describe('ABI Management', () => {
    let abieos;

    Abieos.debug = true;

    test.beforeEach(() => {
        abieos = Abieos.getInstance();
        abieos.cleanup();
    });

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

    const path = join(import.meta.dirname, 'utils', 'eosio.token.raw');
    const rawAbi = readFileSync(path).toString();
    const eosioTokenAbiBuffer = Buffer.from(rawAbi, 'base64');

    test('should load an ABI for a contract', () => {
        const result = abieos.loadAbi(contractAccount, simpleABI);
        assert.ok(result, 'loadAbi should return true on success');
        const loadedAbis = abieos.getLoadedAbis();
        assert.ok(loadedAbis.includes(contractAccount), 'Contract ABI should be in loaded ABIs');
    });

    test('should be able load the ABI for a contract that was already loaded, updating it', () => {
        abieos.loadAbi(contractAccount, simpleABI);
        const result = abieos.loadAbi(contractAccount, simpleABI);
        assert.strictEqual(result, true, 'loadAbi should return true for an already loaded ABI');
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
            /Failed to load ABI|Invalid ABI structure/i,
            () => abieos.loadAbi("testcontract.invalid", invalidABI),
            'Should throw for ABI with invalid field types'
        );
    });

    test('should get all loaded ABIs', () => {
        abieos.loadAbi(contractAccount, simpleABI);
        const anotherAbi = {
            version: "eosio::abi/1.1",
            types: [],
            structs: [{
                name: "transfer",
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
        abieos.cleanup();
        const loadedAbis = abieos.getLoadedAbis();
        assert.strictEqual(loadedAbis.length, 0, 'clearLoadedAbis should remove all ABIs');
    });

    test('cleanup should throw if an invalid contract name is found in the contracts map', () => {
        abieos.loadAbi(contractAccount, simpleABI);
        // Simulate an invalid contract name by directly manipulating the loadedContracts map
        Abieos.loadedContracts.set(0, Date.now());
        assertThrows(
            /Errors during cleanup/i,
            () => abieos.cleanup(),
            'cleanup should throw for invalid contract names'
        );
        // Clean up the invalid contract name
        Abieos.loadedContracts.delete(0);
    });

    test('cleanup should not throw if no contract was loaded', () => {
        assert.doesNotThrow(() => {
            abieos.cleanup();
        }, 'cleanup should not throw if no contract was loaded');
    });

    test('loadAbi should throw if the abi data is not an object or string', () => {
        assertThrows(
            /ABI must be a String or Object/i,
            () => abieos.loadAbi(contractAccount, 123),
            'loadAbi should throw for non-object or non-string ABI data'
        );
    });

    test('loadAbiHex should throw if the abi data is not a hex string', () => {
        assertThrows(
            /expected hex string/i,
            () => abieos.loadAbiHex(contractAccount, "not a hex string"),
            'loadAbiHex should throw for non-hex string ABI data'
        );
    });

    test('loadAbiHex should throw if the ABI is not a string', () => {
        assertThrows(
            /ABI hex must be a String/i,
            () => abieos.loadAbiHex(contractAccount, 123),
            'loadAbiHex should throw for invalid ABI hex string'
        );
    });

    test('loadAbiHex should save the ABI in the loaded contracts map', () => {
        abieos.loadAbiHex(contractAccount, eosioTokenAbiBuffer.toString('hex'));
        const loadedAbis = abieos.getLoadedAbis();
        assert.ok(loadedAbis.includes(contractAccount), 'Contract ABI should be in loaded ABIs');
    });

    test('loadAbiHex should log when updating an already loaded contract', () => {
        const abiHex = eosioTokenAbiBuffer.toString('hex');
        const originalInfo = console.info;
        let infoCalled = false;
        console.info = () => {
            infoCalled = true;
        };
        try {
            abieos.loadAbiHex(contractAccount, abiHex);
            abieos.loadAbiHex(contractAccount, abiHex);
            assert.ok(infoCalled, 'Updating an already loaded ABI should log informational message');
        } finally {
            console.info = originalInfo;
        }
    });

    test('getTypeForAction should return the correct type for a given action', () => {
        abieos.loadAbi(contractAccount, simpleABI);
        const actionType = abieos.getTypeForAction(contractAccount, "transfer");
        assert.strictEqual(actionType, "transfer", 'getTypeForAction should return the correct type for the action');
    });

    test('getTypeForAction should throw if the action is not found in the ABI', () => {
        abieos.loadAbi(contractAccount, simpleABI);
        assertThrows(
            /Failed to get type for action/i,
            () => abieos.getTypeForAction(contractAccount, "non_existent_action"),
            'getTypeForAction should throw if action is not found'
        );
    });

    test('getTypeForTable should return the correct type for a given table', () => {
        abieos.loadAbiHex(contractAccount, eosioTokenAbiBuffer.toString('hex'));
        const tableType = abieos.getTypeForTable(contractAccount, "accounts");
        assert.strictEqual(tableType, "account", 'getTypeForTable should return the correct type for the table');
    });

    test('getTypeForTable should throw if the table is not found in the ABI', () => {
        abieos.loadAbiHex(contractAccount, eosioTokenAbiBuffer.toString('hex'));
        assertThrows(
            /Failed to get type for table/i,
            () => abieos.getTypeForTable(contractAccount, "non_existent_table"),
            'getTypeForTable should throw if table is not found'
        );
    });

    test('deleteContract should remove the contract from loaded contracts', () => {
        abieos.loadAbi(contractAccount, simpleABI);
        abieos.deleteContract(contractAccount);
        const loadedAbis = abieos.getLoadedAbis();
        assert.ok(!loadedAbis.includes(contractAccount), 'Contract ABI should be removed from loaded ABIs');
    });

    test('deleteContract should throw with invalid arguments', () => {
        assertThrows(
            /Expected one string argument/i,
            () => abieos.deleteContract(123),
            'deleteContract should throw for invalid contract name'
        );
    });

});
