import { z } from 'zod';
export const httpbinResponse = z.object({ url: z.string(), headers: z.record(z.string(), z.unknown()) });
export const createdBooking = z.object({ bookingid: z.number().int().positive(), booking: z.object({ firstname: z.string(), lastname: z.string(), totalprice: z.number(), depositpaid: z.boolean(), bookingdates: z.object({ checkin: z.string(), checkout: z.string() }) }) });
export const dummyProducts = z.object({ products: z.array(z.object({ id: z.number(), title: z.string(), price: z.number() })), total: z.number(), skip: z.number(), limit: z.number() });
export const dummyUsers = z.object({ users: z.array(z.object({ id: z.number(), firstName: z.string() })), total: z.number() });

export const cartProduct = z.object({ id: z.number(), title: z.string(), quantity: z.number(), price: z.number(), total: z.number() });
export const cart = z.object({ id: z.number(), userId: z.number(), products: z.array(cartProduct) });
export const cartList = z.object({ carts: z.array(cart) });
export const userIdentity = z.object({ id: z.number(), firstName: z.string().optional() });
export const productIdentity = z.object({ id: z.number(), title: z.string(), price: z.number() });
export const demoQaBooks = z.object({ books: z.array(z.object({ isbn: z.string(), title: z.string() })) });
export const demoQaError = z.object({ message: z.string().min(1) });
