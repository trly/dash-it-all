import { describe, it, expect } from 'bun:test';
import { VdirParser } from './vdir-parser';

describe('vdir-parser', () => {
	it('should be defined', () => {
		expect(VdirParser).toBeDefined();
		expect(VdirParser.parseFile).toBeDefined();
		expect(VdirParser.isValidVdirItem).toBeDefined();
	});

	it('should validate vdir items', () => {
		expect(typeof VdirParser.isValidVdirItem).toBe('function');
	});
});
