import test from 'node:test';
import assert from 'node:assert/strict';
import { assertThrows, setupAbieos } from './test-helpers.js';

test.describe('Deserialization (hexTojson)', () => {
    let abieos;

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
    const transferActionData = {
        from: "alice",
        to: "bob",
        quantity: "1.0000 EOS",
        memo: "test transfer"
    };
    let validHex; 

    test.beforeEach(() => {
        abieos = setupAbieos();
        abieos.loadAbi(contractAccount, transferABI);
        validHex = abieos.jsonToHex(contractAccount, "transfer", transferActionData);
    });

    test('should deserialize valid hex data for transfer action', () => {
        const jsonData = abieos.hexTojson(contractAccount, "transfer", validHex);
        assert.deepStrictEqual(jsonData, transferActionData, 'Deserialized data should match original');
    });

    test('should throw if ABI for contract is not loaded during deserialization', () => {
        assert.throws(
            () => abieos.hexTojson("unknown.contract", "transfer", validHex),
            (err) => err.message.includes('binary decode error') || err.message.includes('failed to parse'),
            'Should throw if ABI is not loaded for deserialization'
        );
    });

    test('should throw if type is not found in ABI during deserialization', () => {
        assert.throws(
            () => abieos.hexTojson(contractAccount, "unknown_type", validHex),
            (err) => err.message.includes('Unknown type') || err.message.includes('failed to parse'),
            'Should throw if type is not found for deserialization'
        );
    });

    test('should throw for invalid hex string', () => {
        const invalidHex = "thisisnothex";
        assert.throws(
            () => abieos.hexTojson(contractAccount, "transfer", invalidHex),
            (err) => err.message.includes('expected hex string') || err.message.includes('failed to parse'),
            'Should throw for invalid hex string'
        );
    });

    test('should throw for hex string that does not conform to ABI type', () => {
        const shortHex = "1234"; 
        assert.throws(
            () => abieos.hexTojson(contractAccount, "transfer", shortHex),
            (err) => err.message.includes('Stream overrun') || err.message.includes('failed to parse'),
            'Should throw for malformed hex data'
        );
    });
});
