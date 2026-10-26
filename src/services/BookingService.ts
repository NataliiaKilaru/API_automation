import { ApiClient } from '../client/ApiClient';
import type { Booking } from '../models/Booking';
/** Provides Restful Booker booking CRUD and token authentication endpoints. */
export class BookingService {
  constructor(private readonly api: ApiClient) {}
  list() { return this.api.send('GET', '/booking'); }
  get(id: number) { return this.api.send('GET', `/booking/${id}`); }
  create(booking: Booking) { return this.api.send('POST', '/booking', { data: booking }); }
  authenticate(username: string, password: string) { return this.api.send('POST', '/auth', { data: { username, password } }); }
  update(id: number, booking: Booking, token: string) { return this.api.send('PUT', `/booking/${id}`, { data: booking, headers: { Cookie: `token=${token}` } }); }
  patch(id: number, fields: Partial<Booking>, token: string) { return this.api.send('PATCH', `/booking/${id}`, { data: fields, headers: { Cookie: `token=${token}` } }); }
  delete(id: number, token: string) { return this.api.send('DELETE', `/booking/${id}`, { headers: { Cookie: `token=${token}` } }); }
}
