import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/client/ApiClient';
import { DemoQaService } from '../../src/services/DemoQaService';
import { urls } from '../../src/data/config';
import { demoQaError } from '../../src/schemas/responseSchemas';

test.describe('DemoQA registration validation', () => {
  let service: DemoQaService;
  test.beforeEach(({ request }) => {
    service = new DemoQaService(new ApiClient(request, urls.demoqa));
  });

  test('registration rejects an invalid password', async () => {
    const username = `qa_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const response = await service.register(username, 'short');
    expect(response.status()).toBe(400);
    const body = demoQaError.parse(await response.json());
    expect(body.message.length).toBeGreaterThan(0);
  });
});
