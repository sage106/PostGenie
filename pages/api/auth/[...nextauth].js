import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import supabase from "@/lib/supabase"

// owner email — this account gets unlimited free posts
const OWNER_EMAIL = "125.mohd.ali.faridi@gmail.com"

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        return null
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // runs on every sign in
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          // check if user already exists in supabase
          const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("email", user.email)
            .single()

          // if user does not exist, create them
          if (!existingUser) {
            const isOwner = user.email === OWNER_EMAIL
            // generate a unique bot token
            const botToken = "pc_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)

            await supabase.from("users").insert({
              email: user.email,
              name: user.name,
              google_id: user.id || null,
              bot_token: botToken,
              posts_total: isOwner ? 999999 : 1,
              posts_used: 0,
              posts_remaining: isOwner ? 999999 : 1,
              subscription_plan: isOwner ? "owner" : "free_trial",
              subscription_status: "active",
              free_trial_used: false,
            })
          }
        } catch (err) {
          console.error("Error creating user in Supabase:", err)
        }
      }
      return true
    },

    // attach supabase user data to session
    async session({ session }) {
      if (session?.user?.email) {
        const { data: dbUser } = await supabase
          .from("users")
          .select("posts_remaining, posts_used, posts_total, subscription_plan, subscription_status, free_trial_used, bot_token")
          .eq("email", session.user.email)
          .single()

        if (dbUser) {
          const isOwner = session.user.email === OWNER_EMAIL
          session.user.posts_remaining = isOwner ? 999999 : dbUser.posts_remaining
          session.user.posts_used = dbUser.posts_used
          session.user.posts_total = dbUser.posts_total
          session.user.plan = isOwner ? "Owner" : dbUser.subscription_plan
          session.user.subscription_status = dbUser.subscription_status
          session.user.free_trial_used = dbUser.free_trial_used
          session.user.bot_token = dbUser.bot_token
          session.user.is_owner = isOwner
        }
      }
      return session
    },
  },
}

export default NextAuth(authOptions)