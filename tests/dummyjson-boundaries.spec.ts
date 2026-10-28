import { test, expect } from '@playwright/test';
import { ApiClient } from '../src/client/ApiClient';
import { DummyJsonService } from '../src/services/DummyJsonService';
import { urls } from '../src/data/config';
import { validLimits, validSkips, missingUserIds } from '../src/data/paginationCases';
import { dummyProducts, cartList, userIdentity } from '../src/schemas/responseSchemas';

test.describe('DummyJSON valid pagination edges and missing resources', () => {
  let service: DummyJsonService;
  test.beforeEach(({ request }) => {
    service = new DummyJsonService(new ApiClient(request, urls.dummy));
  });

  for (const limit of validLimits) {
    test(`products valid limit ${limit}`, async () => {
      const response = await service.products(limit, 0);
      expect(response.status()).toBe(200);
      const body = dummyProducts.parse(await response.json());
      expect(body.limit).toBe(limit);
      expect(body.products.length).toBeLessThanOrEqual(limit);
    });
  }

  for (const skip of validSkips) {
    test(`products valid skip ${skip}`, async () => {
      const response = await service.products(5, skip);
      expect(response.status()).toBe(200);
      const body = dummyProducts.parse(await response.json());
      expect(body.skip).toBe(skip);
      expect(body.products.length).toBeLessThanOrEqual(5);
    });
  }

  for (const id of missingUserIds) {
    test(`missing user ${id} returns 404`, async () => {
      const response = await service.user(id);
      expect(response.status()).toBe(404);
    });
  }

  test('cart links to a real user', async () => {
    const cart = await test.step('Read a cart from the collection', async () => {
      const response = await service.carts();
      expect(response.status()).toBe(200);
      const body = cartList.parse(await response.json());
      expect(body.carts.length).toBeGreaterThan(0);
      return body.carts[0];
    });

    await test.step('Verify the cart owner exists', async () => {
      const user = await service.user(cart.userId);
      expect(user.status()).toBe(200);
      expect(userIdentity.parse(await user.json()).id).toBe(cart.userId);
    });
  });
});
