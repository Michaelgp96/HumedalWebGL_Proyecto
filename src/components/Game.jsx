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
              src="/Build/index.html"
              className="absolute top-0 left-0 w-full h-full rounded-2xl border-2 border-green-700"
              allowFullScreen
            />
          </div>
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <button
              onPointerDown={() => window.unityInstance?.SendMessage('PlayerController', 'MobileForward', '1')}
              onPointerUp={() => window.unityInstance?.SendMessage('PlayerController', 'MobileForward', '0')}
              className="bg-green-700 hover:bg-green-600 px-6 py-3 rounded-xl font-bold text-2xl"
            >▲</button>
            <button
              onPointerDown={() => window.unityInstance?.SendMessage('PlayerController', 'MobileBack', '1')}
              onPointerUp={() => window.unityInstance?.SendMessage('PlayerController', 'MobileBack', '0')}
              className="bg-green-700 hover:bg-green-600 px-6 py-3 rounded-xl font-bold text-2xl"
            >▼</button>
            <button
              onPointerDown={() => window.unityInstance?.SendMessage('PlayerController', 'MobileLeft', '1')}
              onPointerUp={() => window.unityInstance?.SendMessage('PlayerController', 'MobileLeft', '0')}
              className="bg-green-700 hover:bg-green-600 px-6 py-3 rounded-xl font-bold text-2xl"
            >◀</button>
            <button
              onPointerDown={() => window.unityInstance?.SendMessage('PlayerController', 'MobileRight', '1')}
              onPointerUp={() => window.unityInstance?.SendMessage('PlayerController', 'MobileRight', '0')}
              className="bg-green-700 hover:bg-green-600 px-6 py-3 rounded-xl font-bold text-2xl"
            >▶</button>
            <button
              onClick={() => window.unityInstance?.SendMessage('GrabObject', 'PressE')}
              className="bg-yellow-600 hover:bg-yellow-500 px-6 py-3 rounded-xl font-bold"
            >🤚 Depositar</button>
          </div>
        </div>
      )}
    </section>
  )
}