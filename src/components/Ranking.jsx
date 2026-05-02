import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function Ranking() {
  const [scores, setScores] = useState([])

  useEffect(() => {
    async function fetchScores() {
      const { data } = await supabase
        .from('scores')
        .select('email, score, created_at')
        .order('score', { ascending: false })
        .limit(10)
      if (data) setScores(data)
    }
    fetchScores()
  }, [])

  return (
    <section id="ranking" className="py-20 px-4">
      <h2 className="text-3xl font-bold text-green-300 text-center mb-4">🏆 Ranking</h2>
      <p className="text-green-100 text-center max-w-xl mx-auto mb-10">
        Los mejores guardianes del humedal.
      </p>
      <div className="max-w-2xl mx-auto bg-green-900/50 rounded-2xl border border-green-700 overflow-hidden">
        <table className="w-full text-center">
          <thead className="bg-green-800">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Usuario</th>
              <th className="py-3 px-4">Puntaje</th>
            </tr>
          </thead>
          <tbody>
            {scores.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-green-400">Aún no hay puntajes</td>
              </tr>
            ) : (
              scores.map((s, i) => (
                <tr key={i} className="border-t border-green-800 hover:bg-green-800/30">
                  <td className="py-3 px-4">{i + 1}</td>
                  <td className="py-3 px-4 text-green-300">{s.email}</td>
                  <td className="py-3 px-4 font-bold">{s.score}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}