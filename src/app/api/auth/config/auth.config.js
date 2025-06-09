// src/app/api/auth/config/auth.config.js
import { authProviders } from "@/lib/auth-providers";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

export const authConfig = {
  providers: authProviders,
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
};
