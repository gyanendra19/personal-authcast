import { KJUR } from "jsrsasign";

export async function POST(request: Request) {
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  const header = {
    alg: "HS256",
    typ: "JWT",
  };
  const body = await request.json();
  try {
    const payload = {
      app_key: process.env.ZOOM_KEY,
      tpc: body.tpc,
      role_type: 1,
      session_key: body.session_key,
      version: 1,
      iat: iat,
      exp: exp,
    };

    const sHeader = JSON.stringify(header);
    const sPayload = JSON.stringify(payload);
    const sessionToken = KJUR.jws.JWS.sign(
      "HS256",
      sHeader,
      sPayload,
      process.env.ZOOM_SECRET
    );

    return new Response(sessionToken);
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
}
