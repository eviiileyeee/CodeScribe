import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { connectToDatabase } from "@/lib/mongo";
import { User } from "@/models/User";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account }: { user: { name?: string | null; email?: string | null; image?: string | null }; account: { provider?: string } | null }) {
      await connectToDatabase();

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          provider: account?.provider,
        });
      }

      return true;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session(params: any) {
      const { session } = params;
      await connectToDatabase();

      const dbUser = await User.findOne({ email: session.user?.email });

      if (dbUser) {
        session.user.id = dbUser._id.toString();
        session.user.provider = dbUser.provider;
      }

      return session;
    },
  },
};
