"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Zoom from "@/components/Zoom/Zoom";

const SessionParams = () => {
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [tpc, setTpc] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [role, setRole] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useSearchParams();

  useEffect(() => {
    setLoading(true);
    setSessionKey(params.get("session_key") || null);
    setTpc(params.get("tpc"));
    setPassword(params.get("password"));
    setRole(Number(params.get("role")) || null);
    setUserName(params.get("user") || null);
    setLoading(false);
  }, [params]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      {role === 1 && (
        <div className="">
          <h2>Shareable link: </h2>
          <p>
            {process.env.NEXT_PUBLIC_BASE_URL}/session?session_key={sessionKey}&tpc={tpc}&password={password}&role=
            {role === 1 ? 0 : 1}&user=participant
          </p>
        </div>
      )}

      <Zoom
        session_key={sessionKey!}
        tpc={tpc!}
        password={password!}
        role={role!}
        userName={userName!}
      />
    </div>
  );
};

export default SessionParams;
