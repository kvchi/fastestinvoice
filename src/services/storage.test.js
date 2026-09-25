import { beforeEach, describe, expect, it } from 'vitest';
import { readStoredJson, writeStoredJson } from './storage.js';

describe('storage service', () => {
  beforeEach(() => window.localStorage.clear());

  it('falls back safely when stored JSON is corrupt', () => {
    window.localStorage.setItem('broken', '{not json');
    expect(readStoredJson('broken', { safe: true })).toEqual({ safe: true });
  });

  it('round trips JSON values', () => {
    expect(writeStoredJson('item', { value: 4 })).toBe(true);
    expect(readStoredJson('item', null)).toEqual({ value: 4 });
  });
});
