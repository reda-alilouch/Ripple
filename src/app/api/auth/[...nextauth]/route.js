import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/users";
import { comparePassword } from "@/lib/auth";

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          await connectMongoDB();

          const user = await User.findOne({
            email: credentials.email.toLowerCase().trim(),
            provider: "credentials",
          });

          if (!user) {
            return null;
          }

          const isValid = await comparePassword(
            credentials.password,
            user.password
          );

          if (!isValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            provider: user.provider,
          };
        } catch (error) {
          console.error("Erreur d'autorisation:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
    error: "/",
    newUser: "/",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectMongoDB();

        // Pour Google OAuth, créer ou mettre à jour l'utilisateur
        if (account?.provider === "google") {
          const existingUser = await User.findOne({
            email: user.email.toLowerCase().trim(),
          });

          if (!existingUser) {
            // Créer un nouvel utilisateur Google
            const newUser = new User({
              name: user.name,
              email: user.email.toLowerCase().trim(),
              image: user.image,
              provider: "google",
              googleId: account.providerAccountId,
              emailVerified: new Date(),
            });
            await newUser.save();
          } else if (existingUser.provider !== "google") {
            // Lier le compte Google à un utilisateur existant
            existingUser.googleId = account.providerAccountId;
            existingUser.image = user.image;
            await existingUser.save();
          }
        }

        return true;
      } catch (error) {
        console.error("Erreur signIn callback:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Redirection après authentification
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
        token.provider = user.provider;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
        session.user.provider = token.provider;

        // Récupérer les infos utilisateur depuis la DB
        try {
          await connectMongoDB();
          const user = await User.findById(token.sub).lean();
          if (user) {
            session.user.image = user.image || null;
          }
        } catch (error) {
          console.error("Erreur session callback:", error);
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 jour
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
