import crypto from "crypto";

export class MagicLinkService {
  private static getSecret() {
    return process.env.SUPABASE_SERVICE_ROLE_KEY || "fallback-secret";
  }

  public static generateToken(sessionId: string, expiresAt: number): string {
    const message = `${sessionId}:${expiresAt}`;
    return crypto
      .createHmac("sha256", this.getSecret())
      .update(message)
      .digest("hex");
  }

  public static verifyToken(sessionId: string, expiresAt: number, token: string): boolean {
    if (Date.now() > expiresAt) return false;
    const expected = this.generateToken(sessionId, expiresAt);
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  }
}
