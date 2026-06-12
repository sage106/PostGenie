import Head from 'next/head'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function BotAccess() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [postsRemaining, setPostsRemaining] = useState(null)
  const [botToken, setBotToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // fetch real post count from supabase
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setPostsRemaining(data.posts_remaining)
            setBotToken(data.bot_token)
          } else {
            setPostsRemaining(session?.user?.posts_remaining ?? 0)
          }
          setLoading(false)
        })
        .catch(() => {
          setPostsRemaining(session?.user?.posts_remaining ?? 0)
          setLoading(false)
        })
    }
  }, [status, session])

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#6b7280' }}>Loading...</p>
      </div>
    )
  }

  // use real bot token from supabase
  const botLink = botToken ? `https://t.me/Post_Geniebot?start=${botToken}` : ''

  function handleCopy() {
    navigator.clipboard.writeText(botLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // if no posts remaining, show paywall
  if (postsRemaining <= 0) {
    return (
      <>
        <Head>
          <title>Bot Access — PostCraft AI</title>
        </Head>

        <div className="bot-access-page">
          <div className="bot-access-inner">

            <div className="bot-access-header">
              <h1 className="bot-access-title">No Posts Remaining</h1>
              <p className="bot-access-sub">
                You have used all your posts. Buy more to continue creating.
              </p>
            </div>

            {/* ── PAYWALL CARD ──────── */}
            <div style={{
              background: 'linear-gradient(135deg, #1e1b4b, #4c1d95)',
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
              color: 'white',
              marginBottom: '32px',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
              <h2 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: '700' }}>
                Post Credits Exhausted
              </h2>
              <p style={{ margin: '0 0 24px', color: '#c4b5fd', fontSize: '15px', lineHeight: '1.6' }}>
                Your free trial post has been used. Purchase more posts to keep creating
                amazing AI-generated content for your social media.
              </p>
              <Link href="/pricing" style={{
                display: 'inline-block',
                background: 'white',
                color: '#4c1d95',
                padding: '14px 32px',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '700',
                textDecoration: 'none',
                transition: 'transform 0.2s',
              }}>
                View Pricing Plans →
              </Link>
            </div>

            {/* ── PRICING PREVIEW ───── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '32px',
            }}>
              {[
                { name: 'Single', price: '₹120', posts: '1 post' },
                { name: 'Starter', price: '₹299', posts: '3 posts' },
                { name: 'Pro', price: '₹899', posts: '10 posts' },
              ].map((plan, i) => (
                <div key={i} style={{
                  background: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '14px', color: '#a1a1aa', marginBottom: '4px' }}>{plan.name}</div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#e4e4e7' }}>{plan.price}</div>
                  <div style={{ fontSize: '13px', color: '#71717a' }}>{plan.posts}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px' }}>
              <Link
                href="/dashboard"
                style={{ color: '#7c3aed', fontSize: '14px', fontWeight: '500' }}
              >
                ← Back to Dashboard
              </Link>
            </div>

          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Bot Access — PostCraft AI</title>
      </Head>

      <div className="bot-access-page">
        <div className="bot-access-inner">

          {/* ── HEADER ─────────────── */}
          <div className="bot-access-header">
            <h1 className="bot-access-title">Your Bot Access</h1>
            <p className="bot-access-sub">
              Use the link below to access your personal PostCraft AI bot
            </p>
          </div>

          {/* ── POSTS REMAINING BADGE ─ */}
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
            border: '1px solid #86efac',
            borderRadius: '10px',
            padding: '12px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#166534',
            fontWeight: '500',
          }}>
            ✅ You have <strong>{postsRemaining}</strong> post{postsRemaining !== 1 ? 's' : ''} remaining
          </div>

          {/* ── BOT LINK CARD ──────── */}
          <div className="bot-link-card">
            <h2>Your Unique Bot Link</h2>
            <p>
              This link is personal to you. Do not share it with anyone.
            </p>
            <div className="bot-link-box">
              {botLink}
            </div>
            <button className="bot-link-copy" onClick={handleCopy}>
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>

          {/* ── PLATFORMS ──────────── */}
          <h2 className="dash-section-title">Open Bot On</h2>
          <div className="platform-grid">
            <a
              href={botLink}
              target="_blank"
              rel="noopener noreferrer"
              className="platform-card"
            >
              <div className="platform-icon" style={{ background: '#eff6ff' }}>
                ✈️
              </div>
              <div>
                <div className="platform-name">Telegram</div>
                <div className="platform-desc">
                  Click to open bot in Telegram app
                </div>
              </div>
            </a>

            <div className="platform-card" style={{ opacity: '0.5', cursor: 'not-allowed' }}>
              <div className="platform-icon" style={{ background: '#f0fdf4' }}>
                💬
              </div>
              <div>
                <div className="platform-name">WhatsApp</div>
                <div className="platform-desc">
                  Coming soon
                </div>
              </div>
            </div>

            <div className="platform-card" style={{ opacity: '0.5', cursor: 'not-allowed' }}>
              <div className="platform-icon" style={{ background: '#faf5ff' }}>
                🎮
              </div>
              <div>
                <div className="platform-name">Discord</div>
                <div className="platform-desc">
                  Coming soon
                </div>
              </div>
            </div>

            <div className="platform-card" style={{ opacity: '0.5', cursor: 'not-allowed' }}>
              <div className="platform-icon" style={{ background: '#fff7ed' }}>
                💼
              </div>
              <div>
                <div className="platform-name">Slack</div>
                <div className="platform-desc">
                  Coming soon
                </div>
              </div>
            </div>
          </div>

          {/* ── HOW TO USE ─────────── */}
          <div className="how-to-card">
            <h2>How To Use The Bot</h2>

            <div className="how-to-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Connect Your Social Accounts</h3>
                <p>
                  Go to your dashboard and connect your Instagram
                  and Facebook accounts before using the bot.
                </p>
              </div>
            </div>

            <div className="how-to-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Open The Bot</h3>
                <p>
                  Click the Telegram link above to open your
                  personal bot. Click Start to begin.
                </p>
              </div>
            </div>

            <div className="how-to-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Describe Your Image</h3>
                <p>
                  Send a message describing the image you want.
                  For example: &quot;a sunset over mountains, cinematic style&quot;
                </p>
              </div>
            </div>

            <div className="how-to-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>AI Generates and Checks</h3>
                <p>
                  The bot generates your image and self checks
                  quality. It keeps improving until it scores
                  7 out of 10 or higher.
                </p>
              </div>
            </div>

            <div className="how-to-step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Approve and Post</h3>
                <p>
                  You will see the image with a caption and hashtags.
                  Reply yes to post it or describe what to change.
                </p>
              </div>
            </div>

          </div>

          {/* ── BACK TO DASHBOARD ──── */}
          <div style={{ marginTop: '24px' }}>
            <Link
              href="/dashboard"
              style={{ color: '#7c3aed', fontSize: '14px', fontWeight: '500' }}
            >
              ← Back to Dashboard
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}