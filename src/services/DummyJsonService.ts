import { ApiClient } from '../client/ApiClient';

export class DummyJsonService {
  /**
   * Creates a service for DummyJSON endpoints.
   * @param api - Configured API client.
   */
  constructor(private readonly api: ApiClient) {}

  /**
   * Retrieves a paginated product collection.
   * @param limit - Maximum number of products to return.
   * @param skip - Number of products to skip.
   * @returns API response with products and pagination metadata.
   */
  products(limit = 10, skip = 0) {
    return this.api.send('GET', '/products', { params: { limit, skip } });
  }

  /**
   * Retrieves a product by identifier.
   * @param id - Product identifier.
   * @returns API response containing the product or an error.
   */
  product(id: number) {
    return this.api.send('GET', `/products/${id}`);
  }

  /**
   * Searches products by query text.
   * @param q - Search query.
   * @returns API response with matching products.
   */
  search(q: string) {
    return this.api.send('GET', '/products/search', { params: { q } });
  }

  /**
   * Retrieves a user collection.
   * @param limit - Maximum number of users to return.
   * @returns API response with users and pagination metadata.
   */
  users(limit = 10) {
    return this.api.send('GET', '/users', { params: { limit } });
  }

  /**
   * Retrieves a user by identifier.
   * @param id - User identifier.
   * @returns API response containing the user or an error.
   */
  user(id: number) {
    return this.api.send('GET', `/users/${id}`);
  }

  /**
   * Retrieves the cart collection.
   * @returns API response containing carts.
   */
  carts() {
    return this.api.send('GET', '/carts');
  }

  /**
   * Retrieves a cart by identifier.
   * @param id - Cart identifier.
   * @returns API response containing the cart or an error.
   */
  cart(id: number) {
    return this.api.send('GET', `/carts/${id}`);
  }
}
