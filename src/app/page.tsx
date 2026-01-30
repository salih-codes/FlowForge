"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import Logout from "./logout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Page() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());

  const create = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: () => {
        toast.success("Job Queued");
      },
    }),
  );
  return (
    <div className="min-h-screen min-w-screen flex flex-col gap-y-6 items-center justify-center">
      protected server component
      <div> {JSON.stringify(data, null, 2)}</div>
      <Button disabled={create.isPending} onClick={() => create.mutate()}>
        Create Workflow
      </Button>
      <Logout />
    </div>
  );
}
