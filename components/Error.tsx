"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorComponent({
  error,
  reset = () => window.location.reload(),
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-red-100 p-6 rounded-full mb-6 animate-bounce">
        <AlertTriangle className="h-12 w-12 text-red-500" />
      </div>
      <h2 className="text-3xl font-bold font-poppins mb-2">
        Something went wrong!
      </h2>
      <p className="text-gray-600 font-varelaRound mb-8 max-w-md">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="font-poppins">
          Try again
        </Button>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/")}
          className="font-poppins"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}
