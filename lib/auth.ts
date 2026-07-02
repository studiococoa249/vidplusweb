import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-development-only-change-this";
const key = new TextEncoder().encode(JWT_SECRET);

export async function createAdminSession(userId: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
  const token = await new SignJWT({ userId, role: "Admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(key);

  return { token, expires };
}

export async function verifySession(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}
