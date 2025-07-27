import jwt from "jsonwebtoken";

export interface JWTPayload {
    userId :string;
    email: string;
    phone?: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
}

export class JWTUtils {
    private static accessToken = process.env.JWT_ACCESS_TOKEN_SECRET
    private static refreshToken = process.env.JWT_REFRESH_TOKEN_SECRET
    
    public static generateAccessToken(payload:JWTPayload){
        if (!this.accessToken || !this.refreshToken) {
            throw new Error("JWT secrets are not defined in environment variables");
        }
        
        const accessToken = jwt.sign(payload, this.accessToken, {
            expiresIn: "1d" // 15 minutes
        })
        const refreshToken = jwt.sign(payload, this.refreshToken, {
            expiresIn: "7d" // 7 days   
        })
        return { accessToken, refreshToken };
    }

    public static verifyAccessToken(token:string):JWTPayload{
        try {
            if(!this.accessToken) {
                throw new Error("JWT access token secret is not defined in environment variables");
            }
            return jwt.verify(token, this.accessToken) as JWTPayload;
        } catch (error) {
            throw new Error("Invalid or expired token");
        }
    }

    public static verifyRefreshToken(token:string)
    :JWTPayload{
        try {
            if(!this.refreshToken){
                throw new Error("JWT refresh token secret is not defined in environment variables");
            }
            return jwt.verify(token, this.refreshToken) as JWTPayload;
        } catch (error) {
            throw new Error("Invalid or expired refresh token");
        }
    }
}