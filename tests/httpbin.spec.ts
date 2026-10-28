import { test, expect } from '@playwright/test';
import { ApiClient } from '../src/client/ApiClient';
import { HttpbinService } from '../src/services/HttpbinService';
import { urls } from '../src/data/config';
import { httpbinResponse } from '../src/schemas/responseSchemas';

const echoPayload = { title: 'API test', count: 2 };
const httpStatusCodes = [201, 204, 400, 404, 500] as const;
const echoMethods = ['POST', 'PUT', 'PATCH', 'DELETE'] as const;
const expectedQueryName = 'Natalia';
const customHeaderValue = 'header-check';
const encodedPath = 'hello world';

test.describe('HTTP mechanics', () => {
  let service: HttpbinService;
  test.beforeEach(({ request }) => { service = new HttpbinService(new ApiClient(request, urls.httpbin)); });

  test('GET returns query parameters @smoke', async () => {
    const response = await service.get({ name: expectedQueryName });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.args.name).toBe(expectedQueryName);
    expect(httpbinResponse.safeParse(body).success).toBe(true);
  });

  for (const method of echoMethods) {
    test(`${method} echoes JSON request payload`, async () => {
      const response = await service.method(method, echoPayload);
      expect(response.status()).toBe(200);
      expect((await response.json()).json).toEqual(echoPayload);
    });
  }

  test('JSON POST sends the expected Content-Type', async () => {
    await test.step('Verify the echoed JSON request content type', async () => {
      const response = await service.method('POST', echoPayload);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.headers['Content-Type']).toContain('application/json');
      expect(body.json).toEqual(echoPayload);
    });
  });

  test('text/plain POST does not masquerade as a JSON request', async () => {
    await test.step('Inspect server echo for explicitly incorrect JSON content type', async () => {
      const response = await service.postText('not-json', 'text/plain');
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.headers['Content-Type']).toContain('text/plain');
      expect(body.data).toBe('not-json');
      expect(body.json).toBeNull();
    });
  });

  test('GET safely handles an absent optional query parameter', async () => {
    await test.step('Validate query data and absence of an optional field', async () => {
      const response = await service.get({ required: 'present' });
      expect(response.status()).toBe(200);
      const body: { args?: Record<string, string | null> } = await response.json();
      expect(body.args?.required).toBe('present');
      expect(body.args?.optional ?? null).toBeNull();
    });
  });

  test('custom request header is returned', async () => {
    const response = await service.headers({ 'X-Test-Case': customHeaderValue });
    expect(response.status()).toBe(200);
    expect((await response.json()).headers['X-Test-Case']).toBe(customHeaderValue);
  });

  for (const code of httpStatusCodes) {
    test(`status endpoint responds ${code}`, async () => {
      expect((await service.status(code)).status()).toBe(code);
    });
  }

  test('special characters are encoded in path', async () => {
    const response = await service.anything(encodedPath);
    expect(response.status()).toBe(200);
    const body = httpbinResponse.parse(await response.json());
    expect(decodeURIComponent(new URL(body.url).pathname).endsWith(`/anything/${encodedPath}`)).toBe(true);
  });
});
