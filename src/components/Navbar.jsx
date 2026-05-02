export default function Navbar({ user }) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-green-900/90 backdrop-blur-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-green-300">🌿 Humedales Urbanos</h1>
      <div className="flex gap-6 text-sm">
        <a href="#inicio" className="hover:text-green-300 transition">Inicio</a>
        <a href="#juego" className="hover:text-green-300 transition">Juego</a>
        <a href="#recursos" className="hover:text-green-300 transition">Recursos</a>
        <a href="#ranking" className="hover:text-green-300 transition">Ranking</a>
      </div>
      {user && <span className="text-green-400 text-sm">👤 {user.email}</span>}
    </nav>
  )
}