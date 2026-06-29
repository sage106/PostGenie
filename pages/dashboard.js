import Head from 'next/head'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  // redirect to login if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // fetch real user data from supabase via api
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            // user might not exist in supabase yet, use session data
            setStats({
              posts_remaining: session?.user?.posts_remaining ?? 1,
              posts_used: session?.user?.posts_used ?? 0,
              plan: session?.user?.plan ?? 'Free Trial',
            })
          } else {
            setStats({
              posts_remaining: data.posts_remaining,
              posts_used: data.posts_used,
              plan: data.subscription_plan,
            })
          }
          setLoading(false)
        })
        .catch(() => {
          // fallback to session data
          setStats({
            posts_remaining: session?.user?.posts_remaining ?? 1,
            posts_used: session?.user?.posts_used ?? 0,
            plan: session?.user?.plan ?? 'Free Trial',
          })
          setLoading(false)
        })
    }
  }, [status, session])

  // show loading while checking session
  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#6b7280' }}>Loading...</p>
      </div>
    )
  }

  const socialAccounts = [
    { name: 'Instagram', initial: 'IG', bg: '#fdf2f8', connected: false },
    { name: 'Facebook', initial: 'FB', bg: '#eff6ff', connected: false },
    { name: 'Twitter/X', initial: 'X', bg: '#f0f9ff', connected: false },
  ]

  const postHistory = []

  return (
    <>
      <Head>
        <title>Dashboard — PostCraft AI</title>
      </Head>

      <div className="dash-page">
        <div className="dash-inner">

          {/* ── HEADER ─────────────── */}
          <div className="dash-header">
            <h1 className="dash-title">
              Welcome back, {session?.user?.name?.split(' ')[0]}
            </h1>
            <p className="dash-sub">
              Here is an overview of your account
            </p>
          </div>

          {/* ── STATS ──────────────── */}
          <div className="stats-row">
            <div className="stat">
              <div className="stat-label">Posts Remaining</div>
              <div className="stat-value-purple">{stats?.posts_remaining ?? 0}</div>
              <div className="stat-sub">
                {stats?.posts_remaining > 0 ? 'Ready to use' : 'Buy more posts'}
              </div>
            </div>
            <div className="stat">
              <div className="stat-label">Posts Used</div>
              <div className="stat-value">{stats?.posts_used ?? 0}</div>
              <div className="stat-sub">Total created</div>
            </div>
            <div className="stat">
              <div className="stat-label">Current Plan</div>
              <div className="stat-value" style={{ fontSize: '24px', paddingTop: '6px' }}>
                {stats?.plan ?? 'Free Trial'}
              </div>
              <div className="stat-sub">
                <Link href="/pricing" style={{ color: '#7c3aed' }}>
                  Upgrade plan
                </Link>
              </div>
            </div>
          </div>

          {/* ── NO POSTS WARNING ───── */}
          {stats?.posts_remaining === 0 && (
            <div className="dash-warning">
              <div>
                <h3 className="dash-warning-title">
                  No posts remaining
                </h3>
                <p className="dash-warning-text">
                  Your free trial post has been used. Buy more posts to continue creating.
                </p>
              </div>
              <Link href="/pricing" className="dash-warning-btn">
                Buy Posts
              </Link>
            </div>
          )}

          {/* ── BOT ACCESS ─────────── */}
          <div className="dash-section">
            <div className="bot-card">
              <div className="bot-card-left">
                <h3>{stats?.posts_remaining > 0 ? 'Your Bot is Ready' : 'Buy Posts to Use Bot'}</h3>
                <p>
                  {stats?.posts_remaining > 0
                    ? 'Click to get your unique bot link and start creating posts'
                    : 'You need to purchase posts before using the bot'
                  }
                </p>
              </div>
              {stats?.posts_remaining > 0 ? (
                <Link href="/bot-access" className="bot-card-btn">
                  Get Bot Link
                </Link>
              ) : (
                <Link href="/pricing" className="bot-card-btn" style={{ background: '#f59e0b' }}>
                  Buy Posts
                </Link>
              )}
            </div>
          </div>

          {/* ── SOCIAL ACCOUNTS ────── */}
          <div className="dash-section">
            <h2 className="dash-section-title">Connected Social Accounts</h2>
            <div className="connect-grid">
              {socialAccounts.map((account, i) => (
                <div key={i} className="connect-card">
                  <div className="connect-card-left">
                    <div
                      className="connect-icon"
                      style={{ background: account.bg }}
                    >
                      <span className="connect-initial">{account.initial}</span>
                    </div>
                    <div>
                      <div className="connect-name">{account.name}</div>
                      <div className="connect-status">
                        {account.connected ? 'Connected' : 'Not connected'}
                      </div>
                    </div>
                  </div>
                  {account.connected ? (
                    <span className="connected-badge">Connected</span>
                  ) : (
                    <button className="connect-btn">Connect</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── POST HISTORY ───────── */}
          <div className="dash-section">
            <h2 className="dash-section-title">Post History</h2>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Prompt</th>
                  <th>Platforms</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {postHistory.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="history-empty">
                      No posts yet. Get your bot link and create your first post!
                    </td>
                  </tr>
                ) : (
                  postHistory.map((post, i) => (
                    <tr key={i}>
                      <td>{post.prompt}</td>
                      <td>
                        {post.platforms.map((p, j) => (
                          <span key={j} className="platform-tag">{p}</span>
                        ))}
                      </td>
                      <td>{post.date}</td>
                      <td>{post.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  )
}