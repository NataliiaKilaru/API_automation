import { test, expect } from './fixtures/apiFixtures';
import { cartList, cart as cartSchema, userIdentity, productIdentity } from '../src/schemas/responseSchemas';

test.describe('Related resource API flow', () => {
  test('cart list → cart details → owner → product details @smoke', async ({ dummyJson: service }) => {

    const listedCart = await test.step('Find a cart containing products', async () => {
      const response = await service.carts();
      expect(response.status()).toBe(200);
      const carts = cartList.parse(await response.json());
      const found = carts.carts.find(cart => cart.products.length > 0);
      expect(found, 'Expected at least one cart containing products').toBeDefined();
      if (!found) throw new Error('No cart with products found');
      return found;
    });

    const cart = await test.step('Fetch cart details and validate ownership', async () => {
      const response = await service.cart(listedCart.id);
      expect(response.status()).toBe(200);
      const details = cartSchema.parse(await response.json());
      expect(details.userId).toBe(listedCart.userId);
      expect(details.products.length).toBeGreaterThan(0);
      return details;
    });

    await test.step('Fetch the cart owner', async () => {
      const response = await service.user(cart.userId);
      expect(response.status()).toBe(200);
      const user = userIdentity.parse(await response.json());
      expect(user.id).toBe(cart.userId);
    });

    await test.step('Verify a product referenced by the cart', async () => {
      const line = cart.products[0];
      const response = await service.product(line.id);
      expect(response.status()).toBe(200);
      const product = productIdentity.parse(await response.json());
      expect(product.id).toBe(line.id);
      expect(product.title).toBe(line.title);
      expect(line.quantity).toBeGreaterThan(0);
      expect(line.total).toBeGreaterThan(0);
    });
  });
});
