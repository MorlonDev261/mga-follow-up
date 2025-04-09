import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET; // Secret de ton token, à récupérer dans .env

export async function verifyToken(token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(new Error("Token invalide ou expiré"));
      }
      resolve(decoded);
    });
  });
}
