import type { Booking } from '../models/Booking';

/**
 * Creates independent booking payloads with a unique test surname.
 * @param overrides Fields to customize for a particular test scenario.
 * @returns A valid booking request body.
 */
export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    firstname: 'ApiTest',
    lastname: `User${Date.now()}${Math.floor(Math.random() * 100000)}`,
    totalprice: 123,
    depositpaid: true,
    bookingdates: { checkin: '2026-11-10', checkout: '2026-11-12' },
    additionalneeds: 'Breakfast',
    ...overrides
  };
}
