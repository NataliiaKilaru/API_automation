import type { APIRequestContext, APIResponse } from '@playwright/test';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
  data?: unknown;
  params?: Record<string, string | number>;
  headers?: Record<string, string>;
};

export class ApiClient {
  /**
   * Creates an HTTP client for a base URL with optional default headers.
   * @param request - Playwright API request context.
   * @param baseUrl - Base URL of the target API.
   * @param headers - Default headers applied to requests.
   */
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string,
    private readonly headers: Record<string, string> = {},
  ) {}

  /**
   * Sends an HTTP request and returns the response without throwing on non-2xx status codes.
   * @param method - HTTP method to execute.
   * @param path - Endpoint path relative to the base URL.
   * @param options - Optional request body, query parameters, and headers.
   * @returns Playwright API response.
   */
  send(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<APIResponse> {
    const url = `${this.baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;

    return this.request.fetch(url, {
      method,
      data: options.data,
      params: options.params,
      headers: { ...this.headers, ...options.headers },
      failOnStatusCode: false,
    });
  }
}
