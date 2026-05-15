import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Ranking({ user }) {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener todos los registros de scores
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        setRanking([]);
        setLoading(false);
        return;
      }

      // Agrupar por email
      const grouped = {};
      data.forEach(record => {
        if (!grouped[record.email]) {
          grouped[record.email] = {
            email: record.email,
            quizScore: 0,
            compostScore: 0,
            totalScore: 0,
            timeSeconds: record.time_seconds || 0,
            createdAt: record.created_at
          };
        }

        // Sumar por tipo de minijuego (tomar el MEJOR puntaje si jugaron varias veces)
        if (record.minigame === 'quiz') {
          if (record.score > grouped[record.email].quizScore) {
            grouped[record.email].quizScore = record.score;
            // Actualizar tiempo si es del mismo intento que el mejor score
            grouped[record.email].timeSeconds = record.time_seconds || grouped[record.email].timeSeconds;
          }
        } else if (record.minigame === 'compostera') {
          if (record.score > grouped[record.email].compostScore) {
            grouped[record.email].compostScore = record.score;
          }
        }

        // Mantener el tiempo MENOR (mejor tiempo)
        if (record.time_seconds && record.time_seconds < grouped[record.email].timeSeconds) {
          grouped[record.email].timeSeconds = record.time_seconds;
        }
        if (grouped[record.email].timeSeconds === 0 && record.time_seconds) {
          grouped[record.email].timeSeconds = record.time_seconds;
        }
      });

      // Calcular total y filtrar solo los que completaron AMBOS minijuegos
      const arrayRanking = Object.values(grouped)
        .map(player => ({
          ...player,
          totalScore: player.quizScore + player.compostScore
        }))
        .filter(player => player.quizScore > 0 && player.compostScore > 0)
        .sort((a, b) => {
          // Primero por puntaje total (descendente)
          if (b.totalScore !== a.totalScore) {
            return b.totalScore - a.totalScore;
          }
          // En empate, por tiempo (ascendente - menor tiempo es mejor)
          return a.timeSeconds - b.timeSeconds;
        });

      setRanking(arrayRanking);
    } catch (err) {
      console.error('Error cargando ranking:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const maskEmail = (email) => {
    if (!email) return '---';
    const [name, domain] = email.split('@');
    if (name.length <= 3) return `${name}@${domain}`;
    return `${name.substring(0, 3)}***@${domain}`;
  };

  const getMedalEmoji = (position) => {
    if (position === 0) return '🥇';
    if (position === 1) return '🥈';
    if (position === 2) return '🥉';
    return `#${position + 1}`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');

        .ranking-section {
          min-height: 100vh;
          padding: 80px 24px;
          background: linear-gradient(135deg, #f5f0e8 0%, #e8f5e9 100%);
          font-family: 'Poppins', sans-serif;
        }

        .ranking-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .ranking-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .ranking-icon {
          font-size: 64px;
          margin-bottom: 16px;
          display: block;
        }

        .ranking-title {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 800;
          color: #1b5e20;
          margin: 0 0 12px;
          line-height: 1.2;
        }

        .ranking-subtitle {
          font-size: 18px;
          color: #2e7d32;
          font-weight: 500;
          margin: 0;
        }

        .refresh-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 50px;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          margin-top: 16px;
          box-shadow: 0 4px 12px rgba(76,175,80,0.3);
          transition: all 0.2s;
        }

        .refresh-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(76,175,80,0.4);
        }

        .ranking-card {
          background: white;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 12px 40px rgba(27,94,32,0.12);
          border: 2px solid #c8e6c9;
        }

        .ranking-table {
          width: 100%;
          border-collapse: collapse;
        }

        .ranking-table thead {
          border-bottom: 3px solid #81c784;
        }

        .ranking-table th {
          padding: 16px 12px;
          text-align: left;
          font-size: 13px;
          font-weight: 700;
          color: #1b5e20;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .ranking-table th.center {
          text-align: center;
        }

        .ranking-table th.right {
          text-align: right;
        }

        .ranking-table tbody tr {
          border-bottom: 1px solid #e8f5e9;
          transition: background 0.2s;
        }

        .ranking-table tbody tr:hover {
          background: #f1f8e9;
        }

        .ranking-table tbody tr.current-user {
          background: linear-gradient(90deg, rgba(129,199,132,0.2) 0%, rgba(165,214,167,0.1) 100%);
          border-left: 4px solid #4caf50;
        }

        .ranking-table td {
          padding: 16px 12px;
          font-size: 15px;
          color: #2e7d32;
          font-weight: 500;
        }

        .position {
          font-size: 22px;
          font-weight: 800;
          text-align: center;
          color: #1b5e20;
          min-width: 60px;
        }

        .position.top {
          font-size: 28px;
        }

        .email {
          font-weight: 600;
          color: #1b5e20;
        }

        .score-badge {
          display: inline-block;
          background: #c8e6c9;
          color: #1b5e20;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 14px;
          min-width: 40px;
          text-align: center;
        }

        .total-score {
          font-size: 20px;
          font-weight: 800;
          color: #1b5e20;
          text-align: right;
        }

        .time-badge {
          display: inline-block;
          background: #fff3e0;
          color: #e65100;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 14px;
          text-align: center;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 72px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-title {
          font-size: 24px;
          font-weight: 700;
          color: #1b5e20;
          margin: 0 0 12px;
        }

        .empty-text {
          font-size: 16px;
          color: #66bb6a;
          margin: 0;
        }

        .loading {
          text-align: center;
          padding: 60px 20px;
          font-size: 18px;
          color: #4caf50;
          font-weight: 600;
        }

        .error-box {
          background: #ffebee;
          border: 2px solid #ef5350;
          color: #c62828;
          padding: 20px;
          border-radius: 16px;
          text-align: center;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .ranking-section {
            padding: 40px 16px;
          }
          .ranking-card {
            padding: 16px;
          }
          .ranking-table th, .ranking-table td {
            padding: 10px 6px;
            font-size: 13px;
          }
          .position { font-size: 18px; min-width: 40px; }
          .total-score { font-size: 16px; }
          .hide-mobile { display: none; }
        }
      `}</style>

      <section id="ranking" className="ranking-section">
        <div className="ranking-container">
          <div className="ranking-header">
            <span className="ranking-icon">🏆</span>
            <h2 className="ranking-title">Ranking de Guardianes</h2>
            <p className="ranking-subtitle">
              Los mejores exploradores del Humedal
            </p>
            <button className="refresh-btn" onClick={fetchRanking}>
              🔄 Actualizar
            </button>
          </div>

          <div className="ranking-card">
            {loading ? (
              <div className="loading">⏳ Cargando ranking...</div>
            ) : error ? (
              <div className="error-box">
                ❌ Error al cargar el ranking: {error}
              </div>
            ) : ranking.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🌱</div>
                <h3 className="empty-title">¡Sé el primer guardián!</h3>
                <p className="empty-text">
                  Completa los 2 minijuegos para aparecer en el ranking.
                </p>
              </div>
            ) : (
              <table className="ranking-table">
                <thead>
                  <tr>
                    <th className="center">Pos</th>
                    <th>Jugador</th>
                    <th className="center hide-mobile">Quiz</th>
                    <th className="center hide-mobile">Compost</th>
                    <th className="center">Tiempo</th>
                    <th className="right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((player, index) => (
                    <tr 
                      key={player.email}
                      className={user && player.email === user.email ? 'current-user' : ''}
                    >
                      <td className={`position ${index < 3 ? 'top' : ''}`}>
                        {getMedalEmoji(index)}
                      </td>
                      <td className="email">
                        {maskEmail(player.email)}
                        {user && player.email === user.email && ' (Tú)'}
                      </td>
                      <td className="center hide-mobile">
                        <span className="score-badge">{player.quizScore}</span>
                      </td>
                      <td className="center hide-mobile">
                        <span className="score-badge">{player.compostScore}</span>
                      </td>
                      <td className="center">
                        <span className="time-badge">{formatTime(player.timeSeconds)}</span>
                      </td>
                      <td className="total-score">{player.totalScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
