import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { normalizeToE164 } from './phone.util';

export interface TextLkData {
  to: string;
  message: string;
}

@Injectable()
export class TextLkProvider {
  private readonly logger = new Logger(TextLkProvider.name);
  private readonly enabled: boolean;
  private readonly apiToken: string;
  private readonly senderId: string;
  private readonly baseUrl = 'https://app.text.lk/api/http/sms/send';

  constructor(private configService: ConfigService) {
    this.enabled = this.configService.get<string>('TEXTLK_ENABLED', 'false') === 'true';
    this.apiToken = this.configService.get<string>('TEXTLK_API_TOKEN', '');
    this.senderId = this.configService.get<string>('TEXTLK_SENDER_ID', '');

    if (!this.enabled) {
      this.logger.warn('Text.lk SMS is disabled. Set TEXTLK_ENABLED=true to enable.');
    }
  }

  async send(data: TextLkData): Promise<void> {
    if (!this.enabled) return;

    const normalizedPhone = normalizeToE164(data.to);
    if (!normalizedPhone) {
      this.logger.warn(`Text.lk skip: invalid phone "${data.to}"`);
      return;
    }

    // Text.lk usually expects numbers without leading + for local (94...),
    // but normalized is E.164 (+94...). Stripping '+' for compatibility.
    const recipient = normalizedPhone.replace('+', '');

    if (!this.apiToken || !this.senderId) {
      this.logger.warn('[TEXT.LK PROVIDER - MOCK MODE]', {
        to: recipient,
        message: data.message,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          api_token: this.apiToken,
          recipient: recipient,
          sender_id: this.senderId,
          type: 'plain',
          message: data.message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        this.logger.error(`Text.lk API error: ${response.status} ${response.statusText}`, result);
        throw new Error(`Text.lk SMS failed: ${response.statusText}`);
      }

      this.logger.log(`SMS sent via Text.lk to ${recipient}. SID: ${result?.data?.id || 'N/A'}`);
    } catch (error) {
      this.logger.error('Failed to send SMS via Text.lk:', error);
      throw error;
    }
  }
}
