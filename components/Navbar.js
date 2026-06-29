import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">
        PostCraft AI
      </Link>

      <div className="nav-links">
        <Link href="/pricing" className="nav-link">
          Pricing
        </Link>

        {!session ? (
          <>
            <Link href="/login" className="nav-link">
              Login
            </Link>
            <Link href="/signup" className="nav-btn">
              Get Started
            </Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <button onClick={() => signOut()} className="nav-logout">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}