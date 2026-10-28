import { ApiClient } from '../client/ApiClient';

type EchoMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class HttpbinService {
  /**
   * Creates a service for HTTP request and response echo endpoints.
   * @param api - Configured API client.
   */
  constructor(private readonly api: ApiClient) {}

  /**
   * Sends a GET request with optional query parameters.
   * @param params - Optional query parameters.
   * @returns API response echoing the GET request.
   */
  get(params?: Record<string, string>) {
    return this.api.send('GET', '/get', { params });
  }

  /**
   * Sends a supported HTTP method with an optional payload.
   * @param method - HTTP method to send.
   * @param data - Optional request payload.
   * @returns API response echoing the request.
   */
  method(method: EchoMethod, data?: unknown) {
    return this.api.send(method, `/${method.toLowerCase()}`, { data });
  }

  /**
   * Sends a POST request with a string body and explicit content type.
   * @param data - Text payload.
   * @param contentType - Content-Type header value.
   * @returns API response echoing the text request.
   */
  postText(data: string, contentType: string) {
    return this.api.send('POST', '/post', { data, headers: { 'Content-Type': contentType } });
  }

  /**
   * Sends a GET request with custom headers.
   * @param headers - Headers to send.
   * @returns API response echoing received headers.
   */
  headers(headers: Record<string, string>) {
    return this.api.send('GET', '/headers', { headers });
  }

  /**
   * Requests an endpoint that returns a selected HTTP status.
   * @param code - Expected HTTP status code.
   * @returns API response with the selected status.
   */
  status(code: number) {
    return this.api.send('GET', `/status/${code}`);
  }

  /**
   * Requests an echo endpoint with an encoded path segment.
   * @param path - Unencoded path segment.
   * @returns API response containing the requested URL.
   */
  anything(path: string) {
    return this.api.send('GET', `/anything/${encodeURIComponent(path)}`);
  }
}
