import { ApiClient } from '../client/ApiClient';
/** Provides DemoQA account registration requests for validation tests. */
export class DemoQaService {
  constructor(private readonly api: ApiClient) {}
  register(userName: string, password: string) { return this.api.send('POST', '/Account/v1/User', { data: { userName, password } }); }
}
