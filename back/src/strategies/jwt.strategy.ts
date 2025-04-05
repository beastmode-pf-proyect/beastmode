import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Usar el secreto directamente si lo tienes en las variables de entorno
      secretOrKey: configService.get('AUTH0_SECRET'),
      // Alternativamente, si prefieres usar la verificación JWKS (recomendado para producción)
      // secretOrKeyProvider: passportJwtSecret({
      //   cache: true,
      //   rateLimit: true,
      //   jwksRequestsPerMinute: 5,
      //   jwksUri: `${configService.get('AUTH0_ISSUER_BASE_URL')}/.well-known/jwks.json`,
      // }),
      issuer: configService.get('AUTH0_ISSUER_BASE_URL'),
      algorithms: ['HS256'], // Para secreto compartido
      // algorithms: ['RS256'], // Para verificación con JWKS
    });
  }

  validate(payload: any) {
    // Verificación básica del payload
    if (!payload) {
      throw new UnauthorizedException('Token inválido');
    }

    // Devuelve el payload para adjuntarlo a la solicitud
    return payload;
  }
}