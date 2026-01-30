import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import Logout from "./logout";

export default async function Page() {
  await requireAuth();

  const data = await caller.getUsers();
  return (
    <div className="min-h-screen min-w-screen flex flex-col gap-y-6 items-center justify-center">
      protected server component
      <div> {JSON.stringify(data, null, 2)}</div>
      <Logout />
    </div>
  );
}
