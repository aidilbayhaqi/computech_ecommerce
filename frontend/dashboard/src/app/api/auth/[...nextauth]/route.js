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
    signIn: "/", // opsional jika custom halaman login
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/googlelogin`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include", // penting untuk cookie
              body: JSON.stringify({
                name: user.name,
                email: user.email,
                avatar: user.image,
              }),
            }
          );

          if (!res.ok) {
            const err = await res.json();
            console.error("Google login gagal:", err.message);
            return false;
          }
        } catch (err) {
          console.error("Error Google login:", err.message);
          return false;
        }
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST };
