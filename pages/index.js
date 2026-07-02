import Link from 'next/link'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>PostCraft AI</title>
        <meta name="description" content="Create and post AI images to social media automatically" />
      </Head>

      <main>

        {/* ── HERO ─────────────────── */}
        <section className="hero">
          <p className="section-label">AI Powered Social Media</p>
          <h1>
            Create & Post AI Images <br />
            <span>In Seconds</span>
          </h1>
          <p>
            Describe what you want on WhatsApp or Telegram.
            AI creates the image, writes your caption,
            and delivers it to your chat instantly.
          </p>
          <div className="hero-buttons">
            <Link href="/signup" className="btn">Start For Free</Link>
            <Link href="/pricing" className="btn-outline">See Pricing</Link>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────── */}
        <section style={{ padding: '80px 32px', background: '#ffffff' }}>
          <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
            <div className="section-header">
              <p className="section-label">How It Works</p>
              <h2 className="section-title">Three Simple Steps</h2>
            </div>
            <div className="grid-3">
              {[
                { num: "01", title: "Describe Your Image", desc: "Message the bot on WhatsApp or Telegram with what you want to post." },
                { num: "02", title: "AI Creates It", desc: "AI generates the image, checks quality, and writes your caption and hashtags." },
                { num: "03", title: "Ready to Post", desc: "Get the completed poster and caption, ready for you to share!" },
              ].map((item, i) => (
                <div key={i} className="card" style={{ textAlign: 'center' }}>
                  <div className="step-icon">{item.num}</div>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-text">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────── */}
        <section style={{ padding: '80px 32px', background: '#f9fafb' }}>
          <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
            <div className="section-header">
              <p className="section-label">Features</p>
              <h2 className="section-title">Everything You Need</h2>
            </div>
            <div className="grid-3">
              {[
                { title: "AI Image Generation", desc: "Powered by Stability AI — creates stunning images from scratch every time." },
                { title: "Self Quality Check", desc: "AI checks its own work and regenerates until the image is perfect." },
                { title: "WhatsApp & Telegram", desc: "No new app needed. Use the messaging apps you already have." },
                { title: "Any Platform", desc: "Perfectly sized images and captions formatted for any social media platform." },
                { title: "Auto Captions", desc: "AI writes a great caption and 15 hashtags for every post." },
                { title: "Done in 30 Seconds", desc: "From describing your image to having a completed poster in your hand." },
              ].map((f, i) => (
                <div key={i} className="card">
                  <h3 className="card-title">{f.title}</h3>
                  <p className="card-text">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING PREVIEW ──────── */}
        <section style={{ padding: '80px 32px', background: '#ffffff' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <p className="section-label">Pricing</p>
            <h2 className="section-title">Simple Post Based Pricing</h2>
            <p className="section-sub" style={{ marginBottom: '48px' }}>
              Buy posts and use them whenever you want.
            </p>
            <div className="grid-4" style={{ marginBottom: '40px' }}>
              {[
                { name: "Free Trial", posts: "1 post (once)", price: "₹0" },
                { name: "Single", posts: "1 post", price: "₹120" },
                { name: "Starter", posts: "3 posts", price: "₹299" },
                { name: "Pro", posts: "10 posts", price: "₹899" },
              ].map((plan, i) => (
                <div key={i} className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', marginBottom: '8px' }}>{plan.name}</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#7c3aed', marginBottom: '4px' }}>{plan.price}</div>
                  <div style={{ fontSize: '13px', color: '#9ca3af' }}>{plan.posts}</div>
                </div>
              ))}
            </div>
            <Link href="/pricing" className="btn">See Full Pricing</Link>
          </div>
        </section>

        {/* ── CTA ──────────────────── */}
        <section className="cta">
          <h2>Ready to automate your social media?</h2>
          <p>Start with 1 free post. No credit card required.</p>
          <Link href="/signup" className="btn-white">Get Started Free</Link>
        </section>

        {/* ── FOOTER ───────────────── */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-logo">PostCraft AI</div>
            <div className="footer-links">
              <Link href="/pricing" className="footer-link">Pricing</Link>
              <Link href="/login" className="footer-link">Login</Link>
              <Link href="/signup" className="footer-link">Sign Up</Link>
            </div>
            <div className="footer-copy">© 2026 PostCraft AI</div>
          </div>
        </footer>

      </main>
    </>
  )
}