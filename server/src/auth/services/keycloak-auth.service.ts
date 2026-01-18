import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class KeycloakAuthService {
  validate(_token: string): Record<string, unknown> {
    throw new NotImplementedException('Keycloak authentication is not implemented yet');
  }
}
