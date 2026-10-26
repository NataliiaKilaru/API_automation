import { ApiClient } from '../client/ApiClient';
/** Provides DummyJSON product, user, and cart endpoints. */
export class DummyJsonService {
  constructor(private readonly api: ApiClient) {}
  products(limit = 10, skip = 0) { return this.api.send('GET', '/products', { params: { limit, skip } }); }
  product(id: number) { return this.api.send('GET', `/products/${id}`); }
  search(q: string) { return this.api.send('GET', '/products/search', { params: { q } }); }
  users(limit = 10) { return this.api.send('GET', '/users', { params: { limit } }); }
  user(id: number) { return this.api.send('GET', `/users/${id}`); }
  carts() { return this.api.send('GET', '/carts'); }
  cart(id: number) { return this.api.send('GET', `/carts/${id}`); }
}
