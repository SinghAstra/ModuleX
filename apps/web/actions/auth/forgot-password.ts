"use server";

import { siteConfig } from "@/config/site";
import {
  generateResetCode,
  getExpirationTime,
} from "@/lib/generate-reset-code";
import { transporter } from "@/lib/transporter";
import { logError, type ApiResponse } from "@repo/common";
import { prisma } from "@repo/db";

export async function forgotPasswordAction(
  email: string
): Promise<ApiResponse<{ message: string }>> {
  try {
    if (!email) {
      return { success: false, error: "Email is required" };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: true,
        data: {
          message:
            "If an account exists with this email, a reset code has been sent.",
        },
      };
    }

    const resetCode = generateResetCode();
    const expiresAt = getExpirationTime();

    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    await prisma.passwordResetToken.create({
      data: {
        email,
        code: resetCode,
        expiresAt,
      },
    });

    await transporter.sendMail({
      from: `${siteConfig.name} <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Password Reset Code",
      html: `
        <h2>Password Reset Code</h2>
        <p>You requested a password reset. Use the code below to reset your password:</p>
        <h1 style="color: #007bff; font-size: 32px; letter-spacing: 4px;">${resetCode}</h1>
        <p>This code expires in 10 minutes.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });

    return {
      success: true,
      data: {
        message:
          "Reset code has been sent to your email. Please check your inbox.",
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
