import { describe, it, expect } from 'bun:test';
import type { Config } from './types';

describe('config types', () => {
	it('should define Config interface correctly', () => {
		const mockConfig: Config = {
			collections: [],
			plugins: []
		};

		expect(mockConfig).toBeDefined();
		expect(Array.isArray(mockConfig.collections)).toBe(true);
		expect(Array.isArray(mockConfig.plugins)).toBe(true);
	});
});
