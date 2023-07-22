// [...nextauth]/route.ts
import prisma from "@/lib/prisma";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";

// Wallectonnect and SIWE will use this route to authenticate users
// Drop email and phone from the user object

type Credentials = {
  message: string,
  signature: string,
  nonce: string,
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // id: "web3", // <- I'm not sure if this is needed?
      name: "Sign In With Ethereum",
      credentials: {
        message: { label: "Message", type: "text" },
        signature: { label: "Signed Message", type: "text" }, // aka signature
        nonce: { label: "Nonce", type: "text" },
      },
      async authorize(credentials: Credentials | undefined, req) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"))
          console.log("siwe.address:", siwe.address);

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            nonce: credentials?.nonce,
            //nonce: await getCsrfToken({ req }),
            //nonce: generateNonce(),
          })
          console.log("siwe.nonce:", siwe.nonce);

          if (!result.success) {
            console.error("SIWE verification failed")
            return null
          }

          const user = await prisma.user.findUnique({
            where: { walletAddress: siwe.address },
            include: {
              merchant: true,
              operator: true,
            },
          })
          console.log("user.walletAddress:", user?.walletAddress);

          if (!user) {
            const newUser = await prisma.user.create({
              data: {
                walletAddress: siwe.address,
                role: "GUEST",
              },
              include: {
                merchant: true,
                operator: true,
              },
            })

            return {
              id: newUser.id,
              role: newUser.role,
              walletAddress: newUser.walletAddress,
              merchant: newUser.merchant ? { id: newUser.merchant.id } : null,
              operator: newUser.operator ? { id: newUser.operator.id } : null,
            }
          }

          return {
            id: user.id,
            role: user.role,
            walletAddress: user.walletAddress,
            merchant: user.merchant ? { id: user.merchant.id } : null,
            operator: user.operator ? { id: user.operator.id } : null,
          }
        } catch (e) {
          console.error(e)
          return null
        }
      }

    }),
  ],

  pages: {
    signIn: "/",
  },

  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user, trigger }) {
      console.log("jwt token before", token);
      console.log("jwt user", user);

      if (user) {
        try {
          const { walletAddress } = user as any;
          if (walletAddress) {
            token.walletAddress = walletAddress;
            console.log(`Assigned user.walletAddress to token.walletAddress: ${token.walletAddress}`);
          } else {
            console.error('user.walletAddress is undefined');
          }
        } catch (error) {
          console.error('Failed to set token.walletAddress:', error);
        }
      }

      console.log("jwt token after", token);
      return token;
    },


    async session({ session, token }: { session: any, token: any }) {
      console.log("SESSION before", session)
      console.log("TOKEN before", token)

      if (token.walletAddress === undefined) {
        throw new Error("token.walletAddress is undefined");
      }

      session.user = session.user || {};
      session.user.name = token.walletAddress;
      session.user.image = "https://www.fillmurray.com/128/128";

      // Initialize address
      session.address = token.walletAddress;

      console.log("SESSION after", session)
      console.log("TOKEN after", token)

      return session;
    },
  },


};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
