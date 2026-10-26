import { ApiClient } from '../client/ApiClient';
/** Provides HTTPBin endpoints for HTTP status, headers, and encoding tests. */
export class HttpbinService {
  constructor(private readonly api: ApiClient) {}
  get(params?: Record<string, string>) { return this.api.send('GET', '/get', { params }); }
  method(method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', data?: unknown) { return this.api.send(method, `/${method.toLowerCase()}`, { data }); }
  headers(headers: Record<string, string>) { return this.api.send('GET', '/headers', { headers }); }
  status(code: number) { return this.api.send('GET', `/status/${code}`); }
  anything(path: string) { return this.api.send('GET', `/anything/${encodeURIComponent(path)}`); }
}
