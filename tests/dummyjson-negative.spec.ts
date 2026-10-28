import { test, expect } from '@playwright/test';
import { z } from 'zod';
import { ApiClient } from '../src/client/ApiClient';
import { urls } from '../src/data/config';
import { DummyJsonService } from '../src/services/DummyJsonService';
import { missingResources, outOfRangeOffsets, productExistenceCases } from '../src/data/paginationCases';
import { dummyProducts, productIdentity } from '../src/schemas/responseSchemas';

const missingResourceError = z.object({ message: z.string().min(1) });


test.describe('DummyJSON negative contracts and boundary values', () => {
  let api: ApiClient;
  let service: DummyJsonService;

  test.beforeEach(({ request }) => {
    api = new ApiClient(request, urls.dummy);
    service = new DummyJsonService(api);
  });

  for (const { resource, path } of missingResources) {
    test(`${resource}: nonexistent ID returns a consistent error shape`, async () => {
      const response = await test.step(`Request nonexistent ${resource}`, () => api.send('GET', path));
      await test.step('Check 404 and the shared error contract', async () => {
        expect(response.status()).toBe(404);
        missingResourceError.parse(await response.json());
      });
    });
  }

  for (const offset of outOfRangeOffsets) {
    test(`skip beyond available products by ${offset} returns an empty page`, async () => {
      const firstPage = await test.step('Read the current total product count', () => service.products(1, 0));
      expect(firstPage.status()).toBe(200);
      const { total } = dummyProducts.parse(await firstPage.json());
      expect(Number.isInteger(total)).toBe(true);
      expect(total).toBeGreaterThan(0);

      const requestedSkip = total + offset;
      const response = await test.step(`Request products with skip=${requestedSkip}`, () =>
        service.products(5, requestedSkip),
      );
      expect(response.status()).toBe(200);
      const body = dummyProducts.parse(await response.json());
      expect(body.skip).toBe(requestedSkip);
      expect(body.products).toEqual([]);
    });
  }

  for (const { id, status } of productExistenceCases) {
    test(`product ID boundary ${id}: resource existence is handled`, async () => {
      const response = await service.product(id);
      expect(response.status()).toBe(status);
      if (id === 1) {
        const body = productIdentity.parse(await response.json());
        expect(body.id).toBe(id);
      } else {
        missingResourceError.parse(await response.json());
      }
    });
  }
});
