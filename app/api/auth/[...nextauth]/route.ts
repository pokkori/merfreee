import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { createServerClient } from '@/lib/supabase/server';

export const authOptions = {
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER ?? 'smtp://user:password@smtp.example.com:587',
      from: process.env.EMAIL_FROM ?? 'noreply@merfreee.jp',
    }),
  ],
  pages: {
    signIn: '/login',
    verifyRequest: '/verify',
    error: '/login?error=true',
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session: async ({ session, token }: any) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt: async ({ token, user }: any) => {
      if (user) {
        token.sub = user.id;
        // ユーザーがDBに存在しない場合は作成
        try {
          const supabase = createServerClient();
          const { data } = await supabase
            .from('users')
            .select('id')
            .eq('email', user.email)
            .single();
          if (!data) {
            await supabase.from('users').insert({
              email: user.email,
              name: user.name,
              plan: 'trial',
            });
          }
        } catch {
          // DB未接続時は無視
        }
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? 'development-secret',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
