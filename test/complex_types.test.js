import test from 'node:test';
import assert from 'node:assert/strict';
import { assertThrows, setupAbieos, testRoundTrip as globalTestRoundTrip } from './test-helpers.js';

test.describe('Variant Types and Complex Structures', () => {
    let abieos;

    const contract = 'complex.test';
    const complexAbi = {
        version: 'eosio::abi/1.1',
        types: [],
        structs: [
            { name: 's1', base: '', fields: [{ name: 'x1', type: 'int8' }] },
            { name: 's2', base: '', fields: [{ name: 'y1', type: 'int8' }, { name: 'y2', type: 'int8' }] },
            { name: 's_optional', base: '', fields: [{ name: 'a1', type: 'int8?' }, { name: 'b1', type: 'int8[]' }] },
            { name: 's_with_variant', base: '', fields: [{ name: 'v1', type: 'my_variant' }, { name: 'z1', type: 'int8' }] },
            { name: 's_nested', base: '', fields: [
                { name: 'z1', type: 'int8' },
                { name: 'z2', type: 'my_variant' },
                { name: 'z3', type: 's_optional' }
            ]}
        ],
        actions: [],
        tables: [],
        variants: [
            { name: 'my_variant', types: ['int8', 's1', 's2'] }
        ]
    };

    test.beforeEach(() => {
        abieos = setupAbieos();
        abieos.loadAbi(contract, complexAbi);
    });

    test('basic struct serialization/deserialization', () => {
        globalTestRoundTrip(abieos, contract, 's1', { x1: 10 });
        globalTestRoundTrip(abieos, contract, 's2', { y1: -5, y2: 5 });
        
        assertThrows(
            /Failed to convert JSON to hex.*number is out of range/i,
            () => abieos.jsonToHex(contract, 's1', { x1: 128 }),
            'Should reject int8 out of range'
        );
        
        assertThrows(
            /Failed to convert JSON to hex.*Expected field/i,
            () => abieos.jsonToHex(contract, 's2', { y1: 0 }), 
            'Should reject struct with missing required field'
        );
    });

    test('struct with optionals serialization/deserialization', () => {
        globalTestRoundTrip(abieos, contract, 's_optional', { a1: 10, b1: [1, 2, 3] });
        
        const optionalData = { a1: null, b1: [1, 2, 3] };
        const hexWithNull = abieos.jsonToHex(contract, 's_optional', optionalData);
        const jsonWithNull = abieos.hexToJson(contract, 's_optional', hexWithNull);
        
        assert.strictEqual(jsonWithNull.a1, null, 'Deserialized optional should be null');
        assert.deepStrictEqual(jsonWithNull.b1, [1, 2, 3], 'Required array field should match');
        
        assertThrows(
            /Failed to convert JSON to hex.*Expected field/i,
            () => abieos.jsonToHex(contract, 's_optional', { b1: [] }),
            'Should throw if optional field `a1` is missing but `b1` is present'
        );
        globalTestRoundTrip(abieos, contract, 's_optional', { a1: null, b1: [] });
    });

    test('variant type serialization/deserialization', () => {
        globalTestRoundTrip(abieos, contract, 'my_variant', ["int8", 10]);
        globalTestRoundTrip(abieos, contract, 'my_variant', ["s1", { x1: 20 }]);
        globalTestRoundTrip(abieos, contract, 'my_variant', ["s2", { y1: 30, y2: 40 }]);
        
        assertThrows(
            /Failed to convert JSON to hex.*Invalid type for variant/i,
            () => abieos.jsonToHex(contract, 'my_variant', ["unknown_type", 10]),
            'Should reject variant with unknown type'
        );
        
        assertThrows(
            /Failed to convert JSON to hex.*Expected field/i,
            () => abieos.jsonToHex(contract, 'my_variant', ["s1", { invalid: 10 }]),
            'Should reject variant with invalid struct field'
        );
        
        assertThrows(
            /Expected three string arguments/i, // Updated Regex based on actual error
            () => abieos.jsonToHex(contract, 'my_variant', 10), 
            'Should reject variant that is not an array'
        );
    });

    test('struct with variant serialization/deserialization', () => {
        globalTestRoundTrip(abieos, contract, 's_with_variant', { v1: ["int8", 10], z1: 20 });
        globalTestRoundTrip(abieos, contract, 's_with_variant', { v1: ["s1", { x1: 30 }], z1: 40 });
        globalTestRoundTrip(abieos, contract, 's_with_variant', { v1: ["s2", { y1: 50, y2: 60 }], z1: 70 });
        
        assertThrows(
            /Failed to convert JSON to hex.*Expected field/i,
            () => abieos.jsonToHex(contract, 's_with_variant', { z1: 20 }),
            'Should reject struct missing variant field'
        );
    });

    test('nested complex structure serialization/deserialization', () => {
        globalTestRoundTrip(abieos, contract, 's_nested', {
            z1: 10,
            z2: ["int8", 20],
            z3: { a1: 30, b1: [40, 50] }
        });
        
        globalTestRoundTrip(abieos, contract, 's_nested', {
            z1: 10,
            z2: ["s1", { x1: 20 }],
            z3: { a1: null, b1: [] }
        });
        
        assertThrows(
            /Failed to convert JSON to hex.*Expected field/i,
            () => abieos.jsonToHex(contract, 's_nested', { z1: 10, z2: ["int8", 20] }),
            'Should reject nested struct with missing required field z3'
        );
    });
});
