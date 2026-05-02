import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function Hero({ user, setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAuth() {
    setError('')
    setLoading(true)
    const { data, error } = isLogin
      ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
      : await supabase.auth.signUp({ email: email.trim(), password })

    setLoading(false)
    if (error) setError(error.message)
    else setUser(data.user)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAuth()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');

        .hero-section {
          min-height: 100vh;
          padding-top: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
        }

        /* Decorative elements */
        .hero-decoration {
          position: absolute;
          pointer-events: none;
        }

        .deco-circle-1 {
          top: 10%;
          right: 8%;
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, rgba(129,199,132,0.3) 0%, transparent 70%);
          border-radius: 50%;
        }

        .deco-circle-2 {
          bottom: 15%;
          left: 6%;
          width: 160px;
          height: 160px;
          background: radial-gradient(circle, rgba(100,181,246,0.25) 0%, transparent 70%);
          border-radius: 50%;
        }

        .deco-leaf {
          top: 20%;
          left: 10%;
          font-size: 48px;
          opacity: 0.4;
          transform: rotate(-20deg);
        }

        .hero-container {
          position: relative;
          z-index: 1;
          max-width: 500px;
          width: 100%;
          padding: 40px 24px;
          text-align: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #81c784;
          color: white;
          font-family: 'Poppins', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 20px;
          margin-bottom: 20px;
        }

        .hero-title {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(40px, 6vw, 56px);
          font-weight: 800;
          color: #1b5e20;
          line-height: 1.1;
          margin: 0 0 16px;
          text-shadow: 2px 2px 0 rgba(255,255,255,0.5);
        }

        .hero-title .highlight {
          color: #4caf50;
          display: block;
        }

        .hero-subtitle {
          font-family: 'Poppins', sans-serif;
          font-size: 17px;
          color: #2e7d32;
          line-height: 1.5;
          font-weight: 500;
          margin: 0 auto 32px;
          max-width: 420px;
        }

        .auth-box {
          background: white;
          border: 3px solid #81c784;
          border-radius: 20px;
          padding: 32px 28px;
          box-shadow: 0 8px 30px rgba(27,94,32,0.15);
        }

        .auth-header {
          font-family: 'Poppins', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #1b5e20;
          margin: 0 0 24px;
        }

        .form-group {
          margin-bottom: 18px;
          text-align: left;
        }

        .form-label {
          display: block;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #2e7d32;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input {
          width: 100%;
          box-sizing: border-box;
          background: #f1f8e9;
          border: 2px solid #c8e6c9;
          border-radius: 12px;
          padding: 13px 16px;
          font-family: 'Poppins', sans-serif;
          font-size: 15px;
          color: #1b5e20;
          outline: none;
          transition: all 0.2s;
        }

        .form-input:focus {
          border-color: #66bb6a;
          background: white;
          box-shadow: 0 0 0 3px rgba(129,199,132,0.2);
        }

        .form-input::placeholder {
          color: #a5d6a7;
        }

        .error-box {
          background: #ffebee;
          border: 2px solid #ef5350;
          border-radius: 10px;
          padding: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          color: #c62828;
          font-weight: 600;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-submit {
          width: 100%;
          background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(76,175,80,0.3);
          margin-bottom: 18px;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(76,175,80,0.4);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .toggle-text {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          color: #66bb6a;
          font-weight: 600;
          cursor: pointer;
        }

        .toggle-text span {
          color: #2e7d32;
          text-decoration: underline;
        }

        /* Welcome state */
        .welcome-box {
          background: white;
          border: 3px solid #81c784;
          border-radius: 20px;
          padding: 40px 28px;
          box-shadow: 0 8px 30px rgba(27,94,32,0.15);
        }

        .welcome-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .welcome-title {
          font-family: 'Poppins', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #1b5e20;
          margin: 0 0 8px;
        }

        .welcome-email {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          color: #66bb6a;
          font-weight: 600;
          margin-bottom: 28px;
          word-break: break-all;
        }

        .btn-play {
          display: inline-block;
          background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
          color: white;
          text-decoration: none;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 18px;
          padding: 14px 40px;
          border-radius: 50px;
          transition: all 0.2s;
          box-shadow: 0 6px 20px rgba(76,175,80,0.3);
        }

        .btn-play:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(76,175,80,0.45);
        }

        @media (max-width: 600px) {
          .hero-section {
            padding-top: 64px;
          }
          
          .hero-container {
            padding: 24px 16px;
          }

          .hero-title {
            font-size: 36px;
          }

          .auth-box, .welcome-box {
            padding: 24px 20px;
          }
        }
      `}</style>

      <section id="inicio" className="hero-section">
        <div className="hero-decoration deco-circle-1" />
        <div className="hero-decoration deco-circle-2" />
        <div className="hero-decoration deco-leaf">🌿</div>

        <div className="hero-container">
          <div className="hero-badge">
            🌱 Proyecto educativo · Bogotá
          </div>

          <h1 className="hero-title">
            Descubre los
            <span className="highlight">Humedales Urbanos</span>
          </h1>

          <p className="hero-subtitle">
            Explora ecosistemas acuáticos a través de una experiencia interactiva 3D educativa
          </p>

          {!user ? (
            <div className="auth-box">
              <h2 className="auth-header">
                {isLogin ? '¡Bienvenido!' : 'Crea tu cuenta'}
              </h2>

              <div className="form-group">
                <label className="form-label">Correo electrónico</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              {error && (
                <div className="error-box">
                  <span>⚠️</span> {error}
                </div>
              )}

              <button
                className="btn-submit"
                onClick={handleAuth}
                disabled={loading}
              >
                {loading ? 'Cargando...' : isLogin ? 'Iniciar sesión 🌿' : 'Registrarme 🌱'}
              </button>

              <p className="toggle-text" onClick={() => { setIsLogin(!isLogin); setError('') }}>
                {isLogin
                  ? <>¿No tienes cuenta? <span>Regístrate aquí</span></>
                  : <>¿Ya tienes cuenta? <span>Inicia sesión</span></>
                }
              </p>
            </div>
          ) : (
            <div className="welcome-box">
              <div className="welcome-icon">🦆</div>
              <h2 className="welcome-title">¡Listo para explorar!</h2>
              <p className="welcome-email">{user.email}</p>
              <a href="#juego" className="btn-play">
                Iniciar recorrido →
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
