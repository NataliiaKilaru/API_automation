import { test, expect } from '@playwright/test';
import { ApiClient } from '../src/client/ApiClient';
import { BookingService } from '../src/services/BookingService';
import { buildBooking } from '../src/data/bookingFactory';
import { urls } from '../src/data/config';

const username = process.env.RESTFUL_BOOKER_USERNAME;
const password = process.env.RESTFUL_BOOKER_PASSWORD;
const invalidAuthToken = 'invalid-token';
const updatedFirstName = 'Updated';
const patchedFirstName = 'Patched';
const updatedTotalPrice = 200;

test.describe('Authenticated booking lifecycle', () => {
  test.skip(!username || !password, 'Set RESTFUL_BOOKER_USERNAME and RESTFUL_BOOKER_PASSWORD in .env to execute authenticated CRUD.');

  let service: BookingService;
  let token: string;
  let bookingId: number | undefined;

  test.beforeEach(async ({ request }) => {
    bookingId = undefined;
    token = '';
    service = new BookingService(new ApiClient(request, urls.booking));
    const response = await service.authenticate(username!, password!);
    expect(response.status()).toBe(200);
    const body: { token?: string } = await response.json();
    expect(body.token, 'Expected authentication token').toBeTruthy();
    token = body.token!;
  });

  test.afterEach(async () => {
    if (bookingId !== undefined && token) {
      const bookingIdToCleanUp = bookingId;
      const response = await service.delete(bookingIdToCleanUp, token);
      expect([201, 404], `Failed to clean up booking ${bookingIdToCleanUp}`).toContain(response.status());
      bookingId = undefined;
    }
  });

  test('create, update, patch and delete a booking with token', async () => {
    await test.step('Create booking', async () => {
      const created = await service.create(buildBooking());
      expect(created.status()).toBe(200);
      const body: { bookingid: number } = await created.json();
      bookingId = body.bookingid;
      expect(bookingId).toBeGreaterThan(0);
    });

    await test.step('Replace booking with PUT', async () => {
      const updated = buildBooking({ firstname: updatedFirstName, totalprice: updatedTotalPrice });
      const response = await service.update(bookingId!, updated, token);
      expect(response.status()).toBe(200);
      expect(await response.json()).toMatchObject({ firstname: updatedFirstName, totalprice: updatedTotalPrice });
    });

    await test.step('Modify only the first name with PATCH', async () => {
      const response = await service.patch(bookingId!, { firstname: patchedFirstName }, token);
      expect(response.status()).toBe(200);
      expect(await response.json()).toMatchObject({ firstname: patchedFirstName, totalprice: updatedTotalPrice });
    });

    await test.step('Read back persisted booking data', async () => {
      const response = await service.get(bookingId!);
      expect(response.status()).toBe(200);
      expect(await response.json()).toMatchObject({ firstname: patchedFirstName, totalprice: updatedTotalPrice });
    });

    await test.step('Delete booking and verify it no longer exists', async () => {
      const deleted = await service.delete(bookingId!, token);
      expect(deleted.status()).toBe(201);
      const missing = await service.get(bookingId!);
      expect(missing.status()).toBe(404);
      bookingId = undefined;
    });
  });

  test('reject update without authentication cookie', async () => {
    await test.step('Create booking for authorization check', async () => {
      const created = await service.create(buildBooking());
      expect(created.status()).toBe(200);
      const body: { bookingid: number } = await created.json();
      bookingId = body.bookingid;
    });

    await test.step('Reject PUT request without credentials', async () => {
      const response = await service.updateWithoutAuth(bookingId!, buildBooking());
      // Restful Booker uses 403 for unauthorized modification, not 401.
      expect(response.status()).toBe(403);
    });
  });

  test('reject update with invalid authentication token', async () => {
    await test.step('Verify reject update with invalid authentication token', async () => {
      const created = await service.create(buildBooking());
      expect(created.status()).toBe(200);
      const body: { bookingid: number } = await created.json();
      bookingId = body.bookingid;
      const response = await service.update(bookingId, buildBooking(), invalidAuthToken);
      expect(response.status()).toBe(403);
    });
  });
});
