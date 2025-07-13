import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID_GOOGLE,
      clientSecret: process.env.CLIENT_SECRET_GOOGLE,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
    signOut: "/",
  },
  callbacks: {
    async signIn({ user }) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/googlelogin`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              avatar: user.image,
            }),
          }
        );

        const data = await res.json();
        if (res.status === 404) {
          // user belum terdaftar, arahkan ke halaman register
          return `/register?email=${encodeURIComponent(
            user.email
          )}&name=${encodeURIComponent(user.name)}&avatar=${encodeURIComponent(
            user.image
          )}`;
        }
        return true;
      } catch (err) {
        console.error("Google login error", err);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
