import {KJUR} from "jsrsasign";

export async function POST(request: Request) {
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  const header = {
    alg: "HS256",
    typ: "JWT",
  };
  const body = await request.json();
  console.log("my body", body);
  console.log("my env", process.env.NEXT_PUBLIC_ZOOM_KEY);

  try {
    const payload = {
      app_key: process.env.NEXT_PUBLIC_ZOOM_KEY,
      password: body.password,
      tpc: body.tpc,
      role_type: 1,
      session_key: body.session_key,
      version: 1,
      iat: iat,
      exp: exp,
    };

    console.log("kjur",KJUR);
    

    console.log("payload", payload);

    const sHeader = JSON.stringify(header);
    const sPayload = JSON.stringify(payload);
    const sessionToken = KJUR.jws.JWS.sign(
      "HS256",
      sHeader,
      sPayload,
      process.env.NEXT_PUBLIC_ZOOM_SECRET
    );

    console.log("session token", sessionToken);

    return new Response(sessionToken);
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
}