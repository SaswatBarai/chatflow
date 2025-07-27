
import jwt from 'jsonwebtoken';

export interface JWTPayload {
  userId: string;
  email: string;
  phone?: string;
}

export class JWTService {
  private static secret = process.env.JWT_SECRET || 'fallback-secret';
  private static refreshSecret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';

  public static generateTokens(payload: JWTPayload) {
    const accessToken = jwt.sign(payload, this.secret, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, this.refreshSecret, { expiresIn: '7d' });
    
    return { accessToken, refreshToken };
  }

  public static verifyAccessToken(token: string): JWTPayload {
    return jwt.verify(token, this.secret) as JWTPayload;
  }

  public static verifyRefreshToken(token: string): JWTPayload {
    return jwt.verify(token, this.refreshSecret) as JWTPayload;
  }
}
