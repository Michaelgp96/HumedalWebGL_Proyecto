import { useState } from 'react'
import Hero from './components/Hero'
import Game from './components/Game'
import Resources from './components/Resources'
import Ranking from './components/Ranking'
import Navbar from './components/Navbar'

function App() {
  const [user, setUser] = useState(null)

  return (
    <div className="bg-green-950 min-h-screen text-white">
      <Navbar user={user} />
      <Hero user={user} setUser={setUser} />
      <Game user={user} />
      <Resources />
      <Ranking />
    </div>
  )
}

export default App