import test from 'node:test';
import assert from 'node:assert/strict';
import { assertThrows, setupAbieos, testRoundTrip as globalTestRoundTrip } from './test-helpers.js';

test.describe('Type Testing - Basic Types', () => {
    let abieos;

    const contract = 'types.test';
    const basicTypesAbi = {
        version: 'eosio::abi/1.1',
        types: [],
        structs: [
            { name: 'bool_type', base: '', fields: [{ name: 'value', type: 'bool' }] },
            { name: 'int8_type', base: '', fields: [{ name: 'value', type: 'int8' }] },
            { name: 'int16_type', base: '', fields: [{ name: 'value', type: 'int16' }] },
            { name: 'int32_type', base: '', fields: [{ name: 'value', type: 'int32' }] },
            { name: 'int64_type', base: '', fields: [{ name: 'value', type: 'int64' }] },
            { name: 'uint8_type', base: '', fields: [{ name: 'value', type: 'uint8' }] },
            { name: 'uint16_type', base: '', fields: [{ name: 'value', type: 'uint16' }] },
            { name: 'uint32_type', base: '', fields: [{ name: 'value', type: 'uint32' }] },
            { name: 'uint64_type', base: '', fields: [{ name: 'value', type: 'uint64' }] },
            { name: 'float32_type', base: '', fields: [{ name: 'value', type: 'float32' }] },
            { name: 'float64_type', base: '', fields: [{ name: 'value', type: 'float64' }] },
            { name: 'array_type', base: '', fields: [{ name: 'values', type: 'uint8[]' }] },
            { name: 'optional_type', base: '', fields: [{ name: 'value', type: 'string?' }] }
        ],
        actions: [],
        tables: [],
        variants: []
    };

    test.beforeEach(() => {
        abieos = setupAbieos();
        abieos.loadAbi(contract, basicTypesAbi);
    });

    test('boolean type serialization/deserialization', () => {
        globalTestRoundTrip(abieos, contract, 'bool_type', { value: true });
        globalTestRoundTrip(abieos, contract, 'bool_type', { value: false });
        
        assertThrows(
            /failed to parse data/, 
            () => abieos.jsonToHex(contract, 'bool_type', { value: 'true' }),
            'Should reject string "true" as a boolean'
        );
        
        assertThrows(
            /failed to parse data/,
            () => abieos.jsonToHex(contract, 'bool_type', { value: 1 }),
            'Should reject number as a boolean'
        );
    });

    test('int8 type serialization/deserialization', () => {
        globalTestRoundTrip(abieos, contract, 'int8_type', { value: -128 });
        globalTestRoundTrip(abieos, contract, 'int8_type', { value: 0 });
        globalTestRoundTrip(abieos, contract, 'int8_type', { value: 127 });
        
        assertThrows(
            /failed to parse data/,
            () => abieos.jsonToHex(contract, 'int8_type', { value: -129 }),
            'Should reject value below int8 min'
        );
        
        assertThrows(
            /failed to parse data/,
            () => abieos.jsonToHex(contract, 'int8_type', { value: 128 }),
            'Should reject value above int8 max'
        );
    });

    test('uint8 type serialization/deserialization', () => {
        globalTestRoundTrip(abieos, contract, 'uint8_type', { value: 0 });
        globalTestRoundTrip(abieos, contract, 'uint8_type', { value: 255 });
        
        assertThrows(
            /failed to parse data/,
            () => abieos.jsonToHex(contract, 'uint8_type', { value: -1 }),
            'Should reject negative value for uint8'
        );
        
        assertThrows(
            /failed to parse data/,
            () => abieos.jsonToHex(contract, 'uint8_type', { value: 256 }),
            'Should reject value above uint8 max'
        );
    });

    test('int64 type serialization/deserialization', () => {
        globalTestRoundTrip(abieos, contract, 'int64_type', { value: "-9223372036854775808" });
        globalTestRoundTrip(abieos, contract, 'int64_type', { value: "0" });
        globalTestRoundTrip(abieos, contract, 'int64_type', { value: "9223372036854775807" });
        
        assertThrows(
            /failed to parse data/,
            () => abieos.jsonToHex(contract, 'int64_type', { value: "-9223372036854775809" }),
            'Should reject value below int64 min'
        );
        
        assertThrows(
            /failed to parse data/,
            () => abieos.jsonToHex(contract, 'int64_type', { value: "9223372036854775808" }),
            'Should reject value above int64 max'
        );
    });

    test('uint64 type serialization/deserialization', () => {
        globalTestRoundTrip(abieos, contract, 'uint64_type', { value: "0" });
        globalTestRoundTrip(abieos, contract, 'uint64_type', { value: "18446744073709551615" });
        
        assertThrows(
            /failed to parse data/,
            () => abieos.jsonToHex(contract, 'uint64_type', { value: "-1" }),
            'Should reject negative value for uint64'
        );
        
        assertThrows(
            /failed to parse data/,
            () => abieos.jsonToHex(contract, 'uint64_type', { value: "18446744073709551616" }),
            'Should reject value above uint64 max'
        );
    });

    test('float types serialization/deserialization', () => {
        const float32Data = { value: 1.1 };
        const float32Hex = abieos.jsonToHex(contract, 'float32_type', float32Data);
        const float32Result = abieos.hexToJson(contract, 'float32_type', float32Hex);
        assert.ok(Math.abs(float32Result.value - 1.1) < 0.00001, 'Float32 value should be approximately equal after roundtrip');
        
        globalTestRoundTrip(abieos, contract, 'float32_type', { value: 0.0 });
        globalTestRoundTrip(abieos, contract, 'float64_type', { value: 0.0 });
        globalTestRoundTrip(abieos, contract, 'float64_type', { value: 1.1 });
        globalTestRoundTrip(abieos, contract, 'float64_type', { value: -1.1 });
        
        assertThrows(
            /failed to parse data/,
            () => abieos.jsonToHex(contract, 'float32_type', { value: "not a number" }),
            'Should reject non-numeric string for float32'
        );
    });

    test('array type serialization/deserialization', () => {
        globalTestRoundTrip(abieos, contract, 'array_type', { values: [] });
        globalTestRoundTrip(abieos, contract, 'array_type', { values: [1, 2, 3] });
        globalTestRoundTrip(abieos, contract, 'array_type', { values: [0, 255] });
        
        assertThrows(
            /failed to parse data/,
            () => abieos.jsonToHex(contract, 'array_type', { values: ["not a number"] }),
            'Should reject non-numeric values in uint8 array'
        );
        
        assertThrows(
            /failed to parse data/,
            () => abieos.jsonToHex(contract, 'array_type', { values: [256] }),
            'Should reject values above uint8 max in array'
        );
    });

    test('optional type serialization/deserialization', () => {
        globalTestRoundTrip(abieos, contract, 'optional_type', { value: "test string" });
        globalTestRoundTrip(abieos, contract, 'optional_type', { value: null });
        
        const hexWithValue = abieos.jsonToHex(contract, 'optional_type', { value: "test string" });
        const hexWithNull = abieos.jsonToHex(contract, 'optional_type', { value: null });
        
        assert.notEqual(hexWithValue, hexWithNull, 'Hex with optional value should differ from hex with null');
        
        const jsonWithValue = abieos.hexToJson(contract, 'optional_type', hexWithValue);
        const jsonWithNull = abieos.hexToJson(contract, 'optional_type', hexWithNull);
        
        assert.strictEqual(jsonWithValue.value, "test string", 'Deserialized optional should preserve string value');
        assert.strictEqual(jsonWithNull.value, null, 'Deserialized optional should preserve null value');
    });
});
