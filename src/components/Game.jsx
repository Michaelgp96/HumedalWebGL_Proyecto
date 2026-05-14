import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Game({ user }) {
  const IMAGEN_HUMEDAL = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000"
  
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completedGames, setCompletedGames] = useState([]);

  useEffect(() => {
    const initTime = Date.now();
    setStartTime(initTime);
    
    const handleMessage = async (event) => {
      if (!event.data || event.data.type !== 'unity_score') return;
      
      const mensaje = event.data.data;
      console.log('🎮 Puntaje recibido de Unity:', mensaje);
      
      if (!user) {
        console.warn('⚠️ Usuario no autenticado');
        return;
      }
      
      try {
        const [puntaje, minijuego] = mensaje.split('|');
        const score = parseInt(puntaje);
        
        console.log(`✅ Procesando: ${minijuego} = ${score} puntos`);
        
        setCompletedGames(prev => {
          // Evitar duplicados
          if (prev.some(g => g.minigame === minijuego)) {
            console.log(`⚠️ ${minijuego} ya fue completado, ignorando`);
            return prev;
          }
          
          const nuevosCompletados = [...prev, { minigame: minijuego, score: score }];
          
          if (nuevosCompletados.length === 2) {
            const tiempoTotal = Math.floor((Date.now() - initTime) / 1000);
            
            (async () => {
              try {
                for (const juego of nuevosCompletados) {
                  const { data, error } = await supabase
                    .from('scores')
                    .insert({
                      email: user.email,
                      score: juego.score,
                      minigame: juego.minigame,
                      time_seconds: tiempoTotal,
                      created_at: new Date().toISOString()
                    });
                  
                  if (error) {
                    console.error('❌ Error Supabase:', error);
                  } else {
                    console.log('✅ Guardado en Supabase:', juego);
                  }
                }
                
                const mins = Math.floor(tiempoTotal / 60);
                const secs = tiempoTotal % 60;
                alert(`🎉 ¡Recorrido completo!\n\nTiempo total: ${mins}m ${secs}s\n\n¡Revisa el Ranking!`);
              } catch (err) {
                console.error('❌ Error guardando:', err);
                alert('Error al guardar puntajes. Revisa la consola.');
              }
            })();
          } else {
            alert(`✅ ${minijuego} completado: ${score} puntos\n\n¡Completa el otro minijuego!`);
          }
          
          return nuevosCompletados;
        });
      } catch (err) {
        console.error('❌ Error procesando puntaje:', err);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    const interval = setInterval(() => {
      setElapsedTime(Date.now() - initTime);
    }, 1000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('message', handleMessage);
    };
  }, [user]);

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
          top: 0; left: 0; right: 0; bottom: 0;
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
          top: 0; left: 0;
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
          .game-hero { min-height: 50vh; }
          .hero-content { padding: 40px 20px; }
          .wetland-facts { grid-template-columns: 1fr; gap: 12px; }
          .game-container { padding: 40px 16px; }
          .game-timer { top: 80px; left: 12px; font-size: 16px; padding: 10px 16px; }
          .gate-card { padding: 36px 24px; }
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
            <div className="game-timer">
              ⏱️ {formatTime(elapsedTime)}
            </div>

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
                src="https://itch.io/embed-upload/17538228?color=333333"
                className="game-iframe"
                allowFullScreen
                allow="autoplay; fullscreen *; pointer-lock *; encrypted-media;"
              />
            </div>

            <p className="game-tip">
              💡 WASD para moverte, mouse para girar, click para agarrar, E para soltar/interactuar, C para modo exploración, R para reiniciar.
            </p>
          </div>
        )}
      </section>
    </>
  )
}
