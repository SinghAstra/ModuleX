import { authOptions } from "@/lib/auth-options";
import { ROUTES } from "@/lib/routes";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface NonProtectedLayoutProps {
  children: ReactNode;
}

const NonProtectedLayout = async ({ children }: NonProtectedLayoutProps) => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(ROUTES.DASHBOARD);
  }

  return children;
};

export default NonProtectedLayout;
