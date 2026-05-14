import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Hero from './components/Hero'
import Game from './components/Game'
import Resources from './components/Resources'
import Ranking from './components/Ranking'
import Navbar from './components/Navbar'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Recuperar sesión al recargar la página
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escuchar cambios de auth (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5f0e8' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, border: '4px solid #2d6a4f',
            borderTopColor: 'transparent', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
          }} />
          <p style={{ color: '#2d6a4f', fontFamily: 'Georgia, serif', fontSize: 18 }}>
            Cargando...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ background: '#f5f0e8', minHeight: '100vh', color: '#1a2e1a' }}>
      <Navbar user={user} onLogout={handleLogout} />
      <Hero user={user} setUser={setUser} />
      <Game user={user} />
      <Resources />
      <Ranking user={user} />
    </div>
  )
}

export default App
