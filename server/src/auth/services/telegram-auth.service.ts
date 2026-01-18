import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class TelegramAuthService {
  private readonly botToken: string;

  constructor(private readonly configService: ConfigService) {
    this.botToken = this.configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN');
  }

  /**
   * Валидация initData согласно документации Telegram:
   * https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app
   */
  validate(initData: string): Record<string, unknown> {
    // 1. Парсим initData как query string
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');

    if (!hash) {
      throw new UnauthorizedException('Missing hash in initData');
    }

    // 2. Удаляем hash из параметров для формирования data-check-string
    params.delete('hash');

    // 3. Собираем data-check-string: пары key=value в алфавитном порядке, разделённые \n
    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // 4. Вычисляем secret_key = HMAC_SHA256("WebAppData", bot_token)
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(this.botToken)
      .digest();

    // 5. Вычисляем HMAC_SHA256(secret_key, data-check-string)
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // 6. Сравниваем с hash
    if (calculatedHash !== hash) {
      throw new UnauthorizedException('Invalid initData signature');
    }

    // 7. Возвращаем все параметры, парся JSON-поля
    const result: Record<string, unknown> = {};
    for (const [key, value] of params.entries()) {
      result[key] = this.tryParseJson(value);
    }

    return result;
  }

  private tryParseJson(value: string): unknown {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
}
