export const paginationCases = [
  { limit: 1, skip: 0 },
  { limit: 2, skip: 0 },
  { limit: 3, skip: 1 },
  { limit: 5, skip: 5 },
  { limit: 10, skip: 0 },
  { limit: 10, skip: 10 },
  { limit: 15, skip: 0 },
  { limit: 20, skip: 5 },
  { limit: 1, skip: 20 },
  { limit: 2, skip: 30 },
] as const;

export const validLimits = [1, 2, 30] as const;
export const validSkips = [0, 1, 100] as const;
export const missingUserIds = [999999, 999998] as const;
export const missingResources = [
  { resource: 'product', path: '/products/999999' },
  { resource: 'user', path: '/users/999999' },
  { resource: 'cart', path: '/carts/999999' },
] as const;
export const outOfRangeOffsets = [0, 1] as const;
export const productExistenceCases = [
  { id: 1, status: 200 },
  { id: 999999, status: 404 },
] as const;
