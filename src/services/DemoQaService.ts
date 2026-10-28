import { ApiClient } from '../client/ApiClient';

export class DemoQaService {
  /**
   * Creates a service for DemoQA account endpoints.
   * @param api - Configured API client.
   */
  constructor(private readonly api: ApiClient) {}

  /**
   * Submits a user registration request.
   * @param userName - Account username.
   * @param password - Account password.
   * @returns API response with registration result or validation error.
   */
  register(userName: string, password: string) {
    return this.api.send('POST', '/Account/v1/User', {
      data: { userName, password },
    });
  }
}
