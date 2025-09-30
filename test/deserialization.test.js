import assert from 'node:assert/strict';
import test from 'node:test';
import { Abieos } from '../dist/abieos.js';

test.describe('Deserialization (hexTojson)', () => {
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
    const transferActionData = {
        from: "alice",
        to: "bob",
        quantity: "1.0000 VEX",
        memo: "test transfer"
    };
    let validHex;

    Abieos.debug = true;
    abieos.cleanup();
    abieos.loadAbi(contractAccount, transferABI);

    validHex = abieos.jsonToHex(contractAccount, "transfer", transferActionData);

    test('should deserialize valid hex data for transfer action', () => {
        const jsonData = abieos.hexToJson(contractAccount, "transfer", validHex);
        assert.deepStrictEqual(jsonData, transferActionData, 'Deserialized data should match original');
    });

    test('should throw if ABI for contract is not loaded during deserialization', () => {
        assert.throws(
            () => abieos.hexToJson("unknown.contract", "transfer", validHex),
            (err) => err.message.includes('binary decode error'),
            'Should throw if ABI is not loaded for deserialization'
        );
    });

    test('should throw if type is not found in ABI during deserialization', () => {
        assert.throws(
            () => abieos.hexToJson(contractAccount, "unknown_type", validHex),
            (err) => err.message.includes('Unknown type'),
            'Should throw if type is not found for deserialization'
        );
    });

    test('should throw for invalid hex string', () => {
        const invalidHex = "thisisnothex";
        assert.throws(
            () => abieos.hexToJson(contractAccount, "transfer", invalidHex),
            (err) => err.message.includes('expected hex string'),
            'Should throw for invalid hex string'
        );
    });

    test('should throw for hex string that does not conform to ABI type', () => {
        const shortHex = "1234";
        assert.throws(
            () => abieos.hexToJson(contractAccount, "transfer", shortHex),
            (err) => err.message.includes('Stream overrun'),
            'Should throw for malformed hex data'
        );
    });

    test('binToJson should throw for invalid hex string', () => {
        const invalidHex = "thisisnothex";
        assert.throws(
            () => abieos.binToJson(contractAccount, "transfer", invalidHex),
            (err) => err.message.includes('Expected two string arguments and one buffer'),
            'Should throw for invalid hex string'
        );
    });

    test('binToJson should throw for valid Buffer that does not conform to the type', () => {
        const shortHex = "1234";
        assert.throws(
            () => abieos.binToJson(contractAccount, "transfer", Buffer.from(shortHex, 'hex')),
            (err) => err.message.includes('Stream overrun'),
            'Should throw for malformed hex data'
        );
    });

    test('hexToJson should wrap parse errors from native response', () => {
        const originalHexToJson = Abieos.native.hex_to_json;
        Abieos.native.hex_to_json = () => '{invalid json';
        try {
            assert.throws(
                () => abieos.hexToJson(contractAccount, "transfer", validHex),
                (err) => err.message.includes('Failed to parse JSON string from hex'),
                'Should wrap JSON.parse errors when native returns invalid JSON'
            );
        } finally {
            Abieos.native.hex_to_json = originalHexToJson;
        }
    });

    test('binToJson should wrap parse errors from native response', () => {
        const originalBinToJson = Abieos.native.bin_to_json;
        Abieos.native.bin_to_json = () => '{invalid json';
        try {
            assert.throws(
                () => abieos.binToJson(contractAccount, "transfer", Buffer.from(validHex, 'hex')),
                (err) => err.message.includes('Failed to parse JSON string from binary'),
                'Should wrap JSON.parse errors when native returns invalid JSON'
            );
        } finally {
            Abieos.native.bin_to_json = originalBinToJson;
        }
    });

});
