"use server";

import { logError, type ApiResponse } from "@repo/common";
import { prisma } from "@repo/db";
import bcrypt from "bcryptjs";

export async function resetPasswordAction(data: {
  tokenId: string;
  password: string;
}): Promise<ApiResponse<{ message: string }>> {
  try {
    const { tokenId, password } = data;

    if (!tokenId || !password) {
      return { success: false, error: "Missing token or password." };
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: {
        id: tokenId,
      },
    });

    if (!resetToken) {
      return { success: false, error: "Invalid or missing reset token." };
    }

    if (new Date() > resetToken.expiresAt) {
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });

      return {
        success: false,
        error: "This reset link has expired. Please request a new one.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { email: resetToken.email },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      }),
    ]);

    return {
      success: true,
      data: {
        message: "Password reset successfully. You can now log in.",
      },
    };
  } catch (error) {
    logError(error);
    return {
      success: false,
      error: "Failed to reset password. Please try again.",
    };
  }
}
