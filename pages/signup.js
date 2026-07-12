import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Signup() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // basic validation
    if (!name || !email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      // we will add real signup logic here later
      // for now just redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  async function handleGoogleSignup() {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <>
      <Head>
        <title>Sign Up — PostGenie</title>
      </Head>

      <div className="auth-page">
        <div className="auth-box">

          {/* logo */}
          <div className="auth-logo">PostGenie</div>

          {/* title */}
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-sub">Start with 5 free posts. No credit card needed.</p>

          {/* error message */}
          {error && <div className="auth-error">{error}</div>}

          {/* google button */}
          <button className="auth-google" onClick={handleGoogleSignup}>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z"/>
            </svg>
            Continue with Google
          </button>

          {/* divider */}
          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or</span>
            <div className="auth-divider-line" />
          </div>

          {/* form */}
          <form onSubmit={handleSignup}>

            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <input
                type="text"
                className="auth-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Email</label>
              <input
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                type="password"
                className="auth-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

          </form>

          {/* footer */}
          <div className="auth-footer">
            Already have an account?{' '}
            <Link href="/login" className="auth-link">
              Log in
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}