import { ROUTES } from "@/lib/routes";
import { prisma } from "@repo/db";
import { redirect } from "next/navigation";

interface VerifyEmailPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const awaitParams = await searchParams;
  const token = awaitParams.token as string;

  const returnToLogin = (type: "error" | "success", message: string) => {
    const params = new URLSearchParams();

    if (type === "error") {
      params.set("error", "verification_failed");
      params.set("error_description", message);
    } else {
      params.set("message", message);
    }

    return redirect(`${ROUTES.AUTH.SIGN_IN}#${params.toString()}`);
  };

  if (!token) {
    return returnToLogin("error", "Missing verification token.");
  }

  const verifyToken = await prisma.verificationToken.findFirst({
    where: { token },
  });

  if (!verifyToken) {
    return returnToLogin("error", "Invalid or expired confirmation url.");
  }

  if (new Date() > verifyToken.expires) {
    return returnToLogin("error", "Invalid or expired confirmation url.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: verifyToken.identifier },
  });

  if (!existingUser) {
    return returnToLogin("error", "User associated with this token not found.");
  }

  await prisma.user.update({
    where: { email: existingUser.email },
    data: {
      emailVerified: new Date(),
    },
  });

  await prisma.verificationToken.delete({
    where: { token: verifyToken.token },
  });

  return returnToLogin(
    "success",
    "Email verified successfully! Please sign in."
  );
}
