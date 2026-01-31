"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Page() {
  const trpc = useTRPC();
  const testAI = useMutation(
    trpc.testAI.mutationOptions({
      onSuccess: () => {
        toast.success("Success");
      },
      onError: ({ message }) => {
        toast.error(message);
      },
    }),
  );

  return (
    <div>
      <Button onClick={() => testAI.mutate()}>
        Click to test subscription
      </Button>
    </div>
  );
}
