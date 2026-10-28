import { test as base } from '@playwright/test';
import { ApiClient } from '../../src/client/ApiClient';
import { DummyJsonService } from '../../src/services/DummyJsonService';
import { urls } from '../../src/data/config';

type ApiFixtures = { dummyJson: DummyJsonService };

export const test = base.extend<ApiFixtures>({
  dummyJson: async ({ request }, use) => {
    await use(new DummyJsonService(new ApiClient(request, urls.dummy)));
  },
});
export { expect } from '@playwright/test';
