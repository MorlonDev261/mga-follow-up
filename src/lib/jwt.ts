import jwt from "jsonwebtoken";

export type JwtPayload = {
  id: string
  email: string
  name?: string
  image?: string
};

const secret = process.env.JWT_SECRET!;

export async function verifyToken(token: string): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err || typeof decoded !== "object" || decoded === null || !("userId" in decoded)) {
        return reject(new Error("Token invalide ou expiré"));
      }
      resolve(decoded as JwtPayload);
    });
  });
}
