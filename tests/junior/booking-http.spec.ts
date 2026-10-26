import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/client/ApiClient';
import { BookingService } from '../../src/services/BookingService';
import { buildBooking } from '../../src/data/bookingFactory';
import { createdBooking } from '../../src/schemas/responseSchemas';
import { urls } from '../../src/data/config';
import type { Booking } from '../../src/models/Booking';

const username = process.env.RESTFUL_BOOKER_USERNAME;
const password = process.env.RESTFUL_BOOKER_PASSWORD;

test.describe('Restful Booker HTTP resource contracts', () => {
  let service: BookingService;
  let bookingId: number | undefined;
  let token: string | undefined;

  test.beforeEach(({ request }) => {
    service = new BookingService(new ApiClient(request, urls.booking));
    bookingId = undefined;
    token = undefined;
  });

  test.afterEach(async () => {
    if (bookingId !== undefined && token) {
      const response = await service.delete(bookingId, token);
      expect([201, 404]).toContain(response.status());
    }
  });

  async function authenticate(): Promise<string> {
    expect(username, 'RESTFUL_BOOKER_USERNAME must be configured').toBeTruthy();
    expect(password, 'RESTFUL_BOOKER_PASSWORD must be configured').toBeTruthy();
    const response = await service.authenticate(username!, password!);
    expect(response.status()).toBe(200);
    const body: unknown = await response.json();
    expect(body).toEqual(expect.objectContaining({ token: expect.any(String) }));
    const result = body as { token: string };
    expect(result.token.length).toBeGreaterThan(0);
    token = result.token;
    return result.token;
  }

  async function createBooking(data: Booking = buildBooking()): Promise<number> {
    const response = await service.create(data);
    expect(response.status()).toBe(200);
    const body: unknown = await response.json();
    const parsed = createdBooking.safeParse(body);
    expect(parsed.success).toBe(true);
    if (!parsed.success) throw new Error('Booking creation response violates schema');
    bookingId = parsed.data.bookingid;
    return bookingId;
  }

  test('GET booking list returns booking IDs', async () => {
    const response = await service.list();
    expect(response.status()).toBe(200);
    const body: unknown = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect((body as unknown[]).every(item =>
      typeof item === 'object' && item !== null &&
      'bookingid' in item && typeof item.bookingid === 'number'
    )).toBe(true);
  });

  test('GET existing booking returns persisted data', async () => {
    await authenticate();
    const data = buildBooking();
    const id = await createBooking(data);
    const response = await service.get(id);
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(expect.objectContaining({ ...data }));
  });

  test('GET nonexistent booking returns 404', async () => {
    const response = await service.get(999999999);
    expect(response.status()).toBe(404);
  });

  test('POST creates booking with generated identifier', async () => {
    await authenticate();
    const id = await createBooking();
    expect(id).toBeGreaterThan(0);
    const fetched = await service.get(id);
    expect(fetched.status()).toBe(200);
  });

  test('PUT replaces booking fields and persists changes', async () => {
    const authToken = await authenticate();
    const id = await createBooking();
    const updated = buildBooking({ firstname: 'UpdatedViaPut', totalprice: 237 });
    const response = await service.update(id, updated, authToken);
    expect(response.status()).toBe(200);
    const fetched = await service.get(id);
    expect(fetched.status()).toBe(200);
    expect(await fetched.json()).toEqual(expect.objectContaining({ ...updated }));
  });

  test('PATCH modifies selected fields without changing others', async () => {
    const authToken = await authenticate();
    const original = buildBooking({ totalprice: 341 });
    const id = await createBooking(original);
    const response = await service.patch(id, { firstname: 'PatchedName' }, authToken);
    expect(response.status()).toBe(200);
    const fetched = await service.get(id);
    expect(fetched.status()).toBe(200);
    expect(await fetched.json()).toEqual(expect.objectContaining({
      ...original,
      firstname: 'PatchedName'
    }));
  });

  test('DELETE removes booking and subsequent GET returns 404', async () => {
    const authToken = await authenticate();
    const id = await createBooking();
    const deleted = await service.delete(id, authToken);
    expect(deleted.status()).toBe(201);
    bookingId = undefined;
    const fetched = await service.get(id);
    expect(fetched.status()).toBe(404);
  });
});
