import type { APIRequestContext, APIResponse } from '@playwright/test';

/** Sends requests to one API host using shared headers and Playwright's request context. */
export class ApiClient {
  constructor(private readonly request: APIRequestContext, private readonly baseUrl: string, private readonly headers: Record<string, string> = {}) {}

  /**
   * Sends an HTTP request without throwing for non-2xx responses.
   * @param method HTTP method.
   * @param path Endpoint path relative to the configured base URL.
   * @param options Optional JSON body, query parameters, and request headers.
   * @returns The raw response for assertions and runtime schema validation.
   */
  send(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', path: string, options: { data?: unknown; params?: Record<string, string | number>; headers?: Record<string, string> } = {}): Promise<APIResponse> {
    return this.request.fetch(`${this.baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`, {
      method,
      data: options.data,
      params: options.params,
      headers: { ...this.headers, ...options.headers },
      failOnStatusCode: false
    });
  }
}
