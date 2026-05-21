import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import {
  createQueryChain,
  createSupabaseMock,
} from '../src/__test-utils__/supabase.mock';
import { AppModule } from '../src/app.module';
import { SupabaseService } from '../src/supabase/supabase.service';

const ADMIN_TOKEN = 'test-admin-jwt';
const ADMIN_USER = {
  id: 'admin-user-1',
  email: 'admin@test.com',
  app_metadata: { role: 'admin' },
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2026-01-01T00:00:00Z',
};

const MOCK_POST = {
  id: 1,
  country_code: 'JP',
  published: true,
  cover_url: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  translations: [
    {
      post_id: 1,
      lang: 'ko',
      title: '테스트',
      contents: '내용',
      excerpt: null,
    },
  ],
  country: { code: 'JP', name_en: 'Japan', flag_url: null },
  media: [],
};

describe('Admin Posts API (E2E)', () => {
  let app: INestApplication;
  let supabaseMock: ReturnType<typeof createSupabaseMock>;

  beforeAll(async () => {
    supabaseMock = createSupabaseMock();

    (supabaseMock.client.auth.getUser as jest.Mock).mockImplementation(
      (token: string) =>
        Promise.resolve(
          token === ADMIN_TOKEN
            ? { data: { user: ADMIN_USER }, error: null }
            : { data: { user: null }, error: { message: 'Invalid token' } },
        ),
    );

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(SupabaseService)
      .useValue(supabaseMock)
      .compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Re-configure auth after Jest clears mocks between tests
  beforeEach(() => {
    (supabaseMock.client.auth.getUser as jest.Mock).mockImplementation(
      (token: string) =>
        Promise.resolve(
          token === ADMIN_TOKEN
            ? { data: { user: ADMIN_USER }, error: null }
            : { data: { user: null }, error: { message: 'Invalid token' } },
        ),
    );
  });

  // ── Guard behaviour ────────────────────────────────────────────────────────

  describe('Authentication guard', () => {
    it('returns 401 for PATCH /admin/posts/:id without a token', () => {
      return request(app.getHttpServer())
        .patch('/admin/posts/1')
        .send({ published: true })
        .expect(401);
    });

    it('returns 401 for DELETE /admin/posts/:id without a token', () => {
      return request(app.getHttpServer()).delete('/admin/posts/1').expect(401);
    });

    it('returns 403 when the token belongs to a non-admin user', () => {
      (supabaseMock.client.auth.getUser as jest.Mock).mockResolvedValueOnce({
        data: { user: { ...ADMIN_USER, app_metadata: { role: 'viewer' } } },
        error: null,
      });

      return request(app.getHttpServer())
        .patch('/admin/posts/1')
        .set('Authorization', 'Bearer viewer-token')
        .send({ published: true })
        .expect(403);
    });
  });

  // ── PATCH /admin/posts/:id ─────────────────────────────────────────────────

  describe('PATCH /admin/posts/:id', () => {
    it('returns 200 with the updated post envelope for a valid admin token', () => {
      const chain = createQueryChain({ data: MOCK_POST, error: null });
      (supabaseMock.adminClient.from as jest.Mock).mockReturnValue(chain);

      return request(app.getHttpServer())
        .patch('/admin/posts/1')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({ published: true })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.id).toBe(1);
        });
    });

    it('returns 400 when the request body contains an unknown field', () => {
      return request(app.getHttpServer())
        .patch('/admin/posts/1')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({ unknownField: 'should-be-rejected' })
        .expect(400);
    });

    it('returns 404 when the post does not exist', () => {
      const chain = createQueryChain({
        data: null,
        error: { code: 'PGRST116', message: 'no rows found' },
      });
      (supabaseMock.adminClient.from as jest.Mock).mockReturnValue(chain);

      return request(app.getHttpServer())
        .patch('/admin/posts/99')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send({ published: false })
        .expect(404);
    });
  });

  // ── DELETE /admin/posts/:id ────────────────────────────────────────────────

  describe('DELETE /admin/posts/:id', () => {
    it('returns 204 on successful deletion', () => {
      const chain = createQueryChain({ data: null, error: null });
      (supabaseMock.adminClient.from as jest.Mock).mockReturnValue(chain);

      return request(app.getHttpServer())
        .delete('/admin/posts/1')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .expect(204);
    });
  });

  // ── GET /posts (public) ────────────────────────────────────────────────────

  describe('GET /posts', () => {
    it('returns 200 with a paginated envelope (no auth required)', () => {
      const chain = createQueryChain({ data: [], error: null, count: 0 });
      (supabaseMock.client.from as jest.Mock).mockReturnValue(chain);

      return request(app.getHttpServer())
        .get('/posts?lang=ko')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.meta).toMatchObject({ page: 1, limit: 20 });
        });
    });

    it('returns 400 when the required lang query param is missing', () => {
      return request(app.getHttpServer()).get('/posts').expect(400);
    });

    it('returns 400 for an invalid lang value', () => {
      return request(app.getHttpServer()).get('/posts?lang=fr').expect(400);
    });
  });
});
