import assert from 'node:assert/strict';
import test from 'node:test';
import { Abieos } from '../dist/abieos.js';

test.describe('Singleton Pattern', () => {

    test('getInstance returns the same instance', () => {
        const instance1 = Abieos.getInstance();
        const instance2 = Abieos.getInstance();
        assert.strictEqual(instance1, instance2);
    });

    test('constructor throws error when called directly', () => {
        assert.throws(() => new Abieos(), {
            message: /Singleton class/
        });
    });
    
});