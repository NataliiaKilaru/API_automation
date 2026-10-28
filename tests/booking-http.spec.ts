import { test, expect } from '@playwright/test';
import { ApiClient } from '../src/client/ApiClient';
import { BookingService } from '../src/services/BookingService';
import { buildBooking } from '../src/data/bookingFactory';
import { createdBooking } from '../src/schemas/responseSchemas';
import { urls } from '../src/data/config';
import type { Booking } from '../src/data/bookingFactory';
import { expectBookingFields } from './helpers/apiAssertions';

const username = process.env.RESTFUL_BOOKER_USERNAME;
const password = process.env.RESTFUL_BOOKER_PASSWORD;
const missingBookingId = 999999999;
const updatedFirstName = 'UpdatedViaPut';
const patchedFirstName = 'PatchedName';

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

  /**
   * Authenticates the test user and caches the token for cleanup.
   * @returns Authentication token.
   */

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

  /**
   * Creates a booking and caches its identifier for cleanup.
   * @param data - Booking payload; defaults to generated data.
   * @returns Identifier of the created booking.
   */

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

  test('GET booking list returns booking IDs @smoke', async () => {
    await test.step('Verify GET booking list returns booking IDs', async () => {
      const response = await service.list();
      expect(response.status()).toBe(200);
      const body: unknown = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect((body as unknown[]).every(item =>
        typeof item === 'object' && item !== null &&
        'bookingid' in item && typeof item.bookingid === 'number'
      )).toBe(true);
    });
  });

  test('GET existing booking returns persisted data', async () => {
    const data = buildBooking();
    const id = await test.step('Authenticate and create a booking', async () => {
      await authenticate();
      return createBooking(data);
    });
    await test.step('Read booking and compare persisted fields', async () => {
      const response = await service.get(id);
      await expectBookingFields(response, data);
    });
  });

  test('GET nonexistent booking returns 404', async () => {
    await test.step('Verify GET nonexistent booking returns 404', async () => {
      const response = await service.get(missingBookingId);
      expect(response.status()).toBe(404);
    });
  });

  test('POST creates booking with generated identifier', async () => {
    const id = await test.step('Authenticate and create booking', async () => {
      await authenticate();
      return createBooking();
    });
    await test.step('Verify created booking can be retrieved', async () => {
      expect(id).toBeGreaterThan(0);
      const fetched = await service.get(id);
      expect(fetched.status()).toBe(200);
    });
  });

  test('PUT replaces booking fields and persists changes', async () => {
    const authToken = await authenticate();
    const id = await test.step('Create booking', () => createBooking());
    const updated = buildBooking({ firstname: updatedFirstName, totalprice: 237 });
    await test.step('Replace booking with PUT', async () => {
      const response = await service.update(id, updated, authToken);
      expect(response.status()).toBe(200);
    });
    await test.step('Read booking and verify replacement persisted', async () => {
      const fetched = await service.get(id);
      await expectBookingFields(fetched, updated);
    });
  });

  test('PATCH modifies selected fields without changing others', async () => {
    const authToken = await authenticate();
    const original = buildBooking({ totalprice: 341 });
    const id = await test.step('Create original booking', () => createBooking(original));
    await test.step('Patch only the first name', async () => {
      const response = await service.patch(id, { firstname: patchedFirstName }, authToken);
      expect(response.status()).toBe(200);
    });
    await test.step('Verify patched name and unchanged booking fields', async () => {
      const fetched = await service.get(id);
      await expectBookingFields(fetched, { ...original, firstname: patchedFirstName });
    });
  });

  test('DELETE removes booking and subsequent GET returns 404', async () => {
    const authToken = await authenticate();
    const id = await test.step('Create booking', () => createBooking());
    await test.step('Delete booking', async () => {
      const deleted = await service.delete(id, authToken);
      expect(deleted.status()).toBe(201);
      bookingId = undefined;
    });
    await test.step('Verify deleted booking cannot be retrieved', async () => {
      const fetched = await service.get(id);
      expect(fetched.status()).toBe(404);
    });
  });
});
