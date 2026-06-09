"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LifterOperatorPage() {
  const router = useRouter();
  useEffect(() => {
    router.push("/lifter-operator/tasks");
  }, [router]);
  return null;
}