import assert from 'node:assert/strict';
import {Abieos} from '../../dist/abieos.js';

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
        if (!expectedError && e.message.includes(Abieos.logTag)) {
            // If no expected error is provided, but the error message contains the log tag,
            return;
        }
        if (expectedError instanceof RegExp) {
            assert.match(e.message, expectedError, message);
        } else if (typeof expectedError === 'string') {
            assert.strictEqual(e.message, expectedError, message);
        }
    }
}

/**
 * Helper function to test round-trip conversion.
 * Assumes abieos.jsonToHex handles JSON.stringify internally.
 * @param {Abieos} abieos - Abieos instance.
 * @param {string} contract - Contract name.
 * @param {string} type - Type name.
 * @param {Object} data - Data to convert (JavaScript object).
 * @returns {string} Hex representation of data.
 */
export function testRoundTrip(abieos, contract, type, data) {
    const hex = abieos.jsonToHex(contract, type, data);
    assert.ok(typeof hex === 'string' && hex.length > 0, `Serialization should produce hex for ${type}`);
    const roundTripped = abieos.hexToJson(contract, type, hex);
    assert.deepStrictEqual(roundTripped, data, `Round-trip conversion should preserve data for ${type}`);
    return hex;
}
