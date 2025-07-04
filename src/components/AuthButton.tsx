// components/AuthButton.tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // make sure you have these
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-24 rounded" />
      </div>
    );
  }

  if (!session) {
    return (
      <Button onClick={() => signIn("github")}>
        Sign in with GitHub
      </Button>
    );
  }

  const user = session.user;

  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src={user?.image || ""} alt={user?.name || "user"} />
        <AvatarFallback>
          {user?.name?.[0]?.toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium leading-none">
          {user?.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {user?.email}
        </span>
      </div>
      <Button variant="outline" size="sm" onClick={() => signOut()}>
        Sign out
      </Button>
    </div>
  );
}
