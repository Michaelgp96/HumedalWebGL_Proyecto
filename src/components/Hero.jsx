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

  async function handleAuth() {
    setError('')
    const { data, error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) setError(error.message)
    else setUser(data.user)
  }

  return (
    <section id="inicio" className="min-h-screen flex flex-col items-center justify-center px-4 pt-20">
      <h1 className="text-5xl font-bold text-green-300 text-center mb-4">
        🌿 Humedales Urbanos
      </h1>
      <p className="text-green-100 text-center max-w-xl mb-8 text-lg">
        Explora, aprende y protege los ecosistemas acuáticos de nuestra ciudad.
      </p>

      {!user ? (
        <div className="bg-green-900/50 p-8 rounded-2xl w-full max-w-sm flex flex-col gap-4">
          <h2 className="text-xl font-bold text-center">
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </h2>
          <input
            className="bg-green-800 rounded-lg px-4 py-2 text-white placeholder-green-400 outline-none"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className="bg-green-800 rounded-lg px-4 py-2 text-white placeholder-green-400 outline-none"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            onClick={handleAuth}
            className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 rounded-lg transition"
          >
            {isLogin ? 'Entrar' : 'Crear cuenta'}
          </button>
          <p
            className="text-center text-green-400 text-sm cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-green-300 text-xl mb-4">¡Bienvenido, {user.email}! 🌱</p>
          <a href="#juego" className="bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-8 rounded-full transition text-lg">
            ¡Jugar ahora!
          </a>
        </div>
      )}
    </section>
  )
}