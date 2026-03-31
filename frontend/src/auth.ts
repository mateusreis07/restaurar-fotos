import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        // NOTA: Em produção, você deve usar bcrypt/argon2 para comparar senhas!
        // Atualmente o sistema usa senhas em texto puro no banco de dados.
        if (user && (user as any).password === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: (user as any).image,
            credits: (user as any).credits,
          };
        }
        
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.credits = (user as any).credits; // Adicionado
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).credits = token.credits; // Adicionado
      }
      return session;
    }
  }
})
