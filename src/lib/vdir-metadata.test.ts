import { describe, it, expect } from 'bun:test';
import { readVdirMetadata } from './vdir-metadata';

describe('vdir-metadata', () => {
	it('should be defined', () => {
		expect(readVdirMetadata).toBeDefined();
		expect(typeof readVdirMetadata).toBe('function');
	});
});
