import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "./mongodb";
import User from "@/models/users";
import { comparePassword } from "./auth";

export const authProviders = {
  google: () =>
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),

    credentials: () =>
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          try {
            if (!credentials?.email || !credentials?.password) {
              throw new Error("Email et mot de passe requis");
            }
    
            await connectMongoDB();
            const user = await User.findOne({ 
              email: credentials.email.toLowerCase().trim(),
              provider: "credentials" 
            });
    
            if (!user || !user.password) {
              return null;
            }
    
            const isPasswordValid = await comparePassword(
              credentials.password,
              user.password
            );
    
            if (!isPasswordValid) {
              return null;
            }
    
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              provider: "credentials",
            };
          } catch (error) {
            console.error("Authorize error:", error);
            return null;
          }
        },
      }),
};
