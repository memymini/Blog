import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  createQueryChain,
  createSupabaseMock,
} from '../__test-utils__/supabase.mock';
import { SupabaseService } from '../supabase/supabase.service';
import { PostsService } from './posts.service';
import { WebhookService } from '../webhook/webhook.service';

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

describe('PostsService', () => {
  let service: PostsService;
  let supabaseMock: ReturnType<typeof createSupabaseMock>;
  let mockWebhook: { triggerRevalidation: jest.Mock };

  beforeEach(async () => {
    supabaseMock = createSupabaseMock();
    mockWebhook = {
      triggerRevalidation: jest.fn().mockResolvedValue(undefined),
    };

    const module = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: SupabaseService, useValue: supabaseMock },
        { provide: WebhookService, useValue: mockWebhook },
      ],
    }).compile();

    service = module.get(PostsService);
  });

  describe('update()', () => {
    it('returns the updated post on success', async () => {
      const chain = createQueryChain({ data: MOCK_POST, error: null });
      (supabaseMock.adminClient.from as jest.Mock).mockReturnValue(chain);

      const result = await service.update(1, { published: true });

      expect(result).toEqual(MOCK_POST);
    });

    it('throws NotFoundException when the post does not exist (PGRST116)', async () => {
      const chain = createQueryChain({
        data: null,
        error: { code: 'PGRST116', message: 'no rows' },
      });
      (supabaseMock.adminClient.from as jest.Mock).mockReturnValue(chain);

      await expect(service.update(99, { published: false })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws InternalServerErrorException on a generic database error', async () => {
      const chain = createQueryChain({
        data: null,
        error: { code: '23503', message: 'FK violation' },
      });
      (supabaseMock.adminClient.from as jest.Mock).mockReturnValue(chain);

      await expect(service.update(1, { country_code: 'XX' })).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    // RED: passes once PostsService injects WebhookService and calls triggerRevalidation after update
    it('triggers cache revalidation after a successful update', async () => {
      const chain = createQueryChain({ data: MOCK_POST, error: null });
      (supabaseMock.adminClient.from as jest.Mock).mockReturnValue(chain);

      await service.update(1, { published: true });

      expect(mockWebhook.triggerRevalidation).toHaveBeenCalledWith(1);
    });

    // RED: webhook failure must never surface as an HTTP error
    it('does not throw even if triggerRevalidation rejects', async () => {
      const chain = createQueryChain({ data: MOCK_POST, error: null });
      (supabaseMock.adminClient.from as jest.Mock).mockReturnValue(chain);
      mockWebhook.triggerRevalidation.mockRejectedValueOnce(
        new Error('Network error'),
      );

      await expect(
        service.update(1, { published: true }),
      ).resolves.not.toThrow();
    });
  });

  describe('remove()', () => {
    it('resolves without error on a successful delete', async () => {
      const chain = createQueryChain({ data: null, error: null });
      (supabaseMock.adminClient.from as jest.Mock).mockReturnValue(chain);

      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('throws InternalServerErrorException when the delete query fails', async () => {
      const chain = createQueryChain({
        data: null,
        error: { code: '23503', message: 'FK error' },
      });
      (supabaseMock.adminClient.from as jest.Mock).mockReturnValue(chain);

      await expect(service.remove(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    // RED: passes once PostsService injects WebhookService and calls triggerRevalidation after remove
    it('triggers cache revalidation after a successful delete', async () => {
      const chain = createQueryChain({ data: null, error: null });
      (supabaseMock.adminClient.from as jest.Mock).mockReturnValue(chain);

      await service.remove(1);

      expect(mockWebhook.triggerRevalidation).toHaveBeenCalledWith(1);
    });
  });
});
