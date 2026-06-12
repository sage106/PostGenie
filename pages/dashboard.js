import Head from 'next/head'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // redirect to login if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // show loading while checking session
  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#6b7280' }}>Loading...</p>
      </div>
    )
  }

  // dummy data for now
  // we will connect real data from Supabase later
  const stats = {
    posts_remaining: 5,
    posts_used: 0,
    plan: 'Free Trial'
  }

  const socialAccounts = [
    { name: 'Instagram', icon: '📸', bg: '#fdf2f8', connected: false },
    { name: 'Facebook', icon: '👤', bg: '#eff6ff', connected: false },
    { name: 'Twitter/X', icon: '🐦', bg: '#f0f9ff', connected: false },
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
              Welcome back, {session?.user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="dash-sub">
              Here is an overview of your account
            </p>
          </div>

          {/* ── STATS ──────────────── */}
          <div className="stats-row">
            <div className="stat">
              <div className="stat-label">Posts Remaining</div>
              <div className="stat-value-purple">{stats.posts_remaining}</div>
              <div className="stat-sub">Ready to use</div>
            </div>
            <div className="stat">
              <div className="stat-label">Posts Used</div>
              <div className="stat-value">{stats.posts_used}</div>
              <div className="stat-sub">Total created</div>
            </div>
            <div className="stat">
              <div className="stat-label">Current Plan</div>
              <div className="stat-value" style={{ fontSize: '24px', paddingTop: '6px' }}>
                {stats.plan}
              </div>
              <div className="stat-sub">
                <Link href="/pricing" style={{ color: '#7c3aed' }}>
                  Upgrade plan →
                </Link>
              </div>
            </div>
          </div>

          {/* ── BOT ACCESS ─────────── */}
          <div className="dash-section">
            <div className="bot-card">
              <div className="bot-card-left">
                <h3>Your Bot is Ready!</h3>
                <p>Click to get your unique bot link and start creating posts</p>
              </div>
              <Link href="/bot-access" className="bot-card-btn">
                Get Bot Link →
              </Link>
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
                      {account.icon}
                    </div>
                    <div>
                      <div className="connect-name">{account.name}</div>
                      <div className="connect-status">
                        {account.connected ? 'Connected' : 'Not connected'}
                      </div>
                    </div>
                  </div>
                  {account.connected ? (
                    <span className="connected-badge">✓ Connected</span>
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