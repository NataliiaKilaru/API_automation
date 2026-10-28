import { ApiClient } from '../client/ApiClient';
import type { Booking } from '../data/bookingFactory';

export class BookingService {
  /**
   * Creates a service for Restful Booker endpoints.
   * @param api - Configured API client.
   */
  constructor(private readonly api: ApiClient) {}

  /**
   * Retrieves booking identifiers.
   * @returns API response containing the booking list.
   */
  list() {
    return this.api.send('GET', '/booking');
  }

  /**
   * Retrieves a booking by identifier.
   * @param id - Booking identifier.
   * @returns API response containing the booking or an error.
   */
  get(id: number) {
    return this.api.send('GET', `/booking/${id}`);
  }

  /**
   * Creates a booking.
   * @param booking - Booking payload.
   * @returns API response with the created booking identifier and data.
   */
  create(booking: Booking) {
    return this.api.send('POST', '/booking', { data: booking });
  }

  /**
   * Requests an authentication token.
   * @param username - API username.
   * @param password - API password.
   * @returns API response containing the token or authentication error.
   */
  authenticate(username: string, password: string) {
    return this.api.send('POST', '/auth', { data: { username, password } });
  }

  /**
   * Replaces a booking using token authentication.
   * @param id - Booking identifier.
   * @param booking - Replacement booking payload.
   * @param token - Authentication token.
   * @returns API response with updated booking data or an error.
   */
  update(id: number, booking: Booking, token: string) {
    return this.api.send('PUT', `/booking/${id}`, {
      data: booking,
      headers: { Cookie: `token=${token}` },
    });
  }

  /**
   * Attempts to replace a booking without authentication.
   * @param id - Booking identifier.
   * @param booking - Replacement booking payload.
   * @returns API response indicating whether the unauthenticated request was accepted.
   */
  updateWithoutAuth(id: number, booking: Booking) {
    return this.api.send('PUT', `/booking/${id}`, { data: booking });
  }

  /**
   * Partially updates a booking using token authentication.
   * @param id - Booking identifier.
   * @param fields - Booking fields to modify.
   * @param token - Authentication token.
   * @returns API response with the updated booking or an error.
   */
  patch(id: number, fields: Partial<Booking>, token: string) {
    return this.api.send('PATCH', `/booking/${id}`, {
      data: fields,
      headers: { Cookie: `token=${token}` },
    });
  }

  /**
   * Deletes a booking using token authentication.
   * @param id - Booking identifier.
   * @param token - Authentication token.
   * @returns API response indicating the deletion result.
   */
  delete(id: number, token: string) {
    return this.api.send('DELETE', `/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
    });
  }
}
