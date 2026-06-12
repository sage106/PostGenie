import { getServerSession } from "next-auth"
import supabase from "@/lib/supabase"

// owner email — this account gets unlimited free posts
const OWNER_EMAIL = "125.mohd.ali.faridi@gmail.com"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  // get the logged in user session
  const session = await getServerSession(req, res, {})

  if (!session?.user?.email) {
    return res.status(401).json({ error: "Not authenticated" })
  }

  // fetch current user data
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("posts_remaining, posts_used, posts_total, free_trial_used")
    .eq("email", session.user.email)
    .single()

  if (fetchError || !user) {
    return res.status(404).json({ error: "User not found" })
  }

  // owner gets unlimited posts — no credit deduction
  const isOwner = session.user.email === OWNER_EMAIL

  if (isOwner) {
    // just increment posts_used for tracking, don't deduct credits
    await supabase
      .from("users")
      .update({ posts_used: user.posts_used + 1 })
      .eq("email", session.user.email)

    return res.status(200).json({
      success: true,
      posts_remaining: 999999,
      posts_used: user.posts_used + 1,
    })
  }

  // check if user has posts remaining
  if (user.posts_remaining <= 0) {
    return res.status(403).json({
      error: "No posts remaining. Please purchase more posts.",
      posts_remaining: 0,
    })
  }

  // determine if this is the free trial post
  const isFreeTrial = !user.free_trial_used && user.posts_remaining === 1

  // decrement posts_remaining, increment posts_used
  const { error: updateError } = await supabase
    .from("users")
    .update({
      posts_remaining: user.posts_remaining - 1,
      posts_used: user.posts_used + 1,
      free_trial_used: isFreeTrial ? true : user.free_trial_used,
    })
    .eq("email", session.user.email)

  if (updateError) {
    return res.status(500).json({ error: "Failed to update post count" })
  }

  return res.status(200).json({
    success: true,
    posts_remaining: user.posts_remaining - 1,
    posts_used: user.posts_used + 1,
  })
}
