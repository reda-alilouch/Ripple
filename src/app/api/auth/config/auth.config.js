import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { clientPromise } from "@/lib/mongodb";
import { authProviders } from "@/lib/auth-providers";
import User from "@/models/users";

export const authConfig = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [authProviders.google(), authProviders.credentials()],
  pages: {
    signIn: "/",
    error: "/",
    newUser: "/",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return `${baseUrl}/profil`;
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
        const user = await User.findById(token.sub).lean();
        if (user) {
          session.user.image = user.image || null;
        }
      }
      if (token?.provider) {
        session.user.provider = token.provider;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 jour
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  useSecureCookies: process.env.NODE_ENV === "production",
};
