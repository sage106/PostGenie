import { getServerSession } from "next-auth"
import supabase from "@/lib/supabase"
import Razorpay from "razorpay"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  // 1. Authenticate user session
  const session = await getServerSession(req, res, {})
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Not authenticated" })
  }

  const { planName } = req.body
  if (!planName) {
    return res.status(400).json({ error: "Plan name is required" })
  }

  try {
    // 2. Fetch plan details from Supabase plans table
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("name", planName.toLowerCase())
      .single()

    if (planError || !plan) {
      return res.status(404).json({ error: `Plan '${planName}' not found in database.` })
    }

    // 3. Initialize Razorpay client
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })

    // 4. Create an order with Razorpay API
    const amountInPaisa = plan.price_inr * 100
    const orderOptions = {
      amount: amountInPaisa,
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      notes: {
        email: session.user.email,
        planName: planName.toLowerCase()
      }
    }

    const order = await razorpay.orders.create(orderOptions)

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    })

  } catch (error) {
    console.error("Create order error:", error)
    return res.status(500).json({ error: "Failed to create payment order. " + error.message })
  }
}
