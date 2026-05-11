import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Game({ user }) {
  const IMAGEN_HUMEDAL = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000"
  
  // Estados
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completedGames, setCompletedGames] = useState([]);
  const [showControls, setShowControls] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Inicializar timer y detectar móvil
  useEffect(() => {
    setStartTime(Date.now());
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);
    
    // Actualizar timer cada segundo
    const interval = setInterval(() => {
      if (startTime) {
        setElapsedTime(Date.now() - startTime);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime]);

  // Configurar receptor de puntajes Unity
  useEffect(() => {
    if (!user) return;
    
    window.recibirPuntajeUnity = async (mensaje) => {
      try {
        const [puntaje, minijuego] = mensaje.split('|');
        const score = parseInt(puntaje);
        
        // Agregar a completados
        const nuevoJuego = { minigame: minijuego, score: score };
        const nuevosCompletados = [...completedGames, nuevoJuego];
        setCompletedGames(nuevosCompletados);
        
        // Si completó ambos minijuegos
        if (nuevosCompletados.length === 2) {
          const tiempoTotal = Math.floor((Date.now() - startTime) / 1000);
          
          // Guardar ambos puntajes con tiempo total
          for (const juego of nuevosCompletados) {
            await supabase
              .from('scores')
              .insert({
                email: user.email,
                score: juego.score,
                minigame: juego.minigame,
                time_seconds: tiempoTotal,
                created_at: new Date().toISOString()
              });
          }
          
          const mins = Math.floor(tiempoTotal / 60);
          const secs = tiempoTotal % 60;
          alert(`🎉 ¡Recorrido completo!\n\nTiempo total: ${mins}m ${secs}s`);
        } else {
          alert(`✅ ${minijuego} completado: ${score} puntos`);
        }
      } catch (err) {
        console.error('Error guardando puntaje:', err);
      }
    };
    
    return () => {
      delete window.recibirPuntajeUnity;
    };
  }, [user, startTime, completedGames]);

  // Simular tecla WASD
  const simulateKey = (key, action) => {
    const iframe = document.querySelector('.game-iframe');
    if (!iframe || !iframe.contentWindow) return;
    
    const event = new KeyboardEvent(action, {
      key: key,
      code: `Key${key.toUpperCase()}`,
      keyCode: key.charCodeAt(0),
      which: key.charCodeAt(0),
      bubbles: true
    });
    
    iframe.contentWindow.document.dispatchEvent(event);
  };

  // Formatear tiempo
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');

        .game-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f5f0e8;
        }

        .game-hero {
          position: relative;
          min-height: 60vh;
          background-image: url('${IMAGEN_HUMEDAL}');
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .game-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(27,94,32,0.85) 0%, rgba(46,125,50,0.75) 100%);
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 900px;
          padding: 60px 32px;
          text-align: center;
          color: white;
        }

        .game-icon {
          font-size: 56px;
          margin-bottom: 16px;
          display: block;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        }

        .game-title {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(36px, 5vw, 52px);
          font-weight: 800;
          color: white;
          margin: 0 0 20px;
          text-shadow: 2px 2px 12px rgba(0,0,0,0.4);
          line-height: 1.2;
        }

        .game-description {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(16px, 2.5vw, 19px);
          line-height: 1.6;
          color: rgba(255,255,255,0.95);
          max-width: 700px;
          margin: 0 auto 24px;
          text-shadow: 1px 1px 6px rgba(0,0,0,0.3);
          font-weight: 500;
        }

        .wetland-facts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          max-width: 700px;
          margin: 32px auto 0;
        }

        .fact-card {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 16px;
          padding: 20px;
          text-align: center;
        }

        .fact-number {
          font-family: 'Poppins', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: #a7f3d0;
          line-height: 1;
          margin-bottom: 6px;
        }

        .fact-label {
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.9);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .game-container {
          padding: 60px 24px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          position: relative;
        }

        /* Timer y controles en esquinas */
        .game-timer {
          position: fixed;
          top: 100px;
          left: 20px;
          background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
          color: white;
          padding: 12px 20px;
          border-radius: 50px;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(27,94,32,0.3);
          z-index: 1000;
        }

        .controls-toggle {
          position: fixed;
          top: 100px;
          right: 20px;
          background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 50px;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(76,175,80,0.3);
          transition: all 0.2s;
          z-index: 1000;
        }

        .controls-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(76,175,80,0.4);
        }

        /* Controles WASD virtuales */
        .virtual-controls {
          position: fixed;
          bottom: 40px;
          left: 40px;
          display: grid;
          grid-template-columns: repeat(3, 70px);
          grid-template-rows: repeat(2, 70px);
          gap: 8px;
          z-index: 1000;
        }

        .control-btn {
          background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
          border: 3px solid #1b5e20;
          border-radius: 16px;
          color: white;
          font-size: 28px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(27,94,32,0.3);
          transition: all 0.1s;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        .control-btn:active {
          transform: scale(0.95);
          box-shadow: 0 2px 8px rgba(27,94,32,0.4);
        }

        .control-btn.w { grid-column: 2; grid-row: 1; }
        .control-btn.a { grid-column: 1; grid-row: 2; }
        .control-btn.s { grid-column: 2; grid-row: 2; }
        .control-btn.d { grid-column: 3; grid-row: 2; }

        .game-instructions {
          text-align: center;
          margin-bottom: 32px;
        }

        .instructions-title {
          font-family: 'Poppins', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #1b5e20;
          margin: 0 0 12px;
        }

        .instructions-text {
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          color: #2e7d32;
          font-weight: 500;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .progress-indicator {
          text-align: center;
          margin-bottom: 20px;
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          color: #4caf50;
          font-weight: 600;
        }

        .iframe-wrapper {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%;
          background: #1b5e20;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(27,94,32,0.25);
        }

        .game-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }

        .game-tip {
          text-align: center;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          color: #66bb6a;
          font-weight: 600;
          margin-top: 16px;
        }

        .login-gate {
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
        }

        .gate-card {
          background: white;
          border: 3px solid #81c784;
          border-radius: 24px;
          padding: 48px 40px;
          text-align: center;
          max-width: 400px;
          box-shadow: 0 12px 40px rgba(27,94,32,0.15);
        }

        .gate-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .gate-title {
          font-family: 'Poppins', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #1b5e20;
          margin: 0 0 12px;
        }

        .gate-text {
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          color: #66bb6a;
          font-weight: 600;
          margin: 0 0 28px;
        }

        .btn-login {
          display: inline-block;
          background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
          color: white;
          text-decoration: none;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 17px;
          padding: 14px 36px;
          border-radius: 50px;
          transition: all 0.2s;
          box-shadow: 0 6px 20px rgba(76,175,80,0.3);
        }

        .btn-login:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(76,175,80,0.4);
        }

        @media (max-width: 768px) {
          .game-hero {
            min-height: 50vh;
          }

          .hero-content {
            padding: 40px 20px;
          }

          .wetland-facts {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .game-container {
            padding: 40px 16px;
          }

          .game-timer {
            top: 80px;
            left: 12px;
            font-size: 16px;
            padding: 10px 16px;
          }

          .controls-toggle {
            top: 80px;
            right: 12px;
            padding: 10px 20px;
            font-size: 14px;
          }

          .virtual-controls {
            bottom: 20px;
            left: 20px;
            grid-template-columns: repeat(3, 60px);
            grid-template-rows: repeat(2, 60px);
            gap: 6px;
          }

          .control-btn {
            font-size: 24px;
          }

          .gate-card {
            padding: 36px 24px;
          }
        }
      `}</style>

      <section id="juego" className="game-section">
        <div className="game-hero">
          <div className="hero-content">
            <span className="game-icon">🎮</span>
            <h2 className="game-title">El Recorrido Interactivo</h2>
            <p className="game-description">
              Los humedales urbanos son ecosistemas vitales que purifican el agua, 
              albergan biodiversidad y ayudan a mitigar el cambio climático. 
              En Bogotá, estos espacios naturales son el hogar de más de 100 especies 
              de aves y plantas acuáticas únicas.
            </p>

            <div className="wetland-facts">
              <div className="fact-card">
                <div className="fact-number">6%</div>
                <div className="fact-label">De la superficie del planeta</div>
              </div>
              <div className="fact-card">
                <div className="fact-number">30%</div>
                <div className="fact-label">CO₂ absorbido</div>
              </div>
              <div className="fact-card">
                <div className="fact-number">100+</div>
                <div className="fact-label">Especies de aves</div>
              </div>
            </div>
          </div>
        </div>

        {!user ? (
          <div className="login-gate">
            <div className="gate-card">
              <div className="gate-icon">🔒</div>
              <h3 className="gate-title">Acceso Restringido</h3>
              <p className="gate-text">Inicia sesión para explorar el humedal</p>
              <a href="#inicio" className="btn-login">
                Iniciar sesión →
              </a>
            </div>
          </div>
        ) : (
          <div className="game-container">
            {/* Timer */}
            <div className="game-timer">
              ⏱️ {formatTime(elapsedTime)}
            </div>

            {/* Toggle controles */}
            <button 
              className="controls-toggle"
              onClick={() => setShowControls(!showControls)}
            >
              🎮 {showControls ? 'Ocultar' : 'Controles'}
            </button>

            {/* Controles WASD virtuales */}
            {showControls && (
              <div className="virtual-controls">
                <button 
                  className="control-btn w"
                  onTouchStart={() => simulateKey('w', 'keydown')}
                  onTouchEnd={() => simulateKey('w', 'keyup')}
                  onMouseDown={() => simulateKey('w', 'keydown')}
                  onMouseUp={() => simulateKey('w', 'keyup')}
                >
                  ▲
                </button>
                <button 
                  className="control-btn a"
                  onTouchStart={() => simulateKey('a', 'keydown')}
                  onTouchEnd={() => simulateKey('a', 'keyup')}
                  onMouseDown={() => simulateKey('a', 'keydown')}
                  onMouseUp={() => simulateKey('a', 'keyup')}
                >
                  ◀
                </button>
                <button 
                  className="control-btn s"
                  onTouchStart={() => simulateKey('s', 'keydown')}
                  onTouchEnd={() => simulateKey('s', 'keyup')}
                  onMouseDown={() => simulateKey('s', 'keydown')}
                  onMouseUp={() => simulateKey('s', 'keyup')}
                >
                  ▼
                </button>
                <button 
                  className="control-btn d"
                  onTouchStart={() => simulateKey('d', 'keydown')}
                  onTouchEnd={() => simulateKey('d', 'keyup')}
                  onMouseDown={() => simulateKey('d', 'keydown')}
                  onMouseUp={() => simulateKey('d', 'keyup')}
                >
                  ▶
                </button>
              </div>
            )}

            <div className="game-instructions">
              <h3 className="instructions-title">🌿 Explora el humedal</h3>
              <p className="instructions-text">
                Completa los 2 minijuegos (Compostera y Quiz) para registrar tu tiempo en el ranking.
              </p>
            </div>

            {completedGames.length > 0 && (
              <div className="progress-indicator">
                ✅ Minijuegos completados: {completedGames.length} / 2
              </div>
            )}

            <div className="iframe-wrapper">
              <iframe
                src="https://itch.io/embed-upload/17385218?color=1a3a2a"
                className="game-iframe"
                allowFullScreen
                allow="autoplay; fullscreen *; pointer-lock *; encrypted-media;"
              />
            </div>

            <p className="game-tip">
              💡 Haz clic en el juego para activar. WASD para moverte, mouse para girar, E para interactuar, C para centrar cursor, R para reiniciar escena.
            </p>
          </div>
        )}
      </section>
    </>
  )
}