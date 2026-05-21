import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
  // TODO: inject ConfigService and implement POST to Next.js /api/revalidate
  async triggerRevalidation(_postId: number): Promise<void> {
    // fire-and-forget — implementation pending
  }
}
