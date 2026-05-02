export default function Game({ user }) {
  return (
    <section id="juego" className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <h2 className="text-3xl font-bold text-green-300 mb-4">🎮 El Recorrido</h2>
      <p className="text-green-100 text-center max-w-xl mb-8">
        Explora el humedal, aprende sobre su importancia y pon a prueba tus conocimientos.
      </p>

      {!user ? (
        <div className="bg-green-900/50 p-8 rounded-2xl text-center">
          <p className="text-green-300 text-lg">🔒 Inicia sesión para jugar</p>
        </div>
      ) : (
        <div className="w-full max-w-5xl">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src="https://itch.io/embed-upload/17385218?color=1a3a2a"
              className="absolute top-0 left-0 w-full h-full rounded-2xl border-2 border-green-700"
              allowFullScreen
              allow="autoplay; fullscreen *; pointer-lock *; encrypted-media;"
              frameBorder="0"
            />
          </div>
          <p className="text-green-400 text-sm text-center mt-3">
            💡 Haz clic aqui en el juego para activar los controles. WASD para moverte, mouse para girar.
          </p>
        </div>
      )}
    </section>
  )
}