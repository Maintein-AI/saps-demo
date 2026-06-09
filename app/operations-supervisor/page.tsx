"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OperationsSupervisorPage() {
  const router = useRouter();
  useEffect(() => {
    router.push("/operations-supervisor/live-ops-view");
  }, [router]);
  return null;
}