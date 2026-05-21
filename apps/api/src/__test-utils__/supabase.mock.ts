export type QueryResult = {
  data?: unknown;
  error?: { code?: string; message: string } | null;
  count?: number | null;
};

/**
 * Creates a mock Supabase query chain where every builder method returns itself,
 * making the whole chain thenable via Jest so `await chain` resolves to `resolveWith`.
 */
export function createQueryChain(
  resolveWith: QueryResult = { data: null, error: null },
) {
  const chain = {
    select: jest.fn(),
    eq: jest.fn(),
    neq: jest.fn(),
    order: jest.fn(),
    range: jest.fn(),
    single: jest.fn(),
    maybeSingle: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    insert: jest.fn(),
    upsert: jest.fn(),
    limit: jest.fn(),
    then: jest.fn(),
  } as Record<string, jest.Mock>;

  Object.keys(chain).forEach((key) => {
    if (key !== 'then') chain[key].mockReturnValue(chain);
  });

  // Makes `await chain` work — delegates to a real Promise each time it's called.
  chain['then'].mockImplementation(
    (
      onfulfilled: (v: QueryResult) => unknown,
      onrejected?: (r: unknown) => unknown,
    ) => Promise.resolve(resolveWith).then(onfulfilled, onrejected),
  );

  return chain;
}

export function createStorageBucket(
  publicUrl = 'https://example.supabase.co/storage/v1/object/public/post-images/test.jpg',
) {
  return {
    upload: jest
      .fn()
      .mockResolvedValue({ data: { path: 'test.jpg' }, error: null }),
    remove: jest
      .fn()
      .mockResolvedValue({ data: [{ name: 'test.jpg' }], error: null }),
    getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl } }),
  };
}

export function createSupabaseMock() {
  const dbChain = createQueryChain({ data: null, error: null });
  const storageBucket = createStorageBucket();

  return {
    client: {
      from: jest.fn().mockReturnValue(dbChain),
      auth: {
        getUser: jest
          .fn()
          .mockResolvedValue({ data: { user: null }, error: null }),
        signInWithPassword: jest
          .fn()
          .mockResolvedValue({ data: null, error: null }),
      },
    },
    adminClient: {
      from: jest.fn().mockReturnValue(dbChain),
      auth: {
        admin: {
          signOut: jest.fn().mockResolvedValue({ error: null }),
        },
        getUser: jest
          .fn()
          .mockResolvedValue({ data: { user: null }, error: null }),
        signInWithPassword: jest
          .fn()
          .mockResolvedValue({ data: null, error: null }),
      },
      storage: {
        from: jest.fn().mockReturnValue(storageBucket),
      },
    },
  };
}
