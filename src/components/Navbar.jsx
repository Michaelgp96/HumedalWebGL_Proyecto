import { useState } from 'react'

export default function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@400;600&display=swap');

        .nav-root {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 100;
          background: rgba(245, 240, 232, 0.95);
          backdrop-filter: blur(8px);
          border-bottom: 2px solid #2d6a4f;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 12px rgba(45,106,79,0.10);
        }

        .nav-logo {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: #1b4332;
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          letter-spacing: -0.5px;
        }

        .nav-logo span {
          font-size: 26px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: 'Source Sans 3', sans-serif;
        }

        .nav-link {
          color: #2d4a2d;
          text-decoration: none;
          font-weight: 600;
          font-size: 15px;
          padding: 6px 14px;
          border-radius: 20px;
          transition: all 0.2s;
          letter-spacing: 0.2px;
        }

        .nav-link:hover {
          background: #2d6a4f;
          color: #f5f0e8;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Source Sans 3', sans-serif;
        }

        .nav-user {
          font-size: 13px;
          color: #52796f;
          font-weight: 600;
          max-width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .btn-logout {
          background: transparent;
          border: 2px solid #2d6a4f;
          color: #2d6a4f;
          font-family: 'Source Sans 3', sans-serif;
          font-weight: 700;
          font-size: 13px;
          padding: 5px 14px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .btn-logout:hover {
          background: #2d6a4f;
          color: #f5f0e8;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 4px;
          background: none;
          border: none;
        }

        .hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: #1b4332;
          border-radius: 2px;
          transition: all 0.3s;
        }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          background: rgba(245, 240, 232, 0.98);
          border-bottom: 2px solid #2d6a4f;
          padding: 16px 24px 24px;
          z-index: 99;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 8px 24px rgba(45,106,79,0.15);
        }

        .mobile-menu.open {
          display: flex;
        }

        .mobile-link {
          color: #1b4332;
          text-decoration: none;
          font-family: 'Source Sans 3', sans-serif;
          font-weight: 600;
          font-size: 16px;
          padding: 12px 16px;
          border-radius: 10px;
          transition: background 0.2s;
        }

        .mobile-link:hover {
          background: #d8f3dc;
        }

        .mobile-divider {
          height: 1px;
          background: #b7d5c0;
          margin: 8px 0;
        }

        .mobile-user {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 13px;
          color: #52796f;
          font-weight: 600;
          padding: 0 16px 4px;
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-user { display: none; }
          .hamburger { display: flex; }
          .nav-logo { font-size: 18px; }
        }
      `}</style>

      <nav className="nav-root">
        <a href="#inicio" className="nav-logo">
          <span>🌿</span> Humedales Urbanos
        </a>

        <div className="nav-links">
          <a href="#inicio" className="nav-link">Inicio</a>
          <a href="#juego" className="nav-link">Juego</a>
          <a href="#recursos" className="nav-link">Recursos</a>
          <a href="#ranking" className="nav-link">Ranking</a>
        </div>

        <div className="nav-right">
          {user && (
            <>
              <span className="nav-user">👤 {user.email}</span>
              <button className="btn-logout" onClick={onLogout}>
                Cerrar sesión
              </button>
            </>
          )}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            <span style={{ transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <a href="#inicio" className="mobile-link" onClick={() => setMenuOpen(false)}>🏠 Inicio</a>
        <a href="#juego" className="mobile-link" onClick={() => setMenuOpen(false)}>🎮 Juego</a>
        <a href="#recursos" className="mobile-link" onClick={() => setMenuOpen(false)}>📚 Recursos</a>
        <a href="#ranking" className="mobile-link" onClick={() => setMenuOpen(false)}>🏆 Ranking</a>
        {user && (
          <>
            <div className="mobile-divider" />
            <span className="mobile-user">👤 {user.email}</span>
            <button
              className="btn-logout"
              style={{ margin: '4px 16px 0', width: 'calc(100% - 32px)' }}
              onClick={() => { onLogout(); setMenuOpen(false) }}
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </>
  )
}
