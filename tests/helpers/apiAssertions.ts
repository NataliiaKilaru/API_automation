import { expect, type APIResponse } from '@playwright/test';

/**

 * Asserts that an API response has the expected HTTP status.

 * @param response - Actual API response.

 * @param status - Expected HTTP status code.

 * @returns Nothing; throws an assertion error on mismatch.

 */

export function expectStatus(response: APIResponse, status: number): void {
  expect(response.status(), `Expected HTTP ${status}`).toBe(status);
}

/**

 * Asserts a successful booking response contains the specified fields.

 * @param response - Actual booking API response.

 * @param fields - Expected subset of booking fields.

 * @returns Promise that resolves when assertions pass.

 */

export async function expectBookingFields(
  response: APIResponse,
  fields: object,
): Promise<void> {
  expectStatus(response, 200);
  expect(await response.json()).toEqual(expect.objectContaining({ ...fields }));
}
