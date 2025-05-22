import assert from 'node:assert/strict';
import test from 'node:test';
import { Abieos } from '../dist/abieos.js';
import { assertThrows } from './utils/test-helpers.js';

test.describe('Serialization (jsonToHex)', () => {
    const abieos = Abieos.getInstance();

    const contractAccount = "test.token";
    const transferABI = {
        version: "eosio::abi/1.1",
        types: [],
        structs: [{
            name: "transfer",
            base: "",
            fields: [
                { name: "from", type: "name" },
                { name: "to", type: "name" },
                { name: "quantity", type: "asset" },
                { name: "memo", type: "string" }
            ]
        }],
        actions: [{ name: "transfer", type: "transfer", ricardian_contract: "" }],
    };

    Abieos.debug = true;
    abieos.cleanup();
    abieos.loadAbi(contractAccount, transferABI);


    test('should serialize valid transfer action data', () => {
        const actionData = {
            from: "alice",
            to: "bob",
            quantity: "1.0000 EOS",
            memo: "test transfer"
        };
        const hex = abieos.jsonToHex(contractAccount, "transfer", actionData);
        assert.ok(typeof hex === 'string' && hex.length > 0, 'Should return a non-empty hex string');
    });

    test('should throw if ABI for contract is not loaded', () => {
        const actionData = { from: "a", to: "b", quantity: "1.0 EOS", memo: "m" };
        assertThrows(
            /failed to parse data/i,
            () => abieos.jsonToHex("unknown.contract", "transfer", actionData),
            'Should throw if ABI is not loaded'
        );
    });

    test('should throw if type is not found in ABI', () => {
        const actionData = { from: "a", to: "b", quantity: "1.0 EOS", memo: "m" };
        assertThrows(
            /failed to parse data/i,
            () => abieos.jsonToHex(contractAccount, "unknown_type", actionData),
            'Should throw if type is not found'
        );
    });

    test('should throw for data with missing required fields', () => {
        const actionData = {
            from: "alice",
            quantity: "1.0000 EOS",
            memo: "test transfer"
        };
        assertThrows(
            /failed to parse data/i,
            () => abieos.jsonToHex(contractAccount, "transfer", actionData),
            'Should throw for missing required fields'
        );
    });

    test('should throw for data with incorrect types', () => {
        const actionData = {
            from: "alice",
            to: "bob",
            quantity: 12345,
            memo: "test transfer"
        };
        assertThrows(
            /failed to parse data/i,
            () => abieos.jsonToHex(contractAccount, "transfer", actionData),
            'Should throw for incorrect data types'
        );
    });
});
