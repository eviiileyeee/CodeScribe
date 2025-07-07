// components/AuthButton.tsx
"use client";

import {  signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { LogOut } from "lucide-react";

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
      <Link href="/login">
      <Button >
        Login
      </Button>
      </Link>
    );
  }

  const user = session.user;

  return (
    <div className="flex items-center gap-4">
      <Link href="/profile" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
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
      </Link>
      <Button variant="outline" size="sm" onClick={() => signOut()}>
        <LogOut className="h-4 w-4 mr-1" />
        Sign out
      </Button>
    </div>
  );
}
