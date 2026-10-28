export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

/**

 * Builds a booking payload with generated default values and optional overrides.

 * @param overrides - Booking fields to override.

 * @returns Complete booking request payload.

 */

export function buildBooking(
  overrides: Partial<Booking> = {}
): Booking {
  return {
    firstname: 'ApiTest',
    lastname: `User${Date.now()}${Math.floor(Math.random() * 100000)}`,
    totalprice: 123,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-11-10',
      checkout: '2026-11-12',
    },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}