import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private readonly revalidateUrl: string;
  private readonly secret: string;

  constructor(private readonly config: ConfigService) {
    this.revalidateUrl = this.config.get<string>('REVALIDATE_URL') ?? '';
    this.secret = this.config.get<string>('REVALIDATE_SECRET') ?? '';
  }

  async triggerRevalidation(postId: number): Promise<void> {
    if (!this.revalidateUrl || !this.secret) return;

    const response = await fetch(this.revalidateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.secret}`,
      },
      body: JSON.stringify({ postId }),
    });

    if (!response.ok) {
      this.logger.warn(`Revalidation returned ${response.status} for post ${postId}`);
    }
  }
}
