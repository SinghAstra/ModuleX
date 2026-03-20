"use server";

import { verifyResetCodeSchema } from "@/schema/auth";
import { logError, type ApiResponse } from "@repo/common";
import { prisma } from "@repo/db";

export async function verifyResetCodeAction(data: {
  email: string;
  code: string;
}): Promise<ApiResponse<{ message: string; resetTokenId: string }>> {
  try {
    const validationResult = verifyResetCodeSchema.safeParse(data);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[0]?.message || "Invalid input.",
      };
    }

    const { email, code } = validationResult.data;

    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        email,
        code,
      },
    });

    if (!resetToken) {
      return { success: false, error: "Invalid or expired reset code." };
    }

    if (new Date() > resetToken.expiresAt) {
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });

      return {
        success: false,
        error: "Reset code has expired. Please request a new one.",
      };
    }

    return {
      success: true,
      data: {
        message:
          "Reset code verified successfully. You can now reset your password.",
        resetTokenId: resetToken.id,
      },
    };
  } catch (error) {
    logError(error);
    return {
      success: false,
      error: "An error occurred. Please try again later.",
    };
  }
}
