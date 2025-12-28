"use client";

import { useEffect } from "react";
import ErrorComponent from "@/components/Error";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorComponent error={error} reset={reset} />;
}
