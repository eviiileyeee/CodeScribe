import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login"); // redirect unauthenticated users
  }

  return <>{children}</>;
}
