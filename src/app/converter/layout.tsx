export const metadata = {
  title: "Code Converter | Transform AI",
  description: "Instantly convert code from one language to another using AI.",
};

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
