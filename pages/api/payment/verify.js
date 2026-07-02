import { getServerSession } from "next-auth"
import supabase from "@/lib/supabase"
import crypto from "crypto"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  // 1. Authenticate user session
  const session = await getServerSession(req, res, {})
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Not authenticated" })
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planName } = req.body

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planName) {
    return res.status(400).json({ error: "Missing required payment verification details" })
  }

  try {
    // 2. Verify Razorpay signature to ensure transaction authenticity
    const secret = process.env.RAZORPAY_KEY_SECRET
    const hmac = crypto.createHmac("sha256", secret)
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const generatedSignature = hmac.digest("hex")

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Signature verification failed. Potential fraudulent transaction." })
    }

    // 3. Fetch user profile from Supabase
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", session.user.email)
      .single()

    if (userError || !user) {
      return res.status(404).json({ error: "User not found in database." })
    }

    // 4. Fetch purchased plan details to find posts to credit
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("name", planName.toLowerCase())
      .single()

    if (planError || !plan) {
      return res.status(404).json({ error: `Plan '${planName}' not found in database.` })
    }

    // 5. Update user post credits in Supabase users table
    const newPostsRemaining = user.posts_remaining + plan.posts_included
    const newPostsTotal = user.posts_total + plan.posts_included

    const { error: updateError } = await supabase
      .from("users")
      .update({
        posts_remaining: newPostsRemaining,
        posts_total: newPostsTotal,
        subscription_plan: plan.name,
        subscription_status: "active"
      })
      .eq("email", session.user.email)

    if (updateError) {
      console.error("Database update error:", updateError)
      return res.status(500).json({ error: "Failed to update credits in database." })
    }

    // 6. Optionally: log transaction in a payments/audit table if it existed, but we update user directly
    return res.status(200).json({
      success: true,
      message: `Successfully credited ${plan.posts_included} posts to account.`,
      posts_remaining: newPostsRemaining
    })

  } catch (error) {
    console.error("Verify payment error:", error)
    return res.status(500).json({ error: "Internal server error during verification: " + error.message })
  }
}
