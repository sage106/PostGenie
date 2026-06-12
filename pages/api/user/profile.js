import { getServerSession } from "next-auth"
import supabase from "@/lib/supabase"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  // get the logged in user session
  const session = await getServerSession(req, res, {})

  if (!session?.user?.email) {
    return res.status(401).json({ error: "Not authenticated" })
  }

  // fetch user data from supabase
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", session.user.email)
    .single()

  if (error || !user) {
    return res.status(404).json({ error: "User not found" })
  }

  return res.status(200).json({
    email: user.email,
    name: user.name,
    posts_remaining: user.posts_remaining,
    posts_used: user.posts_used,
    posts_total: user.posts_total,
    subscription_plan: user.subscription_plan,
    subscription_status: user.subscription_status,
    free_trial_used: user.free_trial_used,
    bot_token: user.bot_token,
  })
}
