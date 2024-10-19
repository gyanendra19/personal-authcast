// app/session/page.tsx
"use client";

import { Suspense } from "react";
import SessionParams from "@/components/SessionParams/SessionParams";

export default function SessionPage() {
  return (
    <Suspense fallback={<div>Loading session...</div>}>
      <SessionParams />
    </Suspense>
  );
}
