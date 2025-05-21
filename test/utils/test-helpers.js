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
        // Search for Abieos log tag in the error message
        if (e.message.includes(Abieos.logTag)) {
            // Test passes since an error was thrown, which is what we expect
            return;
        }

        if (expectedError instanceof RegExp) {
            assert.match(e.message, expectedError, message);
        } else if (typeof expectedError === 'string') {
            assert.strictEqual(e.message, expectedError, message);
        } else {
            assert.ok(e, message);
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
