import { checkout, polar, portal } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { polarClient } from "./polar";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
	},
	plugins: [
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			use: [
				checkout({
					products: [
						{
							productId: "f4c5d25e-1b88-40b8-9924-b6c27ec59bde",
							slug: "pro",
						},
					],
					successUrl: process.env.POLAR_SUCCESS_URL,
					authenticatedUsersOnly: true,
				}),
				portal({}),
			],
		}),
	],
});
