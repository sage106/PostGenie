import Head from 'next/head'
import Link from 'next/link'
import Script from 'next/script'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'

const plans = [
  {
    name: "Free Trial",
    price: "₹0",
    posts: "1 post",
    per_post: null,
    once: true,
    features: [
      "1 free AI generated image",
      "One time trial only",
      "Caption and hashtag generation",
      "Telegram & WhatsApp bot access",
    ],
    popular: false,
  },
  {
    name: "Single",
    price: "₹120",
    posts: "1 post",
    per_post: "₹120 per post",
    once: false,
    features: [
      "1 AI generated image",
      "Caption and hashtag generation",
      "Telegram & WhatsApp bot access",
    ],
    popular: false,
  },
  {
    name: "Starter",
    price: "₹299",
    posts: "3 posts",
    per_post: "₹100 per post",
    once: false,
    features: [
      "3 AI generated images",
      "Save ₹21 vs buying single",
      "Caption and hashtag generation",
      "Telegram & WhatsApp bot access",
      "Post history",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "₹899",
    posts: "10 posts",
    per_post: "₹90 per post",
    once: false,
    features: [
      "10 AI generated images",
      "Save ₹301 vs buying single",
      "Caption and hashtag generation",
      "Telegram & WhatsApp bot access",
      "Post history",
      "Priority image generation",
    ],
    popular: true,
  },
]

export default function Pricing() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loadingPlan, setLoadingPlan] = useState(null)

  async function handleBuyPlan(plan) {
    if (status !== 'authenticated') {
      router.push(`/login?redirect=/pricing`)
      return
    }

    setLoadingPlan(plan.name)

    try {
      // 1. Create order on the backend
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ planName: plan.name })
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to create payment order')
      }

      // 2. Open Razorpay checkout interface
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "PostGenie AI",
        description: `${plan.name} Plan - ${plan.posts}`,
        order_id: data.orderId,
        handler: async function (response) {
          setLoadingPlan(plan.name)
          try {
            // 3. Verify signature on the backend
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planName: plan.name
              })
            })

            const verifyData = await verifyRes.json()
            if (!verifyRes.ok || verifyData.error) {
              throw new Error(verifyData.error || 'Payment verification failed')
            }

            // 4. Redirect to dashboard with success query
            router.push('/dashboard?payment=success')
          } catch (err) {
            console.error("Verification failed:", err)
            alert(`Payment verification failed: ${err.message}`)
            setLoadingPlan(null)
          }
        },
        prefill: {
          name: session.user.name || '',
          email: session.user.email || ''
        },
        theme: {
          color: "#7c3aed"
        },
        modal: {
          ondismiss: function() {
            setLoadingPlan(null)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (error) {
      console.error("Payment initiation failed:", error)
      alert(`Could not initiate payment: ${error.message}`)
      setLoadingPlan(null)
    }
  }

  return (
    <>
      <Head>
        <title>Pricing — PostGenie</title>
        <meta name="description" content="Simple post based pricing." />
      </Head>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <main>

        {/* ── HEADER ───────────────── */}
        <section className="pricing-header">
          <p className="section-label">Pricing</p>
          <h1>Simple Post Based Pricing</h1>
          <p>Buy posts and use them whenever you want. No subscriptions, no wasted money.</p>
        </section>

        {/* ── PLANS ────────────────── */}
        <section className="plans-section">
          <div className="plans-wrapper">
            <div className="grid-4">
              {plans.map((plan, i) => (
                <div key={i} className={plan.popular ? 'plan-popular' : 'plan'}>

                  {plan.popular && (
                    <div className="plan-badge">Most Popular</div>
                  )}

                  <div className="plan-name">{plan.name}</div>
                  <div className="plan-price">{plan.price}</div>
                  <div className="plan-posts">{plan.posts}</div>

                  {plan.per_post && (
                    <div style={{
                      fontSize: '12px',
                      color: plan.popular ? '#e9d5ff' : '#9ca3af',
                      marginBottom: '8px',
                      marginTop: '-8px'
                    }}>
                      {plan.per_post}
                    </div>
                  )}

                  {plan.once && (
                    <div style={{
                      fontSize: '12px',
                      color: '#ef4444',
                      marginBottom: '8px',
                      marginTop: '-8px',
                      fontWeight: '600'
                    }}>
                      One time only
                    </div>
                  )}

                  <hr className={plan.popular ? 'plan-divider-white' : 'plan-divider'} />

                  <div>
                    {plan.features.map((feature, j) => (
                      <div key={j} className="plan-feature">
                        <span className={plan.popular ? 'plan-feature-tick-white' : 'plan-feature-tick'}>
                          ✓
                        </span>
                        <span className={plan.popular ? 'plan-feature-text-white' : 'plan-feature-text'}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {plan.once ? (
                    <Link
                      href={status === 'authenticated' ? "/dashboard" : "/signup"}
                      className={plan.popular ? 'plan-btn-white' : 'plan-btn'}
                    >
                      {status === 'authenticated' ? 'Go to Dashboard' : 'Try For Free'}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleBuyPlan(plan)}
                      disabled={loadingPlan !== null}
                      className={plan.popular ? 'plan-btn-white' : 'plan-btn'}
                      style={{
                        width: '100%',
                        border: 'none',
                        cursor: loadingPlan !== null ? 'not-allowed' : 'pointer',
                        textAlign: 'center',
                        display: 'block'
                      }}
                    >
                      {loadingPlan === plan.name ? 'Processing...' : 'Buy Now'}
                    </button>
                  )}

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────── */}
        <section className="faq-section">
          <div className="faq-wrapper">
            <div className="section-header">
              <p className="section-label">FAQ</p>
              <h2 className="section-title">Common Questions</h2>
            </div>

            {[
              {
                q: "What happens when I run out of posts?",
                a: "Your bot will notify you when posts are running low. You can buy more posts anytime from your dashboard."
              },
              {
                q: "Can I use my free trial post again?",
                a: "No. The free trial gives you 1 post completely free but it is a one time offer. After that you need to buy posts."
              },
              {
                q: "Do unused posts expire?",
                a: "No! Posts never expire. Buy once and use them whenever you want at your own pace."
              },
              {
                q: "Which social media platforms are supported?",
                a: "PostGenie generates high-quality posters and captions that you can download and post on any social media platform, including Instagram, Facebook, and Twitter/X."
              },
              {
                q: "Which messaging app does the bot use?",
                a: "The bot currently supports Telegram and WhatsApp."
              },
              {
                q: "How good are the AI generated images?",
                a: "We use Flux — one of the best image generation models available. Our AI also self checks quality and regenerates until the image scores 7 out of 10 or higher."
              },
            ].map((item, i) => (
              <div key={i} className="faq-card">
                <h3 className="faq-question">{item.q}</h3>
                <p className="faq-answer">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────── */}
        <section className="cta">
          <h2>Start with 1 free post today</h2>
          <p>No credit card required. No commitment.</p>
          <Link href="/signup" className="btn-white">
            Try For Free
          </Link>
        </section>

        {/* ── FOOTER ───────────────── */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-logo">PostGenie</div>
            <div className="footer-links">
              <Link href="/" className="footer-link">Home</Link>
              <Link href="/login" className="footer-link">Login</Link>
              <Link href="/signup" className="footer-link">Sign Up</Link>
            </div>
            <div className="footer-copy">© 2026 PostGenie</div>
          </div>
        </footer>

      </main>
    </>
  )
}