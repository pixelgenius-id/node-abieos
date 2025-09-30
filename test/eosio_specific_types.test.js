import assert from 'node:assert/strict';
import test from 'node:test';
import { Abieos } from '../dist/abieos.js';
import { assertThrows, testRoundTrip as globalTestRoundTrip } from './utils/test-helpers.js';

test.describe('VEXANIUM Specific Types', () => {
    const abieos = Abieos.getInstance();

    const contract = 'eosio.types';
    const eosioTypesAbi = {
        version: 'eosio::abi/1.1',
        types: [],
        structs: [
            { name: 'name_type', base: '', fields: [{ name: 'value', type: 'name' }] },
            { name: 'asset_type', base: '', fields: [{ name: 'value', type: 'asset' }] },
            { name: 'symbol_type', base: '', fields: [{ name: 'value', type: 'symbol' }] },
            { name: 'symbol_code_type', base: '', fields: [{ name: 'value', type: 'symbol_code' }] },
            {
                name: 'checksum_types', base: '', fields: [
                    { name: 'hash160', type: 'checksum160' },
                    { name: 'hash256', type: 'checksum256' },
                    { name: 'hash512', type: 'checksum512' }
                ]
            },
            { name: 'public_key_type', base: '', fields: [{ name: 'value', type: 'public_key' }] },
            {
                name: 'time_types', base: '', fields: [
                    { name: 'time_point', type: 'time_point' },
                    { name: 'time_point_sec', type: 'time_point_sec' },
                    { name: 'block_timestamp', type: 'block_timestamp_type' }
                ]
            }
        ],
        actions: [],
        tables: [],
        variants: []
    };


    Abieos.debug = true;
    abieos.cleanup();
    abieos.loadAbi(contract, eosioTypesAbi);

    test('simple stringToName conversion', () => {
        const nameValue = abieos.stringToName("vex.token");
        assert.ok(typeof nameValue === 'bigint', 'stringToName should return a BigInt');
    });

    test('stringToName conversion with invalid name', () => {
        assertThrows(
            /Failed to convert string to name./i,
            () => abieos.stringToName(null),
            'Should throw for invalid name format'
        );
    });

    test('name type serialization/deserialization', () => {
        globalTestRoundTrip(abieos, contract, 'name_type', { value: "vexcore" });
        globalTestRoundTrip(abieos, contract, 'name_type', { value: "vex.token" });
        globalTestRoundTrip(abieos, contract, 'name_type', { value: "vex.null" });
        globalTestRoundTrip(abieos, contract, 'name_type', { value: "" });
        globalTestRoundTrip(abieos, contract, 'name_type', { value: "a" });
        globalTestRoundTrip(abieos, contract, 'name_type', { value: "zzzzzzzzzzzzj" });
    });

    test('asset type serialization/deserialization', () => {
        globalTestRoundTrip(abieos, contract, 'asset_type', { value: "1.0000 VEX" });
        globalTestRoundTrip(abieos, contract, 'asset_type', { value: "0.0000 VEX" });
        globalTestRoundTrip(abieos, contract, 'asset_type', { value: "-1.0000 VEX" });
        globalTestRoundTrip(abieos, contract, 'asset_type', { value: "1000000000.0000 VEX" });
    });

    test('time types serialization/deserialization', () => {
        // For time_point_sec, the library seems to consistently return .000, so tests should expect that.
        globalTestRoundTrip(abieos, contract, 'time_types', {
            time_point: "1970-01-01T00:00:00.000",
            time_point_sec: "1970-01-01T00:00:00.000", // Adjusted to expect .000
            block_timestamp: "2000-01-01T00:00:00.000" // Assuming block_timestamp (slot based) also aligns to .000 in this test case
        });

        globalTestRoundTrip(abieos, contract, 'time_types', {
            time_point: "2023-05-21T12:34:56.789",
            time_point_sec: "2023-05-21T12:34:56.000", // Adjusted to expect .000
            block_timestamp: "2023-05-21T12:34:56.500"
        });

        assertThrows(
            /Expected time point/i,
            () => abieos.jsonToHex(contract, 'time_types', {
                time_point: "invalid time",
                time_point_sec: "2023-05-21T12:34:56.000",
                block_timestamp: "2023-05-21T12:34:56.500"
            }),
            'Should reject invalid time_point format'
        );
    });

    test('public key serialization/deserialization', () => {
        const eosKey = "VEX6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV";
        const data = { value: eosKey };

        const hex = abieos.jsonToHex(contract, 'public_key_type', data);
        const result = abieos.hexToJson(contract, 'public_key_type', hex);

        let isValidFormat = result.value.startsWith('PUB_K1_') || result.value.startsWith('VEX');
        if (eosKey.startsWith('PUB_K1_')) {
            isValidFormat = result.value.startsWith('PUB_K1_');
        }
        assert.ok(isValidFormat, `Returned key ${result.value} should be in a valid format`);

        assertThrows(
            /Expected public key/i,
            () => abieos.jsonToHex(contract, 'public_key_type', { value: "invalid key" }),
            'Should reject invalid public key format'
        );

        assertThrows(
            /Failed to convert JSON to hex.*Expected key/i,
            () => abieos.jsonToHex(contract, 'public_key_type', { value: "VEX6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CZ" }),
            'Should reject public key with invalid checksum'
        );
    });
});
