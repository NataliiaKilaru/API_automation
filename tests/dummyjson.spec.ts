import { test, expect } from '@playwright/test';
import { ApiClient } from '../src/client/ApiClient';
import { DummyJsonService } from '../src/services/DummyJsonService';
import {
  cart as cartSchema,
  cartList,
  dummyProducts,
  dummyUsers,
  productIdentity,
  userIdentity,
} from '../src/schemas/responseSchemas';
import { urls } from '../src/data/config';
import { paginationCases } from '../src/data/paginationCases';

test.describe('DummyJSON resources and data-driven coverage', () => {
  let service: DummyJsonService;
  test.beforeEach(({ request }) => { service = new DummyJsonService(new ApiClient(request, urls.dummy)); });

  test('products schema and pagination @smoke', async () => {
    const response = await service.products(5, 0);
    expect(response.status()).toBe(200);
    const body = dummyProducts.parse(await response.json());
    expect(body.total).toBeGreaterThan(0);
    expect(body.products.length).toBe(5);
    expect(body.skip).toBe(0);
  });

  for (const { limit, skip } of paginationCases) {
    test(`pagination limit=${limit} skip=${skip}`, async () => {
      const response = await service.products(limit, skip);
      expect(response.status()).toBe(200);
      const body = dummyProducts.parse(await response.json());
      expect(body.limit).toBe(limit);
      expect(body.skip).toBe(skip);
      expect(body.products.length).toBeLessThanOrEqual(limit);
      expect(body.products.every(product =>
        typeof product.id === 'number' && typeof product.title === 'string'
      )).toBe(true);
    });
  }

  test('single product matches list product', async () => {
    const first = await test.step('Read the first product from the list', async () => {
      const list = await service.products(1);
      expect(list.status()).toBe(200);
      return dummyProducts.parse(await list.json()).products[0];
    });

    await test.step('Verify product details match the list entry', async () => {
      const response = await service.product(first.id);
      expect(response.status()).toBe(200);
      expect(productIdentity.parse(await response.json()).title).toBe(first.title);
    });
  });

  test('nonexistent product returns 404', async () => {
    expect((await service.product(999999)).status()).toBe(404);
  });

  test('search results contain requested term', async () => {
    const response = await service.search('phone');
    expect(response.status()).toBe(200);
    const body = await response.json();
    const parsedBody = dummyProducts.parse(body);
    expect(parsedBody.products.length).toBeGreaterThan(0);
    expect(body.products.some((p: { title: string; description?: string }) =>
      `${p.title} ${p.description ?? ''}`.toLowerCase().includes('phone')
    )).toBe(true);
    expect(parsedBody.total).toBeGreaterThanOrEqual(parsedBody.products.length);
  });

  test('unknown search returns empty results', async () => {
    const response = await service.search('zzzznotarealproduct12345');
    expect(response.status()).toBe(200);
    expect(dummyProducts.parse(await response.json()).products).toEqual([]);
  });

  test('users response matches schema', async () => {
    const response = await service.users(5);
    expect(response.status()).toBe(200);
    dummyUsers.parse(await response.json());
  });

  test('user details correspond to list entry', async () => {
    const first = await test.step('Read the first user from the list', async () => {
      const list = await service.users(1);
      expect(list.status()).toBe(200);
      return dummyUsers.parse(await list.json()).users[0];
    });

    await test.step('Verify user details match the list entry', async () => {
      const response = await service.user(first.id);
      expect(response.status()).toBe(200);
      expect(userIdentity.parse(await response.json()).firstName).toBe(first.firstName);
    });
  });

  test('carts include product lines and user IDs', async () => {
    const response = await service.carts();
    expect(response.status()).toBe(200);
    const body = cartList.parse(await response.json());
    expect(body.carts.length).toBeGreaterThan(0);
    expect(body.carts.every(cart =>
      typeof cart.userId === 'number' && Array.isArray(cart.products)
    )).toBe(true);
  });

  test('cart details match cart listing', async () => {
    const first = await test.step('Read the first cart from the list', async () => {
      const list = await service.carts();
      expect(list.status()).toBe(200);
      return cartList.parse(await list.json()).carts[0];
    });

    await test.step('Verify cart details match the list entry', async () => {
      const response = await service.cart(first.id);
      expect(response.status()).toBe(200);
      expect(cartSchema.parse(await response.json()).userId).toBe(first.userId);
    });
  });
});
