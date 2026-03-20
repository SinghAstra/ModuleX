"use server";

import { siteConfig } from "@/config/site";
import { env } from "@/env";
import { getExpirationTime } from "@/lib/generate-reset-code";
import { transporter } from "@/lib/transporter";
import { signUpSchema, type SignUpFormValues } from "@/schema/auth";
import { logError, type ApiResponse } from "@repo/common";
import { prisma } from "@repo/db";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function signUpAction(
  data: SignUpFormValues
): Promise<ApiResponse<{ message: string }>> {
  try {
    const validationResult = signUpSchema.safeParse(data);

    if (!validationResult.success) {
      return {
        success: false,
        error:
          validationResult.error.issues[0]?.message || "Invalid input data",
      };
    }

    const { email, password } = validationResult.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "A user with this email already exists.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = uuidv4();
    const expiresAt = getExpirationTime();

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: expiresAt,
      },
    });

    const baseUrl = env.FRONTEND_URL;
    const verificationLink = `${baseUrl}/verify-email?token=${token}`;

    await transporter.sendMail({
      from: `${siteConfig.name} <${env.GMAIL_USER}>`,
      to: email,
      subject: `Verify your email address for ${siteConfig.name}`,
      html: `
        <h2>Welcome to ${siteConfig.name}!</h2>
        <p>Please click the link below to verify your email address and complete your registration:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
          Verify Email
        </a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">
          This link will expire in a short period of time. If you did not sign up for this account, please ignore this email.
        </p>
      `,
    });

    return {
      success: true,
      data: {
        message: "Registration successful! Check your email for verification.",
      },
    };
  } catch (error) {
    logError(error);
    return {
      success: false,
      error: "Internal server error. Please try again later.",
    };
  }
}
