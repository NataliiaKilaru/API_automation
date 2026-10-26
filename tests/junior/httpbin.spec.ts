import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/client/ApiClient';
import { HttpbinService } from '../../src/services/HttpbinService';
import { urls } from '../../src/data/config';
import { httpbinResponse } from '../../src/schemas/responseSchemas';

test.describe('HTTP mechanics', () => {
  let service: HttpbinService;
  test.beforeEach(({ request }) => { service = new HttpbinService(new ApiClient(request, urls.httpbin)); });

  test('GET returns query parameters', async () => {
    const response = await service.get({ name: 'Natalia' });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.args.name).toBe('Natalia');
    expect(httpbinResponse.safeParse(body).success).toBe(true);
  });

  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE'] as const) {
    test(`${method} echoes JSON request payload`, async () => {
      const payload = { title: 'API test', count: 2 };
      const response = await service.method(method, payload);
      expect(response.status()).toBe(200);
      expect((await response.json()).json).toEqual(payload);
    });
  }

  test('custom request header is returned', async () => {
    const response = await service.headers({ 'X-Test-Case': 'header-check' });
    expect(response.status()).toBe(200);
    expect((await response.json()).headers['X-Test-Case']).toBe('header-check');
  });

  for (const code of [201, 204, 400, 404, 500]) {
    test(`status endpoint responds ${code}`, async () => {
      expect((await service.status(code)).status()).toBe(code);
    });
  }

  test('special characters are encoded in path', async () => {
    const response = await service.anything('hello world');
    expect(response.status()).toBe(200);
    const body = httpbinResponse.parse(await response.json());
    expect(decodeURIComponent(new URL(body.url).pathname).endsWith('/anything/hello world')).toBe(true);
  });
});
