import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Readable } from 'stream';
import {
  createQueryChain,
  createStorageBucket,
  createSupabaseMock,
} from '../__test-utils__/supabase.mock';
import { SupabaseService } from '../supabase/supabase.service';
import { MediaService } from './media.service';

const MOCK_FILE: Express.Multer.File = {
  fieldname: 'file',
  originalname: 'photo.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: Buffer.from('fake-image-data'),
  size: 15,
  destination: '',
  filename: '',
  path: '',
  stream: null as unknown as Readable,
};

describe('MediaService', () => {
  let service: MediaService;
  let supabaseMock: ReturnType<typeof createSupabaseMock>;

  beforeEach(async () => {
    supabaseMock = createSupabaseMock();

    const module = await Test.createTestingModule({
      providers: [
        MediaService,
        { provide: SupabaseService, useValue: supabaseMock },
      ],
    }).compile();

    service = module.get(MediaService);
  });

  describe('uploadCover()', () => {
    it('uploads the file and persists the public URL', async () => {
      const PUBLIC_URL =
        'https://example.supabase.co/storage/v1/object/public/post-images/1/cover.jpg';
      const bucket = createStorageBucket(PUBLIC_URL);
      (supabaseMock.adminClient.storage.from as jest.Mock).mockReturnValue(
        bucket,
      );

      const dbChain = createQueryChain({ data: null, error: null });
      (supabaseMock.adminClient.from as jest.Mock).mockReturnValue(dbChain);

      const result = await service.uploadCover(1, MOCK_FILE);

      expect(result.url).toBe(PUBLIC_URL);
      expect(bucket.upload).toHaveBeenCalledWith(
        '1/cover.jpg',
        MOCK_FILE.buffer,
        { contentType: 'image/jpeg', upsert: true },
      );
    });

    it('throws InternalServerErrorException when the storage upload fails', async () => {
      const failBucket = {
        upload: jest
          .fn()
          .mockResolvedValue({
            data: null,
            error: { message: 'Storage quota exceeded' },
          }),
        getPublicUrl: jest.fn(),
      };
      (supabaseMock.adminClient.storage.from as jest.Mock).mockReturnValue(
        failBucket,
      );

      await expect(service.uploadCover(1, MOCK_FILE)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    // RED: passes once uploadCover lists the existing cover and calls storage.remove() before re-uploading.
    // This eliminates zombie files when the extension changes (e.g., cover.jpg → cover.png).
    it('removes the existing cover file from storage before uploading a replacement', async () => {
      const bucket = createStorageBucket();
      (supabaseMock.adminClient.storage.from as jest.Mock).mockReturnValue(
        bucket,
      );

      const dbChain = createQueryChain({ data: null, error: null });
      (supabaseMock.adminClient.from as jest.Mock).mockReturnValue(dbChain);

      await service.uploadCover(1, MOCK_FILE);

      expect(bucket.remove).toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    it('deletes the post_media row from the database', async () => {
      const dbChain = createQueryChain({ data: null, error: null });
      (supabaseMock.adminClient.from as jest.Mock).mockReturnValue(dbChain);

      await expect(service.remove(1, 42)).resolves.toBeUndefined();
      expect(supabaseMock.adminClient.from).toHaveBeenCalledWith('post_media');
    });

    it('throws InternalServerErrorException when the delete query fails', async () => {
      const chain = createQueryChain({
        data: null,
        error: { code: '23503', message: 'FK error' },
      });
      (supabaseMock.adminClient.from as jest.Mock).mockReturnValue(chain);

      await expect(service.remove(1, 42)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    // RED: passes once remove() fetches the media URL and calls storage.remove() to delete the file.
    // Currently remove() only deletes the DB row — the storage file is orphaned.
    it('deletes the file from storage when a media record is removed', async () => {
      const MEDIA_URL =
        'https://example.supabase.co/storage/v1/object/public/post-images/1/media-123.jpg';
      const mediaRow = { id: 42, post_id: 1, url: MEDIA_URL, type: 'image' };

      const selectChain = createQueryChain({ data: mediaRow, error: null });
      const deleteChain = createQueryChain({ data: null, error: null });
      (supabaseMock.adminClient.from as jest.Mock)
        .mockReturnValueOnce(selectChain)
        .mockReturnValueOnce(deleteChain);

      const bucket = createStorageBucket();
      (supabaseMock.adminClient.storage.from as jest.Mock).mockReturnValue(
        bucket,
      );

      await service.remove(1, 42);

      expect(bucket.remove).toHaveBeenCalled();
    });
  });
});
