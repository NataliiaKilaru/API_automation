import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/client/ApiClient';
import { DummyJsonService } from '../../src/services/DummyJsonService';
import { dummyProducts } from '../../src/schemas/responseSchemas';
import { urls } from '../../src/data/config';

test.describe('DummyJSON pagination', () => {
  test('skip selects the next product page', async ({ request }) => {
    const service = new DummyJsonService(new ApiClient(request, urls.dummy));
    const firstResponse = await service.products(5, 0);
    const nextResponse = await service.products(5, 5);
    expect(firstResponse.status()).toBe(200);
    expect(nextResponse.status()).toBe(200);
    const first = dummyProducts.parse(await firstResponse.json());
    const next = dummyProducts.parse(await nextResponse.json());
    expect(first.total).toBe(next.total);
    expect(first.products).toHaveLength(5);
    expect(next.products).toHaveLength(5);
    expect(next.skip).toBe(5);
    expect(first.products.map(product => product.id)).not.toEqual(next.products.map(product => product.id));
    expect(new Set([...first.products, ...next.products].map(product => product.id)).size).toBe(10);
  });
});
