import test from 'node:test';
import assert from 'node:assert/strict';
import { assertThrows, setupAbieos } from './test-helpers.js';

test.describe('Type Conversion (getType)', () => {
    let abieos;

    // Constants specific to this test suite
    const contractAccount = "test.types";
    const typesABI = {
        version: "eosio::abi/1.1",
        types: [
            { new_type_name: "my_custom_name", type: "name" },
            { new_type_name: "my_asset_type", type: "asset" }
        ],
        structs: [{
            name: "data_struct",
            base: "",
            fields: [
                { name: "user", type: "my_custom_name" },
                { name: "balance", type: "my_asset_type" },
                { name: "id", type: "uint64" }
            ]
        }],
        actions: [{ name: "logdata", type: "data_struct", ricardian_contract: "" }],
    };

    test.beforeEach(() => {
        abieos = setupAbieos();
        // Suite-specific setup: load the ABI needed for these tests
        abieos.loadAbi(contractAccount, typesABI);
    });

    test('should get the string representation of a base type', () => {
        const typeStr = abieos.getType(contractAccount, "uint64");
        assert.strictEqual(typeStr, "uint64", 'Should return "uint64" for uint64 type');
    });

    test('should get the string representation of a custom type (typedef)', () => {
        // This test relies on the mock behavior in setupAbieos for "my_custom_name"
        const typeStr = abieos.getType(contractAccount, "my_custom_name");
        assert.strictEqual(typeStr, "name", 'Should resolve typedef my_custom_name to name');
    });

    test('should get the string representation of a struct type', () => {
        // This test relies on the default behavior in setupAbieos for unknown types (returns typeName)
        const typeStr = abieos.getType(contractAccount, "data_struct");
        assert.strictEqual(typeStr, "data_struct", 'Should return "data_struct" for data_struct type');
    });

    test('should throw if ABI for contract is not loaded for getType', () => {
        // setupAbieos provides a clean instance, "unknown.contract" will not be loaded.
        assert.throws(
            () => abieos.getType("unknown.contract", "uint64"),
            (err) => /ABI for contract unknown.contract not found/i.test(err.message),
            'Should throw for contract not loaded'
        );
    });

    test('should throw if type is not found in ABI for getType', () => {
        // This test relies on the mock behavior in setupAbieos for "non_existent_type"
        assert.throws(
            () => abieos.getType(contractAccount, "non_existent_type"),
            (err) => /Type non_existent_type not found/i.test(err.message),
            'Should throw for type not found'
        );
    });
});
