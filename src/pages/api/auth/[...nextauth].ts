import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set - NextAuth Google provider will fail until configured.');
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    // Ensure redirects after sign-in honor the callbackUrl or fall back to baseUrl
    async redirect({ url, baseUrl }) {
      try {
        if (!url) return baseUrl;
        // If url is relative, join with baseUrl
        if (url.startsWith('/')) return `${baseUrl}${url}`;
        // If url is already absolute and within baseUrl, allow it
        if (url.startsWith(baseUrl)) return url;
        // Otherwise default to baseUrl for safety
        return baseUrl;
      } catch (err) {
        return baseUrl;
      }
    },
  },
});
