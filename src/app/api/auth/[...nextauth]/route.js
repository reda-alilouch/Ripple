// src/app/api/auth/[...nextauth]/route.js
import { Auth } from "@auth/core";
import GoogleProvider from "@auth/core/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.JWT_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) token.accessToken = account.access_token;
      if (user) token.id = user._id; // Utilise _id pour MongoDB
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name || token.email.split("@")[0];
        session.user.email = token.email;
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirige vers home après connexion
      return baseUrl + "/";
    },
  },
};

const handler = Auth(authConfig);
export { handler as GET, handler as POST };
