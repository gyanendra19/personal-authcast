import { NextResponse } from "next/server";
import KJUR from "jsrsasign"
import ZOOMCONST from "@/Constants/ZoomConstant";

export async function POST(req: Request) {
  
  const iat = Math.round(new Date().getTime() / 1000) - 30
  const exp = iat + 60 * 60 * 2

    const header = {
      alg: "HS256",
      typ: "JWT",
    }
    const  body  = await req.json();
    
    
    
    try {

    const payload = {
        app_key: ZOOMCONST.VIDEOSDK.KEY,
        password: body.password,
        tpc: body.tpc,
        role_type: 1,
        session_key: body.session_key,
        version: 1,
        iat: iat,
        exp: exp,
      }


      const sHeader = JSON.stringify(header);
      const sPayload = JSON.stringify(payload);
      const sessionToken = KJUR.KJUR.jws.JWS.sign("HS256", sHeader, sPayload, ZOOMCONST.VIDEOSDK.SECRET);
    

      return NextResponse.json({sessionToken});
    } catch (error) {
      throw new Error("Something went wrong");
      console.log(error)
    }
  }